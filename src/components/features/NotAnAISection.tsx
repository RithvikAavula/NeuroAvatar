import { useInView } from "@/hooks/useInView";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";

const conventionalImage = "/conventional-ai-robotics.png";
const neuroImage = "/neuroavatar-paradigm.png";

/* ─── data ─────────────────────────────────────────────── */
const conventionalSteps = [
  { label: "Human Instruction", value: '"Pick up the object"', sub: "High-level linguistic goal", icon: "👤", type: "human" },
  { label: "AI Task Decomposition", value: "LLM / Planner Breakdown", sub: "Dissects task into symbolic sub-goals", icon: "🧠", type: "ai" },
  { label: "Path & Trajectory Planning", value: "Autonomous Motion Planner", sub: "Calculates joint trajectories in world space", icon: "🗺️", type: "ai" },
  { label: "Visual Object Perception", value: "Computer Vision & Pose", sub: "Segmentation & 6D bounding estimation", icon: "👁️", type: "ai" },
  { label: "Autonomous Execution", value: "Robot Executes On Its Own", sub: "Human is a detached spectator", icon: "🤖", type: "result" },
];

const neuroSteps = [
  { label: "Motor Intention", value: "Cortical Motor Imagery", sub: "Primary motor cortex & SMA activation", icon: "⚡", type: "human" },
  { label: "BCI Signal Capture", value: "High-Density EEG Array", sub: "Synchronized non-invasive sensor stream", icon: "📡", type: "neuro" },
  { label: "Real-Time Neural Decoding", value: "Deep Spatial-Temporal Filter", sub: "EEGNet / Transformer intent decoding", icon: "🧠", type: "neuro" },
  { label: "Kinematic Retargeting", value: "Direct Joint Angle Stream", sub: "Direct mapping to humanoid kinematics (<16ms)", icon: "🔗", type: "neuro" },
  { label: "Embodied Physical Action", value: "Avatar Mirrors Movement", sub: "True agency: The human acts through the machine", icon: "🤖", type: "result" },
];

/* ─── flow connector ────────────────────────────────────── */
function FlowConnector({ variant, index }: { variant: "red" | "cyan"; index: number }) {
  const isCyan = variant === "cyan";
  const trackColor = isCyan ? "rgba(0, 212, 255, 0.2)" : "rgba(239, 68, 68, 0.2)";
  const dotColor = isCyan ? "#00d4ff" : "#ef4444";
  const label = isCyan ? ["CAPTURE", "DECODE", "MAP", "MIRROR"][index] : ["DECOMPOSE", "PLAN", "DETECT", "EXECUTE"][index];

  return (
    <div className="relative flex justify-center items-center" style={{ height: 32 }}>
      <svg width="2" height="32" viewBox="0 0 2 32" className="overflow-visible">
        <line x1="1" y1="0" x2="1" y2="32" stroke={trackColor} strokeWidth="2" strokeDasharray="3 3" />
        <circle
          cx="1"
          cy="16"
          r="3"
          fill={dotColor}
          style={{
            filter: `drop-shadow(0 0 6px ${dotColor})`,
            animation: "pulse 1.8s ease-in-out infinite",
          }}
        />
      </svg>
      <span
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold tracking-widest opacity-60"
        style={{ color: dotColor }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── step card ─────────────────────────────────────────── */
function StepCard({
  step,
  index,
  variant,
  inView,
}: {
  step: typeof conventionalSteps[0];
  index: number;
  variant: "red" | "cyan";
  inView: boolean;
}) {
  const isCyan = variant === "cyan";
  const isResult = step.type === "result";
  const isHuman = step.type === "human";

  const borderColor = isResult
    ? isCyan ? "rgba(0, 212, 255, 0.6)" : "rgba(239, 68, 68, 0.55)"
    : isCyan ? "rgba(0, 212, 255, 0.2)" : "rgba(239, 68, 68, 0.2)";

  const bgStyle = isResult
    ? isCyan
      ? "linear-gradient(135deg, rgba(0, 212, 255, 0.14) 0%, rgba(0, 255, 170, 0.06) 100%)"
      : "linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(185, 28, 28, 0.05) 100%)"
    : isCyan
    ? "rgba(0, 212, 255, 0.04)"
    : "rgba(239, 68, 68, 0.03)";

  return (
    <div
      className="relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-all duration-500 group"
      style={{
        background: bgStyle,
        borderColor: borderColor,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : `translateX(${isCyan ? 20 : -20}px)`,
        transitionDelay: `${200 + index * 80}ms`,
        boxShadow: isResult
          ? isCyan ? "0 0 20px rgba(0, 212, 255, 0.15)" : "0 0 20px rgba(239, 68, 68, 0.12)"
          : "none",
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
        style={{
          background: isCyan ? "rgba(0, 212, 255, 0.1)" : "rgba(239, 68, 68, 0.1)",
          border: `1px solid ${isCyan ? "rgba(0, 212, 255, 0.3)" : "rgba(239, 68, 68, 0.25)"}`,
        }}
      >
        {step.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div
          className="text-[9.5px] font-bold tracking-[0.16em] uppercase mb-0.5"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: isCyan ? "#00d4ff" : "#f87171",
          }}
        >
          {step.label}
        </div>
        <div className="text-[13.5px] font-bold text-foreground truncate leading-tight">
          {step.value}
        </div>
        <div className="text-[10.5px] text-muted-foreground opacity-75 mt-0.5 truncate">
          {step.sub}
        </div>
      </div>

      {isResult && (
        <span
          className="flex-shrink-0 text-[8.5px] font-black tracking-widest px-2.5 py-1 rounded-full border uppercase"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            borderColor: isCyan ? "#00d4ff" : "#ef4444",
            color: isCyan ? "#00d4ff" : "#f87171",
            background: isCyan ? "rgba(0, 212, 255, 0.12)" : "rgba(239, 68, 68, 0.12)",
            boxShadow: `0 0 10px ${isCyan ? "rgba(0, 212, 255, 0.3)" : "rgba(239, 68, 68, 0.25)"}`,
          }}
        >
          {isCyan ? "EMBODIED" : "DECOUPLED"}
        </span>
      )}
    </div>
  );
}

/* ─── flip card ─────────────────────────────────────────── */
function FlipCard({
  variant,
  steps,
  inView,
  isDark,
}: {
  variant: "red" | "cyan";
  steps: typeof conventionalSteps;
  inView: boolean;
  isDark: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const isCyan = variant === "cyan";
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  // Sync back container height to front content
  useEffect(() => {
    const sync = () => {
      if (frontRef.current && backRef.current) {
        backRef.current.style.height = `${frontRef.current.offsetHeight}px`;
      }
    };
    sync();
    const ro = new ResizeObserver(sync);
    if (frontRef.current) ro.observe(frontRef.current);
    return () => ro.disconnect();
  }, []);

  const accentColor = isCyan ? (isDark ? "#00d4ff" : "#0284c7") : (isDark ? "#f87171" : "#dc2626");
  const badgeBorder = isCyan ? (isDark ? "rgba(0, 212, 255, 0.4)" : "rgba(2, 132, 199, 0.4)") : (isDark ? "rgba(239, 68, 68, 0.4)" : "rgba(220, 38, 38, 0.4)");
  const title = isCyan ? "NEUROAVATAR PARADIGM" : "CONVENTIONAL AI ROBOTICS";
  const subtitle = isCyan
    ? "Direct Motor-Intention Teleoperation · Zero Cognitive Middleware"
    : "Autonomous AI Goal Execution · Machine-Planned Actions";
  const latencyBadge = isCyan ? "LATENCY < 16ms · TRUE EMBODIMENT" : "LATENCY > 1500ms · ZERO AGENCY";
  const image = isCyan ? neuroImage : conventionalImage;

  return (
    <div
      className={`flip-card w-full transition-all duration-700 ${flipped ? "flipped" : ""}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transitionDelay: isCyan ? "200ms" : "100ms",
      }}
    >
      <div className="flip-card-inner">

        {/* ── FRONT ── */}
        <div
          ref={frontRef}
          className="flip-card-front rounded-2xl border flex flex-col justify-between overflow-hidden"
          style={{
            background: isDark
              ? isCyan
                ? "linear-gradient(160deg, rgba(10, 22, 40, 0.95) 0%, rgba(5, 12, 24, 0.98) 100%)"
                : "linear-gradient(160deg, rgba(35, 12, 16, 0.95) 0%, rgba(20, 6, 9, 0.98) 100%)"
              : isCyan
                ? "linear-gradient(160deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 248, 255, 0.98) 100%)"
                : "linear-gradient(160deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 245, 245, 0.98) 100%)",
            borderColor: isCyan
              ? isDark ? "rgba(0, 212, 255, 0.35)" : "rgba(2, 132, 199, 0.35)"
              : isDark ? "rgba(239, 68, 68, 0.3)" : "rgba(220, 38, 38, 0.3)",
            boxShadow: isCyan
              ? isDark ? "0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(0, 212, 255, 0.1)" : "0 10px 30px rgba(0,0,0,0.06), 0 0 20px rgba(2, 132, 199, 0.08)"
              : isDark ? "0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(239, 68, 68, 0.08)" : "0 10px 30px rgba(0,0,0,0.06), 0 0 20px rgba(220, 38, 38, 0.08)",
          }}
        >
          {/* Top header */}
          <div
            className="px-6 pt-6 pb-4 border-b"
            style={{
              borderColor: isCyan ? "rgba(0, 212, 255, 0.15)" : "rgba(239, 68, 68, 0.15)",
              background: isCyan ? "rgba(0, 212, 255, 0.03)" : "rgba(239, 68, 68, 0.02)",
            }}
          >
            <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: accentColor,
                    boxShadow: `0 0 10px ${accentColor}`,
                  }}
                />
                <h3
                  className="text-sm font-black tracking-[0.16em]"
                  style={{ fontFamily: "'Outfit', sans-serif", color: accentColor }}
                >
                  {title}
                </h3>
              </div>

              {/* Flip Button */}
              <button
                onClick={() => setFlipped(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider transition-all duration-300 hover:scale-105"
                style={{
                  border: `1px solid ${badgeBorder}`,
                  background: isCyan ? "rgba(0, 212, 255, 0.12)" : "rgba(239, 68, 68, 0.12)",
                  color: accentColor,
                }}
              >
                <span>VIEW ARCHITECTURE</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 12h16M14 6l6 6-6 6" />
                </svg>
              </button>
            </div>

            <p className="text-[12px] text-muted-foreground leading-relaxed">
              {subtitle}
            </p>

            {/* Latency / State Badge */}
            <div className="mt-3 inline-block">
              <span
                className="text-[9.5px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded border"
                style={{
                  color: accentColor,
                  borderColor: isCyan ? "rgba(0, 212, 255, 0.3)" : "rgba(239, 68, 68, 0.3)",
                  background: isCyan ? "rgba(0, 212, 255, 0.06)" : "rgba(239, 68, 68, 0.06)",
                }}
              >
                {latencyBadge}
              </span>
            </div>
          </div>

          {/* Steps container */}
          <div className="p-6 flex flex-col gap-0">
            {steps.map((s, i) => (
              <div key={i}>
                <StepCard step={s} index={i} variant={variant} inView={inView} />
                {i < steps.length - 1 && <FlowConnector variant={variant} index={i} />}
              </div>
            ))}
          </div>

          {/* Bottom callout */}
          <div
            className="p-4 mx-6 mb-6 rounded-xl border text-xs leading-relaxed"
            style={{
              borderColor: isCyan ? "rgba(0, 212, 255, 0.25)" : "rgba(239, 68, 68, 0.25)",
              background: isCyan ? "rgba(0, 212, 255, 0.05)" : "rgba(239, 68, 68, 0.05)",
              color: isCyan ? "rgba(0, 212, 255, 0.9)" : "rgba(248, 113, 113, 0.9)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {isCyan
              ? "The operator generates motor imagery. The neural decoder classifies intent in real-time and continuously streams joint kinematics. The avatar acts as a direct mechanical prosthesis."
              : "The human is relegated to issuing high-level verbal commands. A black-box AI model decides how, when, and where the robot moves, stripping away the feeling of embodiment."}
          </div>
        </div>

        {/* ── BACK (DIAGRAM VIEW) ── */}
        <div
          ref={backRef}
          className="flip-card-back rounded-2xl border overflow-hidden flex flex-col justify-between"
          style={{
            background: isDark ? "rgba(5, 8, 16, 0.98)" : "rgba(255, 255, 255, 0.98)",
            borderColor: isCyan
              ? isDark ? "rgba(0, 212, 255, 0.4)" : "rgba(2, 132, 199, 0.4)"
              : isDark ? "rgba(239, 68, 68, 0.35)" : "rgba(220, 38, 38, 0.35)",
            boxShadow: isDark ? "0 25px 60px rgba(0,0,0,0.8)" : "0 15px 35px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <div
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{
              borderColor: isCyan
                ? isDark ? "rgba(0, 212, 255, 0.2)" : "rgba(2, 132, 199, 0.2)"
                : isDark ? "rgba(239, 68, 68, 0.2)" : "rgba(220, 38, 38, 0.2)",
              background: isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(240, 245, 250, 0.7)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
              <span
                className="text-[11px] font-mono font-bold tracking-widest uppercase"
                style={{ color: accentColor }}
              >
                {title} · ARCHITECTURAL SCHEMATIC
              </span>
            </div>

            <button
              onClick={() => setFlipped(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider transition-all duration-300 hover:scale-105"
              style={{
                border: `1px solid ${badgeBorder}`,
                background: isCyan ? "rgba(0, 212, 255, 0.15)" : "rgba(239, 68, 68, 0.15)",
                color: accentColor,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 12H4M10 18l-6-6 6-6" />
              </svg>
              <span>RETURN TO PIPELINE</span>
            </button>
          </div>

          {/* Image */}
          <div className="relative flex-1 min-h-[360px] p-4 flex items-center justify-center bg-black/5 dark:bg-black/40">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-contain rounded-xl"
              style={{ maxHeight: "420px" }}
            />
          </div>

          {/* Caption footer */}
          <div
            className="px-6 py-3 border-t text-center"
            style={{
              borderColor: isCyan
                ? isDark ? "rgba(0, 212, 255, 0.15)" : "rgba(2, 132, 199, 0.15)"
                : isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(220, 38, 38, 0.15)",
              background: isDark ? "rgba(0, 0, 0, 0.5)" : "rgba(240, 245, 250, 0.8)",
            }}
          >
            <span
              className="text-[10px] font-mono tracking-widest opacity-60"
              style={{ color: accentColor }}
            >
              CLICK "RETURN TO PIPELINE" TO TOGGLE BACK
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── main section ──────────────────────────────────────── */
export default function NotAnAISection() {
  const { ref, inView } = useInView(0.1);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="relative py-32 overflow-hidden bg-background">
      <div className="section-divider absolute top-0 left-0 right-0" />

      {/* Ambient backgrounds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: "50vw",
            height: "50vw",
            top: "10%",
            left: "-15%",
            background: isDark
              ? "radial-gradient(circle, rgba(239, 68, 68, 0.06), transparent 70%)"
              : "radial-gradient(circle, rgba(239, 68, 68, 0.03), transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "50vw",
            height: "50vw",
            top: "10%",
            right: "-15%",
            background: isDark
              ? "radial-gradient(circle, rgba(0, 212, 255, 0.08), transparent 70%)"
              : "radial-gradient(circle, rgba(0, 212, 255, 0.04), transparent 70%)",
            filter: "blur(70px)",
          }}
        />
      </div>

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Section Header */}
        <div
          className="text-center mb-16 transition-all duration-1000"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="inline-flex items-center gap-2.5 mb-5 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-cyan-400 uppercase">
              THE DISTINCTION · CORE PHILOSOPHY
            </span>
          </div>

          <h2
            className="font-black leading-[1.08] tracking-tight mb-5"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.8rem)",
              color: "hsl(var(--foreground))",
            }}
          >
            NOT AN AI ASSISTANT.
            <br />
            <span className="gradient-text-dynamic">A PHYSICAL AVATAR.</span>
          </h2>

          <p className="text-base sm:text-lg max-w-2xl mx-auto text-muted-foreground leading-relaxed font-normal">
            Conventional robotics inserts a cognitive AI planner between human words and robot actions.
            NeuroAvatar builds a direct neural telemetry channel — translating pure motor intention into embodied movement.
          </p>
        </div>

        {/* Matrix Comparison */}
        <div className="grid md:grid-cols-[1fr_60px_1fr] gap-6 md:gap-0 items-start">
          <FlipCard variant="red" steps={conventionalSteps} inView={inView} isDark={isDark} />

          {/* Center VS Divider */}
          <div
            className="hidden md:flex flex-col items-center justify-start pt-36 gap-3 transition-all duration-700"
            style={{ opacity: inView ? 1 : 0, transitionDelay: "300ms" }}
          >
            <div
              className="w-px h-20"
              style={{
                background: isDark
                  ? "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2))"
                  : "linear-gradient(to bottom, transparent, rgba(0,0,0,0.15))",
              }}
            />
            <div
              className="w-11 h-11 rounded-full border bg-background flex items-center justify-center text-[11px] font-black tracking-wider text-foreground shadow-sm"
              style={{
                fontFamily: "'Outfit', sans-serif",
                borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
              }}
            >
              VS
            </div>
            <div
              className="w-px h-20"
              style={{
                background: isDark
                  ? "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)"
                  : "linear-gradient(to bottom, rgba(0,0,0,0.15), transparent)",
              }}
            />
          </div>

          <FlipCard variant="cyan" steps={neuroSteps} inView={inView} isDark={isDark} />
        </div>

        {/* Long-Term Research Manifesto Card */}
        <div
          className="mt-16 rounded-2xl border p-8 sm:p-10 relative overflow-hidden transition-all duration-1000"
          style={{
            background: isDark
              ? "linear-gradient(145deg, rgba(16, 24, 48, 0.8) 0%, rgba(8, 14, 28, 0.95) 100%)"
              : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 243, 255, 0.98) 100%)",
            borderColor: isDark ? "rgba(168, 85, 247, 0.35)" : "rgba(168, 85, 247, 0.25)",
            boxShadow: isDark
              ? "0 20px 50px rgba(0,0,0,0.6), 0 0 35px rgba(168, 85, 247, 0.12)"
              : "0 15px 35px rgba(0,0,0,0.06), 0 0 25px rgba(168, 85, 247, 0.08)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transitionDelay: "600ms",
          }}
        >
          {/* Top badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_#c084fc]" />
            <span
              className="text-[10px] font-mono font-black tracking-[0.25em] text-purple-600 dark:text-purple-400 uppercase"
            >
              LONG-TERM RESEARCH MANIFESTO
            </span>
          </div>

          <h3
            className="text-xl sm:text-2xl font-black mb-4 tracking-tight"
            style={{ fontFamily: "'Outfit', sans-serif", color: "hsl(var(--foreground))" }}
          >
            The Clean Boundary: Voluntary Agency vs. Reflexive Stability
          </h3>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-4xl mb-8 font-normal">
            Our research deliberately bifurcates high-level motor agency from low-level mechanical stabilization.
            The human operator supplies 100% of the movement intent, direction, and tempo. The robot controller
            operates strictly as an edge-level reflexive spinal cord — managing whole-body balance, center-of-mass,
            and actuator joint limits without corrupting user agency.
          </p>

          {/* 3 Pillars Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t"
            style={{ borderColor: isDark ? "rgba(168, 85, 247, 0.2)" : "rgba(168, 85, 247, 0.15)" }}
          >
            <div
              className="p-4 rounded-xl border"
              style={{
                background: isDark ? "rgba(168, 85, 247, 0.05)" : "rgba(168, 85, 247, 0.04)",
                borderColor: isDark ? "rgba(168, 85, 247, 0.2)" : "rgba(168, 85, 247, 0.15)",
              }}
            >
              <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mb-1 tracking-wider">
                01 · SUB-16MS DECODING
              </div>
              <div className="text-sm font-bold mb-2 text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Continuous Neural Streaming
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Transitioning from discrete class triggers to continuous multi-dimensional velocity vectors decoded from motor cortex telemetry.
              </p>
            </div>

            <div
              className="p-4 rounded-xl border"
              style={{
                background: isDark ? "rgba(168, 85, 247, 0.05)" : "rgba(168, 85, 247, 0.04)",
                borderColor: isDark ? "rgba(168, 85, 247, 0.2)" : "rgba(168, 85, 247, 0.15)",
              }}
            >
              <div className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 mb-1 tracking-wider">
                02 · EDGE BALANCE REFLEXES
              </div>
              <div className="text-sm font-bold mb-2 text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Zero Semantic Interference
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Whole-Body Control (WBC) preserves mechanical equilibrium in real time without cognitive AI models overriding user motor commands.
              </p>
            </div>

            <div
              className="p-4 rounded-xl border"
              style={{
                background: isDark ? "rgba(168, 85, 247, 0.05)" : "rgba(168, 85, 247, 0.04)",
                borderColor: isDark ? "rgba(168, 85, 247, 0.2)" : "rgba(168, 85, 247, 0.15)",
              }}
            >
              <div className="text-xs font-mono font-bold text-pink-600 dark:text-pink-400 mb-1 tracking-wider">
                03 · PSYCHOLOGICAL OWNERSHIP
              </div>
              <div className="text-sm font-bold mb-2 text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Embodied Sensory Loop
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Closing the bi-directional loop with low-latency visual telepresence and vibrotactile return to induce the rubber hand illusion at scale.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
