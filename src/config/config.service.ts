import { resolve } from "node:path";
import { config } from "dotenv";

const NODE_ENV = process.env.NODE_ENV || "development";

config({
  path: resolve(__dirname, `../../.env.${NODE_ENV}`),
});

export const PORT = process.env.PORT || "3000";
export const MONGODB_URI = process.env.MONGODB_URI;
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
export const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;
export const API_SECRET = process.env.API_SECRET;
export const FRONTEND_URL = process.env.FRONTEND_URL;
