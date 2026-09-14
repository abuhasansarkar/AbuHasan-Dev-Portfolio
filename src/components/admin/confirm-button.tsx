"use client";

import { Button, type ButtonProps } from "@/components/ui/button";

/** Submit button that asks for confirmation first. Use inside a <form action={serverAction}>. */
export function ConfirmButton({ confirmText = "Are you sure? This cannot be undone.", children, ...props }: ButtonProps & { confirmText?: string }) {
  return (
    <Button
      type="submit"
      {...props}
      onClick={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      {children}
    </Button>
  );
}
