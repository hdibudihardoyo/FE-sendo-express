"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { EmployeeBranch } from "@/lib/api";
import { ActionCell } from "./action-cell";

export const columns = (): ColumnDef<EmployeeBranch>[] => [
  {
    accessorKey: "user.fullName",
    header: "Nama Karyawan",
    cell: ({ row }) => {
      return (
        <div className="text-sm font-medium">{row.original.user.fullName}</div>
      );
    },
  },
  {
    accessorKey: "user.email",
    header: "Email",
    cell: ({ row }) => {
      return <div className="text-sm">{row.original.user.email}</div>;
    },
  },
  {
    accessorKey: "user.phoneNumber",
    header: "Nomor Telepon",
    cell: ({ row }) => {
      return <div className="text-sm">{row.original.user.phoneNumber}</div>;
    },
  },
  {
  accessorKey: "user.role",
  header: "Role",
  cell: ({ row }) => {
     const role = row.original.user.role;

    const roleConfig: Record<string, { label: string; className: string }> = {
      "admin-branch": {
        label: "Admin Cabang",
        className: "bg-blue-100 text-blue-700 border border-blue-200",
      },
      courier: {
        label: "Kurir",
        className: "bg-orange-100 text-orange-700 border border-orange-200",
      },
    };

    const config = roleConfig[role] ?? {
      label: role,
      className: "bg-gray-100 text-gray-700 border border-gray-200",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
      >
        {config.label}
      </span>
    );
    },
  },
  {
    accessorKey: "branch.name",
    header: "Cabang",
    cell: ({ row }) => {
      return <div className="text-sm">{row.original.branch.name}</div>;
    },
  },
  {
    accessorKey: "action",
    header: "Aksi",
    cell: ({ row }) => {
      return <ActionCell employee={row.original} />;
    },
  },
];
