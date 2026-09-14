"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { createCategory } from "@/app/actions/admin/posts";
import { FormError } from "@/components/admin/form-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/admin/action-state";

export function CategoryForm() {
  const [state, action] = useActionState(createCategory, initialActionState);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      toast.success(state.message ?? "Category created");
      ref.current?.reset();
    }
  }, [state]);

  return (
    <form ref={ref} action={action} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input name="name" placeholder="Category name" aria-label="Category name" required className="sm:max-w-xs" />
        <Input name="slug" placeholder="slug (optional)" aria-label="Category slug" className="sm:max-w-[180px]" />
        <SubmitButton variant="outline" pendingLabel="Adding…">
          Add category
        </SubmitButton>
      </div>
      <FormError message={state.error ?? state.fieldErrors?.name ?? state.fieldErrors?.slug} />
    </form>
  );
}
