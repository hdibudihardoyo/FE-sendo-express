import { Page } from "@/components/ui/page";
import { Input } from "@/components/ui/input";
import { DataTable } from "./components/datatable";
import { courierColumns } from "./components/datatable/courier-columns";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { useCourierShipments } from "@/hooks/use-delivery";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PaginationControl } from "@/components/ui/pagination-control";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchParams } from "react-router";

const LIMIT = 5;

export default function DeliveryPage() {
  useMeta(META_DATA.delivery);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const trackingNumberParam = searchParams.get("trackingNumber") ?? "";

  const [inputSearch, setInputSearch] = useState(trackingNumberParam);
  const debouncedSearch = useDebounce(inputSearch, 400);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch) {
          next.set("trackingNumber", debouncedSearch);
        } else {
          next.delete("trackingNumber");
        }
        next.set("page", "1");
        return next;
      },
      { replace: true },
    );
  }, [debouncedSearch]);

  const { data, error, isLoading, isFetching, refetch } = useCourierShipments({
    trackingNumber: debouncedSearch || undefined,
    page,
    limit: LIMIT,
  });

  const shipments = data?.data ?? [];
  const paging = data?.paging;

  const handlePageChange = (newPage: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(newPage));
        return next;
      },
      { replace: true },
    );
  };

  const handleRefresh = () => {
    refetch();
  };

  const isLoadingShipmentsCourier = isLoading || isFetching;

  if (error) {
    return (
      <Page title="Daftar Pengiriman 🚚📦">
        <div className="flex flex-col items-center justify-center">
          <p className="text-red-500 mb-4">Error: {error.message}</p>
          <Button onClick={() => refetch()} variant="outline">
            Coba lagi
          </Button>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Daftar Pengiriman 🚚📦">
      <div className="mb-4 flex gap-4 items-center">
        <Input
          type="text"
          placeholder="Cari berdasarkan nomor resi"
          className="w-full max-w-md bg-white"
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
        />
      </div>

      {isLoadingShipmentsCourier ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Memuat data pengiriman...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <DataTable
            data={shipments}
            columns={courierColumns(handleRefresh)}
            title="Semua Pengiriman"
          />
          {paging && paging.totalPages > 1 && (
            <PaginationControl
              paging={paging}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </Page>
  );
}
