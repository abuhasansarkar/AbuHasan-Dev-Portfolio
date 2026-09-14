import { Reveal } from "@/components/animations/reveal";
import { TextReveal } from "@/components/animations/text-reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  number?: string;
  title: string;
  description?: string;
  highlight?: string[];
  muted?: string[];
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  as?: "h2" | "h3";
  id?: string;
};

export function SectionHeading({ eyebrow, number, title, description, highlight, muted, align = "left", className, titleClassName, as = "h2", id }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-5", align === "center" && "items-center text-center", className)}>
      {(eyebrow || number) && (
        <Reveal as="div" className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground" y={12}>
          {number && <span className="font-display text-accent">{number}</span>}
          {number && eyebrow && <span className="h-px w-6 bg-border" aria-hidden />}
          {eyebrow && <span>{eyebrow}</span>}
        </Reveal>
      )}
      <TextReveal
        id={id}
        as={as}
        text={title}
        highlight={highlight}
        muted={muted}
        className={cn("max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-5xl lg:text-6xl", align === "center" && "mx-auto", titleClassName)}
      />
      {description && (
        <Reveal as="p" delay={0.15} className={cn("max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg", align === "center" && "mx-auto")}>
          {description}
        </Reveal>
      )}
    </div>
  );
}
