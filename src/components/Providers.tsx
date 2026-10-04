"use client";
import React from "react";
import { GTIProvider } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return <GTIProvider>{children}</GTIProvider>;
}
