import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  /** Seconds for one loop */
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
};

/** CSS-driven infinite marquee. Content is duplicated for a seamless loop. Respects reduced motion via global CSS. */
export function Marquee({ children, className, speed = 40, reverse = false, pauseOnHover = true }: MarqueeProps) {
  return (
    <div className={cn("group/marquee relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]", className)}>
      <div
        className={cn("flex w-max shrink-0 items-center animate-marquee", reverse && "[animation-direction:reverse]", pauseOnHover && "group-hover/marquee:[animation-play-state:paused]")}
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
