import mongoose from "mongoose";
import { MONGO_URI } from "../config/config.service";

export const checkConnectionDB = async () => {
  await mongoose
    .connect(MONGO_URI!)
    .then(() => {
      console.log("DB Connected successfully");
    })
    .catch(() => {
      console.log(`Failed to connect to the DB`);
    });
};
