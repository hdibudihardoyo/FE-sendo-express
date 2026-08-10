import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
type AlertCardProps = {
  alerts: string[];
};

export const AlertCard = ({ alerts }: AlertCardProps) => (
  <Card className="rounded-2xl border border-border/60 shadow-sm">
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