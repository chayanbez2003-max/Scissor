import mongoose from 'mongoose';

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(` MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries++;
      console.error(`MongoDB connection attempt ${retries}/${maxRetries} failed: ${error.message}`);
      if (retries < maxRetries) {
        console.log(`⏳ Retrying in 5 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  console.error('MongoDB connection failed after maximum retries. Server will stay running but database operations will fail.');
  // DO NOT call process.exit(1) — keeps the server alive so CORS preflight works
};

export default connectDB;
