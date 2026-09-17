"use client";

import Image from "next/image";
import { ArrowUpRight, Clock, Video, Mail } from "lucide-react";
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
    <Section id="contact" aria-labelledby="contact-title" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-[#ff4500] via-[#ea3800] to-[#cb2600]">
      {/* Decorative Dot Matrix Patterns matching reference aesthetic */}
      <div className="pointer-events-none absolute -top-10 -left-10 size-72 opacity-25" aria-hidden>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-pattern-1" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern-1)" />
        </svg>
      </div>
      <div className="pointer-events-none absolute -bottom-10 -right-10 size-80 opacity-25" aria-hidden>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-pattern-2" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern-2)" />
        </svg>
      </div>

      {/* Subtle organic gradient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" aria-hidden />

      <div className="container-x relative z-10">
        <Reveal y={24}>
          {/* Main White/Light Card Container */}
          <div className="relative mx-auto w-full max-w-6xl rounded-[28px] sm:rounded-[36px] bg-white text-zinc-900 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35)] p-6 sm:p-10 md:p-12 lg:p-16 border border-white/40 dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800">
            {/* Header Area */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between pb-10 border-b border-zinc-100 dark:border-zinc-800/80">
              <div>
                <h2 id="contact-title" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Let’s Build Something{" "}
                  <span className="block font-serif italic font-normal text-[#ea3800] sm:inline">
                    Extraordinary
                  </span>
                </h2>
              </div>
              <p className="max-w-md text-sm sm:text-base text-zinc-500 dark:text-zinc-400 lg:text-right leading-relaxed">
                We help businesses design, develop, and scale reliable software solutions.
              </p>
            </div>

            {/* Main 2-Column Content */}
            <div className="grid grid-cols-12 gap-y-12 lg:gap-x-12 pt-10 lg:pt-12">
              {/* Left Column: Profile Card & Direct Booking */}
              <div className="col-span-12 lg:col-span-5 flex flex-col justify-between">
                <div className="flex flex-col gap-6">
                  {/* Photo & Name Row */}
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="relative size-28 sm:size-36 shrink-0 overflow-hidden rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                      <Image
                        src="/abuhasan.jpg"
                        alt={name}
                        fill
                        sizes="(max-width: 640px) 112px, 144px"
                        className="object-cover object-top"
                        priority
                      />
                    </div>
                    <div className="flex flex-col pt-1">
                      <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        {name}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-snug">
                        {role}
                      </p>
                    </div>
                  </div>

                  {/* Informational Pill Badges */}
                  <div className="flex flex-col gap-2.5 max-w-sm">
                    <div className="flex items-center gap-3 rounded-full bg-zinc-100 dark:bg-zinc-900 px-4 py-2.5 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors">
                      <Clock className="size-4 text-zinc-800 dark:text-zinc-200 shrink-0" aria-hidden />
                      <span>30m Discovery Call</span>
                    </div>

                    <div className="flex items-center gap-3 rounded-full bg-zinc-100 dark:bg-zinc-900 px-4 py-2.5 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors">
                      <Video className="size-4 text-[#ea3800] shrink-0" aria-hidden />
                      <span>Google Meet / Zoom</span>
                    </div>

                    <div className="flex items-center gap-3 rounded-full bg-zinc-100 dark:bg-zinc-900 px-4 py-2.5 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors truncate">
                      <Mail className="size-4 text-zinc-500 shrink-0" aria-hidden />
                      <span className="truncate">{email}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Booking Link at bottom */}
                <div className="pt-8 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Not Interested to submit the form?{" "}
                  <a
                    href={calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#ea3800] hover:text-[#cb2600] inline-flex items-center gap-1 underline underline-offset-4 transition-colors"
                  >
                    Book A Free Call Directly
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
