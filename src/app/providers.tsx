"use client";

import { ReactNode } from "react";
import { UserProvider } from "@/contexts/user-context";
import { LocalizationProvider } from "@/components/core/localization-provider";
import { ThemeProvider } from "@/components/core/theme-provider/theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LocalizationProvider>
      <UserProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </UserProvider>
    </LocalizationProvider>
  );
}
