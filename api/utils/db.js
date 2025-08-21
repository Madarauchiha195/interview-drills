import mongoose from "mongoose";

export async function connectDB(uri) {
  try {
    console.log("🔗 Connecting to MongoDB:", uri);
    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB_NAME,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}
