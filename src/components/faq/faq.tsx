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
            <Accordion type="single" collapsible className="border-t border-border">
              {faqItems.map((item, i) => (
                <Reveal key={item.question} y={20} delay={i * 0.06} start="top 92%">
                  <AccordionItem value={`faq-${i}`}>
                    <AccordionTrigger className="transition-colors duration-200 hover:bg-secondary/40 rounded-lg -mx-2 px-2">
                      <span className="flex gap-5">
                        <span className="font-display text-xs font-medium tracking-[0.2em] text-accent tabular-nums mt-1.5">{String(i + 1).padStart(2, "0")}</span>
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-11">{item.answer}</AccordionContent>
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
