import { useEffect, useRef, useCallback } from "react";
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

/** Parallax scroll — element moves at a different rate than scroll */
export function useParallaxScroll(speed = 0.3) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: speed * -100,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, [speed]);

  return ref as React.RefObject<any>;
}

/** Counter animation — animates a number from 0 to target when in view */
export function useCounterAnimation(target: number, duration = 2) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration,
        ease: "power2.out",
        onUpdate: () => { el.textContent = Math.round(obj.val).toString(); },
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, el);
    return () => ctx.revert();
  }, [target, duration]);

  return ref as React.RefObject<any>;
}

/** 3D tilt on mouse move for a card element */
export function useTiltCard() {
  const ref = useRef<HTMLElement | null>(null);

  const attach = useCallback((el: HTMLElement | null) => {
    (ref as React.MutableRefObject<HTMLElement | null>).current = el;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      gsap.to(el, {
        rotateY: x * 12,
        rotateX: -y * 8,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
        transformPerspective: 800,
      });
    };
    const onLeave = () => gsap.to(el, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
  }, []);

  return attach;
}
