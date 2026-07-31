import { resolve } from "node:path";
import { config } from "dotenv";

const NODE_ENV = process.env.NODE_ENV;
config({ path: resolve(__dirname, `../../.env.${NODE_ENV}`) });

export const PORT = process.env.PORT
export const MONGO_URI = process.env.MONGO_URI
