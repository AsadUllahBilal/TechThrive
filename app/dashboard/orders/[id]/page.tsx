"use client";

import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/admin/order/${id}`);
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <section className="w-full p-6 flex flex-col gap-3">
        <Skeleton className="h-8 w-48" /> 
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-32" />

        <div className="mt-4 space-y-2">
          <Skeleton className="h-6 w-48" /> 
          <Skeleton className="h-4 w-72" />
        </div>

        <div className="mt-4 space-y-2">
          <Skeleton className="h-6 w-48" /> 
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-80" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="mt-4 space-y-2">
          <Skeleton className="h-6 w-48" /> {/* Items title */}
          <Skeleton className="h-4 w-80" />
          <Skeleton className="h-4 w-80" />
          <Skeleton className="h-4 w-80" />
        </div>
      </section>
    );
  }

  if (!order) return <p>Order not found.</p>;

  return (
    <section className="w-full p-6 flex flex-col gap-3">
      <Heading title="Order Details" />
      <p>
        <strong>Order ID:</strong> {order._id}
      </p>
      <p>
        <strong>Status:</strong> {order.shippingStatus}
      </p>
      <p>
        <strong>Total Price:</strong> ${order.totalPrice}
      </p>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Customer Info</h2>
        <p>
          {order.userId.name} ({order.userId.email})
        </p>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Shipping Address</h2>
        <p>
          <strong>Name:</strong> {order.shippingAddress.fullName}
        </p>
        <p>
          <strong>Address:</strong> {order.shippingAddress.address}
        </p>
        <p>
          <strong>City:</strong> {order.shippingAddress.city}
        </p>
        <p>
          <strong>Postal Code:</strong> {order.shippingAddress.postalCode}
        </p>
        <p>
          <strong>Phone Number:</strong> {order.shippingAddress.phoneNumber}
        </p>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Items</h2>
        <ul className="list-disc list-inside">
          {order.orderItems.map((item: any, idx: number) => (
            <li key={idx}>
              {item.name} × {item.quantity} (${item.price})
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
