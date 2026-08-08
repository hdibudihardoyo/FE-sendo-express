// == Super Admin ==
export const superAdminKpis = [
  { label: "Total Shipment", value: "1.248", description: "Bulan ini" },
  { label: "Total Revenue", value: "Rp 745.000.000", description: "Forecast" },
  { label: "In-Transit", value: "412", description: "Sedang berjalan" },
  { label: "Delivered", value: "832", description: "Terkirim" },
  { label: "Cabang Aktif", value: "18", description: "Seluruh cabang" },
  { label: "Kurir Aktif", value: "63", description: "Terdaftar" },
];

export const dailyRevenue = [
  { day: "01 Apr", revenue: 32 },
  { day: "02 Apr", revenue: 45 },
  { day: "03 Apr", revenue: 40 },
  { day: "04 Apr", revenue: 55 },
  { day: "05 Apr", revenue: 60 },
  { day: "06 Apr", revenue: 52 },
  { day: "07 Apr", revenue: 68 },
];

export const branchVolume = [
  { branch: "Jakarta", volume: 185 },
  { branch: "Bandung", volume: 134 },
  { branch: "Surabaya", volume: 122 },
  { branch: "Medan", volume: 98 },
  { branch: "Bali", volume: 77 },
];

export const statusDistribution = [
  { name: "In Transit", value: 42 },
  { name: "Delivered", value: 33 },
  { name: "Pending", value: 15 },
  { name: "Failed", value: 10 },
];

export const branchPerformance = [
  { branch: "Jakarta Selatan", processed: "420", late: "7" },
  { branch: "Bandung", processed: "312", late: "5" },
  { branch: "Surabaya", processed: "298", late: "10" },
];

export const latestShipments = [
  { tracking: "SEN123456789", branch: "Jakarta", status: "In Transit", payment: "Paid" },
  { tracking: "SEN987654321", branch: "Bandung", status: "Pending", payment: "Expired" },
  { tracking: "SEN456789123", branch: "Surabaya", status: "Delivered", payment: "Paid" },
];

export const superAdminAlerts = [
  "Pembayaran expired: 5 transaksi menunggu verifikasi.",
  "Paket stuck > 24 jam: 8 pengiriman di cabang Makassar.",
  "Cabang dengan antrean tinggi: Jakarta Barat 27 paket.",
];

// == Admin Branch ==
export const branchSummary = [
  { label: "Paket Masuk Hari Ini", value: "128" },
  { label: "Paket Keluar Hari Ini", value: "94" },
  { label: "Total Aktivitas", value: "222" },
  { label: "Ready to Pickup", value: "38" },
];

export const branchActivity = [
  { day: "Sel", in: 18, out: 14 },
  { day: "Rab", in: 21, out: 17 },
  { day: "Kam", in: 16, out: 12 },
  { day: "Jum", in: 23, out: 19 },
  { day: "Sab", in: 20, out: 15 },
  { day: "Min", in: 12, out: 10 },
  { day: "Sen", in: 19, out: 16 },
];

export const branchLogs = [
  { time: "08:20", type: "IN", user: "Rani", status: "Scan sukses" },
  { time: "09:05", type: "OUT", user: "Bayu", status: "Scan sukses" },
  { time: "10:30", type: "IN", user: "Alya", status: "Ready pickup" },
];

export const branchAlerts = [
  "Paket IN belum di-scan OUT > 8 jam di Cabang Bogor.",
  "Antrian scan tinggi di Cabang Semarang.",
];

// == Courier ==
export const courierTasks = [
  { title: "Pickup paket JKT-221", location: "Grosir Melati", status: "Pending" },
  { title: "Deliver paket BDO-449", location: "Perumahan Cemara", status: "On the way" },
  { title: "Pickup paket SUB-012", location: "Kantor Cabang Surabaya", status: "Done" },
];

export const courierTaskKpis = [
  { label: "Selesai Hari Ini", value: 12 },
  { label: "Sedang Berjalan", value: 3 },
  { label: "Menunggu", value: 2 },
];

// == Customer ==
export const customerHistory = [
  { tracking: "SEN001234567", date: "18 Apr", status: "Delivered", label: "Sudah diterima" },
  { tracking: "SEN009876543", date: "16 Apr", status: "In Transit", label: "Dalam perjalanan" },
  { tracking: "SEN005432109", date: "12 Apr", status: "Pending", label: "Menunggu pembayaran" },
];

export const customerActiveShipmentSteps = [
  "Dibuat",
  "Dibayar",
  "Pickup",
  "Transit",
  "Cabang",
  "Antarkan",
  "Terima",
];