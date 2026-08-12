import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControl } from "@/components/ui/pagination-control";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { KpiCards } from "../components/kpi-cards";
import { AlertCard } from "../components/alert-card";
import {
  useAdminBranchDashboardSummary,
  useRecentScanLogs,
  useActivityTrend,
  useStuckPackagesAlert,
} from "@/hooks/use-dashboard-adminbranch";

const CARD_CLASS = "rounded-2xl border border-border/60 shadow-sm";
const CHART_CONFIG = {
  in: { label: "Masuk", color: "var(--chart-1, #22c55e)" },
  out: { label: "Keluar", color: "var(--chart-2, #f97316)" },
} satisfies Record<string, { label: string; color: string }>;

const ACTIVITY_TREND_DAYS = 7;
const STUCK_ALERT_HOURS = 10;
const STUCK_ALERT_LIMIT = 10;
const SCAN_LOG_LIMIT = 10;

const numberFormatter = new Intl.NumberFormat("id-ID");

export const AdminBranchDashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const scanLogPage = Number(searchParams.get("scanLogPage") || 1);
  const scanLogLimit = Number(
    searchParams.get("scanLogLimit") || SCAN_LOG_LIMIT,
  );
  const alertStuckPage = Number(searchParams.get("alertStuckPage") || 1);
  const alertStuckLimit = Number(
    searchParams.get("alertStuckLimit") || STUCK_ALERT_LIMIT,
  );

  const handleScanLogPageChange = (newPage: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("scanLogPage", String(newPage));
        if (!next.get("scanLogLimit")) {
          next.set("scanLogLimit", String(SCAN_LOG_LIMIT));
        }
        return next;
      },
      { replace: true },
    );
  };

  const handleAlertPageChange = (newPage: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("alertStuckPage", String(newPage));
        if (!next.get("alertStuckLimit")) {
          next.set("alertStuckLimit", String(STUCK_ALERT_LIMIT));
        }
        return next;
      },
      { replace: true },
    );
  };

  const { data: summaryRes, isLoading: isSummaryLoading } =
    useAdminBranchDashboardSummary();

  const { data: activityRes, isLoading: isActivityLoading } =
    useActivityTrend(ACTIVITY_TREND_DAYS);

  const {
    data: stuckRes,
    isLoading: isStuckLoading,
    isFetching: isStuckFetching,
  } = useStuckPackagesAlert({
    hours: STUCK_ALERT_HOURS,
    page: alertStuckPage,
    limit: alertStuckLimit,
  });

  const {
    data: scanLogsRes,
    isLoading: isScanLogsLoading,
    isFetching: isScanLogsFetching,
  } = useRecentScanLogs({ page: scanLogPage, limit: scanLogLimit });

  const branchSummary = useMemo(() => {
    const s = summaryRes?.data;
    if (!s) return [];
    return [
      {
        label: "Paket Masuk Hari Ini",
        value: numberFormatter.format(s.packagesInToday),
      },
      {
        label: "Paket Keluar Hari Ini",
        value: numberFormatter.format(s.packagesOutToday),
      },
      {
        label: "Total Aktivitas",
        value: numberFormatter.format(s.totalActivity),
      },
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
    [activityRes],
  );

  const branchAlerts = useMemo(
    () =>
      (stuckRes?.data ?? []).map(
        (p) =>
          `Paket ${p.trackingNumber} berstatus "${p.deliveryStatus}" sudah ${p.hoursSinceIn} jam sejak scan masuk.`,
      ),
    [stuckRes],
  );

  const branchLogs = scanLogsRes?.data ?? [];

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {isSummaryLoading ? (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl sm:h-24" />
          ))}
        </div>
      ) : (
        <KpiCards items={branchSummary} />
      )}

      <Card className={CARD_CLASS}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm sm:text-base">
            Tren Aktivitas 7 Hari
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          {isActivityLoading ? (
            <Skeleton className="h-[180px] w-full rounded-xl sm:h-[220px]" />
          ) : (
            <ChartContainer
              config={CHART_CONFIG}
              className="h-[180px] w-full sm:h-[220px]"
            >
              <LineChart
                data={branchActivity}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  width={32}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="in"
                  stroke="var(--color-in)"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="out"
                  stroke="var(--color-out)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {isStuckLoading ? (
        <Skeleton className="h-32 w-full rounded-2xl sm:h-40" />
      ) : (
        <div className={isStuckFetching ? "opacity-60 transition-opacity" : ""}>
          <AlertCard
            alerts={branchAlerts}
            footer={
              stuckRes?.paging && stuckRes.paging.totalPages > 1 ? (
                <div className="pt-2">
                  <PaginationControl
                    paging={stuckRes.paging}
                    onPageChange={handleAlertPageChange}
                  />
                </div>
              ) : null
            }
          />
        </div>
      )}

      <Card className={CARD_CLASS}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm sm:text-base">
            Log Scan Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto px-2 sm:px-6">
          {isScanLogsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <table className="w-full min-w-[24rem] border-separate border-spacing-y-1 text-left text-[11px] sm:text-xs">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="px-2 py-2 font-medium sm:px-4">Waktu</th>
                    <th className="px-2 py-2 font-medium sm:px-4">Tipe</th>
                    <th className="px-2 py-2 font-medium sm:px-4">Petugas</th>
                    <th className="px-2 py-2 font-medium sm:px-4">Status</th>
                  </tr>
                </thead>
                <tbody
                  className={
                    isScanLogsFetching ? "opacity-60 transition-opacity" : ""
                  }
                >
                  {branchLogs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-2 py-3 text-center text-muted-foreground sm:px-4"
                      >
                        Belum ada aktivitas scan
                      </td>
                    </tr>
                  ) : (
                    branchLogs.map((log) => (
                      <tr key={log.id} className="bg-muted/30">
                        <td className="whitespace-nowrap rounded-l-lg px-2 py-2.5 sm:px-4">
                          {new Date(log.scanTime).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-2 py-2.5 sm:px-4">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium sm:text-[11px] ${
                              log.type === "IN"
                                ? "bg-primary/10 text-primary"
                                : "bg-orange-500/10 text-orange-600"
                            }`}
                          >
                            {log.type}
                          </span>
                        </td>
                        <td className="max-w-[8rem] truncate px-2 py-2.5 sm:max-w-none sm:px-4">
                          {log.scannedBy.fullName}
                        </td>
                        <td className="rounded-r-lg px-2 py-2.5 sm:px-4">
                          {log.status}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {scanLogsRes?.paging && scanLogsRes.paging.totalPages > 1 && (
                <PaginationControl
                  paging={scanLogsRes.paging}
                  onPageChange={handleScanLogPageChange}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
