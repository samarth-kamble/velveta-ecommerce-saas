import crypto from "crypto";
import { ValidationError } from "@packages/error-handler/AppError";
import { NextFunction } from "express";
import redis from "@packages/libs/redis";
import { sendEmail } from "./sendMail";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (
  data: any,
  userType: "user" | "seller"
) => {
  const { name, email, password, phone_number, country } = data;

  if (
    !name ||
    !email ||
    !password ||
    (userType === "seller" && (!phone_number || !country))
  ) {
    throw new ValidationError("Invalid registration data");
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format");
  }
};

export const checkOtpRestriction = async (
  email: string,
  next: NextFunction
) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      new ValidationError(
        "Account locked due to multiple failed attempts! Try after 30 minutes"
      )
    );
  }

  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      new ValidationError(
        "You have already make to many requested an OTP! Try again after 1 hour"
      )
    );
  }

  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(
      new ValidationError(
        "You have already requested an OTP! Try again after 1 minute"
      )
    );
  }
};

export const trackOtpRequest = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_count:${email}`;
  let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");

  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "true", "EX", 3600);
    return next(
      new ValidationError(
        "You have already requested an OTP! Try again after 1 hour"
      )
    );
  }

  await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600); // Track OTP requests
};

export const sendOtp = async (
  name: string,
  email: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString();

  await sendEmail(email, "Verify Your Email", template, { name, otp });

  await redis.set(`otp:${email}`, otp, "EX", 300);

  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
};

export const verifyOtp = async (
  email: string,
  otp: string,
  next: NextFunction
) => {
  const storedOtp = await redis.get(`otp:${email}`);

  if (!storedOtp) {
    throw new ValidationError("OTP expired! Please request a new one");
  }

  const failedAttemptsKey = `otp_attempts:${email}`;
  let failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");

  if (storedOtp !== otp) {
    if (failedAttempts >= 2) {
      await redis.set(`otp_lock:${email}`, "true", "EX", 1800);

      await redis.del(`otp:${email}`, failedAttemptsKey);

      throw new ValidationError(
        "Account locked due to multiple failed attempts! Account locked for  30 minutes"
      );
    }
    await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 300);

    throw new ValidationError(
      `Incorrect OTP! Attempts left: ${2 - failedAttempts}`
    );
  }

  await redis.del(`otp:${email}`, failedAttemptsKey);
};
