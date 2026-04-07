"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
      return;
    }
    orig.apply(console, args);
  };
}
import { AuthProvider } from "./AuthProvider";
import { CartProvider } from "./CartProvider";
import { NotificationProvider } from "./NotificationProvider";
import { User } from "@/lib/interface/user.interface";

import { Toaster } from "@/components/ui/sonner";

export function Providers({ 
  children,
  initialUser
}: { 
  children: React.ReactNode;
  initialUser: User | null;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      forcedTheme="light"
    >
      <AuthProvider initialUser={initialUser}>
        <CartProvider>
          <NotificationProvider>
            {children}
            <Toaster position="top-center" richColors />
          </NotificationProvider>
        </CartProvider>

      </AuthProvider>
    </NextThemesProvider>
  );
}
