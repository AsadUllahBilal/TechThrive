"use client";

import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";
import { ToastContainer, Bounce, toast } from "react-toastify";
import { CheckoutDataTable } from "@/components/checkout/data-table";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CartItem } from "@/components/cart/data-table";

const formSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "city is required"),
  postalCode: z.string().min(1, "postalCode is required"),
  phoneNumber: z.string().min(1, "phoneNumber is required"),
});

const page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [realTotal, setRealTotal] = useState(0);

  useEffect(() => {
    const data = sessionStorage.getItem("checkoutItems");
    if (data) {
      setCheckoutItems(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    const data = sessionStorage.getItem("checkoutItems");
    if (data) {
      setCheckoutItems(JSON.parse(data));
    }
  }, []);

  if (!session?.user) {
    return (
      <section className="w-full min-h-full px-20 py-10">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
        <p>
          Please Login or Sign up to To Order Items{" "}
          <Link href="/login">
            <span className="text-red-600">Login</span>
          </Link>
        </p>
      </section>
    );
  }

  const defaultValues = {
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
    paymentMethod: "Cash on Delevery",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to order.");
      return;
    }

    if (!session?.user?.id) {
      alert("Please sign in to place an order.");
      return;
    }

    const orderPayload = {
      userId: session.user.id,
      orderItems: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      shippingAddress: {
        fullName: values.fullName,
        address: values.address,
        city: values.city,
        postalCode: values.postalCode,
        phoneNumber: values.phoneNumber,
      },
      paymentMethod: "Cash on Delivery",
      totalPrice: realTotal,
    };

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) throw new Error("Failed to save Order");

      toast.success("Order Saved Successfully.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      clearCart();
      form.reset();
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Error saving Order");
    }
  }

  return (
    <section className="w-full min-h-full px-10 tablet:px-20 py-10">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <div className="flex-1 space-y-4">
        {checkoutItems.length > 0 ? (
          <>
            <CheckoutDataTable
              data={checkoutItems}
              onTotalChange={(total) => setRealTotal(total)}
            />
          </>
        ) : (
          <p>No items selected for checkout.</p>
        )}

        <Card className="mx-auto w-full">
          <CardHeader>
            <CardTitle className="text-left text-2xl font-bold">
              Order Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* YourName Name */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter Your Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Enter Your Address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* City */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter Your City</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Enter Your City"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Street */}
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter Your PostalCode</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Enter Your Postal Code"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* PhoneNumber */}
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter Your Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Enter Your Phone Number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <p>Total: ${realTotal}</p>
                <Button type="submit">Add Order</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default page;
