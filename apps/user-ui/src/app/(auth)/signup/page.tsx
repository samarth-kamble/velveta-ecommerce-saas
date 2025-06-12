import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SignupImage from "@/src/assets/sign-up.jpg";
import { SignUpForm } from "../_components/SignupForm";

const SignupPage = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Velveta Inc.
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image src={SignupImage} alt="Image" className="w-full h-full" />
      </div>
    </div>
  );
};
export default SignupPage;
