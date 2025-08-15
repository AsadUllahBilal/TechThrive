// lib/auth.ts
import { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { cookies } from "next/headers";

import User from "@/models/user.model";
import { connectDB } from "@/lib/mongo";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });

        if (!user || !user.verified || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcryptjs.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
          emailVerified: user.verified,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      await connectDB();

      let existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          name: user.name || "",
          email: user.email || "",
          role: "user",
          profilePicture: user.image || "",
          verified: true,
          provider: account?.provider || "google",
        });
      } else {
        let needsUpdate = false;

        if (!existingUser.name && user.name) {
          existingUser.name = user.name;
          needsUpdate = true;
        }
        if (!existingUser.email && user.email) {
          existingUser.email = user.email;
          needsUpdate = true;
        }
        if (!existingUser.profilePicture && user.image) {
          existingUser.profilePicture = user.image;
          needsUpdate = true;
        }
        if (!existingUser.verified) {
          existingUser.verified = true;
          needsUpdate = true;
        }
        if (!existingUser.provider && account?.provider) {
          existingUser.provider = account.provider;
          needsUpdate = true;
        }

        if (needsUpdate) {
          await existingUser.save();
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await User.findOne({ email: user.email });
        token.id = dbUser?._id.toString();
        token.role = dbUser?.role;
        token.profilePicture = dbUser?.profilePicture;
        token.emailVerified = dbUser?.verified;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.profilePicture = token.profilePicture as string;
      session.user.emailVerified = token.emailVerified as boolean;
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getSessionUser() {
  const session = await getServerSession(authOptions);

  if (!session) {
    const cookieStore = cookies();
    const sessionToken =
      cookieStore.get("next-auth.session-token")?.value ||
      cookieStore.get("__Secure-next-auth.session-token")?.value;

    if (!sessionToken) {
      throw new Error("Not authenticated");
    }

    const manualSession = await getServerSession(authOptions);
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