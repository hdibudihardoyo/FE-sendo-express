"use client";

import type { Branch } from "@/lib/api";
import { type ColumnDef } from "@tanstack/react-table";
import { BranchActionCell } from "./branch-action-cell";

export const columns = (onDataChange?: () => void): ColumnDef<Branch>[] => [
  {
    accessorKey: "name",
    header: "Nama Cabang",
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "address",
    header: "Alamat",
    cell: ({ row }) => {
      const address = row.getValue("address") as string;
      return (
        <div className="text-sm max-w-[200px] md:max-w-none">
          <div className="truncate" title={address}>
            {address}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Nomor Telepon",
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue("phoneNumber")}</div>;
    },
  },
  {
    id: "action",
    header: "Aksi",
    cell: ({ row }) => {
      return (
        <BranchActionCell branch={row.original} onDataChange={onDataChange} />
      );
    },
  },
];
