import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@/hooks/useTheme";

gsap.registerPlugin(ScrollTrigger);



export default function HeroSection() {
  const [mousePos, setMousePos]     = useState({ x: 0, y: 0 });
  const [typeText, setTypeText] = useState("");
  const containerRef  = useRef<HTMLDivElement>(null);
  const headlineRef   = useRef<HTMLHeadingElement>(null);
  const subRef        = useRef<HTMLParagraphElement>(null);
  const ctaRef        = useRef<HTMLDivElement>(null);

  const { theme }     = useTheme();
  const isDark        = theme === "dark";

  // Mouse parallax
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Typewriter for subtitle
  useEffect(() => {
    const full = "NeuroAvatar is building a brain-computer interface that enables humans to control humanoid robots through motor intention — transforming robotics into physical extensions of the human body.";
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setTypeText(full.slice(0, i));
        if (i >= full.length) clearInterval(iv);
      }, 18);
      return () => clearInterval(iv);
    }, 2200);
    return () => clearTimeout(t);
  }, []);

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      if (headlineRef.current) {
        const lines = headlineRef.current.querySelectorAll<HTMLElement>("span.hero-line");
        tl.fromTo(lines,
          { opacity: 0, y: 80, skewY: 6, rotateX: 20 },
          { opacity: 1, y: 0, skewY: 0, rotateX: 0, duration: 1, ease: "power4.out", stagger: 0.18 },
          "-=0.4"
        );
      }
      if (ctaRef.current) {
        const btns = ctaRef.current.querySelectorAll("button");
        tl.fromTo(btns,
          { opacity: 0, y: 30, scale: 0.88 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(2)", stagger: 0.12 },
          "-=0.3"
        );
      }

    });
    return () => ctx.revert();
  }, []);

  // Scroll parallax fade
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          if (headlineRef.current) gsap.set(headlineRef.current, { opacity: 1 - p * 1.8, scale: 1 - p * 0.08, y: p * -40 });
          if (subRef.current)     gsap.set(subRef.current,     { opacity: 0.85 - p * 1.5 });

        },
      });
    }, container);
    return () => ctx.revert();
  }, []);

  // Magnetic button effect
  const magneticRef = useCallback((el: HTMLButtonElement | null) => {
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      gsap.to(el, { x: dx * 0.25, y: dy * 0.25, duration: 0.3, ease: "power2.out" });
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
  }, []);

  const scrollToTech   = () => document.querySelector("#technology")?.scrollIntoView({ behavior: "smooth" });
  const scrollToVision = () => document.querySelector("#vision")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: isDark
          ? "radial-gradient(ellipse 120% 80% at 50% 0%, hsl(222 40% 7%), hsl(222 35% 4%))"
          : "radial-gradient(ellipse 100% 100% at 50% 0%, hsl(36 38% 88%), hsl(36 28% 91%))",
      }}
    >
      {/* ── Aurora orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Amber/gold orb — top left */}
        <div
          className="aurora-orb absolute"
          style={{
            width: "60vw", height: "60vw",
            top: "-20%", left: "-15%",
            background: isDark
              ? "radial-gradient(circle, hsl(38 92% 54% / 0.13), transparent 70%)"
              : "radial-gradient(circle, hsl(38 88% 44% / 0.18), transparent 70%)",
            "--aurora-dur": "14s",
            transform: `translate(${mousePos.x * -18}px, ${mousePos.y * -12}px)`,
            transition: "transform 0.6s ease-out",
          } as React.CSSProperties}
        />
        {/* Violet orb — bottom right */}
        <div
          className="aurora-orb absolute"
          style={{
            width: "50vw", height: "50vw",
            bottom: "-15%", right: "-10%",
            background: isDark
              ? "radial-gradient(circle, hsl(258 80% 62% / 0.11), transparent 70%)"
              : "radial-gradient(circle, hsl(258 70% 42% / 0.08), transparent 70%)",
            "--aurora-dur": "18s",
            animationDelay: "-6s",
            transform: `translate(${mousePos.x * 14}px, ${mousePos.y * 10}px)`,
            transition: "transform 0.8s ease-out",
          } as React.CSSProperties}
        />
        {/* Electric blue orb — center right */}
        <div
          className="aurora-orb absolute"
          style={{
            width: "35vw", height: "35vw",
            top: "25%", right: "10%",
            background: isDark
              ? "radial-gradient(circle, hsl(210 100% 60% / 0.07), transparent 70%)"
              : "radial-gradient(circle, hsl(210 90% 40% / 0.06), transparent 70%)",
            "--aurora-dur": "22s",
            animationDelay: "-10s",
            transform: `translate(${mousePos.x * -8}px, ${mousePos.y * 6}px)`,
            transition: "transform 0.5s ease-out",
          } as React.CSSProperties}
        />
        {/* Deep violet orb — top right */}
        <div
          className="aurora-orb absolute"
          style={{
            width: "28vw", height: "28vw",
            top: "-5%", right: "20%",
            background: isDark
              ? "radial-gradient(circle, hsl(280 70% 50% / 0.06), transparent 70%)"
              : "transparent",
            "--aurora-dur": "26s",
            animationDelay: "-14s",
            transform: `translate(${mousePos.x * 10}px, ${mousePos.y * -8}px)`,
            transition: "transform 0.7s ease-out",
          } as React.CSSProperties}
        />
      </div>

      {/* ── Neural grid ── */}
      <div
        className="absolute inset-0 opacity-[0.032]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(258 80% 62% / 0.5) 1px, transparent 1px),
            linear-gradient(90deg, hsl(38 92% 54% / 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          transform: `translate(${mousePos.x * -4}px, ${mousePos.y * -3}px)`,
          transition: "transform 0.4s ease-out",
        }}
      />
      {/* ── Fine dot grid ── */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(210 100% 60%) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          transform: `translate(${mousePos.x * -2}px, ${mousePos.y * -1.5}px)`,
          transition: "transform 0.5s ease-out",
        }}
      />

      {/* ── Animated Cybernetic Logo Display ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 4}px)`,
          transition: "transform 0.5s ease-out",
        }}
      >
        <HeroLogoDisplay isDark={isDark} mousePos={mousePos} />
      </div>

      {/* ── Bottom fade ── */}
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent ${
        isDark ? "to-[hsl(215_28%_4%)]" : "to-[hsl(36_28%_91%)]"
      }`} style={{ top: "50%" }} />

      {/* ── Floating particles ── */}
      <ParticleField mousePos={mousePos} />

      {/* ── Scan line ── */}
      <div
        className="absolute left-0 right-0 h-px opacity-[0.07] pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(38 90% 52%), hsl(22 78% 46%), transparent)",
          animation: "scan-line 10s linear infinite",
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6 pt-12 pb-16">

        {/* Interactive Capability Ticker Pill */}
        <div className="inline-flex items-center justify-center mb-6">
          <div
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border transition-all duration-300 shadow-sm"
            style={{
              background: isDark ? "rgba(0, 212, 255, 0.08)" : "rgba(2, 132, 199, 0.08)",
              borderColor: isDark ? "rgba(0, 212, 255, 0.35)" : "rgba(2, 132, 199, 0.3)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
            <span
              className="text-[11px] font-mono font-bold tracking-[0.22em] uppercase"
              style={{ color: isDark ? "#00d4ff" : "#0284c7" }}
            >
              DIRECT MOTOR TELEMETRY · SUB-16MS REAL-TIME EMBODIMENT
            </span>
          </div>
        </div>

        {/* Interactive Kinetic Headline */}
        <h1
          ref={headlineRef}
          className="font-black leading-none mb-6 select-none"
          style={{
            fontSize: "clamp(2.8rem, 8.5vw, 7.2rem)",
            letterSpacing: "-0.04em",
            perspective: "800px",
            transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 3}px)`,
            transition: "transform 0.4s ease-out",
          }}
        >
          <span className="hero-line block group cursor-default" style={{ opacity: 0, overflow: "hidden" }}>
            <span className="gradient-text-white inline-block transition-all duration-300 group-hover:scale-105 group-hover:tracking-wider">
              YOUR MIND.
            </span>
          </span>
          <span className="hero-line block mt-1 group cursor-default" style={{ opacity: 0, overflow: "hidden" }}>
            <span className="gradient-text-tri inline-block transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_35px_rgba(0,212,255,0.7)]">
              YOUR MOVEMENT.
            </span>
          </span>
          <span className="hero-line block mt-1 group cursor-default" style={{ opacity: 0, overflow: "hidden" }}>
            <span className="gradient-text-white inline-block transition-all duration-300 group-hover:scale-105 group-hover:tracking-wider">
              YOUR SECOND BODY.
            </span>
          </span>
        </h1>

        {/* Typewriter subtitle */}
        <p
          ref={subRef}
          className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8"
          style={{ fontFamily: "'Inter', sans-serif", opacity: 0.9, minHeight: "4.5rem", color: "hsl(var(--foreground))" }}
        >
          {typeText}
          {typeText.length < 180 && (
            <span className="inline-block w-0.5 h-4 ml-0.5 align-middle bg-[hsl(var(--neural-cyan))] blink" />
          )}
        </p>

        {/* Interactive Telemetry Metric Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 max-w-3xl mx-auto">
          <div
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{
              background: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)",
              borderColor: isDark ? "rgba(0, 212, 255, 0.25)" : "rgba(2, 132, 199, 0.25)",
            }}
          >
            <span className="text-cyan-400 text-xs">⚡</span>
            <span className="text-xs font-mono font-bold tracking-wider text-foreground">
              &lt; 16MS LATENCY
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">
              · Sub-Frame Kinematics
            </span>
          </div>

          <div
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{
              background: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)",
              borderColor: isDark ? "rgba(168, 85, 247, 0.25)" : "rgba(147, 51, 234, 0.25)",
            }}
          >
            <span className="text-purple-400 text-xs">🧠</span>
            <span className="text-xs font-mono font-bold tracking-wider text-foreground">
              64CH @ 500HZ
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">
              · Motor Cortex EEG
            </span>
          </div>

          <div
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{
              background: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)",
              borderColor: isDark ? "rgba(52, 211, 153, 0.25)" : "rgba(16, 185, 129, 0.25)",
            }}
          >
            <span className="text-emerald-400 text-xs">🤖</span>
            <span className="text-xs font-mono font-bold tracking-wider text-foreground">
              28-DOF WBC
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">
              · Edge Balance Reflexes
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            ref={magneticRef}
            onClick={scrollToTech}
            className="hero-cta-primary group relative px-9 py-4 font-bold text-sm tracking-widest overflow-hidden rounded-lg transition-all duration-300"
            data-interactive="true"
            style={{
              fontFamily: "'Outfit', sans-serif",
              opacity: 0,
              background: "hsl(var(--neural-cyan))",
              color: isDark ? "hsl(215 28% 5%)" : "#fff",
              boxShadow: isDark
                ? "0 0 20px hsl(var(--neural-cyan) / 0.3), 0 4px 16px hsl(var(--neural-cyan) / 0.15)"
                : "0 0 16px hsl(var(--neural-cyan) / 0.25), 0 4px 12px hsl(var(--neural-cyan) / 0.12)",
              animation: "hero-btn-glow 3s ease-in-out infinite alternate",
            }}
            onMouseEnter={e => gsap.to(e.currentTarget, { boxShadow: "0 0 36px hsl(var(--neural-cyan) / 0.6), 0 8px 32px hsl(var(--neural-cyan) / 0.3)", scale: 1.04, duration: 0.3, ease: "power2.out" })}
            onMouseLeave={e => gsap.to(e.currentTarget, { boxShadow: isDark ? "0 0 20px hsl(var(--neural-cyan) / 0.3), 0 4px 16px hsl(var(--neural-cyan) / 0.15)" : "0 0 16px hsl(var(--neural-cyan) / 0.25), 0 4px 12px hsl(var(--neural-cyan) / 0.12)", scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" })}
          >
            <span className="relative z-10">EXPLORE THE TECHNOLOGY</span>
            {/* White overlay on hover */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            {/* Continuous shimmer sweep */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.3) 50%, transparent 62%)",
                backgroundSize: "250% 100%",
                animation: "hero-btn-shimmer 3.5s ease-in-out infinite",
              }}
            />
            {/* Bottom glow bar */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full pointer-events-none"
              style={{
                width: "60%",
                background: "rgba(255,255,255,0.5)",
                boxShadow: "0 0 10px rgba(255,255,255,0.4)",
                animation: "hero-btn-bar-pulse 2.5s ease-in-out infinite alternate",
              }}
            />
          </button>

          <button
            ref={magneticRef}
            onClick={scrollToVision}
            className="hero-cta-secondary group relative px-9 py-4 font-bold text-sm tracking-widest rounded-lg overflow-hidden transition-all duration-300"
            data-interactive="true"
            style={{
              fontFamily: "'Outfit', sans-serif",
              opacity: 0,
              border: "1.5px solid hsl(var(--foreground) / 0.18)",
              color: "hsl(var(--foreground))",
              background: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)",
              animation: "hero-btn-border-breathe 4s ease-in-out infinite alternate",
            }}
            onMouseEnter={e => {
              gsap.to(e.currentTarget, { borderColor: "hsl(var(--neural-cyan) / 0.7)", scale: 1.04, duration: 0.3, ease: "power2.out" });
            }}
            onMouseLeave={e => {
              gsap.to(e.currentTarget, { borderColor: "hsl(var(--foreground) / 0.18)", scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
            }}
          >
            <span className="relative z-10 group-hover:text-[hsl(var(--neural-cyan))] transition-colors duration-300">SEE THE VISION</span>
            {/* Hover fill */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              style={{ background: "hsl(var(--neural-cyan) / 0.06)" }}
            />
            {/* Subtle floating dot indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 right-4 w-1.5 h-1.5 rounded-full pointer-events-none"
              style={{
                background: isDark ? "hsl(var(--neural-cyan))" : "hsl(var(--neural-cyan))",
                animation: "hero-btn-dot-blink 2s ease-in-out infinite",
              }}
            />
          </button>
        </div>

      </div>

    </section>
  );
}

function ParticleField({ mousePos }: { mousePos: { x: number; y: number } }) {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 5,
    duration: Math.random() * 5 + 4,
    color: i % 5 === 0 ? "hsl(38 92% 55%)"
         : i % 5 === 1 ? "hsl(258 80% 65%)"
         : i % 5 === 2 ? "hsl(210 100% 62%)"
         : i % 5 === 3 ? "hsl(280 70% 60%)"
         : "hsl(38 60% 72%)",
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            opacity: 0.1 + Math.random() * 0.22,
            transform: `translate(${mousePos.x * -p.size * 4}px, ${mousePos.y * -p.size * 4}px)`,
            transition: `transform ${0.3 + p.delay * 0.08}s ease-out`,
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
            boxShadow: `0 0 ${p.size * 5}px ${p.color.replace(")", " / 0.5)")}`,
          }}
        />
      ))}
    </div>
  );
}

function HeroLogoDisplay({ isDark, mousePos }: { isDark: boolean; mousePos: { x: number; y: number } }) {
  return (
    <div
      className="relative flex items-center justify-center pointer-events-none select-none"
      style={{
        width: "min(88vw, 680px)",
        height: "min(88vw, 680px)",
        transform: `perspective(1000px) rotateY(${mousePos.x * 4}deg) rotateX(${-mousePos.y * 3}deg)`,
        transition: "transform 0.5s ease-out",
      }}
    >
      {/* Radiant atmospheric aura glow behind the watermark */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(0, 212, 255, 0.16) 0%, rgba(168, 85, 247, 0.09) 45%, transparent 72%)"
            : "radial-gradient(circle, rgba(2, 132, 199, 0.12) 0%, rgba(217, 119, 6, 0.08) 45%, transparent 72%)",
          filter: "blur(50px)",
          animation: "hero-aura-pulse 6s ease-in-out infinite alternate",
        }}
      />

      {/* Faint subtle outer telemetry orbital ring */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(86vw, 660px)",
          height: "min(86vw, 660px)",
          border: isDark ? "1px dashed rgba(0, 212, 255, 0.18)" : "1px dashed rgba(2, 132, 199, 0.2)",
          animation: "hero-orbit-spin 55s linear infinite",
        }}
      />

      {/* Faint secondary orbital ring */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(74vw, 560px)",
          height: "min(74vw, 560px)",
          border: isDark ? "1px solid rgba(168, 85, 247, 0.14)" : "1px solid rgba(147, 51, 234, 0.14)",
          animation: "hero-orbit-spin-reverse 45s linear infinite",
        }}
      />

      {/* Centered Large Semi-Opaque Background Watermark Logo */}
      <div
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
        style={{
          opacity: isDark ? 0.18 : 0.13,
          transition: "opacity 0.4s ease",
        }}
      >
        <img
          src="/neurologo.png"
          alt=""
          className="w-full h-full object-contain pointer-events-none select-none"
          style={{
            maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 32%, rgba(0,0,0,0.45) 60%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 32%, rgba(0,0,0,0.45) 60%, transparent 78%)",
            filter: isDark ? "contrast(1.1) brightness(1.05)" : "contrast(1.05)",
          }}
        />
      </div>
    </div>
  );
}


