import { Card } from "@/components/ui/card";
import type { KpiItem } from "../types";

type KpiCardsProps = {
  items: KpiItem[];
};

export const KpiCards = ({ items }: KpiCardsProps) => (
  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
    {items.map((item) => (
      <Card key={item.label} className="rounded-2xl border border-border/60 shadow-sm p-5">
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