import { Page } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./components/datatable";
import { columns } from "./components/datatable/columns";
import { BetterScanModal } from "./components/better-scan-modal";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { ArrowDown, ArrowUp, RefreshCircle } from "iconsax-reactjs";
import {
  useGetAllShipmentBranch,
  useGetShipmentBranchSummary,
} from "@/hooks/use-shipment-branch";
import { PaginationControl } from "@/components/ui/pagination-control";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchParams } from "react-router";
import { Loader2 } from "lucide-react";

const DEFAULT_LIMIT = 10;

export default function ShipmentBranchPage() {
  return <ShipmentBranchContent />;
}

function ShipmentBranchContent() {
  useMeta(META_DATA["shipment-branch"]);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const trackingNumberParam = searchParams.get("trackingNumber") ?? "";
  const limit = Number(searchParams.get("limit") || DEFAULT_LIMIT);

  const [inputSearch, setInputSearch] = useState(trackingNumberParam);
  const debouncedSearch = useDebounce(inputSearch, 400);

  const [scanInModalOpen, setScanInModalOpen] = useState(false);
  const [scanOutModalOpen, setScanOutModalOpen] = useState(false);

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
        if (debouncedSearch !== trackingNumberParam) {
          next.set("page", "1");
        }
        return next;
      },
      { replace: true },
    );
  }, [debouncedSearch, trackingNumberParam]);

  const { data, isLoading, isFetching, refetch } = useGetAllShipmentBranch({
    trackingNumber: debouncedSearch || undefined,
    page,
    limit,
  });

  const { data: summaryData } = useGetShipmentBranchSummary();

  const logs = data?.data ?? [];
  const paging = data?.paging;

  const handlePageChange = (newPage: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(newPage));
        if (!next.get("limit")) {
          next.set("limit", String(DEFAULT_LIMIT));
        }
        return next;
      },
      { replace: true },
    );
  };

  const handleScanComplete = () => {
    refetch();
  };

  const isLoadingShipmentBranch = isLoading || isFetching;

  return (
    <Page
      title="Manajemen Cabang Pengiriman 📦🏢"
      action={
        <div className="flex gap-2">
          <Button
            variant="darkGreen"
            onClick={() => setScanInModalOpen(true)}
            className="flex items-center gap-2"
          >
            <ArrowDown size={20} variant="Bold" />
            Scan Masuk
          </Button>
          <Button
            variant="default"
            onClick={() => setScanOutModalOpen(true)}
            className="flex items-center gap-2"
          >
            <ArrowUp size={20} variant="Bold" />
            Scan Keluar
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Search */}
        <Input
          type="text"
          placeholder="Cari berdasarkan nomor resi"
          className="w-full max-w-md bg-white"
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <ArrowDown size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">
                  Paket Masuk Hari Ini
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {summaryData?.packagesInToday ?? 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <ArrowUp size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">
                  Paket Keluar Hari Ini
                </p>
                <p className="text-2xl font-bold text-blue-700">
                  {summaryData?.packagesOutToday ?? 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-full">
                <RefreshCircle size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Aktivitas
                </p>
                <p className="text-2xl font-bold text-gray-700">
                  {summaryData?.totalActivity ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        {isLoadingShipmentBranch ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Memuat data pengiriman cabang...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <DataTable
              data={logs}
              columns={columns}
              title="Log Aktivitas Cabang"
            />
            {paging && paging.totalPages > 1 && (
              <PaginationControl
                paging={paging}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}
      </div>

      {/* Scan Modals */}
      <BetterScanModal
        isOpen={scanInModalOpen}
        onClose={() => setScanInModalOpen(false)}
        type="IN"
        onScanComplete={handleScanComplete}
      />
      <BetterScanModal
        isOpen={scanOutModalOpen}
        onClose={() => setScanOutModalOpen(false)}
        type="OUT"
        onScanComplete={handleScanComplete}
      />
      <Toaster position="top-right" />
    </Page>
  );
}
