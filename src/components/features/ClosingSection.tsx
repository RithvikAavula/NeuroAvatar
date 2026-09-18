import { useInView } from "@/hooks/useInView";
import { useEffect, useState } from "react";

export default function ClosingSection() {
  const { ref, inView } = useInView(0.3);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setPhase(3), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [inView]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#000' }}
    >
      {/* Deep radial glow */}
      <div
        className="absolute inset-0 transition-all duration-3000"
        style={{
          background: inView
            ? 'radial-gradient(ellipse 60% 60% at 50% 50%, hsl(191 100% 50% / 0.04), transparent)'
            : 'transparent',
        }}
      />

      {/* Particle field - very sparse */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[hsl(var(--neural-cyan))]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '1px',
              height: '1px',
              opacity: Math.random() * 0.3,
              animation: `float-particle ${4 + Math.random() * 4}s ease-in-out ${Math.random() * 4}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
        {/* NEUROAVATAR wordmark */}
        <div
          className={`transition-all duration-1000 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[hsl(var(--neural-cyan))/40]" />
            <div className="w-3 h-3 rounded-full border border-[hsl(var(--neural-cyan))/50] flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[hsl(var(--neural-cyan))] glow-pulse" />
            </div>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[hsl(var(--neural-cyan))/40]" />
          </div>

          <div
            className="font-black leading-none tracking-[0.15em] shimmer-text mb-12"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            }}
          >
            NEUROAVATAR
          </div>
        </div>

        {/* Tagline */}
        <div
          className={`transition-all duration-1000 delay-300 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p
            className="text-xl md:text-2xl opacity-60 leading-relaxed mb-12"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
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
          className={`transition-all duration-1000 delay-600 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="w-full h-px mb-12" style={{ background: 'linear-gradient(90deg, transparent, hsl(191 100% 50% / 0.3), transparent)' }} />
          <p
            className="font-bold tracking-[0.2em] text-white/70"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            }}
          >
            THE BODY IS ONLY THE BEGINNING.
          </p>
        </div>
      </div>
    </section>
  );
}
