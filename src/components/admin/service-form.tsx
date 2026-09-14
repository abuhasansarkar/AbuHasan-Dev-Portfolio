"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { Service } from "@prisma/client";
import { saveService } from "@/app/actions/admin/services";
import { Checkbox, FormError, FormField, FormSection } from "@/components/admin/form-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { ServiceIcon, serviceIconNames } from "@/components/services/service-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { initialActionState } from "@/lib/admin/action-state";
import { cn } from "@/lib/utils";

export function ServiceForm({ service }: { service?: Service }) {
  const [state, action] = useActionState(saveService, initialActionState);
  const [icon, setIcon] = useState(service?.icon ?? "code");
  const e = state.fieldErrors ?? {};

  return (
    <form action={action} className="flex flex-col gap-6">
      {service && <input type="hidden" name="id" value={service.id} />}
      <input type="hidden" name="icon" value={icon} />
      <FormSection title="Service" description="Shown as a numbered card. Order controls the number.">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Title" name="title" error={e.title}>
            <Input id="title" name="title" defaultValue={service?.title} required />
          </FormField>
          <FormField label="Slug" name="slug" error={e.slug} hint="Leave empty to generate.">
            <Input id="slug" name="slug" defaultValue={service?.slug} />
          </FormField>
        </div>
        <FormField label="Short description" name="description" error={e.description}>
          <Textarea id="description" name="description" rows={2} defaultValue={service?.description} required />
        </FormField>
        <FormField label="Expanded details" name="details" error={e.details}>
          <Textarea id="details" name="details" rows={4} defaultValue={service?.details} required />
        </FormField>
        <FormField label="Included features" name="features" error={e.features} hint="One per line.">
          <Textarea id="features" name="features" rows={4} defaultValue={service?.features.join("\n")} />
        </FormField>
        <div>
          <p className="mb-2 text-sm font-medium">Icon</p>
          <div role="radiogroup" aria-label="Icon" className="flex flex-wrap gap-2">
            {serviceIconNames.map((name) => (
              <button
                key={name}
                type="button"
                role="radio"
                aria-checked={icon === name}
                aria-label={name}
                onClick={() => setIcon(name)}
                className={cn("flex size-10 items-center justify-center rounded-full border transition-colors", icon === name ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground")}
              >
                <ServiceIcon name={name} className="size-4" />
              </button>
            ))}
          </div>
          {e.icon && <p className="mt-2 text-xs text-destructive">{e.icon}</p>}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Sort order" name="sortOrder" error={e.sortOrder}>
            <Input id="sortOrder" name="sortOrder" type="number" min={0} defaultValue={service?.sortOrder ?? 0} />
          </FormField>
          <FormField label="Active" name="active" inline className="sm:mt-7">
            <Checkbox id="active" name="active" defaultChecked={service?.active ?? true} />
          </FormField>
        </div>
      </FormSection>
      <FormError message={state.error} />
      <div className="flex items-center justify-end gap-3">
        <Button asChild variant="ghost">
          <Link href="/admin/services">Cancel</Link>
        </Button>
        <SubmitButton pendingLabel="Saving…">{service ? "Save changes" : "Create service"}</SubmitButton>
      </div>
    </form>
  );
}
