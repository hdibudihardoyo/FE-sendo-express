import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControl } from "@/components/ui/pagination-control";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { KpiCards } from "../components/kpi-cards";
import { AlertCard } from "../components/alert-card";
import {
  useDashboardSummary,
  useDailyRevenueChart,
  useVolumeByBranch,
  useShipmentStatusDistribution,
  useBranchPerformanceRanking,
  useRecentShipments,
  useDashboardAlerts,
} from "@/hooks/use-dashboard-superadmin";

const DEFAULT_SHIPMENT_LIMIT = 10;
const DEFAULT_ALERT_LIMIT = 10;

// Formatter angka & mata uang Indonesia
const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
const numberFormatter = new Intl.NumberFormat("id-ID");

const CARD_CLASS = "rounded-2xl border border-border/60 shadow-sm";
const SECTION_GAP = "gap-4";

const STATUS_COLORS = [
  "var(--chart-1, #22c55e)",
  "var(--chart-2, #3b82f6)",
  "var(--chart-3, #f59e0b)",
  "var(--chart-4, #ef4444)",
  "var(--chart-5, #a855f7)",
];

const CHART_CONFIG = {
  revenue: { label: "Revenue", color: "var(--chart-1, #22c55e)" },
  volume: { label: "Volume", color: "var(--chart-2, #3b82f6)" },
} satisfies Record<string, { label: string; color: string }>;

export const SuperAdminDashboardPage = () => {
  const [revenueDays, setRevenueDays] = useState(7);
  const [volumeBranchLimit] = useState(5);
  const [paymentStatusFilter] = useState("ALL");
  const [searchParams, setSearchParams] = useSearchParams();
  const shipmentPage = Number(searchParams.get("shipmentPage") || 1);
  const shipmentLimit = Number(
    searchParams.get("shipmentLimit") || DEFAULT_SHIPMENT_LIMIT,
  );
  const alertPage = Number(searchParams.get("alertPage") || 1);
  const alertLimit = Number(
    searchParams.get("alertLimit") || DEFAULT_ALERT_LIMIT,
  );

  const handleShipmentPageChange = (newPage: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("shipmentPage", String(newPage));
        if (!next.get("shipmentLimit")) {
          next.set("shipmentLimit", String(DEFAULT_SHIPMENT_LIMIT));
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
        next.set("alertPage", String(newPage));
        if (!next.get("alertLimit")) {
          next.set("alertLimit", String(DEFAULT_ALERT_LIMIT));
        }
        return next;
      },
      { replace: true },
    );
  };

  const { data: summaryRes, isLoading: isSummaryLoading } =
    useDashboardSummary();
  const { data: revenueRes, isLoading: isRevenueLoading } =
    useDailyRevenueChart(revenueDays);
  const { data: volumeRes, isLoading: isVolumeLoading } =
    useVolumeByBranch(volumeBranchLimit);
  const { data: statusRes, isLoading: isStatusLoading } =
    useShipmentStatusDistribution();
  const { data: rankingRes, isLoading: isRankingLoading } =
    useBranchPerformanceRanking();
  const {
    data: alertsRes,
    isLoading: isAlertsLoading,
    isFetching: isAlertsFetching,
  } = useDashboardAlerts({ page: alertPage, limit: alertLimit });
  const {
    data: shipmentsRes,
    isLoading: isShipmentsLoading,
    isFetching: isShipmentsFetching,
  } = useRecentShipments({
    limit: shipmentLimit,
    paymentStatus: paymentStatusFilter,
    page: shipmentPage,
  });

  const superAdminKpis = useMemo(() => {
    const s = summaryRes?.data;
    if (!s) return [];
    return [
      {
        label: "Shipment Bulan Ini",
        value: numberFormatter.format(s.totalShipmentsThisMonth),
      },
      {
        label: "Total Revenue",
        value: currencyFormatter.format(s.totalRevenue),
      },
      {
        label: "Dalam Perjalanan",
        value: numberFormatter.format(s.inTransitPackages),
      },
      { label: "Terkirim", value: numberFormatter.format(s.deliveredPackages) },
      {
        label: "Cabang Aktif",
        value: numberFormatter.format(s.activeBranches),
      },
      { label: "Kurir Aktif", value: numberFormatter.format(s.activeCouriers) },
    ];
  }, [summaryRes]);

  const dailyRevenue = useMemo(
    () =>
      (revenueRes?.data.dailyRevenue ?? []).map((d) => {
        const date = new Date(d.date);
        return {
          day:
            revenueDays <= 7
              ? date.toLocaleDateString("id-ID", { weekday: "long" })
              : date.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                }),
          fullDate: date.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          revenue: d.revenue,
        };
      }),
    [revenueRes, revenueDays],
  );

  const branchVolume = useMemo(
    () =>
      (volumeRes?.data ?? []).map((v) => ({
        branch: v.branchName,
        volume: v.volume,
      })),
    [volumeRes],
  );

  const statusDistribution = useMemo(
    () =>
      (statusRes?.data ?? []).map((s) => ({
        name: s.status,
        value: s.count,
      })),
    [statusRes],
  );

  const branchPerformance = useMemo(
    () =>
      (rankingRes?.data ?? []).map((r) => ({
        branch: r.branchName,
        processed: r.packagesProcessed,
        late: r.latePackages,
      })),
    [rankingRes],
  );

  const latestShipments = useMemo(
    () =>
      (shipmentsRes?.data ?? []).map((sh) => ({
        tracking: sh.trackingNumber,
        branch: sh.currentBranch,
        status: sh.deliveryStatus,
        payment: sh.paymentStatus,
      })),
    [shipmentsRes],
  );

  const alertMessages = useMemo(
    () => (alertsRes?.data ?? []).map((alert) => alert.description),
    [alertsRes],
  );

  return (
    <>
      <div
        className={`grid ${SECTION_GAP} xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]`}
      >
        <div className={`grid ${SECTION_GAP}`}>
          {isSummaryLoading ? (
            <Skeleton className="h-24 w-full rounded-2xl" />
          ) : (
            <KpiCards items={superAdminKpis} />
          )}
          <Card className={CARD_CLASS}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <CardTitle className="text-base">Revenue Harian</CardTitle>
                <CardDescription>
                  Estimasi pendapatan per hari di rentang terpilih
                </CardDescription>
              </div>
              <div className="flex gap-1">
                {[7, 14, 30].map((d) => (
                  <Button
                    key={d}
                    size="sm"
                    variant={revenueDays === d ? "darkGreen" : "outline"}
                    className="h-7 px-2 text-xs"
                    onClick={() => setRevenueDays(d)}
                  >
                    {d}H
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              {isRevenueLoading ? (
                <Skeleton className="h-[220px] w-full rounded-xl" />
              ) : (
                <ChartContainer
                  config={CHART_CONFIG}
                  className="h-[240px] w-full"
                >
                  <LineChart
                    data={dailyRevenue}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 4,
                      bottom: revenueDays <= 7 ? 20 : 0,
                    }}
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
                      angle={revenueDays <= 7 ? -35 : 0}
                      textAnchor={revenueDays <= 7 ? "end" : "middle"}
                      height={revenueDays <= 7 ? 45 : 30}
                      interval={revenueDays > 14 ? "preserveStartEnd" : 0}
                    />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      width={56}
                      tickFormatter={(value: number) =>
                        new Intl.NumberFormat("id-ID", {
                          notation: "compact",
                          compactDisplay: "short",
                        }).format(value)
                      }
                    />
                    <Tooltip
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.fullDate ?? ""
                      }
                      formatter={(value: number) => [
                        currencyFormatter.format(value),
                        "Revenue",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-revenue)"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
          <Card className={CARD_CLASS}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Ranking Performa Cabang
              </CardTitle>
              <CardDescription>
                Cabang dengan pemrosesan tercepat dan tingkat keterlambatan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {isRankingLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full rounded-xl" />
                ))
              ) : branchPerformance.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Belum ada data performa cabang
                </p>
              ) : (
                branchPerformance.map((item) => (
                  <div
                    key={item.branch}
                    className="grid grid-cols-3 items-center gap-3 rounded-xl bg-muted/30 px-4 py-2.5 text-xs"
                  >
                    <div className="font-medium text-foreground">
                      {item.branch}
                    </div>
                    <div className="text-muted-foreground">
                      {numberFormatter.format(item.processed)} diproses
                    </div>
                    <div className="text-muted-foreground">
                      {numberFormatter.format(item.late)} terlambat
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
        <div className={`grid ${SECTION_GAP}`}>
          <Card className={CARD_CLASS}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Volume Shipment per Cabang
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isVolumeLoading ? (
                <Skeleton className="h-[200px] w-full rounded-xl" />
              ) : (
                <ChartContainer
                  config={CHART_CONFIG}
                  className="h-[200px] w-full"
                >
                  <BarChart
                    data={branchVolume}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="branch"
                      stroke="var(--muted-foreground)"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                    />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="volume"
                      fill="var(--color-volume)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
          <Card className={CARD_CLASS}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Distribusi Status Pengiriman
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isStatusLoading ? (
                <Skeleton className="h-[200px] w-full rounded-xl" />
              ) : (
                <>
                  <ChartContainer
                    config={CHART_CONFIG}
                    className="h-[200px] w-full"
                  >
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                        strokeWidth={0}
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ChartContainer>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                    {statusDistribution.map((entry, index) => (
                      <div
                        key={entry.name}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground"
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor:
                              STATUS_COLORS[index % STATUS_COLORS.length],
                          }}
                        />
                        {entry.name}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          {isAlertsLoading ? (
            <Skeleton className="h-40 w-full rounded-2xl" />
          ) : (
            <div
              className={
                isAlertsFetching ? "opacity-60 transition-opacity" : ""
              }
            >
              <AlertCard
                alerts={alertMessages}
                footer={
                  alertsRes?.paging && alertsRes.paging.totalPages > 1 ? (
                    <div className="pt-2">
                      <PaginationControl
                        paging={alertsRes.paging}
                        onPageChange={handleAlertPageChange}
                      />
                    </div>
                  ) : null
                }
              />
            </div>
          )}
        </div>
      </div>
      <Card className={CARD_CLASS}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Shipment Terbaru</CardTitle>
          <CardDescription>
            Tabel ringkas status terbaru dan status pembayaran
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isShipmentsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <table className="w-full min-w-[24rem] border-separate border-spacing-y-1 text-left text-xs">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Tracking</th>
                    <th className="px-4 py-2 font-medium">Cabang</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Pembayaran</th>
                  </tr>
                </thead>
                <tbody
                  className={
                    isShipmentsFetching ? "opacity-60 transition-opacity" : ""
                  }
                >
                  {latestShipments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-3 text-center text-muted-foreground"
                      >
                        Tidak ada shipment
                      </td>
                    </tr>
                  ) : (
                    latestShipments.map((shipment) => (
                      <tr key={shipment.tracking} className="bg-muted/30">
                        <td className="rounded-l-lg px-4 py-2.5">
                          {shipment.tracking}
                        </td>
                        <td className="px-4 py-2.5">{shipment.branch}</td>
                        <td className="px-4 py-2.5">{shipment.status}</td>
                        <td className="rounded-r-lg px-4 py-2.5">
                          {shipment.payment}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {shipmentsRes?.paging && shipmentsRes.paging.totalPages > 1 && (
                <PaginationControl
                  paging={shipmentsRes.paging}
                  onPageChange={handleShipmentPageChange}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};
