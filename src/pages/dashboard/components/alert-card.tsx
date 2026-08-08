import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CARD_CLASS } from "../constants";

type AlertCardProps = {
  alerts: string[];
};

export const AlertCard = ({ alerts }: AlertCardProps) => (
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