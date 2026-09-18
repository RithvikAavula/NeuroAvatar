import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CHANNELS = ["Fp1", "Fp2", "C3", "C4", "Cz", "Fz", "Pz", "O1", "O2"];

type Pattern = (x: number, ch: number, t: number) => number;

const patterns: Record<string, Pattern> = {
  REST: (x, ch, t) => {
    const alpha = Math.sin((x + t) * 0.055 + ch * 0.7) * 7;
    const beta  = Math.sin((x + t) * 0.13  + ch * 1.1) * 2.5;
    const noise = Math.sin((x + t) * 0.21  + ch * 0.4) * 1.2;
    return alpha + beta + noise;
  },
  "LEFT HAND": (x, ch, t) => {
    const base = Math.sin((x + t) * 0.06 + ch * 0.6) * 4;
    const erd  = ch === 2
      ? Math.sin((x + t) * 0.32) * 18 * Math.exp(-Math.pow(((x + t * 0.5) % 80 - 40), 2) / 280)
      : ch === 3
      ? -Math.sin((x + t) * 0.22) * 6 * Math.exp(-Math.pow(((x + t * 0.5) % 80 - 40), 2) / 400)
      : 0;
    return base + erd;
  },
  "RIGHT HAND": (x, ch, t) => {
    const base = Math.sin((x + t) * 0.06 + ch * 0.6) * 4;
    const erd  = ch === 3
      ? Math.sin((x + t) * 0.32) * 18 * Math.exp(-Math.pow(((x + t * 0.5) % 80 - 40), 2) / 280)
      : ch === 2
      ? -Math.sin((x + t) * 0.22) * 6 * Math.exp(-Math.pow(((x + t * 0.5) % 80 - 40), 2) / 400)
      : 0;
    return base + erd;
  },
  FEET: (x, ch, t) => {
    const base  = Math.sin((x + t) * 0.06 + ch * 0.55) * 4;
    const erd   = ch === 4
      ? Math.sin((x + t) * 0.28) * 16 * Math.exp(-Math.pow(((x + t * 0.45) % 80 - 40), 2) / 320)
      : 0;
    const theta = ch === 5 || ch === 6
      ? Math.sin((x + t) * 0.09 + ch) * 5.5
      : 0;
    return base + erd + theta;
  },
};

const ACTIVE_CHANNELS: Record<string, number[]> = {
  REST:         [],
  "LEFT HAND":  [2],
  "RIGHT HAND": [3],
  FEET:         [4],
};

const REGION_LABEL: Record<string, string> = {
  REST:         "RESTING STATE",
  "LEFT HAND":  "CONTRALATERAL C3",
  "RIGHT HAND": "CONTRALATERAL C4",
  FEET:         "Cz / FOOT AREA",
};

const REGION_DESC: Record<string, string> = {
  REST:         "Background alpha / beta rhythms",
  "LEFT HAND":  "Event-related desynchronization (ERD) · C3",
  "RIGHT HAND": "Event-related desynchronization (ERD) · C4",
  FEET:         "Cz midline ERD — bilateral foot imagery",
};

const SVG_W = 300;
const SVG_H = 30;
const STEP  = 3;

export default function BCISection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const titleRef     = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState("REST");
  const [prevMode, setPrevMode] = useState("REST");
  const timeRef      = useRef(0);
  const frameRef     = useRef<number>();
  const pathRefs     = useRef<(SVGPolylineElement | null)[]>([]);
  const strokeOpRef  = useRef<number[]>(CHANNELS.map(() => 0.35));
  const transitionRef = useRef(0);
  const modeRef      = useRef(mode);
  const prevModeRef  = useRef(prevMode);

  const buildPoints = useCallback((chIdx: number, t: number, pat: Pattern) => {
    const pts: string[] = [];
    for (let i = 0; i <= SVG_W; i += STEP) {
      const amp = pat(i, chIdx, t);
      pts.push(`${i},${SVG_H / 2 + amp}`);
    }
    return pts.join(" ");
  }, []);

  useEffect(() => {
    const loop = () => {
      timeRef.current += 0.85;
      const t = timeRef.current;

      if (transitionRef.current < 1) {
        transitionRef.current = Math.min(transitionRef.current + 0.035, 1);
      }
      const blend = transitionRef.current;

      const curPat  = patterns[modeRef.current]  || patterns.REST;
      const prevPat = patterns[prevModeRef.current] || patterns.REST;
      const activeChs = ACTIVE_CHANNELS[modeRef.current] || [];

      CHANNELS.forEach((_, i) => {
        const el = pathRefs.current[i];
        if (!el) return;

        const pts: string[] = [];
        for (let x = 0; x <= SVG_W; x += STEP) {
          const yCur  = curPat(x, i, t);
          const yPrev = prevPat(x, i, t);
          const y     = SVG_H / 2 + yPrev * (1 - blend) + yCur * blend;
          pts.push(`${x},${y}`);
        }
        el.setAttribute("points", pts.join(" "));

        const targetOpacity = activeChs.includes(i) ? 1 : 0.32;
        strokeOpRef.current[i] += (targetOpacity - strokeOpRef.current[i]) * 0.07;

        const isActive = activeChs.includes(i);
        el.setAttribute("stroke", isActive ? "hsl(38 90% 55%)" : "hsl(215 12% 52% / 0.5)");
        el.setAttribute("stroke-width", isActive ? "1.6" : "0.8");
        el.setAttribute("stroke-opacity", strokeOpRef.current[i].toFixed(3));
        el.style.filter = isActive ? "drop-shadow(0 0 3px hsl(38 90% 52% / 0.6))" : "none";
      });

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, []);

  const handleModeChange = (newMode: string) => {
    setPrevMode(modeRef.current);
    prevModeRef.current = modeRef.current;
    setMode(newMode);
    modeRef.current = newMode;
    transitionRef.current = 0;
  };

  useEffect(() => {
    const section = sectionRef.current;
    const title   = titleRef.current;
    if (!section || !title) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        Array.from(title.children),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: title, start: "top 80%", toggleActions: "play none none none" },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="bci"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
      style={{ background: "hsl(var(--surface-2))" }}
    >
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div ref={titleRef} className="text-center mb-16">
          <div className="tech-label mb-4 opacity-50" style={{ opacity: 0 }}>INPUT LAYER</div>
          <h2
            className="font-bold mb-4 text-foreground"
            style={{ fontSize: "clamp(1.8rem,4vw,3rem)", letterSpacing: "-0.02em", opacity: 0 }}
          >
            BRAIN-COMPUTER <span className="gradient-text-cyan">INTERFACE</span>
          </h2>
          <div
            className="inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-full"
            style={{ opacity: 0 }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="tech-label opacity-80" style={{ color: "hsl(38 90% 52%)" }}>
              DEMO / SIMULATED SIGNAL — NOT LIVE BRAIN DATA
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* EEG waveform panel */}
          <div className="lg:col-span-2 glass-panel-bright rounded-2xl p-6" data-technical="true">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 glow-pulse" />
                <span className="tech-label opacity-70">EEG CHANNELS — SIMULATED</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="tech-label opacity-40">256 Hz</span>
                <span className="tech-label opacity-30">·</span>
                <span className="tech-label text-green-500 opacity-70" style={{ fontSize: "9px" }}>ACQUIRING</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              {CHANNELS.map((ch, i) => {
                const isActive = (ACTIVE_CHANNELS[mode] || []).includes(i);
                return (
                  <div key={ch} className="flex items-center gap-3">
                    <div
                      className="w-8 text-right flex-shrink-0 transition-colors duration-500"
                      style={{
                        fontFamily: "'Space Grotesk', monospace",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        color: isActive ? "hsl(38 90% 55%)" : "hsl(215 12% 48%)",
                      }}
                    >
                      {ch}
                    </div>

                    <div
                      className="flex-1 relative rounded overflow-hidden transition-all duration-500"
                      style={{
                        height: "28px",
                        background: isActive ? "hsl(38 90% 52% / 0.05)" : "hsl(215 22% 8% / 0.4)",
                        border: isActive
                          ? "1px solid hsl(38 90% 52% / 0.2)"
                          : "1px solid hsl(215 18% 16% / 0.35)",
                      }}
                    >
                      <svg
                        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                        className="w-full h-full"
                        preserveAspectRatio="none"
                        style={{ overflow: "visible" }}
                      >
                        <polyline
                          ref={el => { pathRefs.current[i] = el; }}
                          points=""
                          fill="none"
                          stroke="hsl(215 12% 52% / 0.35)"
                          strokeWidth="0.8"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div
                        className="absolute top-0 right-0 bottom-0 w-6 pointer-events-none"
                        style={{
                          background: `linear-gradient(90deg, transparent, hsl(var(--surface-${isActive ? "3" : "2"})))`,
                        }}
                      />
                    </div>

                    <div className="w-4 flex-shrink-0 flex items-center justify-center">
                      {isActive && (
                        <div
                          className="w-1.5 h-1.5 rounded-full glow-pulse"
                          style={{ background: "hsl(var(--neural-cyan))" }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="mt-4 flex items-center justify-between opacity-25"
              style={{ fontFamily: "'Space Grotesk', monospace", fontSize: "9px" }}
            >
              <span>t = 0 ms</span>
              <span>─── 250 ms / div ───</span>
              <span>t = 2000 ms</span>
            </div>
          </div>

          {/* Controls panel */}
          <div className="flex flex-col gap-3">
            <div className="tech-label opacity-60 mb-1">SIMULATED MOTOR IMAGERY</div>

            {Object.keys(patterns).map((m) => {
              const isSelected = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => handleModeChange(m)}
                  className="w-full py-4 px-5 rounded-xl text-sm font-bold tracking-widest text-left relative overflow-hidden transition-all duration-300 border"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    background: isSelected ? "hsl(38 90% 52% / 0.1)" : "hsl(var(--surface-2) / 0.7)",
                    borderColor: isSelected ? "hsl(38 90% 52% / 0.5)" : "hsl(var(--border) / 0.4)",
                    color: isSelected ? "hsl(38 90% 60%)" : "hsl(var(--muted-foreground))",
                    boxShadow: isSelected ? "0 0 16px hsl(38 90% 52% / 0.12)" : "none",
                  }}
                  data-interactive="true"
                >
                  {isSelected && (
                    <div
                      className="absolute bottom-0 left-0 h-0.5 w-full"
                      style={{ background: "hsl(38 90% 52% / 0.5)", animation: "neural-scan 1.8s linear infinite" }}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <div
                        className="w-1.5 h-1.5 rounded-full glow-pulse"
                        style={{ background: "hsl(var(--neural-cyan))" }}
                      />
                    )}
                    {m}
                  </div>
                </button>
              );
            })}

            <div className="glass-panel rounded-xl p-4 mt-1">
              <div className="tech-label mb-2 opacity-50">ACTIVE REGION</div>
              <div
                className="text-sm font-bold mb-1 transition-all duration-500"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--neural-cyan))" }}
              >
                {REGION_LABEL[mode]}
              </div>
              <div className="text-xs opacity-50 leading-relaxed transition-all duration-500">
                {REGION_DESC[mode]}
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4">
              <div className="tech-label mb-2 opacity-40">DISCLAIMER</div>
              <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--muted-foreground))", opacity: 0.5 }}>
                Mathematically simulated EEG patterns for demonstration only.
                Real neural signals vary significantly by individual and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
