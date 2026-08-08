import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { Additem, Building } from "iconsax-reactjs";
import { CARD_CLASS, CHART_CONFIG, SECTION_GAP } from "../constants";
import { KpiCards } from "../components/kpi-cards";
import { AlertCard } from "../components/alert-card";
import { branchSummary, branchActivity, branchLogs, branchAlerts } from "../mock-data";

export const AdminBranchDashboard = () => (
  <>
    <KpiCards items={branchSummary} />
    <div className={`grid ${SECTION_GAP} lg:grid-cols-[1.4fr_1fr]`}>
      <Card className={CARD_CLASS}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Scan Masuk / Scan Keluar</CardTitle>
          <CardDescription>Fokus role admin cabang pada operasi scan paket.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Button variant="darkGreen" size="lg" className="w-full">Scan Masuk</Button>
          <Button variant="oranye" size="lg" className="w-full">Scan Keluar</Button>
        </CardContent>
      </Card>
      <AlertCard alerts={branchAlerts} />
    </div>
    
    <div className={`grid ${SECTION_GAP} lg:grid-cols-[1.4fr_1fr]`}>
      <Card className={CARD_CLASS}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Tren Aktivitas 7 Hari</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card className={CARD_CLASS}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Log Scan Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[20rem] border-separate border-spacing-y-1 text-left text-xs">
            <thead>
              <tr className="text-muted-foreground">
                <th className="px-4 py-2 font-medium">Waktu</th>
                <th className="px-4 py-2 font-medium">Tipe</th>
                <th className="px-4 py-2 font-medium">Petugas</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {branchLogs.map((log) => (
                <tr key={`${log.time}-${log.user}`} className="bg-muted/30">
                  <td className="rounded-l-lg px-4 py-2.5">{log.time}</td>
                  <td className="px-4 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${log.type === "IN" ? "bg-primary/10 text-primary" : "bg-orange-500/10 text-orange-600"}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">{log.user}</td>
                  <td className="rounded-r-lg px-4 py-2.5">{log.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
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