"use client";

import { useCartStore } from "@/lib/cartStore";
import { DataTable } from "@/components/cart/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast, Bounce } from "react-toastify";

export default function CartPage() {
  const { cart, clearCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!session?.user) {
    return (
      <section className="w-full min-h-full px-20 py-10">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <p>
          Please Login or Sign up to add Items in the Cart{" "}
          <Link href="/login">
            <span className="text-red-600">Login</span>
          </Link>
        </p>
      </section>
    );
  }

  const handleCheckout = () => {
    const selectedItems = cart.filter((item) => selectedIds.includes(item._id));

    if (selectedItems.length === 0) {
      toast.error("Invalid email or Password", {
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
      return;
    }

    sessionStorage.setItem("checkoutItems", JSON.stringify(selectedItems));

    router.push("/checkout");
  };

  return (
    <section className="w-full min-h-full px-2 tablet:px-20 py-10">
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
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <DataTable selectedIds={selectedIds} setSelectedIds={setSelectedIds} />

      {cart.length > 0 && (
        <div className="flex justify-between mt-4">
          <Button
            variant="destructive"
            onClick={clearCart}
            className="cursor-pointer"
          >
            Clear Cart
          </Button>
          <Button variant={"navbarBtn"} onClick={handleCheckout}>
            Checkout
          </Button>
        </div>
      )}
    </section>
  );
}
