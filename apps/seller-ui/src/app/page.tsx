"use client";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const RootPage = () => {
  useEffect(() => {
    redirect("/dashboard");
  }, []);

  return <div>RootPage</div>;
};

export default RootPage;
