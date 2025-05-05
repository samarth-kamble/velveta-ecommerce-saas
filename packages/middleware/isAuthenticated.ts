import prisma from "@packages/libs/prisma";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { decode } from "punycode";

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies.access_token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized! Access token not found",
      });
    }

    // verify Token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
      role: "user" | "seller";
    };

    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized! Invalid access token",
      });
    }

    const account = await prisma.users.findUnique({
      where: { id: decoded.id },
    });

    req.user = account;

    if (!account) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized! Invalid or Expired access token",
    });
  }
};

export default isAuthenticated;
