import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(root)/api/auth/[...nextauth]/route";
import { cookies, headers } from "next/headers";

export async function getSessionUser() {
  const session = await getServerSession(authOptions); // works in server components
  if (!session) {
    // Try to manually read from cookies (for API requests from Thunder Client)
    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get("next-auth.session-token")?.value ||
      cookieStore.get("__Secure-next-auth.session-token")?.value;

    if (!sessionToken) {
      throw new Error("Not authenticated");
    }

    const manualSession = await getServerSession({ ...authOptions });
    if (!manualSession?.user) {
      throw new Error("Not authenticated");
    }
    return manualSession.user;
  }

  return session.user;
}

export function requireAdmin(user: any) {
  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }
}
