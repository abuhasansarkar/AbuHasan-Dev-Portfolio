"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { saveSettings } from "@/app/actions/admin/settings";
import { FormError, FormField } from "@/components/admin/form-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { initialActionState } from "@/lib/admin/action-state";
import { getPath } from "@/lib/admin/form-data";
import { statsToText, type SettingsSection } from "@/lib/admin/settings-fields";

export function SettingsSectionForm({ section, values }: { section: SettingsSection; values: unknown }) {
  const [state, action] = useActionState(saveSettings, initialActionState);
  const e = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.ok) toast.success(state.message ?? "Saved");
  }, [state]);

  return (
    <form action={action} id={`settings-${section.key}`} className="grid gap-6 rounded-2xl border border-border bg-card p-6 md:grid-cols-12 md:p-8">
      <input type="hidden" name="key" value={section.key} />
      <div className="md:col-span-4">
        <h2 className="font-display text-lg font-semibold tracking-tight">{section.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
      </div>
      <div className="grid gap-5 md:col-span-8">
        {section.fields.map((field) => {
          if (field.type === "stats") {
            const stats = Array.isArray(values) ? (values as Parameters<typeof statsToText>[0]) : [];
            return (
              <FormField key="stats" label={field.label} name="stats" hint={field.hint} error={state.error && Object.keys(e).length ? "Check each line has at least a value and a label." : undefined}>
                <Textarea id="stats" name="stats" rows={6} defaultValue={statsToText(stats)} className="font-mono text-xs" />
              </FormField>
            );
          }
          const raw = getPath(values, field.path);
          const defaultValue = field.type === "lines" && Array.isArray(raw) ? raw.join("\n") : typeof raw === "string" ? raw : "";
          const name = field.path;
          return (
            <FormField key={name} label={field.label} name={name} hint={field.hint} error={e[name]}>
              {field.type === "text" ? <Input id={name} name={name} defaultValue={defaultValue} /> : <Textarea id={name} name={name} rows={field.type === "lines" ? 5 : 3} defaultValue={defaultValue} />}
            </FormField>
          );
        })}
        <FormError message={state.error} />
        <div className="flex justify-end">
          <SubmitButton pendingLabel="Saving…">Save {section.title.toLowerCase()}</SubmitButton>
        </div>
      </div>
    </form>
  );
}
