import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const bodyParts = [
  { label: "HEAD", delay: 0, top: "8%", left: "48%" },
  { label: "TORSO", delay: 800, top: "28%", left: "48%" },
  { label: "L. ARM", delay: 1600, top: "35%", left: "32%" },
  { label: "R. ARM", delay: 2400, top: "35%", left: "65%" },
  { label: "LEGS", delay: 3200, top: "68%", left: "48%" },
];

export default function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeparts, setActiveParts] = useState<number[]>([]);
  const [signalActive, setSignalActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const animIntervalRef = useRef<NodeJS.Timeout>();

  // Mouse parallax
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Neural activation sequence
  useEffect(() => {
    const runSequence = () => {
      setActiveParts([]);
      setSignalActive(true);
      bodyParts.forEach((_, i) => {
        setTimeout(() => {
          setActiveParts((prev) => [...prev, i]);
        }, i * 800 + 200);
      });
      setTimeout(() => {
        setSignalActive(false);
        setTimeout(runSequence, 2000);
      }, bodyParts.length * 800 + 1500);
    };
    const t = setTimeout(runSequence, 1200);
    return () => {
      clearTimeout(t);
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    };
  }, []);

  // GSAP entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Status badge
      if (statusRef.current) {
        tl.fromTo(
          statusRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
        );
      }

      // Hero headline — word by word
      if (headlineRef.current) {
        const lines = headlineRef.current.querySelectorAll<HTMLElement>("span.hero-line");
        tl.fromTo(
          lines,
          { opacity: 0, y: 60, skewY: 4 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.9, ease: "power4.out", stagger: 0.15 },
          "-=0.3"
        );
      }

      // Subheading
      if (subRef.current) {
        tl.fromTo(
          subRef.current,
          { opacity: 0, y: 25 },
          { opacity: 0.7, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        );
      }

      // CTAs
      if (ctaRef.current) {
        const btns = ctaRef.current.querySelectorAll("button");
        tl.fromTo(
          btns,
          { opacity: 0, y: 20, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.5)", stagger: 0.1 },
          "-=0.4"
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // GSAP pinned hero + scroll-out effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Headline scales down and fades as you scroll
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          if (headlineRef.current) {
            gsap.set(headlineRef.current, {
              opacity: 1 - p * 1.8,
              scale: 1 - p * 0.08,
              y: p * -40,
            });
          }
          if (subRef.current) {
            gsap.set(subRef.current, { opacity: 0.7 - p * 1.5 });
          }
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  const scrollToTech = () =>
    document.querySelector("#technology")?.scrollIntoView({ behavior: "smooth" });
  const scrollToVision = () =>
    document.querySelector("#vision")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 80% at 50% 0%, hsl(215 30% 10%), hsl(215 28% 5%))",
      }}
    >
      {/* CSS Robot Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 30% 50% at 50% 60%, hsl(38 90% 52% / 0.04), transparent),
            radial-gradient(ellipse 20% 30% at 50% 35%, hsl(22 78% 46% / 0.05), transparent),
            radial-gradient(ellipse 60% 80% at 50% 100%, hsl(215 30% 8% / 0.8), transparent)
          `,
          transform: `translate(${mousePos.x * -8}px, ${mousePos.y * -5}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />

      {/* Animated robot silhouette */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 4}px)`,
          transition: "transform 0.5s ease-out",
        }}
      >
        <HeroBotSVG />
      </div>

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(215_28%_5%/0.4)] to-[hsl(215_28%_5%)]" />

      {/* Particles */}
      <ParticleField mousePos={mousePos} />

      {/* Neural Grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(38 90% 52% / 0.25) 1px, transparent 1px),
            linear-gradient(90deg, hsl(38 90% 52% / 0.25) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-px opacity-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsl(191 100% 50%), transparent)",
          animation: "scan-line 8s linear infinite",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        {/* Status indicator */}
        <div ref={statusRef} className="flex items-center justify-center gap-3 mb-12" style={{ opacity: 0 }}>
          <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--neural-cyan))] glow-pulse" />
            <span className="tech-label opacity-70">RESEARCH PLATFORM</span>
            <span className="text-[hsl(var(--border))]">·</span>
            <span className="tech-label text-[hsl(var(--neural-cyan))]">
              BRAIN → BODY INTERFACE
            </span>
          </div>
        </div>

        {/* Hero Headline */}
        <h1
          ref={headlineRef}
          className="font-bold leading-none mb-8 text-white"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 7rem)",
            letterSpacing: "-0.03em",
            transform: `translate(${mousePos.x * 3}px, ${mousePos.y * 2}px)`,
            transition: "transform 0.4s ease-out",
          }}
        >
          <span className="hero-line block gradient-text-white" style={{ opacity: 0 }}>YOUR MIND.</span>
          <span className="hero-line block gradient-text-cyan mt-2" style={{ opacity: 0 }}>YOUR MOVEMENT.</span>
          <span className="hero-line block gradient-text-white mt-2" style={{ opacity: 0 }}>YOUR SECOND BODY.</span>
        </h1>

        {/* Subheading */}
        <p
          ref={subRef}
          className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
          style={{ fontFamily: "'Inter', sans-serif", opacity: 0 }}
        >
          NeuroAvatar is building a brain-computer interface that enables humans to control
          humanoid robots through motor intention — transforming robotics from autonomous machines
          into physical extensions of the human body.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={scrollToTech}
            className="group relative px-8 py-4 font-semibold text-sm tracking-widest text-black transition-all duration-300 rounded overflow-hidden"
            data-interactive="true"
            style={{ fontFamily: "'Space Grotesk', sans-serif", opacity: 0, background: "hsl(var(--neural-cyan))", color: "hsl(var(--background))" }}
          >
            <span className="relative z-10">EXPLORE THE TECHNOLOGY</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </button>
          <button
            onClick={scrollToVision}
            className="group px-8 py-4 font-semibold text-sm tracking-widest border border-[hsl(var(--foreground)/0.2)] hover:border-[hsl(var(--foreground)/0.5)] text-foreground transition-all duration-300 rounded"
            data-interactive="true"
            style={{ fontFamily: "'Space Grotesk', sans-serif", opacity: 0 }}
          >
            SEE THE VISION
          </button>
        </div>

        {/* Neural activation visualization */}
        <NeuralActivationViz activeparts={activeparts} signalActive={signalActive} />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="tech-label">SCROLL</span>
        <div className="w-px h-8 relative overflow-hidden bg-white/10">
          <div
            className="absolute top-0 w-full h-4 bg-[hsl(var(--neural-cyan))]"
            style={{ animation: "signal-move 1.5s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}

function ParticleField({ mousePos }: { mousePos: { x: number; y: number } }) {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
    duration: Math.random() * 4 + 3,
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
            background: p.id % 3 === 0 ? 'hsl(38 90% 55%)' : p.id % 3 === 1 ? 'hsl(22 78% 50%)' : 'hsl(38 60% 70%)',
            opacity: 0.15 + Math.random() * 0.25,
            transform: `translate(${mousePos.x * -p.size * 3}px, ${mousePos.y * -p.size * 3}px)`,
            transition: `transform ${0.3 + p.delay * 0.1}s ease-out`,
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
            boxShadow: `0 0 ${p.size * 3}px hsl(38 90% 52% / 0.35)`,
          }}
        />
      ))}
    </div>
  );
}

function HeroBotSVG() {
  return (
    <svg
      viewBox="0 0 200 420"
      className="w-48 md:w-64 opacity-20"
      style={{ filter: "drop-shadow(0 0 24px hsl(38 90% 52% / 0.25))" }}
    >
      {/* Head */}
      <rect
        x="78" y="10" width="44" height="36" rx="6"
        fill="none" stroke="hsl(38 90% 52%)" strokeWidth="1.5"
      />
      <circle cx="92" cy="28" r="4" fill="hsl(38 90% 52%)" opacity="0.85">
        <animate attributeName="opacity" values="0.85;0.3;0.85" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="108" cy="28" r="4" fill="hsl(38 90% 52%)" opacity="0.85">
        <animate attributeName="opacity" values="0.85;0.3;0.85" dur="2s" begin="0.3s" repeatCount="indefinite" />
      </circle>
      {/* Neck */}
      <rect x="92" y="46" width="16" height="12" rx="2" fill="none" stroke="hsl(38 90% 52% / 0.5)" strokeWidth="1" />
      {/* Torso */}
      <rect x="62" y="58" width="76" height="100" rx="6" fill="none" stroke="hsl(22 78% 46%)" strokeWidth="1.5" />
      <rect x="76" y="72" width="48" height="28" rx="3" fill="hsl(38 90% 52% / 0.04)" stroke="hsl(38 90% 52% / 0.35)" strokeWidth="1" />
      {/* Chest lines */}
      <line x1="76" y1="82" x2="124" y2="82" stroke="hsl(38 90% 52% / 0.18)" strokeWidth="0.5" />
      <line x1="76" y1="88" x2="124" y2="88" stroke="hsl(38 90% 52% / 0.18)" strokeWidth="0.5" />
      {/* Left arm */}
      <line x1="62" y1="70" x2="30" y2="130" stroke="hsl(38 90% 52% / 0.65)" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="130" x2="18" y2="175" stroke="hsl(38 90% 52% / 0.45)" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="12" y="175" width="14" height="18" rx="3" fill="none" stroke="hsl(38 90% 52% / 0.45)" strokeWidth="1" />
      {/* Right arm */}
      <line x1="138" y1="70" x2="170" y2="130" stroke="hsl(22 78% 46% / 0.65)" strokeWidth="2" strokeLinecap="round" />
      <line x1="170" y1="130" x2="182" y2="175" stroke="hsl(22 78% 46% / 0.45)" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="174" y="175" width="14" height="18" rx="3" fill="none" stroke="hsl(22 78% 46% / 0.45)" strokeWidth="1" />
      {/* Hip */}
      <rect x="68" y="158" width="64" height="20" rx="4" fill="none" stroke="hsl(22 78% 46% / 0.4)" strokeWidth="1" />
      {/* Left leg */}
      <line x1="88" y1="178" x2="76" y2="280" stroke="hsl(38 90% 52% / 0.55)" strokeWidth="2" strokeLinecap="round" />
      <line x1="76" y1="280" x2="70" y2="360" stroke="hsl(38 90% 52% / 0.35)" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="58" y="355" width="26" height="12" rx="3" fill="none" stroke="hsl(38 90% 52% / 0.35)" strokeWidth="1" />
      {/* Right leg */}
      <line x1="112" y1="178" x2="124" y2="280" stroke="hsl(22 78% 46% / 0.55)" strokeWidth="2" strokeLinecap="round" />
      <line x1="124" y1="280" x2="130" y2="360" stroke="hsl(22 78% 46% / 0.35)" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="116" y="355" width="26" height="12" rx="3" fill="none" stroke="hsl(22 78% 46% / 0.35)" strokeWidth="1" />
      {/* Neural pulses */}
      <circle r="3" fill="hsl(38 90% 55%)" opacity="0.85">
        <animateMotion dur="2s" repeatCount="indefinite" path="M100,0 L100,160" />
        <animate attributeName="opacity" values="0.85;0.1" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle r="2" fill="hsl(22 78% 50%)" opacity="0.7">
        <animateMotion dur="2.4s" begin="0.8s" repeatCount="indefinite" path="M100,0 L62,160" />
        <animate attributeName="opacity" values="0.7;0.1" dur="2.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function NeuralActivationViz({
  activeparts,
  signalActive,
}: {
  activeparts: number[];
  signalActive: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      <div className="tech-label opacity-50">NEURAL ACTIVATION →</div>
      {bodyParts.map((part, i) => (
        <div
          key={part.label}
          className={`px-3 py-1 rounded text-[10px] tracking-widest font-bold transition-all duration-500 border`}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            borderColor: activeparts.includes(i)
              ? 'hsl(var(--neural-cyan) / 0.7)'
              : 'hsl(var(--border) / 0.3)',
            color: activeparts.includes(i)
              ? 'hsl(var(--neural-cyan))'
              : 'hsl(var(--foreground) / 0.2)',
            background: activeparts.includes(i)
              ? 'hsl(var(--neural-cyan) / 0.08)'
              : 'transparent',
          }}
        >
          {part.label}
          {activeparts.includes(i) && (
            <span
              className="ml-1 inline-block w-1 h-1 rounded-full align-middle"
              style={{ background: 'hsl(var(--neural-cyan))', boxShadow: '0 0 4px hsl(var(--neural-cyan))' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
