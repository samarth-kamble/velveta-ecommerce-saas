import Image from "next/image";
import SignupImage from "@/assets/sign-up.jpg";
import SellerRegistrationPage from "../_components/SignupForm";

const SignupPage = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full">
            <SellerRegistrationPage />
          </div>
        </div>
      </div>

      {/* Right Side - Fixed Image */}
      <div className="relative hidden bg-muted lg:block overflow-hidden">
        <Image
          src={SignupImage}
          alt="Image"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
};

export default SignupPage;
