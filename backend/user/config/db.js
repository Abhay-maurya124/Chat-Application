import mongoose from "mongoose";
const connectDB = async () => {
  const url = process.env.MONGO_URL;

  if (!url) {
    console.log("URL needed");
  }

  try {
    await mongoose.connect(url, {
      dbName: "chatappmicroservices",
    });
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
 export default connectDB
 