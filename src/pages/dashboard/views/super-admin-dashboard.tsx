import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
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
import { ArrowDown, ArrowUp, RefreshCircle } from "iconsax-reactjs";
import { CARD_CLASS, CHART_CONFIG, SECTION_GAP, STATUS_COLORS } from "../constants";
import { KpiCards } from "../components/kpi-cards";
import { AlertCard } from "../components/alert-card";
import {
  superAdminKpis,
  dailyRevenue,
  branchVolume,
  statusDistribution,
  branchPerformance,
  latestShipments,
  superAdminAlerts,
} from "../mock-data";

export const SuperAdminDashboard = () => (
  <>
    <div className={`grid ${SECTION_GAP} xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]`}>
      <div className={`grid ${SECTION_GAP}`}>
        <KpiCards items={superAdminKpis} />

        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue Harian</CardTitle>
            <CardDescription>Estimasi pendapatan per hari di minggu berjalan</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={CHART_CONFIG} className="h-[220px] w-full">
              <LineChart data={dailyRevenue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Ranking Performa Cabang</CardTitle>
            <CardDescription>Cabang dengan pemrosesan tercepat dan tingkat keterlambatan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {branchPerformance.map((item) => (
              <div key={item.branch} className="grid grid-cols-3 items-center gap-3 rounded-xl bg-muted/30 px-4 py-2.5 text-xs">
                <div className="font-medium text-foreground">{item.branch}</div>
                <div className="text-muted-foreground">{item.processed} diproses</div>
                <div className="text-muted-foreground">{item.late} terlambat</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className={`grid ${SECTION_GAP}`}>
        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Volume Shipment per Cabang</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={CHART_CONFIG} className="h-[200px] w-full">
              <BarChart data={branchVolume} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="branch" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="volume" fill="var(--color-volume)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Distribusi Status Pengiriman</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={CHART_CONFIG} className="h-[200px] w-full">
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
                    <Cell key={entry.name} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ChartContainer>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {statusDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[index % STATUS_COLORS.length] }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <AlertCard alerts={superAdminAlerts} />
      </div>
    </div>

    <div className={`grid ${SECTION_GAP} lg:grid-cols-2`}>
      <Card className={CARD_CLASS}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Shipment Terbaru</CardTitle>
          <CardDescription>Tabel ringkas status terbaru dan status pembayaran.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[24rem] border-separate border-spacing-y-1 text-left text-xs">
            <thead>
              <tr className="text-muted-foreground">
                <th className="px-4 py-2 font-medium">Tracking</th>
                <th className="px-4 py-2 font-medium">Cabang</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Pembayaran</th>
              </tr>
            </thead>
            <tbody>
              {latestShipments.map((shipment) => (
                <tr key={shipment.tracking} className="bg-muted/30">
                  <td className="rounded-l-lg px-4 py-2.5">{shipment.tracking}</td>
                  <td className="px-4 py-2.5">{shipment.branch}</td>
                  <td className="px-4 py-2.5">{shipment.status}</td>
                  <td className="rounded-r-lg px-4 py-2.5">{shipment.payment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      
      <Card className={CARD_CLASS}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Aksi Cepat</CardTitle>
          <CardDescription>Kelola cabang, employee, dan permission dari satu tempat.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <Button variant="darkGreen" size="sm" className="w-full justify-between">
            Kelola Cabang <ArrowUp size={16} />
          </Button>
          <Button variant="darkGreen" size="sm" className="w-full justify-between">
            Kelola Employee <ArrowDown size={16} />
          </Button>
          <Button variant="darkGreen" size="sm" className="w-full justify-between">
            Kelola Permission <RefreshCircle size={16} />
          </Button>
        </CardContent>
      </Card>
    </div>
  </>
);