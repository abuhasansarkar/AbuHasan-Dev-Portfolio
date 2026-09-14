"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Testimonial } from "@prisma/client";
import { saveTestimonial } from "@/app/actions/admin/testimonials";
import { Checkbox, FormError, FormField, FormSection } from "@/components/admin/form-field";
import { ImageInput } from "@/components/admin/image-input";
import { SubmitButton } from "@/components/admin/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { initialActionState } from "@/lib/admin/action-state";

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  const [state, action] = useActionState(saveTestimonial, initialActionState);
  const e = state.fieldErrors ?? {};

  return (
    <form action={action} className="flex flex-col gap-6">
      {testimonial && <input type="hidden" name="id" value={testimonial.id} />}
      <FormSection title="Testimonial" description="Only publish quotes you have permission to use. Keep placeholders flagged as demo.">
        <FormField label="Quote" name="quote" error={e.quote}>
          <Textarea id="quote" name="quote" rows={5} defaultValue={testimonial?.quote} required />
        </FormField>
        <div className="grid gap-5 sm:grid-cols-3">
          <FormField label="Name" name="name" error={e.name}>
            <Input id="name" name="name" defaultValue={testimonial?.name} required />
          </FormField>
          <FormField label="Role" name="role" error={e.role}>
            <Input id="role" name="role" defaultValue={testimonial?.role} required />
          </FormField>
          <FormField label="Company" name="company" error={e.company}>
            <Input id="company" name="company" defaultValue={testimonial?.company} required />
          </FormField>
        </div>
        <FormField label="Avatar" name="avatar" error={e.avatar} hint="Optional. Initials are shown when empty.">
          <ImageInput name="avatar" defaultValue={testimonial?.avatar} />
        </FormField>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Rating" name="rating" error={e.rating}>
            <Select id="rating" name="rating" defaultValue={testimonial?.rating?.toString() ?? ""}>
              <option value="">No rating</option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n > 1 ? "s" : ""}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Sort order" name="sortOrder" error={e.sortOrder}>
            <Input id="sortOrder" name="sortOrder" type="number" min={0} defaultValue={testimonial?.sortOrder ?? 0} />
          </FormField>
        </div>
        <div className="flex flex-wrap gap-6">
          <FormField label="Show on site" name="featured" inline>
            <Checkbox id="featured" name="featured" defaultChecked={testimonial?.featured ?? true} />
          </FormField>
          <FormField label="Demo content" name="isDemo" inline>
            <Checkbox id="isDemo" name="isDemo" defaultChecked={testimonial?.isDemo ?? false} />
          </FormField>
        </div>
      </FormSection>
      <FormError message={state.error} />
      <div className="flex items-center justify-end gap-3">
        <Button asChild variant="ghost">
          <Link href="/admin/testimonials">Cancel</Link>
        </Button>
        <SubmitButton pendingLabel="Saving…">{testimonial ? "Save changes" : "Create testimonial"}</SubmitButton>
      </div>
    </form>
  );
}
