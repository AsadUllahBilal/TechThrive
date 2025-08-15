"use client";

import { DataTable } from "@/components/order/data-table";

export default function YourOrders() {
  return (
    <section className="w-full min-h-full px-20 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      <DataTable/>
    </section>
  );
}
