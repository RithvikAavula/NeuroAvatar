import { useInView } from "@/hooks/useInView";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";

export default function ClosingSection() {
  const { ref, inView } = useInView(0.2);
  const [phase, setPhase] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => setPhase(3), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [inView]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background py-24"
    >
      {/* Aurora orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="aurora-orb absolute"
          style={{
            width: "60vw", height: "60vw",
            top: "10%", left: "20%",
            background: isDark
              ? "radial-gradient(circle, hsl(38 92% 54% / 0.08), transparent 70%)"
              : "radial-gradient(circle, hsl(38 88% 44% / 0.12), transparent 70%)",
            "--aurora-dur": "16s",
          } as React.CSSProperties}
        />
        <div
          className="aurora-orb absolute"
          style={{
            width: "45vw", height: "45vw",
            bottom: "5%", right: "10%",
            background: isDark
              ? "radial-gradient(circle, hsl(258 80% 62% / 0.09), transparent 70%)"
              : "radial-gradient(circle, hsl(258 70% 42% / 0.07), transparent 70%)",
            "--aurora-dur": "20s",
            animationDelay: "-8s",
          } as React.CSSProperties}
        />
        <div
          className="aurora-orb absolute"
          style={{
            width: "35vw", height: "35vw",
            top: "35%", left: "5%",
            background: isDark
              ? "radial-gradient(circle, hsl(210 100% 60% / 0.07), transparent 70%)"
              : "radial-gradient(circle, hsl(210 90% 40% / 0.06), transparent 70%)",
            "--aurora-dur": "24s",
            animationDelay: "-12s",
          } as React.CSSProperties}
        />
      </div>

      {/* Deep radial glow */}
      <div
        className="absolute inset-0 transition-all duration-3000 pointer-events-none"
        style={{
          background: inView
            ? isDark
              ? "radial-gradient(ellipse 65% 65% at 50% 50%, rgba(0, 212, 255, 0.06), transparent)"
              : "radial-gradient(ellipse 65% 65% at 50% 50%, rgba(2, 132, 199, 0.05), transparent)"
            : "transparent",
        }}
      />

      {/* ── Atmospheric Centered Background Logo Watermark (No Waves, Clean & Cinematic) ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <div
          className="relative flex items-center justify-center pointer-events-none select-none"
          style={{
            width: "min(88vw, 680px)",
            height: "min(88vw, 680px)",
            opacity: phase >= 1 ? (isDark ? 0.18 : 0.13) : 0,
            transform: phase >= 1 ? "scale(1)" : "scale(0.92)",
            transition: "opacity 1.8s cubic-bezier(0.16, 1, 0.3, 1), transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Soft ambient atmospheric aura */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: isDark
                ? "radial-gradient(circle, rgba(0, 212, 255, 0.16) 0%, rgba(168, 85, 247, 0.09) 48%, transparent 74%)"
                : "radial-gradient(circle, rgba(2, 132, 199, 0.12) 0%, rgba(217, 119, 6, 0.07) 48%, transparent 74%)",
              filter: "blur(55px)",
              animation: "hero-aura-pulse 5.5s ease-in-out infinite alternate",
            }}
          />

          {/* Faint subtle high-tech telemetry outer orbital ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: "min(86vw, 660px)",
              height: "min(86vw, 660px)",
              border: isDark ? "1px dashed rgba(0, 212, 255, 0.18)" : "1px dashed rgba(2, 132, 199, 0.18)",
              animation: "hero-orbit-spin 60s linear infinite",
            }}
          />

          {/* Faint secondary orbital ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: "min(72vw, 550px)",
              height: "min(72vw, 550px)",
              border: isDark ? "1px solid rgba(168, 85, 247, 0.13)" : "1px solid rgba(147, 51, 234, 0.12)",
              animation: "hero-orbit-spin-reverse 45s linear infinite",
            }}
          />

          {/* Feathered Semi-Opaque Watermark Logo */}
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
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
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6 flex flex-col items-center">

        {/* Subtle Cybernetic Status Beacon */}
        <div
          className={`transition-all duration-1000 mb-8 ${
            phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border transition-all duration-300 shadow-sm"
            style={{
              background: isDark ? "rgba(0, 212, 255, 0.08)" : "rgba(2, 132, 199, 0.08)",
              borderColor: isDark ? "rgba(0, 212, 255, 0.3)" : "rgba(2, 132, 199, 0.28)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
            <span
              className="text-[11px] font-mono tracking-[0.22em] uppercase font-bold"
              style={{ color: isDark ? "#38bdf8" : "#0284c7" }}
            >
              NEUROAVATAR PROTOCOL · ACTIVE
            </span>
          </div>
        </div>

        {/* NEUROAVATAR wordmark */}
        <div
          className={`transition-all duration-1000 ${phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[hsl(var(--neural-cyan))/50]" />
            <div className="w-3 h-3 rounded-full border border-[hsl(var(--neural-cyan))/60] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--neural-cyan))] animate-pulse" />
            </div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[hsl(var(--neural-cyan))/50]" />
          </div>

          <div
            className="font-black leading-none shimmer-text mb-8"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(2.4rem, 7vw, 5.5rem)",
              letterSpacing: "0.08em",
              whiteSpace: "nowrap",
            }}
          >
            NEUROAVATAR
          </div>
        </div>

        {/* Tagline */}
        <div
          className={`transition-all duration-1000 delay-200 ${phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p
            className="text-xl md:text-2xl leading-relaxed mb-10 text-muted-foreground font-normal"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            "Your mind.
            <br />
            Your movement.
            <br />
            Your second body."
          </p>
        </div>

        {/* Final line */}
        <div
          className={`transition-all duration-1000 delay-400 ${phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div
            className="w-full max-w-md mx-auto h-px mb-10"
            style={{ background: "linear-gradient(90deg, transparent, hsl(191 100% 50% / 0.4), transparent)" }}
          />
          <p
            className="font-bold tracking-[0.22em] text-foreground/80 mb-8"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
            }}
          >
            THE BODY IS ONLY THE BEGINNING.
          </p>

          {/* Interactive Return-to-Top Bridge */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border text-xs font-mono uppercase tracking-[0.18em] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)",
              borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
              color: isDark ? "#94a3b8" : "#475569",
            }}
          >
            <span className="text-cyan-400">↑</span>
            <span>Return to Top</span>
          </button>
        </div>

      </div>
    </section>
  );
}
