import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
  inline?: boolean;
};

export function FormField({ label, name, error, hint, children, className, inline = false }: FormFieldProps) {
  return (
    <div className={cn("flex gap-2", inline ? "flex-row-reverse items-center justify-end" : "flex-col", className)}>
      <Label htmlFor={name} className={cn(inline && "cursor-pointer")}>
        {label}
      </Label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${name}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Checkbox({ id, name, defaultChecked }: { id: string; name: string; defaultChecked?: boolean }) {
  return <input id={id} name={name} type="checkbox" defaultChecked={defaultChecked} className="size-4 rounded border-input accent-[hsl(var(--accent))]" />;
}

export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="grid gap-6 rounded-2xl border border-border bg-card p-6 md:grid-cols-12 md:p-8">
      <div className="md:col-span-4">
        <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="grid gap-5 md:col-span-8">{children}</div>
    </section>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
      {message}
    </p>
  );
}
