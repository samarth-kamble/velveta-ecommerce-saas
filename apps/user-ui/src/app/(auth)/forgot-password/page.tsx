"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Logo from "./../../../../public/logo.png";
import Image from "next/image";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

const ForgotPasswordForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) => {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 1: Request OTP
  const requestOtpMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/forgot-password-user`,
        { email }
      );
      return response.data;
    },
    onSuccess: (_, { email }) => {
      setUserEmail(email);
      setStep("otp");
      setCanResend(false);
      startTimer();
      setOtp(["", "", "", ""]);
      setServerError(null);
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message: string })?.message ||
        "Failed to send OTP. Please try again.";
      setServerError(errorMessage);
    },
  });

  // Step 2: Verify OTP
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-forgot-password-user`,
        {
          email: userEmail,
          otp: otp.join(""),
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setStep("reset");
      setServerError(null);
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message: string })?.message ||
        "Invalid OTP. Please try again.";
      setServerError(errorMessage);
    },
  });

  // Step 3: Reset Password
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/reset-password-user`,
        {
          email: userEmail,
          newPassword: password,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setServerError(null);
      router.push("/login?message=Password reset successfully. Please log in.");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message: string })?.message ||
        "Failed to reset password. Please try again.";
      setServerError(errorMessage);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>();

  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setCanResend(true);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmitEmail = (data: Pick<FormData, "email">) => {
    requestOtpMutation.mutate({ email: data.email });
  };

  const onVerifyOtp = () => {
    if (otp.join("").length === 4) {
      verifyOtpMutation.mutate();
    }
  };

  const onResetPassword = (data: Pick<FormData, "password">) => {
    resetPasswordMutation.mutate({ password: data.password });
  };

  const getStepTitle = () => {
    switch (step) {
      case "email":
        return "Forgot Password";
      case "otp":
        return "Enter Verification Code";
      case "reset":
        return "Reset Password";
      default:
        return "Forgot Password";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case "email":
        return "Enter your email address and we'll send you a verification code.";
      case "otp":
        return `We've sent a 4-digit verification code to ${userEmail}`;
      case "reset":
        return "Choose a new password for your account.";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center mb-12">
            <Image src={Logo} alt="Logo" />
          </div>

          {/* Back to Sign In */}
          <button
            onClick={() => router.push("/login")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Sign In
          </button>

          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getStepTitle()}
            </h1>
            <p className="text-gray-600">{getStepDescription()}</p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Step 1: Email */}
            {step === "email" && (
              <>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-blue-600 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="jonas_kahnwald@gmail.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address",
                      },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSubmit(onSubmitEmail)}
                  disabled={requestOtpMutation.isPending}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {requestOtpMutation.isPending
                    ? "Sending..."
                    : "Send Verification Code"}
                </button>
              </>
            )}

            {/* Step 2: OTP Verification */}
            {step === "otp" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-4">
                    Verification Code
                  </label>
                  <div className="flex gap-3 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-14 h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onVerifyOtp}
                  disabled={
                    verifyOtpMutation.isPending || otp.join("").length !== 4
                  }
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifyOtpMutation.isPending ? "Verifying..." : "Verify Code"}
                </button>

                <div className="text-center text-sm text-gray-600">
                  Didn't receive the code?{" "}
                  {canResend ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (userEmail) {
                          requestOtpMutation.mutate({ email: userEmail });
                        }
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Resend Code
                    </button>
                  ) : (
                    <span className="text-gray-500">Resend in {timer}s</span>
                  )}
                </div>
              </>
            )}

            {/* Step 3: Reset Password */}
            {step === "reset" && (
              <>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-blue-600 mb-1"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={passwordVisible ? "text" : "password"}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      placeholder="*********"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {passwordVisible ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-blue-600 mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={confirmPasswordVisible ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (val) =>
                          val === getValues("password") ||
                          "Passwords do not match",
                      })}
                      placeholder="*********"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {confirmPasswordVisible ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSubmit(onResetPassword)}
                  disabled={resetPasswordMutation.isPending}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetPasswordMutation.isPending
                    ? "Resetting..."
                    : "Reset Password"}
                </button>
              </>
            )}

            {/* Server Error */}
            {serverError && (
              <p className="text-red-500 text-sm text-center">{serverError}</p>
            )}

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Right side - Blue fluid background */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-1/4 right-0 w-72 h-72 bg-cyan-300 rounded-full mix-blend-overlay filter blur-xl opacity-60 animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-300 rounded-full mix-blend-overlay filter blur-xl opacity-50 animate-pulse delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-2xl opacity-40 animate-pulse delay-3000"></div>
        </div>

        {/* Flowing shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-16 w-16 h-16 bg-white/15 rounded-full animate-float delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-white/10 rounded-full animate-float delay-2000"></div>
          <div className="absolute bottom-16 right-20 w-12 h-12 bg-white/25 rounded-full animate-float delay-500"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ForgotPasswordForm;
