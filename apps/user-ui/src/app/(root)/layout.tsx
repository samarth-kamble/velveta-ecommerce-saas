import React from "react";
import Header from "../../components/Header";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default RootLayout;
