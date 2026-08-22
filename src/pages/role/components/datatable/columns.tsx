"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type Role } from "@/lib/api";
import { ActionCell } from "./action-cell";
import { Badge } from "@/components/ui/badge";

export const createColumns = (onDataChange?: () => void): ColumnDef<Role>[] => [
  {
    accessorKey: "name",
    header: "Nama Role",
    cell: ({ row }) => {
      return <div className="text-sm font-medium">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "key",
    header: "Key",
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue("key")}</div>;
    },
  },
  {
    id: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      const permissions = row.original.permissions;
      return (
        <div className="flex flex-wrap gap-1">
          {permissions.slice(0, 3).map((p) => (
            <Badge key={p.id} variant="secondary">
              {p.name}
            </Badge>
          ))}
          {permissions.length > 3 && (
            <Badge variant="outline">+{permissions.length - 3}</Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      return <ActionCell role={row.original} onDataChange={onDataChange} />;
    },
  },
];
