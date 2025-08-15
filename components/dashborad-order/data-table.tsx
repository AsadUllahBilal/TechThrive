"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /**
   * Optional custom filter function.
   * Signature: (rowLike, columnId, filterValue) => boolean
   * We'll call it as: globalFilterFn({ original: row }, undefined, query)
   */
  globalFilterFn?: (row: any, columnId: string | undefined, filterValue: string) => boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  globalFilterFn,
}: DataTableProps<TData, TValue>) {
  // sorting state (handled by react-table)
  const [sorting, setSorting] = useState<SortingState>([]);
  // local search query
  const [query, setQuery] = useState("");

  // --- IMPORTANT: we do the filtering *before* giving data to react-table.
  // This makes the filtering predictable (works with nested arrays/objects),
  // and avoids relying on the table's internal globalFilterFn behavior.
  const filteredData = useMemo(() => {
    if (!query || !query.trim()) return data;

    const q = query.toLowerCase().trim();
    // If the user provided a custom filter function, use it:
    if (typeof globalFilterFn === "function") {
      return data.filter((row) => {
        try {
          // call with a fake 'row' object shape that many filter fns expect
          return globalFilterFn({ original: row }, undefined, q);
        } catch {
          return false;
        }
      });
    }

    // Fallback: stringify row and check includes()
    return data.filter((row) => {
      try {
        return JSON.stringify(row).toLowerCase().includes(q);
      } catch {
        return false;
      }
    });
  }, [data, query, globalFilterFn]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // NOTE: We intentionally do NOT use table's globalFilter here since
    // we've pre-filtered `filteredData`. This avoids mismatches with nested data.
  });

  return (
    <div className="w-full">
      {/* Search */}
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Search by customer or product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />
        {/* optional helper / counts */}
        <div className="text-sm text-muted-foreground ml-auto">
          {filteredData.length} / {data.length} item(s)
        </div>
      </div>

      {/* Table wrapper — only this element scrolls horizontally */}
      <div className="rounded-md border min-w-[900px]">
        <div className="min-w-[900px] overflow-x-auto"> {/* <-- keeps scroll inside here */}
          {/* give the inner table a min width so columns can be wider without forcing page width */}
          <div className="min-w-[900px]">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="max-w-[200px] truncate">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
