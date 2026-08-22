import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router";
import type { History } from "@/lib/api";

interface HistoryActionCellProps {
  history: History;
}

export function HistoryActionCell({ history }: HistoryActionCellProps) {
  return (
    <div className="flex items-center gap-2">
      <Link
        to={`/history/detail/${history.id}`}
        className={buttonVariants({
          variant: "darkGreen",
          size: "sm",
        })}
      >
        Detail
      </Link>
    </div>
  );
}
