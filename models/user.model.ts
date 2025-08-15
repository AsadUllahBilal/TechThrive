import mongoose from 'mongoose';

interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    profilePicture?: string;
    role: "admin" | "user";
    verified: boolean;
    otp?: string;
    otpExpiry?: Date;
    provider?: string;
}

const UserSchema = new mongoose.Schema<IUser>({
    name: String,
    email: String,
    password: String,
    profilePicture: String,
    role: {type: String,enum: ["admin", "user"], default: "user"},
    verified: {type: Boolean, default: false},
    otp: {type: String, default: ""},
    otpExpiry: {type: Date, default: null},
    provider: {type: String, default: "credentials"},
},{ timestamps: true});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;