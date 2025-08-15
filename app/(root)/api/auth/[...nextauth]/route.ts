import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/user.model";
import bcryptjs from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
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

        // If no user, or not verified, or no password saved
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
          emailVerified: user.verified, // or user.emailVerified if that's your field
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      await connectDB();

      // Check if the user already exists
      let existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        // Create new Google user
        await User.create({
          name: user.name || "",
          email: user.email || "",
          role: "user",
          profilePicture: user.image || "",
          verified: true,
          provider: account?.provider || "google",
        });
      } else {
        // Update existing user if data is missing
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
        token.id = dbUser?._id.toString(); // store MongoDB ObjectId as string
        token.role = dbUser?.role;
        token.profilePicture = dbUser?.profilePicture;
        token.emailVerified = dbUser?.verified;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string; // Always MongoDB _id
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
