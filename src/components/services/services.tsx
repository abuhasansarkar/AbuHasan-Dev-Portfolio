"use client";

import type { Service } from "@prisma/client";
import { Reveal } from "@/components/animations/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { EmptyState } from "@/components/layout/empty-state";
import { ServiceCard } from "./service-card";

export function Services({ services, error }: { services: Service[]; error?: boolean }) {
  return (
    <Section id="services" aria-labelledby="services-title" className="border-t border-border/70">
      <div className="container-x">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <SectionHeading
              id="services-title"
              number="02"
              eyebrow="What I build"
              title="Everything a website needs to win attention and keep it."
              highlight={["win", "keep"]}
              description="From strategy and design to WordPress, WooCommerce, no-code and custom development, each service is delivered with performance, SEO and conversion in mind."
            />
          </div>
        </div>

        {services.length === 0 ? (
          <EmptyState className="mt-14" title={error ? "Services are temporarily unavailable" : "No services published yet"} description={error ? "The database could not be reached. Please refresh in a moment." : "Add services from the admin dashboard."} />
        ) : (
          <Reveal stagger={0.08} className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-20 xl:grid-cols-3">
            {services.map((service, i) => (
              <div
                key={service.id}
                onPointerMove={(e) => {
                  const target = e.currentTarget.firstElementChild as HTMLElement | null;
                  if (!target) return;
                  const rect = target.getBoundingClientRect();
                  target.style.setProperty("--x", `${e.clientX - rect.left}px`);
                  target.style.setProperty("--y", `${e.clientY - rect.top}px`);
                }}
              >
                <ServiceCard service={service} index={i} />
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </Section>
  );
}
