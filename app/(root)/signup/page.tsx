"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { signIn, useSession } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SignupPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  if (session?.user?.email) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      setLoading(false);

      if (res.ok) router.push("/verify?email=" + form.email);
    } catch (error) {
      console.log(error);
      toast.error("Registeration Failed", {
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
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register with your account</CardTitle>
          <CardDescription>
            Enter your name and email below to Register your account
          </CardDescription>
          <CardAction>
            <Link href="/login">
              <Button
                variant="link"
                className="text-black dark:text-[#ddd] cursor-pointer"
              >
                Login
              </Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter Your Name..."
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="flex flex-col w-full mt-6">
              {loading ? (
                <Button size={"lg"} className="w-full cursor-pointer" disabled>
                  <Loader2Icon className="animate-spin" /> Registering...
                </Button>
              ) : (
                <Button type="submit" className="w-full cursor-pointer">
                  Sign Up
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full cursor-pointer mt-2"
                onClick={() => signIn("google")}
              >
                <FaGoogle /> Sign up with Google
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default SignupPage;
