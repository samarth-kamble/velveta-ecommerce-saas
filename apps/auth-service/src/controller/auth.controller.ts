import { NextFunction, Request, Response } from "express";
import {
  checkOtpRestriction,
  handleForgotPassword,
  sendOtp,
  trackOtpRequest,
  validateRegistrationData,
  verifyForgotPasswordOtp,
  verifyOtp,
} from "../utils/auth.helper";
import prisma from "@packages/libs/prisma";
import { AuthError, ValidationError } from "@packages/error-handler/AppError";
import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { setCookie } from "../utils/cookie";
import stripe from "../utils/stripe";

// Register a new user
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "user");
    const { name, email } = req.body;

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new ValidationError("User already exists with this email"));
    }

    await checkOtpRestriction(email, next);

    await trackOtpRequest(email, next);
    await sendOtp(name, email, "user-activation-mail");

    res.status(200).json({
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    return next(error);
  }
};

// Verify user with OTP
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, password, name } = req.body;

    if (!email || !otp || !password || !name) {
      return next(new ValidationError("Please provide all required fields"));
    }

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new ValidationError("User already exists with this email"));
    }

    await verifyOtp(email, otp, next);

    const hashedPassword = bcrypt.hashSync(password, 10);

    await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return next(error);
  }
};

// Login User
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError("Email and Password are required!"));
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return next(new AuthError("User not found with this email"));
    }

    // verfiy password
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return next(new AuthError("Invalid email and password"));
    }

    // clear all cookies of seller
    res.clearCookie("seller_access_token");
    res.clearCookie("seller_refresh_token");

    // Generate JWT token
    const accessToken = jwt.sign(
      { id: user.id, role: "user" },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: "user" },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    // Store refresh token in HTTPOnly cookie
    setCookie(res, "refresh_token", refreshToken);
    setCookie(res, "access_token", accessToken);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Refresh token
export const refreshToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken =
      req.cookies["refresh_token"] ||
      req.cookies["seller_refresh_token"] ||
      req.headers.authorization?.split(" ")[1];

    if (!refreshToken) {
      return new ValidationError("Unauthorized! Refresh token not found");
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { id: string; role: string };

    if (!decoded || !decoded.id || !decoded.role) {
      return new JsonWebTokenError("Invalid refresh token");
    }

    let account;

    if (decoded.role === "user") {
      account = await prisma.users.findUnique({
        where: { id: decoded.id },
      });
    } else if (decoded.role === "seller") {
      account = await prisma.sellers.findUnique({
        where: { id: decoded.id },
        include: {
          shop: true,
        },
      });
    }

    if (!account) {
      return new AuthError("User not found");
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15m",
      }
    );

    if (decoded.role === "user") {
      setCookie(res, "access_token", newAccessToken);
    } else if (decoded.role === "seller") {
      setCookie(res, "seller_access_token", newAccessToken);
    }

    req.role = decoded.role;

    return res.status(201).json({
      success: true,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    return next(error);
  }
};

// get logged in user
export const getUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// User Forgot Password
export const userForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await handleForgotPassword(req, res, next, "user");
};

// User Verify OTP for password
export const verifyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await verifyForgotPasswordOtp(req, res, next);
};

// User Reset Password
export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return next(new ValidationError("Email and New Password are required!"));
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return next(new AuthError("User not found with this email"));
    }

    // Campapre new password with old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password!);

    if (isSamePassword) {
      return next(
        new ValidationError("New password cannot be same as old password")
      );
    }

    // Hash new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Update user password
    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Seller Registration
export const registerSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "seller");
    const { name, email } = req.body;

    const existingSeller = await prisma.sellers.findUnique({
      where: { email },
    });

    if (existingSeller) {
      return next(new ValidationError("Seller already exists with this email"));
    }

    await checkOtpRestriction(email, next);

    await trackOtpRequest(email, next);
    await sendOtp(name, email, "seller-activation-mail");

    res.status(200).json({
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    next(error);
  }
};

// Verify Seller OTP
export const verifySeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, password, name, phone_number, country } = req.body;

    if (!email || !otp || !password || !name || !phone_number || !country) {
      return next(new ValidationError("Please provide all required fields"));
    }

    const existingSeller = await prisma.sellers.findUnique({
      where: { email },
    });

    if (existingSeller) {
      return next(new ValidationError("Seller already exists with this email"));
    }

    await verifyOtp(email, otp, next);

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await prisma.sellers.create({
      data: {
        name,
        email,
        password: hashedPassword,
        country,
        phone_number,
      },
    });

    res.status(201).json({
      seller,
      message: "Seller Account created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Create Seller Shop
export const createShop = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, bio, address, opening_hours, website, category, sellerId } =
      req.body;

    if (
      !name ||
      !bio ||
      !address ||
      !opening_hours ||
      !website ||
      !category ||
      !sellerId
    ) {
      return next(new ValidationError("Please provide all required fields"));
    }

    const shopData: any = {
      name,
      bio,
      address,
      opening_hours,
      category,
      sellerId,
    };

    if (website && website.trim() === "") {
      shopData.website = website;
    }

    const shop = await prisma.shops.create({
      data: shopData,
    });

    res.status(201).json({
      success: true,
      message: "Shop created successfully",
      shop,
    });
  } catch (error) {
    next(error);
  }
};

// Create stripe account for seller
export const createStripeConnectLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sellerId } = req.body;

    if (!sellerId) {
      return next(new ValidationError("Seller ID is required"));
    }

    const seller = await prisma.sellers.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      return next(new AuthError("Seller is not available with this id"));
    }

    const account = await stripe.accounts.create({
      type: "express",
      email: seller.email,
      country: "GB",
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: { requested: true },
      },
    });

    await prisma.sellers.update({
      where: { id: sellerId },
      data: {
        stripeId: account.id,
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      type: "account_onboarding",
      refresh_url: `http://localhost:3000/success`,
      return_url: `http://localhost:3000/success`,
    });

    res.status(201).json({
      url: accountLink.url,
    });
  } catch (error) {
    console.error("General Error:", error);
    return next(error);
  }
};

// Login Seller
export const loginSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError("Email and Password are required"));
    }

    const seller = await prisma.sellers.findUnique({
      where: { email },
    });

    if (!seller) {
      return next(new AuthError("Seller not found"));
    }

    const isMatch = await bcrypt.compare(password, seller.password!);

    if (!isMatch) {
      return next(new AuthError("Invalid email and password"));
    }

    // clear all cookies
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    const accessToken = jwt.sign(
      { id: seller.id, role: "seller" },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      { id: seller.id, role: "seller" },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    setCookie(res, "seller_access_token", accessToken);
    setCookie(res, "seller_refresh_token", refreshToken);

    res.status(200).json({
      success: true,
      message: "Seller logged in successfully",
      seller,
    });
  } catch (error) {
    next(error);
  }
};

// Get seller details
export const getSeller = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const seller = req.seller;
    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    next(error);
  }
};
