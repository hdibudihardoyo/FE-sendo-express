import { useState } from "react";
import { useSearchParams, Link } from "react-router";
import { toast } from "react-hot-toast";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControl } from "@/components/ui/pagination-control";
import { Camera, SearchNormal1, CloseCircle } from "iconsax-reactjs";
import {
  useActiveShipments,
  useShipmentHistory,
} from "@/hooks/use-dashboard-customer";
import { useTrackShipment } from "@/hooks/use-shipment";
import {
  getStatusLabel,
  getStatusBadgeVariant,
} from "@/lib/utils/status-utils";

const CARD_CLASS = "rounded-2xl border border-border/60 shadow-sm";
const SECTION_GAP = "gap-4";
const HISTORY_LIMIT_DEFAULT = 10;
const ACTIVE_LIMIT_DEFAULT = 5;

export const CustomerDashboardPage = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const historyPage = Number(searchParams.get("historyPage") || 1);
  const historyLimit = Number(
    searchParams.get("historyLimit") || HISTORY_LIMIT_DEFAULT,
  );
  const activePage = Number(searchParams.get("activePage") || 1);
  const activeLimit = Number(
    searchParams.get("activeLimit") || ACTIVE_LIMIT_DEFAULT,
  );

  const handleHistoryPageChange = (newPage: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("historyPage", String(newPage));
        if (!next.get("historyLimit")) {
          next.set("historyLimit", String(HISTORY_LIMIT_DEFAULT));
        }
        return next;
      },
      { replace: true },
    );
  };

  const handleActivePageChange = (newPage: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("activePage", String(newPage));
        if (!next.get("activeLimit")) {
          next.set("activeLimit", String(ACTIVE_LIMIT_DEFAULT));
        }
        return next;
      },
      { replace: true },
    );
  };

  const {
    data: activeRes,
    isLoading: isActiveLoading,
    isFetching: isActiveFetching,
  } = useActiveShipments({ page: activePage, limit: activeLimit  });
  const {
    data: historyRes,
    isLoading: isHistoryLoading,
    isFetching: isHistoryFetching,
  } = useShipmentHistory({ page: historyPage, limit: historyLimit  });

  const activeShipments = activeRes?.data ?? [];
  const historyItems = historyRes?.data ?? [];

  const trackShipment = useTrackShipment();
  const trackedShipment = trackShipment.data;

  const handleTrackSubmit = () => {
    if (!trackingNumber.trim()) {
      toast.error("Silakan masukkan nomor resi");
      return;
    }
    trackShipment.mutate(trackingNumber.trim());
  };

  return (
    <>
      <div
        className={`grid ${SECTION_GAP} lg:grid-cols-[1.5fr_1fr] lg:items-start`}
      >
        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Riwayat Pengiriman</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isHistoryLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))
            ) : historyItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada riwayat pengiriman
              </p>
            ) : (
              <div
                className={
                  isHistoryFetching
                    ? "space-y-2 opacity-60 transition-opacity"
                    : "space-y-2"
                }
              >
                {historyItems.map((item) => (
                  <div
                    key={item.shipmentId}
                    className="flex items-center gap-3 rounded-xl bg-muted/30 p-4"
                  >
                    {item.deliveryStatus === "Delivered" ? (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
                        <Camera size={18} variant="Bold" />
                      </div>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-medium">
                            {item.trackingNumber}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(item.statusDate).toLocaleDateString(
                              "id-ID",
                            )}
                          </div>
                        </div>
                        <span className="rounded-full bg-background px-3 py-1 text-xs">
                          {item.deliveryStatus}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-3">
                        <span className="text-sm text-muted-foreground">
                          {item.destinationAddress}
                        </span>
                        <Link
                          to={`/send-package/detail/${item.shipmentId}`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                          })}
                        >
                          Detail
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {historyRes?.paging && historyRes.paging.totalPages > 1 && (
              <PaginationControl
                paging={historyRes.paging}
                onPageChange={handleHistoryPageChange}
              />
            )}
          </CardContent>
        </Card>

        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Cari Tracking</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="relative">
              <SearchNormal1
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTrackSubmit()}
                placeholder="Masukkan nomor resi, mis. SEN123456789"
                className="pl-9"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Lihat status real-time paket Anda dengan memasukkan nomor resi di
              atas
            </p>
            <Button
              variant="darkGreen"
              className="w-full"
              onClick={handleTrackSubmit}
              loading={trackShipment.isPending}
            >
              Lacak Paket
            </Button>

            {trackedShipment ? (
              <div className="mt-1 space-y-2 rounded-xl bg-muted/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">
                    {trackedShipment.trackingNumber}
                  </span>
                  <Badge
                    variant={getStatusBadgeVariant(
                      trackedShipment.deliveryStatus,
                    )}
                  >
                    {getStatusLabel(trackedShipment.deliveryStatus)}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Tujuan:{" "}
                  {trackedShipment.shipmentDetail?.destinationAddress ||
                    "Tidak tersedia"}
                </div>
              </div>
            ) : trackShipment.isError ? (
              <div className="mt-1 flex items-center gap-2 rounded-xl bg-muted/30 p-4 text-sm text-muted-foreground">
                <CloseCircle size={18} className="shrink-0 text-red-500" />
                Paket tidak ditemukan. Pastikan nomor resi sudah benar!
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className={`grid ${SECTION_GAP}`}>
        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Status Paket Aktif</CardTitle>
            <CardDescription>
              Ikhtisar progress paket Anda saat ini
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isActiveLoading ? (
              <Skeleton className="h-48 w-full rounded-xl" />
            ) : activeShipments.length === 0 ? (
              <div className="rounded-xl bg-muted/30 p-5 text-center text-sm text-muted-foreground">
                Tidak ada paket yang sedang aktif saat ini
              </div>
            ) : (
              <div
                className={
                  isActiveFetching
                    ? "space-y-3 opacity-60 transition-opacity"
                    : "space-y-3"
                }
              >
                {activeShipments.map((shipment) => (
                  <div
                    key={shipment.shipmentId}
                    className="rounded-xl bg-muted/30 p-5"
                  >
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Tracking
                        </div>
                        <div className="mt-1 text-lg font-semibold">
                          {shipment.trackingNumber}
                        </div>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        {shipment.deliveryStatus}
                      </span>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      {shipment.steps.map((step) => (
                        <div
                          key={step.key}
                          className="flex items-center gap-3 rounded-lg bg-background px-4 py-2.5"
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${
                              step.completed || step.active
                                ? "bg-primary"
                                : "bg-border"
                            }`}
                          />
                          <div>
                            <div className="text-sm font-medium">
                              {step.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {step.completed
                                ? "Selesai"
                                : step.active
                                  ? "Sedang berjalan"
                                  : "Menunggu"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeRes?.paging && activeRes.paging.totalPages > 1 && (
              <PaginationControl
                paging={activeRes.paging}
                onPageChange={handleActivePageChange}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};
