import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import User from "@/models/user.model";
import { sendVerificationRequest } from "@/lib/mail";
import bcryptjs from "bcryptjs";

export async function POST(req: Request){
    await connectDB();

    const {name, email, password} = await req.json();

    const existingUser = await User.findOne({ email: email });

    if(existingUser) {
        return NextResponse.json({ error: "User Already Exists" }, {status: 400});
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Create a 6-digit OTP
    // Set OTP expiry to 10 minutes from now
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        otp,
        otpExpiry,
        verified: false,
    });
    await sendVerificationRequest({
        identifier: email,
        url: "",
        provider: {
            server: {
                host: "smtp.gmail.com",
                port: 587,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD
                }
            },
            from: `"Tech Thrive" <${process.env.SMTP_FROM}>`
        },
        theme: {
            brandColor: "#346df1",
            buttonText: "#ffffff"
        },
        otp,
    });

    await newUser.save();

    return NextResponse.json({ message: "User registered successfully. Please check your email to verify your account." }, {status: 201});
}