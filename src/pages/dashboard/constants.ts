export const CARD_CLASS = "rounded-2xl border-none bg-card shadow-sm";
export const SECTION_GAP = "gap-6";
export const GRID_GAP = "gap-4";

export const CHART_CONFIG = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  volume: { label: "Volume", color: "var(--chart-2)" },
  in: { label: "Masuk", color: "var(--chart-1)" },
  out: { label: "Keluar", color: "var(--chart-3)" },
};

export const STATUS_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
];

export const DASHBOARD_TITLES: Record<string, string> = {
  "super-admin": "Dashboard Super Admin",
  "admin-branch": "Dashboard Admin Cabang",
  courier: "Dashboard Kurir",
  customer: "Dashboard Customer",
};