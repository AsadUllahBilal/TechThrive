import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { connectDB } from "@/lib/mongo";

export async function POST(req: Request) {
    await connectDB();

    const { email, otp } = await req.json();

    const user = await User.findOne({email: email});

    if (!user || user.verified) {
        return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
    }

    if (user.otp !== otp || user.otpExpiry < new Date()) {
        return NextResponse.json({ error: "Invalid or Expired OTP" }, { status: 400 });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "User verified successfully" }, { status: 200 });
}