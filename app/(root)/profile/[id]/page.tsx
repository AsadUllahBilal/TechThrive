import { connectDB } from "@/lib/mongo";
import User from "@/models/user.model";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

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
    <section className="w-full px-2 flex items-center justify-center tablet:px-20 py-10">
      <div className="flex items-center gap-6 flex-wrap">
        <Image src={user.profilePicture || "https://plus.unsplash.com/premium_photo-1723028769916-a767a6b0f719?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMGljb25zfGVufDB8fDB8fHww"} alt={user.name} className="w-[160px] h-[160px] rounded-full" width={160} height={160} />
        <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
        </div>
      </div>
    </section>
  );
}
