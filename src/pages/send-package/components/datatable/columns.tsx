"use client";
import { Badge } from "@/components/ui/badge";
import type { Shipment, PaymentStatus } from "@/lib/api";
import {
  getStatusLabel,
  getStatusBadgeVariant,
  getPaymentVariant,
  formatPaymentStatus,
} from "@/lib/utils/status-utils";
import { type ColumnDef } from "@tanstack/react-table";
import ActionCell from "./action-cell";

export const useColumns = (): ColumnDef<Shipment>[] => {
  const columns: ColumnDef<Shipment>[] = [
    {
      accessorKey: "trackingNumber",
      header: "No Resi",
      cell: ({ row }) => {
        const trackingNumber = row.getValue("trackingNumber") as string;
        return (
          <div className="text-sm font-medium">
            {trackingNumber ?? "Belum tersedia"}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Tanggal Dibuat",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt") as string);
        return (
          <div className="text-sm">{date.toLocaleDateString("id-ID")}</div>
        );
      },
    },
    {
      accessorKey: "deliveryStatus",
      header: "Status Pengiriman",
      cell: ({ row }) => {
        const status = row.original.deliveryStatus;
        if (!status) {
          return (
            <Badge variant="secondary" className="text-white">
              Menunggu Pembayaran
            </Badge>
          );
        }
        return (
          <Badge variant={getStatusBadgeVariant(status)}>
            {getStatusLabel(status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "paymentStatus",
      header: "Status Pembayaran",
      cell: ({ row }) => {
        const status = row.getValue("paymentStatus") as PaymentStatus;
        return (
          <Badge variant={getPaymentVariant(status)}>
            {formatPaymentStatus(status)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => <ActionCell shipment={row.original} />,
    },
  ];
  return columns;
};
