"use client";

import { ImageKitProvider as IKProvider } from "@imagekit/next";
import { publicEnv } from "@/lib/public-env";

export interface ImageKitProviderProps {
  children: React.ReactNode;
}

export function ImageKitProvider({ children }: ImageKitProviderProps) {
  return (
    <IKProvider urlEndpoint={publicEnv.imagekit.urlEndpoint}>
      {children}
    </IKProvider>
  );
}
