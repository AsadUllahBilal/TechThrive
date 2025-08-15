"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashborad-order/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

// ✅ Types
export type UserAdmin = {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  role: string;
  verified: boolean;
  createdAt: string;
  provider: string;
};

// ✅ Columns for DataTable
export const columns: ColumnDef<UserAdmin>[] = [
  {
    accessorKey: "_id",
    header: "User ID",
    cell: ({ row }) => (
      <span
      >
        {row.original._id}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.profilePicture && (
          <img
            src={row.original.profilePicture}
            alt={row.original.name}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span>{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "provider",
    header: "Provider",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant={row.original.role === "admin" ? "default" : "secondary"}>
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "verified",
    header: "Verified",
    cell: ({ row }) => (
      <Badge variant={row.original.verified ? "success" : "destructive"}>
        {row.original.verified ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString(),
  },
];

// ✅ Page Component
export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // ✅ Search filter by name or email
  const globalFilterFn = (row, _columnId, filterValue) => {
    const user = row.original;
    return (
      user.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.email?.toLowerCase().includes(filterValue.toLowerCase())
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          globalFilterFn={globalFilterFn}
        />
      )}
    </div>
  );
}
