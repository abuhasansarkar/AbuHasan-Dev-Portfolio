"use client";

import { Toaster } from "sonner";
import { ThemeProvider } from "./theme-provider";
import { ImageKitProvider } from "./imagekit-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ImageKitProvider>
        {children}
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
