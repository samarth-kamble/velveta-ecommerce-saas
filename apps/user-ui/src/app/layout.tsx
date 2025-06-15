import Providers from "../components/Providers/Provider";
import "./global.css";

export const metadata = {
  title: "Revolutie - Ecommerce Platform",
  description:
    "Revolutie is a modern ecommerce platform built with Next.js, TypeScript, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
