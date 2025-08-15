import Navbar from "@/components/Navbar";
import AuthSessionProvider from "@/components/SessionProvider";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AuthSessionProvider>
      <Navbar />
      {children}
    </AuthSessionProvider>
  );
}
