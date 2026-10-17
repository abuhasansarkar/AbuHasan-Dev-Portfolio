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
export type UsePreventFormResetOptions = {
  /**
   * If true, automatically resets the form inputs when `state?.ok` becomes true.
   * Useful for creation forms like category creation. Defaults to false.
   */
  resetOnSuccess?: boolean;
};

export function usePreventFormReset<T extends HTMLFormElement = HTMLFormElement>(
  state?: ActionState,
  options?: UsePreventFormResetOptions
) {
  const formRef = useRef<T>(null);
  const resetOnSuccess = options?.resetOnSuccess ?? false;

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const originalReset = form.reset.bind(form);

    // React 19 calls `form.reset()` with no arguments when completing an action.
    // By ignoring 0-argument calls from React 19, we prevent it from wiping inputs on failure.
    // Explicit manual calls with `force = true` or `resetForm()` will still reset.
    form.reset = (force?: boolean) => {
      if (force === true) {
        originalReset();
        form.dispatchEvent(new Event("reset", { bubbles: true, cancelable: true }));
      }
    };
    (form as unknown as { resetForm?: () => void }).resetForm = () => {
      originalReset();
      form.dispatchEvent(new Event("reset", { bubbles: true, cancelable: true }));
    };

    return () => {
      form.reset = originalReset;
      delete (form as unknown as { resetForm?: () => void }).resetForm;
    };
  }, []);

  const resetForm = useCallback(() => {
    const form = formRef.current;
    if (form) {
      const customReset = (form as unknown as { resetForm?: () => void }).resetForm;
      if (typeof customReset === "function") {
        customReset();
      } else {
        HTMLFormElement.prototype.reset.call(form);
        form.dispatchEvent(new Event("reset", { bubbles: true, cancelable: true }));
      }
    }
  }, []);

  // When resetOnSuccess is enabled and the action succeeded, reset the form
  useEffect(() => {
    if (resetOnSuccess && state?.ok) {
      resetForm();
    }
  }, [resetOnSuccess, state?.ok, resetForm]);

  // When state updates with validation errors, scroll the first error into view and focus it
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
        const prefersReducedMotion =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "center",
        });

        // Determine the best element to receive focus
        let focusTarget: HTMLElement | null = null;
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement ||
          target instanceof HTMLButtonElement
        ) {
          focusTarget = target;
        } else {
          // If target is a container (e.g. BlockEditor or field wrapper), find its first interactive input
          focusTarget = target.querySelector<HTMLElement>(
            'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (!focusTarget) {
            if (!target.hasAttribute("tabindex")) {
              target.setAttribute("tabindex", "-1");
            }
            focusTarget = target;
          }
        }

        if (focusTarget && typeof focusTarget.focus === "function") {
          focusTarget.focus({ preventScroll: true });
        }
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [state]);

  return { formRef, resetForm };
}
