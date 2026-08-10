import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControl } from "@/components/ui/pagination-control";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { Additem, Building } from "iconsax-reactjs";
import { KpiCards } from "../components/kpi-cards";
import { AlertCard } from "../components/alert-card";
import {
  useAdminBranchDashboardSummary,
  useRecentScanLogs,
  useActivityTrend,
  useStuckPackagesAlert,
} from "@/hooks/use-dashboard-adminbranch";

const CARD_CLASS = "rounded-2xl border border-border/60 shadow-sm";
const SECTION_GAP = "gap-4";
const CHART_CONFIG = {
  in: { label: "Masuk", color: "var(--chart-1, #22c55e)" },
  out: { label: "Keluar", color: "var(--chart-2, #f97316)" },
} satisfies Record<string, { label: string; color: string }>;

const ACTIVITY_TREND_DAYS = 7;
const STUCK_ALERT_HOURS = 24;
const SCAN_LOG_LIMIT = 8;

const numberFormatter = new Intl.NumberFormat("id-ID");

export const AdminBranchDashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const scanLogPage = Number(searchParams.get("page") || 1);

  const handleScanLogPageChange = (newPage: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(newPage));
        return next;
      },
      { replace: true }
    );
  };

  const { data: summaryRes, isLoading: isSummaryLoading } = useAdminBranchDashboardSummary();
  const { data: activityRes, isLoading: isActivityLoading } = useActivityTrend(ACTIVITY_TREND_DAYS);
  const { data: stuckRes, isLoading: isStuckLoading } = useStuckPackagesAlert(STUCK_ALERT_HOURS);
  const {
    data: scanLogsRes,
    isLoading: isScanLogsLoading,
    isFetching: isScanLogsFetching,
  } = useRecentScanLogs({ page: scanLogPage, limit: SCAN_LOG_LIMIT });

  const branchSummary = useMemo(() => {
    const s = summaryRes?.data;
    if (!s) return [];
    return [
      { label: "Paket Masuk Hari Ini", value: numberFormatter.format(s.packagesInToday) },
      { label: "Paket Keluar Hari Ini", value: numberFormatter.format(s.packagesOutToday) },
      { label: "Total Aktivitas", value: numberFormatter.format(s.totalActivity) },
      { label: "Siap Diambil", value: numberFormatter.format(s.readyToPickup) },
    ];
  }, [summaryRes]);

  const branchActivity = useMemo(
    () =>
      (activityRes?.data.dailyActivity ?? []).map((d) => ({
        day: new Date(d.date).toLocaleDateString("id-ID", { weekday: "short" }),
        in: d.incoming,
        out: d.outgoing,
      })),
    [activityRes]
  );

  const branchAlerts = useMemo(
    () =>
      (stuckRes?.data ?? []).map(
        (p) =>
          `Paket ${p.trackingNumber} berstatus "${p.deliveryStatus}" sudah ${p.hoursSinceIn} jam sejak scan masuk.`
      ),
    [stuckRes]
  );

  const branchLogs = scanLogsRes?.data ?? [];

  return (
    <>
      {isSummaryLoading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <KpiCards items={branchSummary} />
      )}

      <div className={`grid ${SECTION_GAP} lg:grid-cols-[1.4fr_1fr]`}>
        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Scan Masuk / Scan Keluar</CardTitle>
            <CardDescription>Fokus role admin cabang pada operasi scan paket.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Button variant="darkGreen" size="lg" className="w-full">
              Scan Masuk
            </Button>
            <Button variant="oranye" size="lg" className="w-full">
              Scan Keluar
            </Button>
          </CardContent>
        </Card>

        {isStuckLoading ? (
          <Skeleton className="h-40 w-full rounded-2xl" />
        ) : (
          <AlertCard alerts={branchAlerts} />
        )}
      </div>

      <div className={`grid ${SECTION_GAP} lg:grid-cols-[1.4fr_1fr]`}>
        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tren Aktivitas 7 Hari</CardTitle>
          </CardHeader>
          <CardContent>
            {isActivityLoading ? (
              <Skeleton className="h-[220px] w-full rounded-xl" />
            ) : (
              <ChartContainer config={CHART_CONFIG} className="h-[220px] w-full">
                <LineChart data={branchActivity} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="in" stroke="var(--color-in)" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="out" stroke="var(--color-out)" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Log Scan Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {isScanLogsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <>
                <table className="w-full min-w-[20rem] border-separate border-spacing-y-1 text-left text-xs">
                  <thead>
                    <tr className="text-muted-foreground">
                      <th className="px-4 py-2 font-medium">Waktu</th>
                      <th className="px-4 py-2 font-medium">Tipe</th>
                      <th className="px-4 py-2 font-medium">Petugas</th>
                      <th className="px-4 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className={isScanLogsFetching ? "opacity-60 transition-opacity" : ""}>
                    {branchLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-center text-muted-foreground">
                          Belum ada aktivitas scan.
                        </td>
                      </tr>
                    ) : (
                      branchLogs.map((log) => (
                        <tr key={log.id} className="bg-muted/30">
                          <td className="rounded-l-lg px-4 py-2.5">
                            {new Date(log.scanTime).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                log.type === "IN"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-orange-500/10 text-orange-600"
                              }`}
                            >
                              {log.type}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">{log.scannedBy.name}</td>
                          <td className="rounded-r-lg px-4 py-2.5">{log.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {scanLogsRes?.paging && scanLogsRes.paging.totalPages > 1 && (
                  <PaginationControl paging={scanLogsRes.paging} onPageChange={handleScanLogPageChange} />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className={CARD_CLASS}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Aksi Cepat</CardTitle>
          <CardDescription>Shortcut operasional harian untuk admin cabang.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          <Button variant="darkGreen" size="sm" className="w-full justify-between">
            Buat Shipment <Additem size={16} />
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-between">
            Kelola Data Cabang <Building size={16} />
          </Button>
        </CardContent>
      </Card>
    </>
  );
};