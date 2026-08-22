"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { UserAddress } from "@/lib/api";
import { ActionCell } from "./action-cell";

export const createColumns = (
  onDataChange?: () => void,
): ColumnDef<UserAddress>[] => [
  {
    accessorKey: "address",
    header: "Alamat",
    cell: ({ row }) => {
      return (
        <div className="text-sm max-w-xs truncate">
          {row.getValue("address")}
        </div>
      );
    },
  },
  {
    accessorKey: "tag",
    header: "Patokan",
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue("tag")}</div>;
    },
  },
  {
    accessorKey: "label",
    header: "Label",
    cell: ({ row }) => {
      const label = row.getValue("label") as string;
      return (
        <div className="text-sm">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {label || "Tidak ada label"}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      return (
        <ActionCell userAddress={row.original} onDataChange={onDataChange} />
      );
    },
  },
];
