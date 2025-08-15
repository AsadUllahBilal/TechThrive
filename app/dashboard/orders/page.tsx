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
export type AdminOrder = {
  _id: string;
  userId: { email: string };
  totalPrice: number;
  shippingStatus: string;
  orderItems: { name: string; quantity: number; price: number }[];
  createdAt: string;
  shippingAddress: { fullName: string; }
};

// ✅ Columns for DataTable
export const columns: ColumnDef<AdminOrder>[] = [
  {
    accessorKey: "_id",
    header: "Order ID",
    cell: ({ row }) => {
      const orderId = row.original._id;
      return (
        <Link
          href={`/dashboard/orders/${orderId}`}
          className="text-blue-600 hover:underline"
        >
          {orderId}
        </Link>
      );
    },
  },
  {
    accessorKey: "shippingAddress.fullName",
    header: "Shipping Name",
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
    accessorKey: "shippingStatus",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue("shippingStatus") === "Delivered"
            ? "success"
            : row.getValue("status") === "Pending"
            ? "secondary"
            : "default"
        }
      >
        {row.getValue("shippingStatus")}
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
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
];

// ✅ Page Component
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/admin/order");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const globalFilterFn = (row, columnId, filterValue) => {
    const order = row.original;
    const matchesCustomer = order.shippingAddress.fullName
      ?.toLowerCase()
      .includes(filterValue.toLowerCase());
    const matchesProduct = order.orderItems?.some((item) =>
      item.name.toLowerCase().includes(filterValue.toLowerCase())
    );
    return matchesCustomer || matchesProduct;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          globalFilterFn={globalFilterFn} // your function matching customer or product
        />
      )}
    </div>
  );
}
