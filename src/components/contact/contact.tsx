"use client";

import Image from "next/image";
import { ArrowUpRight, Clock, Video, Mail, Globe2, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Section } from "@/components/layout/section";
import type { SiteSettings } from "@/lib/settings/schema";
import { ContactForm } from "./contact-form";

export function Contact({
  contact,
  social,
  profile,
}: {
  contact: SiteSettings["contact"];
  social: SiteSettings["social"];
  availability?: string;
  profile?: SiteSettings["profile"];
}) {
  const calendlyUrl = "https://calendly.com/abuhasansarkar/appointments";
  const email = social?.email || "abuhasansarkar@gmail.com";
  const name = profile?.name || "Abu Hasan Sarkar";
  const role = profile?.role || "Full-Stack Web Developer & WordPress Specialist";

  return (
    <Section id="contact" aria-labelledby="contact-title" className="relative py-20 sm:py-28 lg:py-36 overflow-hidden border-t border-border/70">
      {/* Decorative Warm Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,hsl(var(--accent)/0.12),transparent_65%)]" aria-hidden />

      {/* Decorative Dot Matrix Patterns */}
      <div className="pointer-events-none absolute -top-10 -left-10 size-72 opacity-15" aria-hidden>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-pattern-1" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="hsl(var(--accent))" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern-1)" />
        </svg>
      </div>
      <div className="pointer-events-none absolute -bottom-10 -right-10 size-80 opacity-15" aria-hidden>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-pattern-2" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="hsl(var(--accent))" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern-2)" />
        </svg>
      </div>

      {/* Floating dots for depth */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <span className="absolute top-[12%] left-[8%] size-1.5 rounded-full bg-accent/30 animate-[dot-float-1_8s_ease-in-out_infinite]" />
        <span className="absolute top-[30%] right-[12%] size-1 rounded-full bg-accent/20 animate-[dot-float-2_9s_ease-in-out_infinite_1s]" />
        <span className="absolute bottom-[18%] left-[20%] size-2 rounded-full bg-accent/15 animate-[dot-float-3_7s_ease-in-out_infinite_2s]" />
      </div>

      <div className="container-x relative z-10">
        <Reveal y={24}>
          {/* Main Card Container */}
          <div className="relative mx-auto w-full max-w-6xl rounded-[32px] sm:rounded-[40px] bg-card/90 text-foreground shadow-[0_30px_90px_-20px_hsl(var(--foreground)/0.12)] p-7 sm:p-10 md:p-12 lg:p-16 border border-border/80 backdrop-blur-xl grain shine-on-hover">
            {/* Header Area */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between pb-10 border-b border-border/60">
              <div>
                <h2 id="contact-title" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                  Let&apos;s Build Something{" "}
                  <span className="block font-serif italic font-normal text-accent sm:inline">
                    Extraordinary
                  </span>
                </h2>
              </div>
              <p className="max-w-md text-sm sm:text-base text-muted-foreground lg:text-right leading-relaxed">
                We help businesses design, develop, and scale high-converting, reliable web solutions.
              </p>
            </div>

            {/* Main 2-Column Content */}
            <div className="grid grid-cols-12 gap-y-12 lg:gap-x-12 pt-10 lg:pt-12">
              {/* Left Column: Profile Card & Direct Booking */}
              <div className="col-span-12 lg:col-span-5 flex flex-col justify-between">
                <div className="flex flex-col gap-6">
                  {/* Photo & Name Row */}
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="relative size-28 sm:size-36 shrink-0 overflow-hidden rounded-2xl shadow-lg border border-border/80 bg-secondary">
                      <Image
                        src="/abuhasan.jpg"
                        alt={name}
                        fill
                        sizes="(max-width: 640px) 112px, 144px"
                        className="object-cover object-top"
                        priority
                      />
                      <span className="absolute bottom-2 right-2 flex size-3 items-center justify-center" title="Available for new projects">
                        <span className="radar-beacon size-2 rounded-full bg-success shadow-[0_0_6px_hsl(var(--success))]" />
                      </span>
                    </div>
                    <div className="flex flex-col pt-1">
                      <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground">
                        {name}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-snug font-medium">
                        {role}
                      </p>
                    </div>
                  </div>

                  {/* Informational Pill Badges with hover animation */}
                  <div className="flex flex-col gap-2.5 max-w-sm">
                    <div className="flex items-center gap-3 rounded-full border border-border/60 bg-secondary/50 px-4 py-2.5 text-xs sm:text-sm font-medium text-foreground/85 transition-all duration-300 hover:border-accent/40 hover:bg-secondary hover:shadow-xs">
                      <Clock className="size-4 text-accent shrink-0" aria-hidden />
                      <span>30m Discovery Call</span>
                    </div>

                    <div className="flex items-center gap-3 rounded-full border border-border/60 bg-secondary/50 px-4 py-2.5 text-xs sm:text-sm font-medium text-foreground/85 transition-all duration-300 hover:border-accent/40 hover:bg-secondary hover:shadow-xs">
                      <Video className="size-4 text-accent shrink-0" aria-hidden />
                      <span>Google Meet / Zoom</span>
                    </div>

                    <div className="flex items-center gap-3 rounded-full border border-border/60 bg-secondary/50 px-4 py-2.5 text-xs sm:text-sm font-medium text-foreground/85 transition-all duration-300 hover:border-accent/40 hover:bg-secondary hover:shadow-xs truncate">
                      <Mail className="size-4 text-muted-foreground shrink-0" aria-hidden />
                      <span className="truncate">{email}</span>
                    </div>

                    {/* WhatsApp Quick Chat */}
                    <a
                      href="https://wa.me/8801700000000?text=Hi%20Abu%20Hasan,%20I'd%20like%20to%20discuss%20a%20website%20project."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/wa flex items-center justify-between rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs sm:text-sm font-medium text-emerald-400 dark:text-emerald-300 transition-all duration-300 hover:border-emerald-500/50 hover:bg-emerald-500/20 hover:shadow-[0_0_16px_hsl(150_80%_40%/0.15)]"
                    >
                      <span className="flex items-center gap-2.5">
                        <MessageCircle className="size-4 text-emerald-400" aria-hidden />
                        <span>Quick Chat on WhatsApp</span>
                      </span>
                      <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/wa:translate-x-0.5 group-hover/wa:-translate-y-0.5" aria-hidden />
                    </a>

                    {/* Timezone overlap info */}
                    <div className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-secondary/30 px-3.5 py-2 text-[11px] sm:text-xs text-muted-foreground">
                      <Globe2 className="size-3.5 text-accent shrink-0" aria-hidden />
                      <span>Dhaka (UTC+6) &middot; Seamless US, UK &amp; EU hours overlap</span>
                    </div>
                  </div>
                </div>

                {/* Direct Booking Link at bottom */}
                <div className="pt-8 text-xs sm:text-sm text-muted-foreground font-medium">
                  Prefer to schedule directly?{" "}
                  <a
                    href={calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-accent hover:text-accent/80 inline-flex items-center gap-1 underline underline-offset-4 transition-colors"
                  >
                    Book A Free Discovery Call
                    <ArrowUpRight className="size-3.5 inline shrink-0" aria-hidden />
                  </a>
                </div>
              </div>

              {/* Right Column: Inquiry Form */}
              <div className="col-span-12 lg:col-span-7">
                <ContactForm contact={contact} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
