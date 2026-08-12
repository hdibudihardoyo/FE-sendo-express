import { Page } from "@/components/ui/page";
import { DataTable } from "./components/datatable";
import { useColumns } from "./components/datatable/columns";
import { Button } from "@/components/ui/button";
import { AddSquare } from "iconsax-reactjs";
import { Input } from "@/components/ui/input";
import { Link, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { useShipments } from "@/hooks/use-shipment";
import { useDebounce } from "@/hooks/use-debounce";
import { PaginationControl } from "@/components/ui/pagination-control";
import { Loader2 } from "lucide-react";

const DEFAULT_LIMIT = 10;

export default function SendPackagePage() {
  useMeta(META_DATA["send-package"]);
  const columns = useColumns();

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const trackingNumberParam = searchParams.get("trackingNumber") ?? "";
  const limit = Number(searchParams.get("limit") || DEFAULT_LIMIT);

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
        if (!next.get("limit")) {
          next.set("limit", String(DEFAULT_LIMIT));
        }
        next.set("page", "1");
        return next;
      },
      { replace: true },
    );
  }, [debouncedSearch]);

  const { data, isLoading, isFetching, error } = useShipments({
    trackingNumber: debouncedSearch || undefined,
    page,
    limit,
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

  const isLoadingShipments = isLoading || isFetching;

  if (error) {
    return (
      <Page title="Kirim Paket 🚚 🏠">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-600">
            Gagal memuat data pengiriman: {error.message}
          </p>
        </div>
      </Page>
    );
  }

  return (
    <Page
      title="Kirim Paket 🚚 🏠"
      action={
        <Link to="/send-package/add">
          <Button variant="darkGreen">
            Buat Pengiriman Baru
            <AddSquare className="ml-auto" variant="Bold" size="20" />
          </Button>
        </Link>
      }
    >
      <Input
        type="text"
        placeholder="Cari berdasarkan nomor resi"
        className="mb-4 w-full max-w-sm bg-white"
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
      />
      {isLoadingShipments ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Memuat data pengiriman...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <DataTable
            data={shipments}
            columns={columns}
            title="Pengiriman Sebelumnya"
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
