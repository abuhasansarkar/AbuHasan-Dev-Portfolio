import { Reveal } from "@/components/animations/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/layout/section-heading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqItems } from "@/lib/content/faq";

export function Faq() {
  return (
    <Section id="faq" aria-labelledby="faq-title" className="border-t border-border/70">
      <div className="container-x">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <SectionHeading id="faq-title" number="10" eyebrow="FAQ" title="Questions clients ask before we start." highlight={["before"]} titleClassName="lg:text-5xl" description="Something not covered? Ask in the contact form below." />
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <Accordion type="single" collapsible className="flex flex-col gap-3">
              {faqItems.map((item, i) => (
                <Reveal key={item.question} y={20} delay={i * 0.05} start="top 92%">
                  <AccordionItem value={`faq-${i}`} className="rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md px-5 py-2 shadow-xs transition-all duration-300 hover:border-accent/40 hover:bg-card hover:shadow-[0_8px_24px_-6px_hsl(var(--accent)/0.12)]">
                    <AccordionTrigger className="transition-colors duration-200 hover:no-underline py-3">
                      <span className="flex items-center gap-4 text-left font-display font-semibold text-base md:text-lg text-foreground">
                        <span className="font-mono text-xs font-semibold tracking-wider text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                        <span>{item.question}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-9 pb-3 text-sm leading-relaxed text-muted-foreground md:text-base border-t border-border/40 pt-3">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </Reveal>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </Section>
  );
}
