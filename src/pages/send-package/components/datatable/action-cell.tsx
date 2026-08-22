import { Link, useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import type { Shipment } from "@/lib/api";

interface ActionCellProps {
  shipment: Shipment;
}

function ActionCell({ shipment }: ActionCellProps) {
  const navigate = useNavigate();

  const handlePayment = () => {
    navigate(`/send-package/pay/${shipment.id}`);
  };

  return (
    <div className="flex gap-2">
      <Link
        to={`/send-package/detail/${shipment.id}`}
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        Detail
      </Link>
      {shipment.paymentStatus === "PENDING" && (
        <Button size="sm" onClick={handlePayment}>
          Bayar
        </Button>
      )}
    </div>
  );
}

export default ActionCell;
