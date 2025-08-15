"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Product } from "@/types/product";
import { Column, ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Text } from "lucide-react";
import Image from "next/image";
import { CellAction } from "./cell-action";
import { CATEGORY_OPTIONS } from "./options";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "images", // use images, plural
    header: "IMAGE",
    cell: ({ row }) => {
      const imageUrl =
        row.original.images && row.original.images.length > 0
          ? row.original.images[0]
          : "/placeholder.png";

      return (
        <div className="relative aspect-square w-16 h-16">
          <Image
            src={imageUrl}
            alt={row.original.name}
            fill
            className="rounded-lg object-cover"
            unoptimized={true}
          />
        </div>
      );
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Product["name"]>()}</div>,
    meta: {
      label: "Name",
      placeholder: "Search products...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "category",
    accessorKey: "category.name",
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const categoryName = row.original.category?.name || "Uncategorized";
      return (
        <Badge variant="outline" className="capitalize flex items-center gap-1">
          <CheckCircle2 size={14} /> {categoryName}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "categories",
      variant: "multiSelect",
      options: CATEGORY_OPTIONS,
    },
  },
  {
    accessorKey: "price",
    header: "PRICE",
    cell: ({ row }) => <span>${row.original.price?.toFixed(2) || "0.00"}</span>,
  },
  {
    accessorKey: "description",
    header: "DESCRIPTION",
    cell: ({ row }) => (
      <div className="truncate max-w-xs">{row.original.description}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
