import { connect } from "mongoose";

import dotenv from "dotenv";

dotenv.config();

const connectMJsDB = async () => {
  try {
    const mongoURI: string = process.env.MONGODB_URL || "";
    await connect(mongoURI);
  } catch (err: any) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};


export default connectMJsDB();

