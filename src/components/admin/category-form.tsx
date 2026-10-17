"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { createCategory } from "@/app/actions/admin/posts";
import { FormError } from "@/components/admin/form-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/admin/action-state";
import { usePreventFormReset } from "@/lib/admin/use-prevent-form-reset";

export function CategoryForm() {
  const [state, action] = useActionState(createCategory, initialActionState);
  const { formRef } = usePreventFormReset(state, { resetOnSuccess: true });
  const e = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.ok) {
      toast.success(state.message ?? "Category created");
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex w-full flex-col gap-1 sm:max-w-xs">
          <Input
            id="category-name"
            name="name"
            placeholder="Category name"
            aria-label="Category name"
            required
            aria-invalid={Boolean(e.name)}
            aria-describedby={e.name ? "category-name-error" : undefined}
          />
          {e.name && (
            <p id="category-name-error" role="alert" className="text-xs font-medium text-destructive">
              {e.name}
            </p>
          )}
        </div>
        <div className="flex w-full flex-col gap-1 sm:max-w-[180px]">
          <Input
            id="category-slug"
            name="slug"
            placeholder="slug (optional)"
            aria-label="Category slug"
            aria-invalid={Boolean(e.slug)}
            aria-describedby={e.slug ? "category-slug-error" : undefined}
          />
          {e.slug && (
            <p id="category-slug-error" role="alert" className="text-xs font-medium text-destructive">
              {e.slug}
            </p>
          )}
        </div>
        <SubmitButton variant="outline" pendingLabel="Adding…">
          Add category
        </SubmitButton>
      </div>
      <FormError message={state.error} />
    </form>
  );
}
