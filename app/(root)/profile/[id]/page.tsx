import { connectDB } from "@/lib/mongo";
import User from "@/models/user.model";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  await connectDB();
  const user = await User.findById(params.id).lean();

  if (!user) {
    return {
      title: "User Not Found",
      description: "The user you are looking for does not exist.",
    };
  }

  return {
    title: `${user.name}'s Profile`,
    description: `Profile page of ${user.name}`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  await connectDB();
  const user = await User.findById(params.id).lean();
  if (!user) {
    notFound();
  }

  return (
    <section className="w-full px-20 py-10">
      <div className="flex items-center gap-6">
        <img src={user.profilePicture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8-sy0Y-97bsW5BLoIHWPMIUN-AYMvT9wJrQ&s"} alt={user.name} className="w-[160px] h-[160px] rounded-full" />
        <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
        </div>
      </div>
    </section>
  );
}
