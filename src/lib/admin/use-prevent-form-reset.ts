"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ActionState } from "@/lib/admin/action-state";

/**
 * Custom hook to prevent React 19 from automatically clearing/resetting
 * uncontrolled form inputs when a form action finishes with validation errors.
 *
 * React 19 automatically invokes `HTMLFormElement.prototype.reset()` on uncontrolled
 * forms after an action completes. For administrative CRUD forms, this causes typed data
 * to be wiped out whenever validation fails or server errors occur.
 *
 * This hook overrides the form DOM node's `.reset()` method during action execution
 * so user inputs remain intact, while providing an explicit `resetForm` function for cases
 * where the form should intentionally be cleared (such as successful category creation).
 *
 * Additionally, if validation errors are detected, it smoothly scrolls the page to the
 * first invalid field or error message so the user can see what needs fixing.
 */
export function usePreventFormReset<T extends HTMLFormElement = HTMLFormElement>(
  state?: ActionState
) {
  const formRef = useRef<T>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const originalReset = form.reset.bind(form);

    // React 19 calls `form.reset()` with no arguments when completing an action.
    // By ignoring 0-argument calls, we prevent React 19 from clearing user inputs on failure.
    // Explicit manual calls with `force = true` or `form.resetForm()` will still reset.
    form.reset = (force?: boolean) => {
      if (force === true) {
        originalReset();
      }
    };
    (form as unknown as { resetForm?: () => void }).resetForm = originalReset;

    return () => {
      form.reset = originalReset;
      delete (form as unknown as { resetForm?: () => void }).resetForm;
    };
  }, []);

  // When state updates with validation errors, scroll the first error into view
  useEffect(() => {
    if (!state) return;
    const hasFieldErrors = state.fieldErrors && Object.keys(state.fieldErrors).length > 0;
    const hasError = Boolean(state.error);

    if (!hasFieldErrors && !hasError) return;

    const form = formRef.current;
    if (!form) return;

    // Use requestAnimationFrame to ensure the DOM has updated with error messages
    const frameId = requestAnimationFrame(() => {
      const target =
        form.querySelector<HTMLElement>('[aria-invalid="true"]') ||
        form.querySelector<HTMLElement>('[role="alert"]');

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        if ("focus" in target && typeof target.focus === "function") {
          target.focus({ preventScroll: true });
        }
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [state]);

  const resetForm = useCallback(() => {
    const form = formRef.current;
    if (form) {
      const customReset = (form as unknown as { resetForm?: () => void }).resetForm;
      if (typeof customReset === "function") {
        customReset();
      } else {
        HTMLFormElement.prototype.reset.call(form);
      }
    }
  }, []);

  return { formRef, resetForm };
}
