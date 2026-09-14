"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Item>, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>>(
  ({ className, ...props }, ref) => <AccordionPrimitive.Item ref={ref} className={cn("border-b border-border", className)} {...props} />,
);
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>>(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "group flex flex-1 items-start justify-between gap-6 py-6 text-left text-lg font-medium tracking-tight transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm md:text-xl",
          className,
        )}
        {...props}
      >
        {children}
        <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 group-hover:border-foreground/40 group-data-[state=open]:rotate-45 group-data-[state=open]:border-accent group-data-[state=open]:text-accent">
          <Plus className="size-4" aria-hidden />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  ),
);
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Content>, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>>(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
      ref={ref}
      className="overflow-hidden text-base text-muted-foreground data-[state=closed]:animate-[accordion-up_0.35s_var(--ease-out-expo)] data-[state=open]:animate-[accordion-down_0.4s_var(--ease-out-expo)]"
      {...props}
    >
      <div className={cn("pb-6 pr-14 leading-relaxed", className)}>{children}</div>
    </AccordionPrimitive.Content>
  ),
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
