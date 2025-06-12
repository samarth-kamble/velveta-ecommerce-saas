"use client";

import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

type ForgotPasswordFormProps = React.ComponentPropsWithoutRef<"form">;

type FormFields = {
  email: string;
  password: string;
  confirmPassword: string;
};

export function ForgotPasswordForm({
  className,
  ...props
}: ForgotPasswordFormProps) {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<FormFields>();

  // Step 1: Request OTP
  const requestOtpMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) =>
      axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/forgot-password-user`,
        { email }
      ),
    onSuccess: (_, { email }) => {
      setUserEmail(email);
      setStep("otp");
      setCanResend(false);
      startTimer();
      setOtp(["", "", "", ""]);
    },
    onError: handleError,
  });

  // Step 2: Verify OTP
  const verifyOtpMutation = useMutation({
    mutationFn: async () =>
      axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-forgot-password-user`,
        {
          email: userEmail,
          otp: otp.join(""),
        }
      ),
    onSuccess: () => setStep("reset"),
    onError: handleError,
  });

  // Step 3: Reset Password
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) =>
      axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/reset-password-user`,
        {
          email: userEmail,
          newPassword: password,
        }
      ),
    onSuccess: () => {
      toast.success("Password reset successfully. Please log in.");
      setStep("email");
      reset();
      router.push("/login");
    },
    onError: handleError,
  });

  function handleError(error: AxiosError) {
    const message =
      (error.response?.data as { message: string })?.message ||
      "An unexpected error occurred.";
    setServerError(message);
    toast.error(message);
  }

  function startTimer() {
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
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function onSubmitEmail({ email }: { email: string }) {
    requestOtpMutation.mutate({ email });
  }

  function onVerifyOtp() {
    if (otp.join("").length === 4) {
      verifyOtpMutation.mutate();
    }
  }

  function onResetPassword({ password }: { password: string }) {
    resetPasswordMutation.mutate({ password });
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={
        step === "email"
          ? handleSubmit(onSubmitEmail)
          : step === "reset"
          ? handleSubmit(onResetPassword)
          : (e) => {
              e.preventDefault();
              onVerifyOtp();
            }
      }
      {...props}
    >
      <div className="text-center">
        <h2 className="text-2xl font-semibold">
          {step === "email"
            ? "Forgot Password"
            : step === "otp"
            ? "Enter OTP"
            : "Reset Password"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {step === "email"
            ? "Enter your email to receive an OTP."
            : step === "otp"
            ? `Enter the 4-digit OTP sent to ${userEmail}`
            : "Set a new password for your account."}
        </p>
      </div>

      {serverError && (
        <p className="text-sm text-red-500 text-center">{serverError}</p>
      )}

      {step === "email" && (
        <div className="grid gap-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
            className="h-12 text-base"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
          <Button type="submit" className="w-full">
            Send OTP
          </Button>
        </div>
      )}

      {step === "otp" && (
        <div className="flex flex-col gap-4 items-center">
          <div className="flex gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                type="text"
                maxLength={1}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg"
              />
            ))}
          </div>
          <Button type="submit" className="w-full">
            Verify OTP
          </Button>
          <div className="text-sm text-center">
            Didn’t get the code?{" "}
            {canResend ? (
              <button
                type="button"
                onClick={() => {
                  if (userEmail) {
                    requestOtpMutation.mutate({ email: userEmail });
                  }
                }}
                className="underline underline-offset-4"
              >
                Resend
              </button>
            ) : (
              <span className="text-muted-foreground">Resend in {timer}s</span>
            )}
          </div>
        </div>
      )}

      {step === "reset" && (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="********"
                className="h-12 text-base pr-10"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="********"
              className="h-12 text-base"
              {...register("confirmPassword", {
                required: "Confirm your password",
                validate: (val) =>
                  val === getValues("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </div>
      )}
    </form>
  );
}
