import mongoose from "mongoose";
import { MONGODB_URI } from "../config/config.service";

export const checkConnectionDB = async () => {
  await mongoose
    .connect(MONGODB_URI!)
    .then(() => {
      console.log(`Connected to the DB successfully`);
    })
    .catch((error) => {
      console.log(`Failed to connect to the DB`);
      console.log(error);
    });
};
