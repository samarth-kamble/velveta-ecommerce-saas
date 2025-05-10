import Image from "next/image";
import SignupImage from "@/assets/sign-up.jpg";
import SellerRegistrationPage from "../_components/SignupForm";

const SignupPage = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 ">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full ">
            <SellerRegistrationPage />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block overflow-hidden">
        <Image src={SignupImage} alt="Image" className="w-full h-full" />
      </div>
    </div>
  );
};
export default SignupPage;
{
  /* <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Velveta Inc.
          </Link> */
}
