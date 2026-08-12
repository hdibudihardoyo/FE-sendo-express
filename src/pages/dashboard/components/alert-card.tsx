import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type AlertCardProps = {
  alerts: string[];
  footer?: React.ReactNode;
};

export const AlertCard = ({ alerts, footer }: AlertCardProps) => (
  <Card className="rounded-2xl border border-border/60 shadow-sm">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Alert Penting</CardTitle>
      <CardDescription>Notifikasi operasi yang perlu perhatian cepat</CardDescription>
    </CardHeader>
    <CardContent className="space-y-2">
      {alerts.length === 0 ? (
        <div className="rounded-xl border border-border/40 bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
          Tidak ada alert saat ini
        </div>
      ) : (
        alerts.map((alert) => (
          <div
            key={alert}
            className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-sm text-foreground/90"
          >
            {alert}
          </div>
        ))
      )}
      {footer}
    </CardContent>
  </Card>
);