import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowDown,
  ArrowUp,
  Location,
  RefreshCircle,
  TruckTime,
  SearchNormal1,
  Camera,
  Barcode,
  Additem,
  Building,
} from "iconsax-reactjs";
import { Page } from "@/components/ui/page";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { useAuth } from "@/hooks/use-auth";

// ---- Design tokens ----
const CARD_CLASS = "rounded-2xl border-none bg-card shadow-sm";
const SECTION_GAP = "gap-6";
const GRID_GAP = "gap-4";

const CHART_CONFIG = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  volume: { label: "Volume", color: "var(--chart-2)" },
  in: { label: "Masuk", color: "var(--chart-1)" },
  out: { label: "Keluar", color: "var(--chart-3)" },
};

const STATUS_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
];

type TaskAction = { title: string; type: "pickup" | "deliver" } | null;

const Index = () => {
  useMeta(META_DATA.dashboard);
  const { user, isLoadingUser } = useAuth();
  const role = typeof user?.role === "string" ? user.role : "";

  // ---- state baru untuk fitur interaktif ----
  const [trackingNumber, setTrackingNumber] = useState("");
  const [activeTaskAction, setActiveTaskAction] = useState<TaskAction>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const heroText = useMemo(() => {
    const titles: Record<string, string> = {
      "super-admin": "Dashboard Super Admin",
      "admin-branch": "Dashboard Admin Cabang",
      courier: "Dashboard Kurir",
      customer: "Dashboard Customer",
    };
    return { title: titles[role] ?? "Dashboard" };
  }, [role]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const closeTaskDialog = () => {
    setActiveTaskAction(null);
    setPhotoPreview(null);
  };

  if (isLoadingUser) {
    return (
      <Page title="Dashboard">
        <div className="grid min-h-[60vh] place-items-center text-sm text-muted-foreground">
          Memuat dashboard...
        </div>
      </Page>
    );
  }

  // ---- Data mock (tidak berubah) ----
  const superAdminKpis = [
    { label: "Total Shipment", value: "1.248", description: "Bulan ini" },
    { label: "Total Revenue", value: "Rp 745.000.000", description: "Forecast" },
    { label: "In-Transit", value: "412", description: "Sedang berjalan" },
    { label: "Delivered", value: "832", description: "Terkirim" },
    { label: "Cabang Aktif", value: "18", description: "Seluruh cabang" },
    { label: "Kurir Aktif", value: "63", description: "Terdaftar" },
  ];

  const dailyRevenue = [
    { day: "01 Apr", revenue: 32 },
    { day: "02 Apr", revenue: 45 },
    { day: "03 Apr", revenue: 40 },
    { day: "04 Apr", revenue: 55 },
    { day: "05 Apr", revenue: 60 },
    { day: "06 Apr", revenue: 52 },
    { day: "07 Apr", revenue: 68 },
  ];

  const branchVolume = [
    { branch: "Jakarta", volume: 185 },
    { branch: "Bandung", volume: 134 },
    { branch: "Surabaya", volume: 122 },
    { branch: "Medan", volume: 98 },
    { branch: "Bali", volume: 77 },
  ];

  const statusDistribution = [
    { name: "In Transit", value: 42 },
    { name: "Delivered", value: 33 },
    { name: "Pending", value: 15 },
    { name: "Failed", value: 10 },
  ];

  const branchPerformance = [
    { branch: "Jakarta Selatan", processed: "420", late: "7" },
    { branch: "Bandung", processed: "312", late: "5" },
    { branch: "Surabaya", processed: "298", late: "10" },
  ];

  const latestShipments = [
    { tracking: "SEN123456789", branch: "Jakarta", status: "In Transit", payment: "Paid" },
    { tracking: "SEN987654321", branch: "Bandung", status: "Pending", payment: "Expired" },
    { tracking: "SEN456789123", branch: "Surabaya", status: "Delivered", payment: "Paid" },
  ];

  const branchSummary = [
    { label: "Paket Masuk Hari Ini", value: "128" },
    { label: "Paket Keluar Hari Ini", value: "94" },
    { label: "Total Aktivitas", value: "222" },
    { label: "Ready to Pickup", value: "38" },
  ];

  const branchActivity = [
    { day: "Sel", in: 18, out: 14 },
    { day: "Rab", in: 21, out: 17 },
    { day: "Kam", in: 16, out: 12 },
    { day: "Jum", in: 23, out: 19 },
    { day: "Sab", in: 20, out: 15 },
    { day: "Min", in: 12, out: 10 },
    { day: "Sen", in: 19, out: 16 },
  ];

  const branchLogs = [
    { time: "08:20", type: "IN", user: "Rani", status: "Scan sukses" },
    { time: "09:05", type: "OUT", user: "Bayu", status: "Scan sukses" },
    { time: "10:30", type: "IN", user: "Alya", status: "Ready pickup" },
  ];

  const courierTasks = [
    { title: "Pickup paket JKT-221", location: "Grosir Melati", status: "Pending" },
    { title: "Deliver paket BDO-449", location: "Perumahan Cemara", status: "On the way" },
    { title: "Pickup paket SUB-012", location: "Kantor Cabang Surabaya", status: "Done" },
  ];

  const customerHistory = [
    { tracking: "SEN001234567", date: "18 Apr", status: "Delivered", label: "Sudah diterima" },
    { tracking: "SEN009876543", date: "16 Apr", status: "In Transit", label: "Dalam perjalanan" },
    { tracking: "SEN005432109", date: "12 Apr", status: "Pending", label: "Menunggu pembayaran" },
  ];

  // ---- Shared building blocks ----
  const renderKpiCards = (
    items: { label: string; value: string; description?: string }[]
  ) => (
    <div className={`grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 ${GRID_GAP}`}>
      {items.map((item) => (
        <Card key={item.label} className={`${CARD_CLASS} p-5`}>
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {item.label}
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">{item.value}</div>
          {item.description ? (
            <div className="mt-1 text-xs text-muted-foreground/80">{item.description}</div>
          ) : null}
        </Card>
      ))}
    </div>
  );

  const renderAlertCard = (alerts: string[]) => (
    <Card className={CARD_CLASS}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Alert Penting</CardTitle>
        <CardDescription>Notifikasi operasi yang perlu perhatian cepat.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert}
            className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-sm text-foreground/90"
          >
            {alert}
          </div>
        ))}
      </CardContent>
    </Card>
  );

  // Dialog upload foto bukti — dipakai bersama Pickup & Deliver
  const renderTaskActionDialog = () => (
    <Dialog open={!!activeTaskAction} onOpenChange={(open) => !open && closeTaskDialog()}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {activeTaskAction?.type === "pickup" ? "Konfirmasi Pickup" : "Konfirmasi Deliver"}
          </DialogTitle>
          <DialogDescription>{activeTaskAction?.title}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <label
            htmlFor="proof-photo"
            className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground"
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Bukti" className="h-full w-full rounded-xl object-cover" />
            ) : (
              <>
                <Camera size={28} variant="Bold" className="text-primary" />
                Ambil / unggah foto bukti
              </>
            )}
          </label>
          <input
            id="proof-photo"
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={closeTaskDialog}>
            Batal
          </Button>
          <Button variant="darkGreen" size="sm" disabled={!photoPreview} onClick={closeTaskDialog}>
            Simpan & Konfirmasi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const renderSuperAdminDashboard = () => (
    <>
      <div className={`grid ${SECTION_GAP} xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]`}>
        <div className={`grid ${SECTION_GAP}`}>
          {renderKpiCards(superAdminKpis)}
          <Card className={CARD_CLASS}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Revenue Harian</CardTitle>
              <CardDescription>Estimasi pendapatan per hari di minggu berjalan.</CardDescription>
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
          {renderAlertCard([
            "Pembayaran expired: 5 transaksi menunggu verifikasi.",
            "Paket stuck > 24 jam: 8 pengiriman di cabang Makassar.",
            "Cabang dengan antrean tinggi: Jakarta Barat 27 paket.",
          ])}
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

  const renderAdminBranchDashboard = () => (
    <>
      {renderKpiCards(branchSummary)}
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
        {renderAlertCard([
          "Paket IN belum di-scan OUT > 8 jam di Cabang Bogor.",
          "Antrian scan tinggi di Cabang Semarang.",
        ])}
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
        {/* Log scan: list card -> table, sesuai spec */}
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
      {/* Card Aksi Cepat baru — sebelumnya hilang */}
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

  const renderCourierDashboard = () => (
    <>
      <div className={`grid ${SECTION_GAP} lg:grid-cols-[1.8fr_1fr]`}>
        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tugas Hari Ini</CardTitle>
            <CardDescription>Daftar paket pickup dan delivery yang harus diselesaikan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {courierTasks.map((task) => (
              <div key={task.title} className="rounded-xl bg-muted/30 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium">{task.title}</span>
                  <span className="rounded-full bg-background px-3 py-1 text-xs text-muted-foreground">
                    {task.status}
                  </span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{task.location}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="darkGreen"
                    size="sm"
                    onClick={() => setActiveTaskAction({ title: task.title, type: "pickup" })}
                  >
                    Pickup
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTaskAction({ title: task.title, type: "deliver" })}
                  >
                    Deliver
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <div className={`grid ${SECTION_GAP}`}>
          <Card className={CARD_CLASS}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">KPI Tugas</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {[
                { label: "Selesai Hari Ini", value: 12 },
                { label: "Sedang Berjalan", value: 3 },
                { label: "Menunggu", value: 2 },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-muted/30 p-4">
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                  <div className="mt-1 text-2xl font-semibold">{item.value}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className={CARD_CLASS}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Rute Harian</CardTitle>
            </CardHeader>
            <CardContent className="rounded-xl bg-muted/30 p-6 text-center text-sm text-muted-foreground">
              <Location size={24} variant="Bold" className="mx-auto mb-3 text-primary" />
              Peta rute antar titik pickup, cabang, dan alamat penerima.
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Card Aksi Cepat baru — sebelumnya hilang, dipisah dari task list */}
      <Card className={CARD_CLASS}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Aksi Cepat</CardTitle>
          <CardDescription>Shortcut operasional untuk kurir di lapangan.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          <Button variant="darkGreen" size="sm" className="w-full justify-between">
            Scan Barcode Paket <Barcode size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between"
            onClick={() => setActiveTaskAction({ title: "Konfirmasi umum", type: "deliver" })}
          >
            Konfirmasi Deliver <Camera size={16} />
          </Button>
        </CardContent>
      </Card>

      <Card className={CARD_CLASS}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Timeline Paket</CardTitle>
          <CardDescription>Status paket yang sedang dipegang.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {courierTasks.map((task, index) => (
            <div key={task.title} className="flex items-start gap-4">
              <div className="mt-1.5 flex flex-col items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                {index < courierTasks.length - 1 && <div className="mt-1 h-8 w-px bg-border" />}
              </div>
              <div>
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-muted-foreground">{task.location}</div>
                <div className="mt-1 text-xs text-muted-foreground/80">
                  {task.status} · Foto bukti tersedia setelah selesai
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {renderTaskActionDialog()}
    </>
  );

  const renderCustomerDashboard = () => (
    <>
      <div className={`grid ${SECTION_GAP} lg:grid-cols-[1.5fr_1fr]`}>
        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Status Paket Aktif</CardTitle>
            <CardDescription>Ikhtisar progress paket Anda saat ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl bg-muted/30 p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Tracking</div>
                  <div className="mt-1 text-lg font-semibold">SEN001234567</div>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  In Transit
                </span>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {["Dibuat", "Dibayar", "Pickup", "Transit", "Cabang", "Antarkan", "Terima"].map((step, index) => (
                  <div key={step} className="flex items-center gap-3 rounded-lg bg-background px-4 py-2.5">
                    <div className={`h-2 w-2 rounded-full ${index <= 3 ? "bg-primary" : "bg-border"}`} />
                    <div>
                      <div className="text-sm font-medium">{step}</div>
                      <div className="text-xs text-muted-foreground">{index <= 3 ? "Selesai" : "Menunggu"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input tracking sungguhan — sebelumnya cuma placeholder teks */}
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
                placeholder="Masukkan nomor resi, mis. SEN123456789"
                className="pl-9"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Lihat status real-time paket Anda dengan memasukkan nomor resi di atas.
            </p>
            <Button variant="darkGreen" className="w-full" disabled={!trackingNumber.trim()}>
              Lacak Paket
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className={`grid ${SECTION_GAP} xl:grid-cols-[1.4fr_1fr]`}>
        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Riwayat Pengiriman</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {customerHistory.map((item) => (
              <div key={item.tracking} className="flex items-center gap-3 rounded-xl bg-muted/30 p-4">
                {item.status === "Delivered" ? (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
                    <Camera size={18} variant="Bold" />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{item.tracking}</div>
                      <div className="text-sm text-muted-foreground">{item.date}</div>
                    </div>
                    <span className="rounded-full bg-background px-3 py-1 text-xs">{item.status}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary hover:bg-transparent">
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className={CARD_CLASS}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="darkGreen" className="w-full">Buat Kiriman Baru</Button>
            <Button variant="outline" className="w-full">Lihat Estimasi Biaya</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const dashboardContent = useMemo(() => {
    switch (role) {
      case "super-admin":
        return renderSuperAdminDashboard();
      case "admin-branch":
        return renderAdminBranchDashboard();
      case "courier":
        return renderCourierDashboard();
      case "customer":
        return renderCustomerDashboard();
      default:
        return (
          <Card className={`${CARD_CLASS} text-center`}>
            <CardContent className="p-8">
              <p className="text-sm text-muted-foreground">
                Role tidak dikenali. Silakan periksa kembali informasi akun Anda.
              </p>
            </CardContent>
          </Card>
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, trackingNumber, activeTaskAction, photoPreview]);

  return (
    <Page title={heroText.title}>
      <div className={`grid ${SECTION_GAP}`}>
        <Card className="rounded-2xl border-none bg-gradient-to-br from-primary to-primary/85 text-primary-foreground">
          <CardContent className="flex items-center justify-between gap-4 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/70">
                Selamat datang,
              </p>
              <h1 className="mt-1 text-2xl font-semibold">{user?.fullName ?? "Pengguna"}</h1>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <TruckTime size={28} variant="Bold" />
            </div>
          </CardContent>
        </Card>
        {dashboardContent}
      </div>
    </Page>
  );
};

export default Index;