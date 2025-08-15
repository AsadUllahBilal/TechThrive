import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI as string;

if(!MONGO_URI) {
    throw new Error("Please define the MONGO_URI environment variable inside .env");
}

export const connectDB = async () => {
    if(mongoose.connections[0].readyState) return;
    try {
        await mongoose.connect(MONGO_URI, {
            dbName: "tech-thrive",
        })
        console.log("✅ MongoDB Connected");
        
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
    }
}