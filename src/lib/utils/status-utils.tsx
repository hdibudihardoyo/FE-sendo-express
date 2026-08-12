import { Timer, TruckTime, BoxTick, Location, CardPos } from "iconsax-reactjs";
import type { DeliveryStatus, PaymentStatus } from "@/lib/api/types/shipment";
import type { ReactNode } from "react";

type BadgeVariant =
  | "secondary"
  | "warning"
  | "default"
  | "destructive"
  | "darkGreen"
  | "outline";

type StatusConfig = {
  label: string;
  badge: BadgeVariant;
  icon: ReactNode;
};

const DEFAULT_STATUS: StatusConfig = {
  label: "-",
  badge: "secondary",
  icon: <Timer size={20} variant="Bold" />,
};

const STATUS_CONFIG: Partial<
  Record<NonNullable<DeliveryStatus>, StatusConfig>
> = {
  READY_TO_PICKUP: {
    label: "Siap Dijemput",
    badge: "secondary",
    icon: <Timer size={20} variant="Bold" />,
  },

  WAITING_FOR_PICKUP: {
    label: "Menunggu Dijemput",
    badge: "secondary",
    icon: <Timer size={20} variant="Bold" />,
  },

  PICKED_UP: {
    label: "Sudah Dijemput",
    badge: "warning",
    icon: <TruckTime size={20} variant="Bold" />,
  },

  IN_TRANSIT: {
    label: "Dalam Perjalanan",
    badge: "warning",
    icon: <TruckTime size={20} variant="Bold" />,
  },

  ARRIVED_AT_BRANCH: {
    label: "Tiba di Cabang",
    badge: "warning",
    icon: <Location size={20} variant="Bold" />,
  },

  DEPARTED_FROM_BRANCH: {
    label: "Berangkat dari Cabang",
    badge: "warning",
    icon: <TruckTime size={20} variant="Bold" />,
  },

  AT_BRANCH: {
    label: "Di Cabang",
    badge: "warning",
    icon: <Location size={20} variant="Bold" />,
  },

  ON_THE_WAY: {
    label: "Menuju Cabang Tujuan",
    badge: "warning",
    icon: <TruckTime size={20} variant="Bold" />,
  },

  READY_TO_PICKUP_AT_BRANCH: {
    label: "Siap Dijemput di Cabang",
    badge: "warning",
    icon: <Location size={20} variant="Bold" />,
  },

  READY_TO_DELIVER: {
    label: "Siap Dikirim",
    badge: "warning",
    icon: <TruckTime size={20} variant="Bold" />,
  },

  ON_THE_WAY_TO_ADDRESS: {
    label: "Menuju Alamat Tujuan",
    badge: "warning",
    icon: <TruckTime size={20} variant="Bold" />,
  },

  DELIVERED: {
    label: "Diterima",
    badge: "darkGreen",
    icon: <BoxTick size={20} variant="Bold" />,
  },

  COMPLETED: {
    label: "Selesai",
    badge: "darkGreen",
    icon: <BoxTick size={20} variant="Bold" />,
  },
};

export const getStatusLabel = (status: DeliveryStatus): string =>
  status ? (STATUS_CONFIG[status]?.label ?? status) : DEFAULT_STATUS.label;

export const getStatusIcon = (status: DeliveryStatus) =>
  status
    ? (STATUS_CONFIG[status]?.icon ?? DEFAULT_STATUS.icon)
    : DEFAULT_STATUS.icon;

export const getStatusBadgeVariant = (status: DeliveryStatus): BadgeVariant =>
  status
    ? (STATUS_CONFIG[status]?.badge ?? DEFAULT_STATUS.badge)
    : DEFAULT_STATUS.badge;

const PAYMENT_STATUSES: PaymentStatus[] = [
  "PENDING",
  "PAID",
  "SETTLED",
  "EXPIRED",
  "FAILED",
  "REFUNDED",
];

export const isPaymentStatus = (status: string): status is PaymentStatus =>
  PAYMENT_STATUSES.includes(status as PaymentStatus);

export const getPaymentVariant = (status: PaymentStatus): BadgeVariant => {
  switch (status) {
    case "PENDING":
      return "warning";
    case "PAID":
    case "SETTLED":
      return "darkGreen";
    case "EXPIRED":
    case "FAILED":
      return "destructive";
    case "REFUNDED":
      return "secondary";
    default:
      return "secondary";
  }
};

export const formatPaymentStatus = (status: PaymentStatus): string => {
  switch (status) {
    case "PENDING":
      return "Belum Bayar";
    case "PAID":
      return "Lunas";
    case "SETTLED":
      return "Lunas";
    case "EXPIRED":
      return "Kadaluwarsa";
    case "FAILED":
      return "Gagal Bayar";
    case "REFUNDED":
      return "Dikembalikan";
    default:
      return status;
  }
};

export const isPaymentCompleted = (status: PaymentStatus) =>
  status === "PAID" || status === "SETTLED";

const PACKAGE_TYPE_LABELS: Record<string, string> = {
  Furniture: "Furniture",
  Electronics: "Elektronik",
  Clothing: "Pakaian",
  Documents: "Dokumen",
};

const DELIVERY_TYPE_LABELS: Record<string, string> = {
  regular: "Regular",
  next_day: "Next Day",
  same_day: "Same Day",
};

export const getDeliveryTypeLabel = (deliveryType: string): string =>
  DELIVERY_TYPE_LABELS[deliveryType] ?? deliveryType;

export const getPackageTypeLabel = (packageType: string): string =>
  PACKAGE_TYPE_LABELS[packageType] ?? packageType;

export const getHistoryLabel = (status: string): string =>
  isPaymentStatus(status)
    ? formatPaymentStatus(status)
    : getStatusLabel(status as DeliveryStatus);

export const getHistoryIcon = (status: string) => {
  if (isPaymentStatus(status)) {
    return <CardPos size={20} variant="Bold" />;
  }
  return getStatusIcon(status as DeliveryStatus);
};
