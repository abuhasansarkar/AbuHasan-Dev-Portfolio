"use client";

import { useActionState, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import { initialActionState, type ActionState } from "@/lib/admin/action-state";
import { ConfirmButton } from "./confirm-button";

type DeleteAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;

/**
 * Form wrapper for destructive server actions. The action returns an ActionState,
 * so failures surface as an error toast instead of a redirect, while successes
 * still redirect (the action itself redirects with ?deleted=1 for the Flash toast).
 */
export function DeleteForm({
  action,
  id,
  ariaLabel,
  confirmText,
  variant = "ghost",
  size = "icon-sm",
  className,
  children,
}: {
  action: DeleteAction;
  id: string;
  ariaLabel: string;
  confirmText?: string;
  variant?: "ghost" | "destructive";
  size?: "icon-sm" | "sm";
  className?: string;
  children: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, initialActionState);

  useEffect(() => {
    if (state.error) toast.error("Delete failed", { description: state.error });
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <ConfirmButton variant={variant} size={size} className={className} aria-label={ariaLabel} confirmText={confirmText} disabled={pending}>
        {children}
      </ConfirmButton>
    </form>
  );
}