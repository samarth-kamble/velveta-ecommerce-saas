import { AuthError } from "@packages/error-handler/AppError";
import { NextFunction, Response } from "express";

export const isSeller = async (req: any, res: Response, next: NextFunction) => {
  if (req.role !== "seller") {
    return next(
      new AuthError("Unauthorized! Only Sellers can access this route")
    );
  }
  next();
};

export const isUser = async (req: any, res: Response, next: NextFunction) => {
  if (req.role !== "user") {
    return next(
      new AuthError("Unauthorized! Only Users can access this route")
    );
  }
  next();
};
