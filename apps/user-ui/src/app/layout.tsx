import "./global.css";

import { Poppins, Roboto } from "next/font/google";

export const metadata = {
  title: "Velveta - Welcome to Velveta",
  description:
    "Welcome to Velveta, an ecommerce platform that helps you build and manage your online store with ease.",
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}
