"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { Loader2Icon } from "lucide-react";
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

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  if (session?.user?.email) {
    router.push("/");
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);
    if (res?.error) {
      console.error("Login failed:", res.error);
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
    }

    if (res?.ok) {
      toast.success("User Login Successfully", {
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
      setTimeout(() => {
        router.push("/");
      }, 3000);
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
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Link href="/signup">
              <Button
                variant="link"
                className="text-black dark:text-[#ddd] cursor-pointer"
              >
                Sign Up
              </Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
        <div className="flex-col gap-2 w-full mt-6">
          {loading ? (
            <Button size={"lg"} className="w-full cursor-pointer" disabled>
              <Loader2Icon className="animate-spin" /> Logging In...
            </Button>
          ) : (
            <Button type="submit" className="w-full cursor-pointer">
              Login
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full cursor-pointer mt-2"
            onClick={() => signIn("google")}
          >
            <FaGoogle /> Login with Google
          </Button>
        </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default LoginPage;
