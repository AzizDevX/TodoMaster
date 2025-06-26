import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
async function DbConection() {
  try {
    await mongoose.connect(`${process.env.ConnectDb}`).then(() => {
      console.log(`DB Connected :]`);
    });
  } catch (Error) {
    console.log(`Disconnected ${Error}`);
  }
}
export default DbConection;
