import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Fade + slide-up reveal for any container */
export function useGsapReveal(options?: { y?: number; delay?: number; stagger?: number }) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = Array.from(el.children) as HTMLElement[];
    if (!children.length) return;

    gsap.set(children, { opacity: 0, y: options?.y ?? 40 });

    const ctx = gsap.context(() => {
      gsap.to(children, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: options?.stagger ?? 0.12,
        delay: options?.delay ?? 0,
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return ref as React.RefObject<any>;
}

/** Split-text reveal: each word flies up */
export function useSplitTextReveal() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const originalHTML = el.innerHTML;
    const words = el.innerText.split(" ").filter(Boolean);
    el.innerHTML = words
      .map(
        (w) =>
          `<span class="gsap-word-wrap" style="display:inline-block;overflow:hidden;vertical-align:bottom;margin-right:0.25em"><span class="gsap-word" style="display:inline-block;will-change:transform">${w}</span></span>`
      )
      .join("");

    const wordEls = el.querySelectorAll<HTMLElement>(".gsap-word");

    gsap.set(wordEls, { y: "110%", opacity: 0 });

    const ctx = gsap.context(() => {
      gsap.to(wordEls, {
        y: "0%",
        opacity: 1,
        duration: 0.85,
        ease: "power4.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => {
      ctx.revert();
      el.innerHTML = originalHTML;
    };
  }, []);

  return ref as React.RefObject<any>;
}
