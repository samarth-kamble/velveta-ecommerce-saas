"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Mail,
  Lock,
  Store,
  Tag,
  FileText,
  CreditCard,
  Building,
  Hash,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/constant";

interface FormData {
  name: string;
  email: string;
  password: string;
  shopName: string;
  shopType: string;
  description: string;
  bank: string;
  account: string;
  ifsc: string;
}

const steps = ["Create an Account", "Setup Shop", "Connect Bank"];

export default function SellerRegistrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Become a Seller</h1>
          <p className="mt-2 text-gray-600">
            Complete the steps below to set up your seller account
          </p>
        </div>
        <SellerForm />
      </div>
    </div>
  );
}

const SellerForm = () => {
  const [step, setStep] = useState(1);

  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(true);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userData, setUserData] = useState<FormData | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const signupMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/user-registration`,
        data
      );
      return response.data;
    },
    onSuccess: (_, formData) => {
      setUserData(formData);
      setShowOtpDialog(true);
      setCanResend(false);
      setTimer(60);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userData) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-user`,
        {
          ...userData,
          otp: otp.join(""),
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // after success, close dialog and move to shop step
      setShowOtpDialog(false);
      setStep(2);
    },
  });

  // countdown effect
  useEffect(() => {
    if (!showOtpDialog) return;
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [showOtpDialog, timer]);

  const resendOtp = () => {
    if (userData) {
      signupMutation.mutate(userData);
      setCanResend(false);
      setTimer(60);
    }
  };

  const nextHandler = () => {
    if (step === 1) {
      // trigger signup & OTP
      handleSubmit((data) => signupMutation.mutate(data))();
    } else {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((label, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 
                ${
                  step > index + 1
                    ? "bg-rose-600 border-rose-600 text-white"
                    : step === index + 1
                    ? "border-rose-600 text-rose-600"
                    : "border-gray-300 text-gray-300"
                }
                transition-all duration-300
              `}
            >
              {step > index + 1 ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span
              className={`
                mt-2 text-xs font-medium
                ${step >= index + 1 ? "text-rose-600" : "text-gray-400"}
              `}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <Card className="border-none shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-rose-600 py-4 px-6">
            <h2 className="text-xl font-bold text-white">{steps[step - 1]}</h2>
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {step === 1 && (
              <div className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <User size={18} />
                    </div>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="pl-10 h-12 border-gray-300"
                      {...register("name", { required: true })}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Mail size={18} />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10 h-12 border-gray-300"
                      {...register("email", { required: true })}
                    />
                  </div>
                </div>
                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-gray-700">
                    Mobile Number
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Phone size={18} />
                    </div>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="Enter your mobile number"
                      className="pl-10 h-12 border-gray-300"
                      {...register("phone_number", {
                        required: "Mobile number is required",
                        pattern: {
                          value: /^\+?[1-9]\d{1,14}$/,
                          message:
                            "Enter a valid 10-digit Indian mobile number",
                        },
                        minLength: {
                          value: 10,
                          message: "Phone number must be at least 10 digits",
                        },
                        maxLength: {
                          value: 15,
                          message: "Phone number cannot exceed 15 digits",
                        },
                      })}
                    />
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-gray-700">
                    Country
                  </Label>
                  <div className="relative">
                    <Select
                      onValueChange={(value) => setValue("country", value)}
                    >
                      <SelectTrigger className="w-full h-16 border border-gray-300 pl-3">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 border-gray-300"
                      {...register("password", {
                        required: true,
                        minLength: 8,
                      })}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters long
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="shopName" className="text-gray-700">
                    Shop Name
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Store size={18} />
                    </div>
                    <Input
                      id="shopName"
                      placeholder="Green Roots"
                      className="pl-10 h-12 border-gray-300"
                      {...register("shopName", { required: true })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shopType" className="text-gray-700">
                    Shop Category
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Tag size={18} />
                    </div>
                    <Input
                      id="shopType"
                      placeholder="Vegetables, Dairy, etc."
                      className="pl-10 h-12 border-gray-300"
                      {...register("shopType", { required: true })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700">
                    Shop Description
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <FileText size={18} />
                    </div>
                    <Input
                      id="description"
                      placeholder="Tell us about your shop"
                      className="pl-10 h-12 border-gray-300"
                      {...register("description", { required: true })}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="bank" className="text-gray-700">
                    Bank Name
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Building size={18} />
                    </div>
                    <Input
                      id="bank"
                      placeholder="ICICI Bank"
                      className="pl-10 h-12 border-gray-300"
                      {...register("bank", { required: true })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account" className="text-gray-700">
                    Account Number
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <CreditCard size={18} />
                    </div>
                    <Input
                      id="account"
                      placeholder="1234567890"
                      className="pl-10 h-12 border-gray-300"
                      {...register("account", { required: true })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ifsc" className="text-gray-700">
                    IFSC Code
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <Hash size={18} />
                    </div>
                    <Input
                      id="ifsc"
                      placeholder="ICIC0001234"
                      className="pl-10 h-12 border-gray-300"
                      {...register("ifsc", { required: true })}
                    />
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-sm text-gray-600 flex items-start">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    You'll be redirected to Stripe to securely finish
                    onboarding. Your banking information is encrypted and
                    secure.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>

      {/* Navigation & OTP Dialog */}
      <div className="flex justify-between pt-6">
        {step > 1 ? (
          <Button
            variant="outline"
            onClick={() => step > 1 && setStep(step - 1)}
            className="flex items-center gap-2 border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            <ArrowLeft size={16} /> Back
          </Button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <Button
            onClick={nextHandler}
            disabled={step === 1 && signupMutation.isPending}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700"
          >
            {step === 1
              ? signupMutation.isPending
                ? "Submitting..."
                : "Next"
              : "Next"}{" "}
            <ArrowRight size={16} />
          </Button>
        ) : (
          <Button
            onClick={() => {
              /* redirect to Stripe OAuth */
            }}
            className="bg-rose-600 hover:bg-rose-700"
          >
            Connect with Stripe
          </Button>
        )}
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify OTP</DialogTitle>
            <DialogDescription>
              Enter the 4-digit code sent to your email
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-between space-x-2 my-4">
            {otp.map((digit, idx) => (
              <Input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^[0-9]?$/.test(val)) {
                    const arr = [...otp];
                    arr[idx] = val;
                    setOtp(arr);
                    if (val && idx < otp.length - 1) {
                      inputRefs.current[idx + 1]?.focus();
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !otp[idx] && idx > 0) {
                    inputRefs.current[idx - 1]?.focus();
                  }
                }}
                className="w-12 h-12 text-center text-xl border border-gray-300"
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <Button
              variant="ghost"
              onClick={resendOtp}
              disabled={!canResend}
              className="text-blue-600 hover:underline"
            >
              Resend OTP
            </Button>
            {!canResend && <span className="text-gray-500">{timer}s</span>}
          </div>

          <Button
            className="mt-4 w-full bg-rose-600 hover:bg-rose-700"
            onClick={() => verifyOtpMutation.mutate()}
          >
            Verify & Continue
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
