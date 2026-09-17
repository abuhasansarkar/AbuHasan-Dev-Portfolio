"use client";

import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import { ThemeProvider } from "./theme-provider";
import { ImageKitProvider } from "./imagekit-provider";
import { SmoothScrollProvider } from "./smooth-scroll-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ImageKitProvider>
        <SmoothScrollProvider>
          {/* Honor prefers-reduced-motion for all framer-motion transform/layout animations */}
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </SmoothScrollProvider>
      </ImageKitProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "!bg-popover !text-popover-foreground !border-border !shadow-xl",
            description: "!text-muted-foreground",
          },
        }}
      />
    </ThemeProvider>
  );
}

