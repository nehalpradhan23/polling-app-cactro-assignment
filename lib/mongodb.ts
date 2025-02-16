import mongoose from "mongoose";

async function connectToDB(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("DB connected...");
  } catch (error) {
    console.error(error);
  }
}

export default connectToDB;
