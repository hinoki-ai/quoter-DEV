"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { QuoteProvider } from "@/hooks/use-current-quote";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function Providers({ children }: { children: ReactNode }) {
  const content = (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );

  if (!convex) {
    return content;
  }

  return (
    <ConvexProvider client={convex}>
      <QuoteProvider>
        {content}
      </QuoteProvider>
    </ConvexProvider>
  );
}
