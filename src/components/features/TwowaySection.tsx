import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { useTheme } from "@/hooks/useTheme";
import NeuralBridgeCanvas from "./twoway/NeuralBridgeCanvas";
import { CharacterViewer } from "./twoway/MeshyCharacterScene";
import BCICore from "./twoway/BCICore";

type Mode = "motor" | "sensory" | "full";

const modeLabels: Record<Mode, { title: string; sub: string; color: string }> = {
  motor:   { title: "MOTOR INTENTION",  sub: "ACTIVE",    color: "#00d4ff" },
  sensory: { title: "SENSORY FEEDBACK", sub: "RESEARCH",  color: "#a855f7" },
  full:    { title: "TWO-WAY INTERFACE",sub: "SIMULATED", color: "#7c3aed" },
};

export default function TwowaySection() {
  const { ref: sectionRef, inView } = useInView(0.1);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [mode, setMode]           = useState<Mode>("full");
  const [bridgeSize, setBridgeSize] = useState({ w: 140, h: 420 });
  const [phase, setPhase]         = useState(0);
  const bridgeRef                 = useRef<HTMLDivElement>(null);

  const cyanAccent   = isDark ? "#00d4ff" : "#0284c7";
  const violetAccent = isDark ? "#c084fc" : "#6d28d9";
  const purpleMid    = isDark ? "#a855f7" : "#5b21b6";

  useEffect(() => {
    function measure() {
      if (bridgeRef.current) {
        const r = bridgeRef.current.getBoundingClientRect();
        setBridgeSize({ w: r.width || 140, h: r.height || 420 });
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (inView && phase === 0) {
      const timers = [
        setTimeout(() => setPhase(1), 200),
        setTimeout(() => setPhase(2), 700),
        setTimeout(() => setPhase(3), 1400),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [inView]);

  const motorActive   = mode === "motor"   || mode === "full";
  const sensoryActive = mode === "sensory" || mode === "full";
  const ml = modeLabels[mode];

  return (
    <section
      id="future"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative overflow-hidden bg-background"
      style={{ paddingTop: 80, paddingBottom: 100 }}
    >
      <div className="section-divider absolute top-0 left-0 right-0" />

      {/* ambient orbs only — no grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute rounded-full" style={{
          left: "15%", top: "30%", width: 400, height: 400,
          background: `radial-gradient(circle, ${cyanAccent}0a 0%, transparent 70%)`,
          filter: "blur(60px)",
        }} />
        <div className="absolute rounded-full" style={{
          right: "15%", top: "30%", width: 400, height: 400,
          background: `radial-gradient(circle, ${violetAccent}0a 0%, transparent 70%)`,
          filter: "blur(60px)",
        }} />
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-6">

        {/* ── HEADER ── */}
        <div
          className="text-center mb-14 transition-all duration-700"
          style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateY(0)" : "translateY(24px)" }}
        >
          <div className="inline-flex items-center gap-2.5 mb-5 px-3.5 py-1.5 rounded border"
            style={{ borderColor: `${cyanAccent}30`, background: `${cyanAccent}08` }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: cyanAccent, animation: "glow-pulse 2s ease-in-out infinite" }} />
            <span className="tech-label" style={{ color: cyanAccent }}>FUTURE DIRECTION · RESEARCH VISION</span>
          </div>

          <div
            className="font-black"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.6rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "hsl(var(--foreground))",
              marginBottom: 12,
            }}
          >
            FROM CONTROL
            <br />
            <span className="gradient-text-dynamic" style={{ paddingBottom: "0.1em" }}>
              TO CONNECTION.
            </span>
          </div>

          <p className="text-base max-w-lg mx-auto leading-relaxed mb-5"
            style={{ color: "hsl(var(--muted-foreground))" }}>
            The long-term vision isn't just to control a robot — it's to create a two-way interface
            between human intention and physical embodiment.
          </p>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border"
            style={{
              borderColor: isDark ? "rgba(251,191,36,0.25)" : "rgba(180,120,0,0.3)",
              background: isDark ? "rgba(251,191,36,0.06)" : "rgba(180,120,0,0.06)",
            }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: isDark ? "#fbbf24" : "#b45309" }} />
            <span className="text-[9px] font-bold tracking-[0.18em]"
              style={{ fontFamily: "'IBM Plex Mono', monospace", color: isDark ? "#fbbf24" : "#b45309" }}>
              LONG-TERM RESEARCH DIRECTION — NOT CURRENT PROTOTYPE
            </span>
          </div>
        </div>

        {/* ── HERO VISUAL ── */}
        <div
          className="transition-all duration-700"
          style={{ opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "translateY(0)" : "translateY(40px)", transitionDelay: "0.1s" }}
        >
          {/* mode selector */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex gap-1.5 p-1.5 rounded-2xl border"
              style={{ background: "hsl(var(--surface-2)/0.8)", borderColor: "hsl(var(--border)/0.6)" }}>
              <span className="text-[11px] font-mono font-bold tracking-[0.2em] px-3.5 flex items-center"
                style={{ color: "hsl(var(--muted-foreground))" }}>
                PARADIGM:
              </span>
              {(["motor", "sensory", "full"] as Mode[]).map(m => {
                const ac = m === "motor" ? cyanAccent : m === "sensory" ? violetAccent : "#7c3aed";
                return (
                  <button key={m} onClick={() => setMode(m)}
                    className="text-[11.5px] font-black tracking-[0.16em] px-5 py-2.5 rounded-xl transition-all duration-300"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      background: mode === m ? `${ac}25` : "transparent",
                      color: mode === m ? (isDark ? "#ffffff" : ac) : "hsl(var(--muted-foreground))",
                      boxShadow: mode === m ? `0 0 16px ${ac}40` : "none",
                      border: mode === m ? `1.5px solid ${ac}80` : "1.5px solid transparent",
                      transform: mode === m ? "scale(1.03)" : "scale(1)",
                    }}>
                    {m === "full" ? "FULL DUAL-LOOP" : m.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* mode badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border"
              style={{ borderColor: `${ml.color}60`, background: `${ml.color}15`, boxShadow: `0 0 16px ${ml.color}20` }}>
              <div className="w-2 h-2 rounded-full" style={{ background: ml.color, boxShadow: `0 0 8px ${ml.color}`, animation: "glow-pulse 1.5s ease-in-out infinite" }} />
              <span className="text-[11px] font-extrabold tracking-[0.2em]"
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: ml.color }}>
                {ml.title} — {ml.sub}
              </span>
            </div>
          </div>

          {/* 3-column viewer */}
          <div className="grid items-center" style={{ gridTemplateColumns: "1fr 140px 1fr", gap: 0 }}>
            <CharacterViewer
              url="/Meshy_AI_Neural_Vanguard_0918185718_texture.glb"
              label="HUMAN OPERATOR"
              accentHex={cyanAccent}
              isDark={isDark}
              signalLabel={motorActive ? "MOTOR INTENTION" : undefined}
              signalSub={motorActive ? "BRAIN → ROBOT" : undefined}
            />

            <div ref={bridgeRef} className="relative flex items-center justify-center" style={{ height: 420 }}>
              <NeuralBridgeCanvas mode={mode} width={bridgeSize.w} height={bridgeSize.h} isDark={isDark} />
              <div className="relative z-10">
                <BCICore mode={mode} active={inView} isDark={isDark} />
              </div>
            </div>

            <CharacterViewer
              url="/Meshy_AI_Cybernetic_Sentinel_0918184736_texture.glb"
              label="HUMANOID AVATAR"
              accentHex={violetAccent}
              isDark={isDark}
              signalLabel={sensoryActive ? "SENSORY FEEDBACK" : undefined}
              signalSub={sensoryActive ? "ROBOT → HUMAN" : undefined}
            />
          </div>

          <div className="flex justify-center mt-3">
            <span className="text-[8px] tracking-[0.15em] px-2.5 py-1 rounded border"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: "hsl(var(--muted-foreground))",
                borderColor: "hsl(var(--border)/0.3)",
              }}>
              SIMULATED FUTURE INTERACTION
            </span>
          </div>
        </div>

        {/* ── CINEMATIC STATEMENT + FUTURE SCOPE CARDS ── */}
        <div
          className="mt-20 transition-all duration-700"
          style={{ opacity: phase >= 3 ? 1 : 0, transform: phase >= 3 ? "translateY(0)" : "translateY(40px)", transitionDelay: "0.2s" }}
        >
          {/* statement */}
          <div className="text-center mb-14">
            <p
              className="font-bold mb-3"
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                color: "hsl(var(--muted-foreground))",
                letterSpacing: "-0.01em",
                lineHeight: 1.4,
              }}
            >
              THE ULTIMATE GOAL ISN'T<br />A ROBOT THAT OBEYS YOU.
            </p>
            <div
              className="font-black mb-0"
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: "hsl(var(--foreground))",
              }}
            >
              IT'S A ROBOT THAT BECOMES
            </div>
            <div className="gradient-text-dynamic" style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(1.8rem, 5vw, 3.4rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginTop: 4,
              paddingBottom: "0.1em",
              display: "block",
            }}>
              AN EXTENSION OF YOU.
            </div>
          </div>

          {/* future scope cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: "🔁",
                label: "HUMAN INTENTION → ROBOT ACTION",
                color: cyanAccent,
                stage: "PHASE 1 · CURRENT FOCUS",
                desc: "Motor imagery decoded from EEG drives real-time humanoid movement. The human thinks — the robot mirrors. No autonomous AI planning in the loop.",
                detail: "Motor BCI · Retargeting · WBC",
              },
              {
                icon: "👁️",
                label: "VISUAL FEEDBACK",
                color: isDark ? "#60a5fa" : "#2563eb",
                stage: "PHASE 2 · NEAR-TERM",
                desc: "First-person visual feed from the robot's cameras streamed back to the operator. The human sees through the robot's eyes, enabling remote physical presence.",
                detail: "RGB-D · Stereo · Latency < 80 ms",
              },
              {
                icon: "🤚",
                label: "TACTILE & FORCE FEEDBACK",
                color: violetAccent,
                stage: "PHASE 3 · MID-TERM",
                desc: "Contact forces and pressure at the robot's end-effectors are translated into haptic signals for the operator — closing the sensory loop between body and machine.",
                detail: "Force sensors · Haptic actuators",
              },
              {
                icon: "🧬",
                label: "FULL EMBODIMENT INTERFACE",
                color: isDark ? "#e879f9" : "#7e22ce",
                stage: "PHASE 4 · LONG-TERM VISION",
                desc: "A bidirectional neural interface where motor intention flows out and multimodal sensation flows back — proprioception, touch, vision — creating true physical embodiment at a distance.",
                detail: "Bidirectional BCI · Multimodal",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl p-6 transition-all duration-300 group cursor-default"
                style={{
                  background: isDark
                    ? `linear-gradient(145deg, ${card.color}18 0%, rgba(12, 18, 34, 0.7) 100%)`
                    : `linear-gradient(145deg, ${card.color}12 0%, hsl(36 22% 97% / 0.95) 100%)`,
                  border: `1px solid ${card.color}${isDark ? "35" : "45"}`,
                  boxShadow: isDark
                    ? `0 4px 24px ${card.color}12`
                    : `0 4px 20px rgba(0,0,0,0.06), 0 0 0 1px ${card.color}20`,
                  opacity: phase >= 3 ? 1 : 0,
                  transform: phase >= 3 ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.5s ease",
                  transitionDelay: `${0.3 + i * 0.1}s`,
                }}
              >
                {/* hover shimmer */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(105deg, transparent 20%, ${card.color}0c 50%, transparent 80%)`, animation: "shimmer 2s ease-in-out infinite" }} />

                {/* top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-13 h-13 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 p-2.5"
                      style={{ background: isDark ? `${card.color}25` : `${card.color}18`, border: `1.5px solid ${card.color}${isDark ? "55" : "40"}` }}>
                      {card.icon}
                    </div>
                    <div>
                      <div className="text-[10.5px] font-black tracking-[0.2em] mb-1"
                        style={{ fontFamily: "'IBM Plex Mono', monospace", color: card.color, textShadow: isDark ? `0 0 12px ${card.color}50` : "none" }}>
                        {card.stage}
                      </div>
                      <h3 className="font-black text-base sm:text-lg leading-tight"
                        style={{ fontFamily: "'Outfit', sans-serif", color: isDark ? "#ffffff" : "hsl(222 45% 8%)", letterSpacing: "-0.01em" }}>
                        {card.label}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* description */}
                <p className="text-[14.5px] leading-[1.8] mb-5 font-normal"
                  style={{ color: isDark ? "rgba(240,245,255,0.85)" : "hsl(215 35% 18%)" }}>
                  {card.desc}
                </p>

                {/* detail badge */}
                <span className="text-[10px] font-black tracking-widest px-3.5 py-1.5 rounded-full inline-block"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: card.color,
                    background: isDark ? `${card.color}25` : `${card.color}15`,
                    border: `1.5px solid ${card.color}${isDark ? "50" : "60"}`,
                    boxShadow: `0 0 10px ${card.color}20`,
                  }}>
                  {card.detail}
                </span>

                {/* bottom accent line */}
                <div className="absolute bottom-0 left-6 right-6 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${card.color}66, transparent)` }} />
              </div>
            ))}
          </div>

          {/* bottom label */}
          <p className="text-center text-[9px] tracking-[0.2em] mt-8 opacity-30"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            LONG-TERM RESEARCH VISION · NOT CURRENT PROTOTYPE
          </p>
        </div>

      </div>
    </section>
  );
}
