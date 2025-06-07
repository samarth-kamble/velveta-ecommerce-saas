import { Toaster } from "sonner";
import Providers from "@/components/providers/Providers";
import "./global.css";

export const metadata = {
  title: "Velvata Seller",
  description:
    "Velvata Seller UI for managing your store and products on Velvata",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Toaster richColors />
          {children}
        </Providers>
      </body>
    </html>
  );
}
