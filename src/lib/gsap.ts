import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once on the client. Import this module instead of "gsap" directly in components.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };

export const EASE = {
  out: "power3.out",
  outExpo: "expo.out",
  inOut: "power3.inOut",
} as const;
