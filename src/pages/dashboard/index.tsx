import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Page } from "@/components/ui/page";
import { TruckTime } from "iconsax-reactjs";
import { useMeta, META_DATA } from "@/hooks/use-meta";
import { useAuth } from "@/hooks/use-auth";
import { SuperAdminDashboardPage } from "./views/super-admin-dashboard";
import { AdminBranchDashboardPage } from "./views/admin-branch-dashboard";
import { CourierDashboardPage } from "./views/courier-dashboard";
import { CustomerDashboardPage } from "./views/customer-dashboard";

const CARD_CLASS = "rounded-2xl border border-border/60 shadow-sm";
const SECTION_GAP = "gap-4";

const DASHBOARD_TITLES: Record<string, string> = {
  "super-admin": "Dashboard Super Admin",
  "admin-branch": "Dashboard Cabang",
  courier: "Dashboard Kurir",
  customer: "Dashboard Customer",
};

const Index = () => {
  useMeta(META_DATA.dashboard);
  const { user, isLoadingUser } = useAuth();
  const role = typeof user?.role === "string" ? user.role : "";

  const title = useMemo(() => DASHBOARD_TITLES[role] ?? "Dashboard", [role]);

  if (isLoadingUser) {
    return (
      <Page title="Dashboard">
        <div className="grid min-h-[60vh] place-items-center text-sm text-muted-foreground">
          Memuat dashboard...
        </div>
      </Page>
    );
  }

  const renderDashboard = () => {
    switch (role) {
      case "super-admin":
        return <SuperAdminDashboardPage />;
      case "admin-branch":
        return <AdminBranchDashboardPage />;
      case "courier":
        return <CourierDashboardPage />;
      case "customer":
        return <CustomerDashboardPage />;
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
  };

  return (
    <Page title={title}>
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
        {renderDashboard()}
      </div>
    </Page>
  );
};

export default Index;