import express, { Router } from "express";
import {
  getUser,
  loginUser,
  refreshToken,
  resetUserPassword,
  userForgotPassword,
  userRegistration,
  verifyUser,
} from "../controller/auth.controller";
import { verifyForgotPasswordOtp } from "../utils/auth.helper";
import isAuthenticated from "@packages/middleware/isAuthenticated";

const router: Router = express.Router();

router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);
router.post("/login-user", loginUser);
router.post("/refresh-token-user", refreshToken);
router.get("/logged-in-user", isAuthenticated, getUser);
router.post("/forgot-password-user", userForgotPassword);
router.post("/reset-password-user", resetUserPassword);
router.post("/verify-forgot-password-user", verifyForgotPasswordOtp);

export default router;
