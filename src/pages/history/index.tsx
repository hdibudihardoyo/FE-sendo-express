import { Page } from "@/components/ui/page";
import { Input } from "@/components/ui/input";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { useGetAllHistory } from "@/hooks/use-history";
import { DataTable } from "./components/datatable";
import { columns } from "./components/datatable/columns";
import { PaginationControl } from "@/components/ui/pagination-control";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const DEFAULT_LIMIT = 10;

export default function HistoryPage() {
  useMeta(META_DATA.history);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || DEFAULT_LIMIT);
  const trackingNumberParam = searchParams.get("trackingNumber") ?? "";

  const [inputTrackingNumber, setInputTrackingNumber] =
    useState(trackingNumberParam);
  const debouncedTrackingNumber = useDebounce(inputTrackingNumber, 400);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedTrackingNumber) {
          next.set("trackingNumber", debouncedTrackingNumber);
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
  }, [debouncedTrackingNumber]);

  const {
    data,
    error,
    isLoading: isLoadingHistory,
    isFetching: isFetchingHistory,
  } = useGetAllHistory({
    trackingNumber: debouncedTrackingNumber || undefined,
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

  const isLoading = isLoadingHistory || isFetchingHistory;

  if (error) {
    return (
      <Page title="Riwayat Pengiriman 📜⏰">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-red-600 text-2xl font-semibold mb-4">
              Gagal memuat riwayat pengiriman
            </h2>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Riwayat Pengiriman 📜⏰">
      <Input
        type="text"
        placeholder="Cari Pengiriman berdasarkan No. Resi"
        className="mb-4 w-full max-w-sm bg-white"
        value={inputTrackingNumber}
        onChange={(e) => setInputTrackingNumber(e.target.value)}
      />
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Memuat riwayat pengiriman...</p>
        </div>
      ) : (
        <>
          <DataTable
            data={shipments}
            columns={columns}
            title="Paket yang Sudah Dikirim"
          />
          {paging && paging.totalPages > 1 && (
            <PaginationControl
              paging={paging}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </Page>
  );
}
