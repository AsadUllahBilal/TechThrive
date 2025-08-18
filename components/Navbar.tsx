"use client";

import logo from "@/assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { ModeToggle } from "./layout/theme-toggle";
import { Package, ShoppingCart } from "lucide-react";
import { Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full h-[90px] flex items-center justify-between px-2 card:px-10 dark:text-accent-foreground text-[#222] bg-accent dark:bg-[#222] shadow-md">
      <div className="flex items-center justify-center gap-10">
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            width={170}
            height={170}
            className="w-[140px] tablet:w-[170px]"
          />
        </Link>
        <ul className="hidden tablet:flex gap-4 items-center justify-center">
          <li>
            <Link
              href="/"
              className="dark:text-[#fff] text-[#222] hover:text-gray-500 transition-all dark:hover:text-gray-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="dark:text-[#fff] text-[#222] hover:text-gray-500 transition-all dark:hover:text-gray-300"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact-us"
              className="dark:text-[#fff] text-[#222] hover:text-gray-500 transition-all dark:hover:text-gray-300"
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
      {session ? (
        <>
          <div className="hidden tablet:flex items-center justify-center gap-6">
            <Link href="/cart">
              <span>
                <ShoppingCart />
              </span>
            </Link>
            <Link href="/your-orders">
              <span>
                <Package />
              </span>
            </Link>
            <ModeToggle />
            <Link href={`/profile/${session?.user?.id}`}>
              <div className="flex items-center justify-center gap-2">
                {session.user?.image ? (
                  <Image
                    src={session.user?.image}
                    height={50}
                    width={50}
                    alt="ProfilePic"
                    className="w-[40px] h-[40px] rounded-full"
                  />
                ) : (
                  <Image
                    src="https://plus.unsplash.com/premium_photo-1723028769916-a767a6b0f719?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMGljb25zfGVufDB8fDB8fHww"
                    height={50}
                    width={50}
                    alt="ProfilePic"
                    className="w-[40px] h-[40px] rounded-full"
                  />
                )}
                <p>{session?.user?.name}</p>
              </div>
            </Link>
            <Button variant={"navbarBtn"} size={"lg"} onClick={() => signOut()}>
              Logout
            </Button>
          </div>
          <div className="tablet:hidden flex items-center justify-center gap-2">
            <ModeToggle />
            <Button
              variant={"navbarBtn"}
              className="rounded-md outline-none cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </Button>
          </div>
          <div
            className={`fixed top-0 right-0 h-full z-[1000] w-64 bg-[#f3f3f3] dark:bg-[#333] shadow-lg transform p-6 ${
              isOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out tablet:hidden`}
            ref={menuRef}
          >
            <Button
              variant={"navbarBtn"}
              className="rounded-md outline-none cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <X size={28} />
            </Button>
            <ul className="flex flex-col gap-4 items-center justify-center my-6">
              <li>
                <Link
                  href="/"
                  className="dark:text-[#fff] text-[#222] hover:text-gray-500 transition-all dark:hover:text-gray-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="dark:text-[#fff] text-[#222] hover:text-gray-500 transition-all dark:hover:text-gray-300"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="dark:text-[#fff] text-[#222] hover:text-gray-500 transition-all dark:hover:text-gray-300"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
            <hr />
            <div className="flex items-center my-3 gap-3">
              <Link href="/cart">
                <span>
                  <ShoppingCart />
                </span>
              </Link>
              <Link href="/your-orders">
                <span>
                  <Package />
                </span>
              </Link>
            </div>
            <hr />
            <div className="mt-3 w-full flex flex-col gap-2">
              <Link href={`/profile/${session?.user?.id}`}>
                <div className="flex items-center justify-center gap-2">
                  <Image
                    src={
                      session?.user?.image ||
                      "https://plus.unsplash.com/premium_photo-1723028769916-a767a6b0f719?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMGljb25zfGVufDB8fDB8fHww"
                    }
                    height={50}
                    width={50}
                    alt="ProfilePic"
                    className="w-[40px] h-[40px] rounded-full"
                  />
                  <p>{session?.user?.name}</p>
                </div>
              </Link>
              <Button
                variant={"navbarBtn"}
                size={"lg"}
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <User />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link href="/login">
                <DropdownMenuItem className="cursor-pointer">
                  Login
                </DropdownMenuItem>
              </Link>
              <Link href="/signup">
                <DropdownMenuItem className="cursor-pointer">
                  Sign Up
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
          <div className="tablet:hidden flex items-center justify-center gap-2">
            <Button
              variant={"navbarBtn"}
              className="rounded-md outline-none cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </Button>
          </div>
          <div
            className={`fixed top-0 right-0 h-full z-[1000] w-64 bg-[#f3f3f3] dark:bg-[#333] shadow-lg transform p-6 ${
              isOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out tablet:hidden`}
            ref={menuRef}
          >
            <Button
              variant={"navbarBtn"}
              className="rounded-md outline-none cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <X size={28} />
            </Button>
            <ul className="flex flex-col gap-4 items-center justify-center my-6">
              <li>
                <Link
                  href="/"
                  className="dark:text-[#fff] text-[#222] hover:text-gray-500 transition-all dark:hover:text-gray-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="dark:text-[#fff] text-[#222] hover:text-gray-500 transition-all dark:hover:text-gray-300"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="dark:text-[#fff] text-[#222] hover:text-gray-500 transition-all dark:hover:text-gray-300"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
            <hr />
            <div className="flex items-center my-3 gap-3">
              <Link href="/cart">
                <span>
                  <ShoppingCart />
                </span>
              </Link>
              <Link href="/your-orders">
                <span>
                  <Package />
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
