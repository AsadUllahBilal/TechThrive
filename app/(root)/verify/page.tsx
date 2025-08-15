"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { Loader2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  if (session?.user?.email) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
      headers: { "Content-Type": "application/json" },
    });

    setLoading(false);

    if (res.ok) {
      setStatus("Verified! Redirecting...");
      setTimeout(() => router.push("/"), 2000);
      toast.success("User Registered Successfully", {
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
    } else {
      const data = await res.json();
      setStatus(data.error || "Verification failed");
      toast.error(data.error || "Verification failed", {
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
    }
  };

  return (
    <section className="w-full min-h-[80vh] flex items-center justify-center">
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
      <Card>
        <CardHeader>
          <CardTitle>Verify your account</CardTitle>
          <CardDescription>
            Enter your otp below to verify your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            // className="w-[500px] rounded-md p-6 bg-[#ddd] text-[#222] dark:text-white dark:bg-[#222] flex flex-col gap-4"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="otp">Enter Your OTP:</Label>
                <InputOTP maxLength={6} onChange={setOtp} className="w-full">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            <div className="w-full mt-6">
              {loading ? (
                <Button disabled size={"lg"} className="mt-2">
                  {" "}
                  <Loader2Icon className="animate-spin" /> Verifying...
                </Button>
              ) : (
                <Button
                  className="w-full text-[17px] mt-2 cursor-pointer"
                  size={"lg"}
                  type="submit"
                >
                  Verify
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
