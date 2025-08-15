"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type AdminOrder = {
  _id: string;
  userId: { name: string; email: string };
  totalPrice: number;
  status: string;
  orderItems: { name: string; quantity: number; price: number }[];
  createdAt: string;
};

export const columns: ColumnDef<AdminOrder>[] = [
  {
    accessorKey: "_id",
    header: "Order ID",
  },
  {
    accessorKey: "userId.name",
    header: "Customer Name",
  },
  {
    accessorKey: "userId.email",
    header: "Customer Email",
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => `$${row.getValue("totalPrice")}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue("status") === "Delivered"
            ? "success"
            : row.getValue("status") === "Pending"
            ? "secondary"
            : "default"
        }
      >
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    accessorKey: "orderItems",
    header: "Items",
    cell: ({ row }) => (
      <ul className="list-disc list-inside">
        {row.original.orderItems.map((item, idx) => (
          <li key={idx}>
            {item.name} × {item.quantity} (${item.price})
          </li>
        ))}
      </ul>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) =>
      new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
];