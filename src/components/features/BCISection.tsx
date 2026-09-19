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

// Frequency band target powers per mode [delta, theta, alpha, beta, gamma]
const BAND_TARGETS: Record<string, number[]> = {
  REST:         [0.12, 0.18, 0.82, 0.55, 0.15],
  "LEFT HAND":  [0.20, 0.30, 0.35, 0.90, 0.45],
  "RIGHT HAND": [0.20, 0.30, 0.35, 0.90, 0.45],
  FEET:         [0.25, 0.72, 0.28, 0.75, 0.38],
};

const BAND_LABELS = ["δ", "θ", "α", "β", "γ"];
const BAND_NAMES  = ["Delta", "Theta", "Alpha", "Beta", "Gamma"];
const BAND_HZ     = ["0–4", "4–8", "8–13", "13–30", "30–100"];

const CONFIDENCE: Record<string, number> = {
  REST: 0,
  "LEFT HAND":  0.91,
  "RIGHT HAND": 0.88,
  FEET:         0.84,
};

const INTENT_LABEL: Record<string, string> = {
  REST:         "NO INTENT DETECTED",
  "LEFT HAND":  "LEFT LIMB MOVEMENT",
  "RIGHT HAND": "RIGHT LIMB MOVEMENT",
  FEET:         "LOWER LIMB MOVEMENT",
};

const SVG_W = 300;
const SVG_H = 30;
const STEP  = 3;

export default function BCISection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const titleRef    = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState("REST");
  const [prevMode, setPrevMode] = useState("REST");
  const timeRef     = useRef(0);
  const frameRef    = useRef<number>();
  const pathRefs    = useRef<(SVGPolylineElement | null)[]>([]);
  const strokeOpRef = useRef<number[]>(CHANNELS.map(() => 0.35));
  const transRef    = useRef(0);
  const modeRef     = useRef(mode);
  const prevModeRef = useRef(prevMode);
  const bandRef     = useRef<number[]>([0.12, 0.18, 0.82, 0.55, 0.15]);
  const bandEls     = useRef<(HTMLDivElement | null)[]>([]);
  const confRef     = useRef(0);
  const confBarRef  = useRef<HTMLDivElement>(null);
  const confTextRef = useRef<HTMLSpanElement>(null);
  const intentRef   = useRef<HTMLDivElement>(null);
  const [displayMode, setDisplayMode] = useState("REST");

  const buildPoints = useCallback((chIdx: number, t: number, pat: Pattern) => {
    const pts: string[] = [];
    for (let i = 0; i <= SVG_W; i += STEP) {
      pts.push(`${i},${SVG_H / 2 + pat(i, chIdx, t)}`);
    }
    return pts.join(" ");
  }, []);

  useEffect(() => {
    const loop = () => {
      timeRef.current += 0.85;
      const t = timeRef.current;

      if (transRef.current < 1) transRef.current = Math.min(transRef.current + 0.035, 1);
      const blend = transRef.current;

      const curPat   = patterns[modeRef.current]  || patterns.REST;
      const prevPat  = patterns[prevModeRef.current] || patterns.REST;
      const activeChs = ACTIVE_CHANNELS[modeRef.current] || [];

      // EEG waveforms
      CHANNELS.forEach((_, i) => {
        const el = pathRefs.current[i];
        if (!el) return;
        const pts: string[] = [];
        for (let x = 0; x <= SVG_W; x += STEP) {
          const y = SVG_H / 2 + prevPat(x, i, t) * (1 - blend) + curPat(x, i, t) * blend;
          pts.push(`${x},${y}`);
        }
        el.setAttribute("points", pts.join(" "));
        const isActive = activeChs.includes(i);
        const targetOp = isActive ? 1 : 0.32;
        strokeOpRef.current[i] += (targetOp - strokeOpRef.current[i]) * 0.07;
        el.setAttribute("stroke", isActive ? "hsl(38 90% 55%)" : "hsl(215 12% 52% / 0.5)");
        el.setAttribute("stroke-width", isActive ? "1.8" : "0.8");
        el.setAttribute("stroke-opacity", strokeOpRef.current[i].toFixed(3));
        el.style.filter = isActive ? "drop-shadow(0 0 4px hsl(38 90% 52% / 0.7))" : "none";
      });

      // Frequency bands
      const targets = BAND_TARGETS[modeRef.current] || BAND_TARGETS.REST;
      targets.forEach((target, bi) => {
        bandRef.current[bi] += (target - bandRef.current[bi]) * 0.04;
        const el = bandEls.current[bi];
        if (el) el.style.height = `${Math.round(bandRef.current[bi] * 100)}%`;
      });

      // Confidence
      const targetConf = CONFIDENCE[modeRef.current] ?? 0;
      confRef.current += (targetConf - confRef.current) * 0.04;
      if (confBarRef.current) confBarRef.current.style.width = `${(confRef.current * 100).toFixed(1)}%`;
      if (confTextRef.current) confTextRef.current.textContent = `${Math.round(confRef.current * 100)}%`;

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
    transRef.current = 0;
    setDisplayMode(newMode);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const title   = titleRef.current;
    if (!section || !title) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        Array.from(title.children),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: title, start: "top 80%", toggleActions: "play none none none" } }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  const isRest = displayMode === "REST";

  return (
    <section id="bci" ref={sectionRef} className="relative py-32 overflow-hidden bg-background">
      <div className="section-divider absolute top-0 left-0 right-0" />

      {/* subtle grid bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--neural-cyan)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neural-cyan)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <div className="tech-label mb-4 opacity-50" style={{ opacity: 0 }}>INPUT LAYER</div>
          <h2
            className="font-bold mb-4 text-foreground"
            style={{ fontSize: "clamp(1.8rem,4vw,3rem)", letterSpacing: "-0.02em", opacity: 0 }}
          >
            BRAIN-COMPUTER <span className="gradient-text-cyan">INTERFACE</span>
          </h2>
          <div className="inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-full" style={{ opacity: 0 }}>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="tech-label opacity-80" style={{ color: "hsl(38 90% 52%)" }}>
              DEMO / SIMULATED SIGNAL — NOT LIVE BRAIN DATA
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── EEG waveform panel ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="glass-panel-bright rounded-2xl p-6" data-technical="true">
              {/* Panel header */}
              <div className="flex items-center justify-between mb-5">
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

              {/* Channels */}
              <div className="flex flex-col gap-1.5">
                {CHANNELS.map((ch, i) => {
                  const isActive = (ACTIVE_CHANNELS[displayMode] || []).includes(i);
                  return (
                    <div key={ch} className="flex items-center gap-3">
                      {/* Channel label */}
                      <div
                        className="w-8 text-right flex-shrink-0 transition-colors duration-500"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em",
                          color: isActive ? "hsl(38 90% 55%)" : "hsl(215 12% 48%)",
                        }}
                      >
                        {ch}
                      </div>

                      {/* Waveform */}
                      <div
                        className="flex-1 relative rounded overflow-hidden transition-all duration-500"
                        style={{
                          height: "28px",
                          background: isActive ? "hsl(38 90% 52% / 0.06)" : "hsl(var(--muted) / 0.5)",
                          borderLeft: isActive ? "2px solid hsl(38 90% 52% / 0.7)" : "2px solid transparent",
                          border: isActive
                            ? "1px solid hsl(38 90% 52% / 0.25)"
                            : "1px solid hsl(var(--border) / 0.4)",
                        }}
                      >
                        {/* scanline */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, hsl(0 0% 0% / 0.06) 3px, hsl(0 0% 0% / 0.06) 4px)",
                          }}
                        />
                        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-full" preserveAspectRatio="none">
                          <polyline
                            ref={el => { pathRefs.current[i] = el; }}
                            points=""
                            fill="none"
                            stroke="hsl(var(--muted-foreground) / 0.4)"
                            strokeWidth="0.8"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div
                          className="absolute top-0 right-0 bottom-0 w-6 pointer-events-none"
                          style={{ background: `linear-gradient(90deg, transparent, hsl(var(--surface-${isActive ? "3" : "2"})))` }}
                        />
                      </div>

                      {/* Active dot */}
                      <div className="w-4 flex-shrink-0 flex items-center justify-center">
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full glow-pulse" style={{ background: "hsl(var(--neural-cyan))" }} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Time ruler */}
              <div
                className="mt-4 flex items-center justify-between opacity-25"
                style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px" }}
              >
                <span>t = 0 ms</span>
                <span>─── 250 ms / div ───</span>
                <span>t = 2000 ms</span>
              </div>
            </div>

            {/* ── Frequency band power ── */}
            <div className="glass-panel rounded-2xl p-5" data-technical="true">
              <div className="flex items-center justify-between mb-4">
                <span className="tech-label opacity-60">FREQUENCY BAND POWER</span>
                <span className="tech-label opacity-30" style={{ fontSize: "9px" }}>RELATIVE μV²/Hz</span>
              </div>
              <div className="flex items-end gap-3 h-20">
                {BAND_LABELS.map((label, bi) => (
                  <div key={label} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex-1 relative rounded-sm overflow-hidden" style={{ background: "hsl(var(--muted)/0.4)" }}>
                      <div
                        ref={el => { bandEls.current[bi] = el; }}
                        className="absolute bottom-0 left-0 right-0 rounded-sm transition-none"
                        style={{
                          height: "0%",
                          background: bi === 2
                            ? "linear-gradient(180deg, hsl(var(--neural-cyan)), hsl(var(--neural-cyan)/0.5))"
                            : bi === 3
                            ? "linear-gradient(180deg, hsl(38 90% 55%), hsl(38 90% 40%))"
                            : "linear-gradient(180deg, hsl(215 60% 60%), hsl(215 60% 40%))",
                          boxShadow: bi === 2
                            ? "0 0 8px hsl(var(--neural-cyan)/0.4)"
                            : bi === 3
                            ? "0 0 8px hsl(38 90% 52%/0.4)"
                            : "none",
                        }}
                      />
                    </div>
                    <span
                      className="text-center"
                      style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", fontWeight: 700, color: "hsl(var(--muted-foreground))" }}
                    >
                      {label}
                    </span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px", opacity: 0.35 }}>{BAND_HZ[bi]}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-3 flex-wrap">
                {BAND_NAMES.map((name, bi) => (
                  <span key={name} className="flex items-center gap-1" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", opacity: 0.45 }}>
                    <span
                      className="inline-block w-2 h-2 rounded-sm"
                      style={{
                        background: bi === 2 ? "hsl(var(--neural-cyan))" : bi === 3 ? "hsl(38 90% 55%)" : "hsl(215 60% 60%)",
                      }}
                    />
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right controls column ── */}
          <div className="flex flex-col gap-3">
            <div className="tech-label opacity-60 mb-1">SIMULATED MOTOR IMAGERY</div>

            {Object.keys(patterns).map((m) => {
              const isSelected = displayMode === m;
              return (
                <button
                  key={m}
                  onClick={() => handleModeChange(m)}
                  className="w-full py-4 px-5 rounded-xl text-sm font-bold tracking-widest text-left relative overflow-hidden transition-all duration-300 border"
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    background: isSelected ? "hsl(38 90% 52% / 0.12)" : "hsl(var(--surface-2) / 0.7)",
                    borderColor: isSelected ? "hsl(38 90% 52% / 0.55)" : "hsl(var(--border) / 0.4)",
                    color: isSelected ? "hsl(38 90% 62%)" : "hsl(var(--muted-foreground))",
                    boxShadow: isSelected ? "0 0 20px hsl(38 90% 52% / 0.15), inset 0 0 20px hsl(38 90% 52% / 0.04)" : "none",
                  }}
                  data-interactive="true"
                >
                  {isSelected && (
                    <div
                      className="absolute bottom-0 left-0 h-0.5 w-full"
                      style={{ background: "hsl(38 90% 52% / 0.6)", animation: "neural-scan 1.8s linear infinite" }}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    {isSelected
                      ? <div className="w-1.5 h-1.5 rounded-full glow-pulse" style={{ background: "hsl(var(--neural-cyan))" }} />
                      : <div className="w-1.5 h-1.5 rounded-full opacity-20" style={{ background: "hsl(var(--muted-foreground))" }} />
                    }
                    {m}
                  </div>
                </button>
              );
            })}

            {/* Active region */}
            <div className="glass-panel rounded-xl p-4 mt-1">
              <div className="tech-label mb-2 opacity-50">ACTIVE REGION</div>
              <div
                className="text-sm font-bold mb-1 transition-all duration-500"
                style={{ fontFamily: "'Outfit', sans-serif", color: "hsl(var(--neural-cyan))" }}
              >
                {REGION_LABEL[displayMode]}
              </div>
              <div className="text-xs opacity-50 leading-relaxed">{REGION_DESC[displayMode]}</div>
            </div>

            {/* Decoded intent + confidence */}
            <div className="glass-panel rounded-xl p-4">
              <div className="tech-label mb-3 opacity-50">DECODED INTENT</div>
              <div
                ref={intentRef}
                className="text-xs font-bold mb-3 tracking-widest transition-all duration-500"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: isRest ? "hsl(var(--muted-foreground))" : "hsl(38 90% 60%)",
                  opacity: isRest ? 0.4 : 1,
                }}
              >
                {INTENT_LABEL[displayMode]}
              </div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="tech-label opacity-40" style={{ fontSize: "9px" }}>CONFIDENCE</span>
                <span
                  ref={confTextRef}
                  className="tech-label"
                  style={{ fontSize: "10px", color: isRest ? "hsl(var(--muted-foreground))" : "hsl(38 90% 60%)" }}
                >
                  0%
                </span>
              </div>
              <div className="w-full rounded-full overflow-hidden" style={{ height: "4px", background: "hsl(var(--muted)/0.5)" }}>
                <div
                  ref={confBarRef}
                  className="h-full rounded-full transition-none"
                  style={{
                    width: "0%",
                    background: isRest
                      ? "hsl(var(--muted-foreground)/0.3)"
                      : "linear-gradient(90deg, hsl(var(--neural-cyan)), hsl(38 90% 55%))",
                    boxShadow: isRest ? "none" : "0 0 8px hsl(var(--neural-cyan)/0.5)",
                  }}
                />
              </div>
            </div>

            {/* Disclaimer */}
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
