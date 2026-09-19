import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";

const pipeline = [
  { num: "01", label: "BRAIN",                   sublabel: "Motor Cortex Activity",          icon: "🧠", color: "#a78bfa", detail: "10–30 Hz beta suppression",     desc: "The human imagines or intends a movement. The motor cortex generates characteristic neural oscillations — particularly in the mu and beta frequency bands — that encode the intended action." },
  { num: "02", label: "BCI",                     sublabel: "Non-Invasive Neural Capture",     icon: "⚡", color: "#60a5fa", detail: "256 Hz · 64 channels",           desc: "An EEG-based brain-computer interface captures scalp-level neural activity in real time. High-density electrode arrays sample signals across multiple cortical regions simultaneously." },
  { num: "03", label: "SIGNAL PROCESSING",       sublabel: "Preprocessing Pipeline",          icon: "〜", color: "#f59e0b", detail: "CAR · ICA · Bandpass",           desc: "Raw EEG signals are cleaned of artifacts — eye blinks, muscle noise — and filtered. Spatial filtering techniques like Common Average Reference and Laplacian improve signal quality." },
  { num: "04", label: "NEURAL DECODER",          sublabel: "Motor-Intention Classification",  icon: "◈", color: "#a78bfa", detail: "EEGNet · CSP-LDA · Transformer", desc: "Machine learning models decode movement intentions from EEG features. EEGNet, CSP-LDA, and transformer-based architectures classify motor imagery patterns with high accuracy." },
  { num: "05", label: "MOVEMENT REPRESENTATION", sublabel: "Kinematic Intent Estimation",     icon: "◎", color: "#60a5fa", detail: "6-DOF pose · velocity vector",   desc: "Decoded motor intentions are translated into a kinematic representation — which body segment should move, in which direction, and at what velocity — forming a continuous motion command." },
  { num: "06", label: "MOTION RETARGETING",      sublabel: "Human-to-Robot Mapping",          icon: "⇄", color: "#f59e0b", detail: "IK solver · morphology map",     desc: "Human kinematics are retargeted to robot joint space, accounting for morphological differences between human and robot bodies while faithfully preserving the original movement intent." },
  { num: "07", label: "WHOLE-BODY CONTROL",      sublabel: "Physical Execution Layer",        icon: "⊕", color: "#a78bfa", detail: "WBC · QP solver · 1 kHz",       desc: "A whole-body controller resolves intended movement into joint torques, enforcing balance constraints, joint limits, and real-time collision avoidance at 1 kHz control frequency." },
  { num: "08", label: "HUMANOID",                sublabel: "Physical Avatar",                 icon: "⟡", color: "#f59e0b", detail: "< 200 ms end-to-end",           desc: "The humanoid robot executes the intended movement as a physical extension of the human body. The full pipeline — from neural signal to robot motion — targets sub-200 ms latency." },
];

/* ── Animated SVG signal line between two nodes ── */
function SignalLine({ fromColor, toColor }: { fromColor: string; toColor: string }) {
  const id = `grad-${fromColor.replace("#", "")}-${toColor.replace("#", "")}`;
  return (
    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      style={{ width: 2, height: 80, top: "100%", marginTop: -8 }}>
      <svg width="2" height="80" viewBox="0 0 2 80" className="overflow-visible">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fromColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={toColor} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {/* static track */}
        <line x1="1" y1="0" x2="1" y2="80" stroke={`url(#${id})`} strokeWidth="1.5" />
        {/* animated signal dot 1 */}
        <circle r="3" fill={fromColor} style={{
          filter: `drop-shadow(0 0 4px ${fromColor})`,
          offsetPath: "path('M 1 0 L 1 80')",
          animation: "dot-flow 1.4s ease-in-out 0s infinite",
        } as React.CSSProperties} />
        {/* animated signal dot 2 */}
        <circle r="2" fill={toColor} style={{
          filter: `drop-shadow(0 0 3px ${toColor})`,
          offsetPath: "path('M 1 0 L 1 80')",
          animation: "dot-flow 1.4s ease-in-out 0.5s infinite",
        } as React.CSSProperties} />
      </svg>
    </div>
  );
}

/* ── Single pipeline card with its own scroll observer ── */
function PipelineCard({
  step, index, inView,
}: {
  step: typeof pipeline[0];
  index: number;
  inView: boolean;
}) {
  const cardRef   = useRef<HTMLDivElement>(null);
  const [scrollActive, setScrollActive] = useState(false);
  const [clicked, setClicked]           = useState(false);
  const isLeft    = index % 2 === 0;
  const c         = step.color;
  const isActive  = scrollActive || clicked;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setScrollActive(entry.isIntersecting),
      { threshold: 0.55, rootMargin: "-10% 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative flex items-start ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? "translateX(0) translateY(0)"
          : `translateX(${isLeft ? -28 : 28}px) translateY(24px)`,
        transition: "opacity 0.65s ease, transform 0.65s ease",
        transitionDelay: inView ? `${0.1 + index * 0.08}s` : "0s",
        paddingBottom: 0,
      }}
    >
      {/* ── CARD ── */}
      <div className={`flex-1 pb-0 pl-14 md:pl-0 ${isLeft ? "md:pr-16" : "md:pl-16"}`}>
        <div
          onClick={() => setClicked(v => !v)}
          className="w-full text-left group relative overflow-hidden cursor-pointer"
          style={{
            borderRadius: 20,
            padding: "1.75rem 2rem",
            background: isActive
              ? `linear-gradient(145deg, ${c}1c 0%, ${c}0c 60%, transparent 100%)`
              : "hsl(var(--surface-2)/0.65)",
            border: `1px solid ${isActive ? c + "65" : "hsl(var(--border)/0.45)"}`,
            boxShadow: isActive
              ? `0 0 0 1px ${c}18, 0 20px 60px ${c}16, 0 4px 24px rgba(0,0,0,0.18)`
              : "0 2px 12px rgba(0,0,0,0.07)",
            backdropFilter: "blur(20px)",
            transform: isActive ? "translateY(-4px) scale(1.008)" : "translateY(0) scale(1)",
            transition: "all 0.4s cubic-bezier(0.34,1.2,0.64,1)",
            marginBottom: 80,
          }}
          data-interactive="true"
        >
          {/* shimmer */}
          {isActive && (
            <div className="absolute inset-0 pointer-events-none" style={{
              background: `linear-gradient(105deg, transparent 20%, ${c}0e 50%, transparent 80%)`,
              animation: "shimmer 2.8s ease-in-out infinite",
            }} />
          )}

          {/* hover glow */}
          <div className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at ${isLeft ? "90% 10%" : "10% 10%"}, ${c}0e, transparent 60%)` }}
          />

          {/* number + icon row */}
          <div className={`flex items-start justify-between mb-5 ${isLeft ? "md:flex-row-reverse" : ""}`}>
            <div
              className="font-black leading-none select-none transition-all duration-400"
              style={{
                fontSize: "clamp(3.5rem, 7vw, 5.5rem)",
                letterSpacing: "-0.06em",
                lineHeight: 1,
                fontFamily: "'Outfit', sans-serif",
                color: isActive ? c : `${c}28`,
                textShadow: isActive ? `0 0 50px ${c}77` : "none",
              }}
            >
              {step.num}
            </div>
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-2xl transition-all duration-400"
              style={{
                width: 60, height: 60, fontSize: 28,
                background: isActive ? `${c}22` : "hsl(var(--surface-3)/0.9)",
                border: `1px solid ${isActive ? c + "50" : "hsl(var(--border)/0.3)"}`,
                boxShadow: isActive ? `0 0 28px ${c}66, 0 0 56px ${c}22` : "none",
                transform: isActive ? "scale(1.12) rotate(-5deg)" : "scale(1) rotate(0deg)",
              }}
            >
              {step.icon}
            </div>
          </div>

          {/* label */}
          <h3
            className="font-black mb-2 transition-all duration-300"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(1.15rem, 2.2vw, 1.5rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              color: isActive ? "#fff" : "hsl(var(--foreground))",
            }}
          >
            {step.label}
          </h3>

          {/* sublabel */}
          <p
            className="text-[11px] font-semibold tracking-[0.16em] mb-3 transition-all duration-300"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: c,
              opacity: isActive ? 0.85 : 0.4,
            }}
          >
            {step.sublabel.toUpperCase()}
          </p>

          {/* description — always visible */}
          <p
            className="text-sm leading-[1.75] transition-all duration-300"
            style={{
              color: "hsl(var(--foreground))",
              opacity: isActive ? 0.8 : 0.45,
              maxHeight: isActive ? "200px" : "60px",
              overflow: "hidden",
            }}
          >
            {step.desc}
          </p>

          {/* detail badge — slides in when active */}
          <div
            className="mt-4 flex items-center gap-3 overflow-hidden transition-all duration-400"
            style={{ maxHeight: isActive ? "40px" : "0px", opacity: isActive ? 1 : 0 }}
          >
            <span
              className="text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: c,
                background: `${c}1a`,
                border: `1px solid ${c}44`,
              }}
            >
              {step.detail}
            </span>
            <span className="text-[10px] opacity-30 tracking-widest"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              STAGE {step.num} / 08
            </span>
          </div>

          {/* bottom glow line */}
          <div
            className="absolute bottom-0 left-8 right-8 h-px transition-all duration-500"
            style={{
              background: `linear-gradient(90deg, transparent, ${c}99, transparent)`,
              opacity: isActive ? 1 : 0,
            }}
          />
        </div>
      </div>

      {/* ── SPINE NODE ── */}
      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10" style={{ top: 30 }}>
        {isActive && (
          <div className="absolute rounded-full pointer-events-none"
            style={{
              inset: -10,
              border: `1px solid ${c}70`,
              animation: "pulse-ring 1.8s ease-out infinite",
            }}
          />
        )}
        <div
          className="rounded-full border-2 flex items-center justify-center"
          style={{
            width: isActive ? 42 : 22,
            height: isActive ? 42 : 22,
            background: isActive ? c : "hsl(var(--surface-2))",
            borderColor: isActive ? c : `${c}55`,
            boxShadow: isActive ? `0 0 24px ${c}bb, 0 0 48px ${c}44` : "none",
            transition: "all 0.45s cubic-bezier(0.34,1.56,0.64,1)",
            fontSize: 16,
          }}
        >
          {isActive ? step.icon : ""}
        </div>
      </div>

      {/* empty side */}
      <div className="hidden md:block flex-1" />
    </div>
  );
}

export default function HowItWorksSection() {
  const { ref, inView } = useInView(0.03);

  return (
    <section id="technology" className="relative py-32 overflow-hidden bg-background">
      <div className="section-divider absolute top-0 left-0 right-0" />

      {/* dot grid */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: "radial-gradient(circle, hsl(var(--neural-cyan)) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* ambient orbs */}
      <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--neural-violet)/0.08), transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--neural-cyan)/0.07), transparent 70%)", filter: "blur(80px)" }} />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6">

        {/* header */}
        <div className="text-center mb-24">
          <div className="transition-all duration-700"
            style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(16px)" }}>
            <div className="tech-label mb-4 opacity-50">THE SYSTEM</div>
          </div>
          <div className="transition-all duration-700"
            style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transitionDelay: "0.1s" }}>
            <h2 className="font-black gradient-text-white"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)", letterSpacing: "-0.04em", lineHeight: 0.95 }}>
              HOW IT WORKS
            </h2>
          </div>
          <div className="transition-all duration-700"
            style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(16px)", transitionDelay: "0.2s" }}>
            <p className="mt-6 text-lg max-w-xl mx-auto leading-relaxed"
              style={{ color: "hsl(var(--muted-foreground))" }}>
              Eight stages transform neural intention into physical robot movement.
              <br />
              <span className="text-sm opacity-60">Scroll through each stage to explore the pipeline.</span>
            </p>
          </div>
        </div>

        {/* timeline */}
        <div className="relative">

          {/* static spine background */}
          <div
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 transition-all duration-1000"
            style={{
              background: "linear-gradient(to bottom, transparent, hsl(var(--neural-violet)/0.25) 8%, hsl(var(--neural-cyan)/0.2) 50%, hsl(var(--neural-violet)/0.15) 92%, transparent)",
              opacity: inView ? 1 : 0,
              transitionDelay: "0.4s",
            }}
          />

          {/* traveling signal dot */}
          <div
            className="absolute left-6 md:left-1/2 -translate-x-1/2 pointer-events-none z-20"
            style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "hsl(var(--neural-cyan))",
              boxShadow: "0 0 12px hsl(var(--neural-cyan)), 0 0 24px hsl(var(--neural-cyan)/0.5)",
              animation: "signal-move 4s ease-in-out infinite",
              opacity: inView ? 1 : 0,
              transition: "opacity 0.5s ease 0.6s",
            }}
          />

          {/* cards + signal lines between them */}
          <div className="flex flex-col">
            {pipeline.map((step, i) => (
              <div key={step.num} className="relative">
                <PipelineCard step={step} index={i} inView={inView} />
                {/* animated signal line between cards */}
                {i < pipeline.length - 1 && (
                  <SignalLine
                    fromColor={step.color}
                    toColor={pipeline[i + 1].color}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* footer */}
        <div className="text-center mt-4 transition-all duration-700"
          style={{ opacity: inView ? 0.3 : 0, transitionDelay: "1s" }}>
          <p className="text-[10px] tracking-[0.22em]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            8 STAGES · SCROLL TO ACTIVATE · CLICK TO TOGGLE
          </p>
        </div>

      </div>
    </section>
  );
}
