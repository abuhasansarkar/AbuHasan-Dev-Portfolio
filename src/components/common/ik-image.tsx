"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { getImageKitUrl, getImageKitBlurUrl, isImageKitUrl, type ImageKitTransformOptions } from "@/lib/imagekit/url";

export interface IKImageCustomProps extends Omit<ImageProps, "src"> {
  src: string;
  transforms?: ImageKitTransformOptions;
  useLqip?: boolean;
}

/**
 * Enhanced Image component with built-in ImageKit optimization,
 * automatic LQIP blur placeholders, and graceful fallback.
 */
export function IKImage({
  src,
  alt,
  transforms,
  useLqip = false,
  className,
  onError,
  ...props
}: IKImageCustomProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex size-full items-center justify-center bg-secondary text-xs text-muted-foreground ${className ?? ""}`}
        aria-label={alt || "Image preview unavailable"}
      >
        <span>Image unavailable</span>
      </div>
    );
  }

  const isIK = isImageKitUrl(src);
  const optimizedSrc = isIK && transforms ? getImageKitUrl(src, transforms) : src;
  const blurUrl = isIK && useLqip ? getImageKitBlurUrl(src) : undefined;

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      className={className}
      blurDataURL={blurUrl}
      placeholder={blurUrl ? "blur" : props.placeholder}
      onError={(e) => {
        setHasError(true);
        onError?.(e);
      }}
      {...props}
    />
  );
}
