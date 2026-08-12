export type TaskAction = {
  title: string;
  type: "pickup" | "deliver";
  deliveryStatus: string;
} | null;

export type KpiItem = {
  label: string;
  value: string;
  description?: string;
};

export type CourierTask = {
  title: string;
  location: string;
  status: string;
};