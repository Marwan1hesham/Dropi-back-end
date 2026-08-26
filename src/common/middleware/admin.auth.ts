import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/global-error-handler";
import jwt from "jsonwebtoken";
import { ADMIN_SECRET_KEY } from "../../config/config.service";

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.token;

  if (!token) {
    throw new AppError("Token not found", 401);
  }

  try {
    jwt.verify(token as string, ADMIN_SECRET_KEY!);

    next();
  } catch (error) {
    throw new AppError(
      error instanceof Error ? error.message : String(error),
      401,
    );
  }
};
