"use client";
import { Badge } from "@/components/ui/badge";
import type { ShipmentBranch } from "@/lib/api";
import {
  getStatusBadgeVariant,
  getStatusLabel,
} from "@/lib/utils/status-utils";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

const getTypeVariant = (type: "IN" | "OUT") => {
  return type === "IN" ? "darkGreen" : "warning";
};

export const columns: ColumnDef<ShipmentBranch>[] = [
  {
    accessorKey: "trackingNumber",
    header: "No Resi",
    cell: ({ row }) => {
      const trackingNumber = row.getValue("trackingNumber") as string;
      return (
        <div className="font-mono text-sm font-medium">{trackingNumber}</div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Tipe Pengiriman",
    cell: ({ row }) => {
      const type = row.getValue("type") as "IN" | "OUT";
      return (
        <Badge variant={getTypeVariant(type)} className="font-semibold">
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={getStatusBadgeVariant(status)}>
          {getStatusLabel(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => {
      return (
        <div className="text-sm max-w-xs truncate">
          {row.getValue("description") || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal Dibuat",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return (
        <div className="text-sm">
          {format(new Date(createdAt), "dd/MM/yyyy HH:mm")}
        </div>
      );
    },
  },
  {
    id: "scannedBy",
    header: "Dipindai Oleh",
    cell: ({ row }) => {
      const scannedBy = row.original.scannedByUserId;
      return (
        <div className="text-sm font-medium">
          {scannedBy?.fullName ?? "Tidak diketahui"}
        </div>
      );
    },
  },
];
