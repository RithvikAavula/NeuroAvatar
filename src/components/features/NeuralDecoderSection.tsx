import { useInView } from "@/hooks/useInView";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";

const steps = [
  {
    step: "01",
    label: "EEG INPUT",
    sublabel: "Raw 64ch @ 500Hz",
    title: "Raw Signal Acquisition",
    type: "image",
    img: "/pipeline/eeg-input.png",
    color: "cyan",
    desc: "Continuous scalp micro-potentials recorded across 64 synchronized non-invasive electrodes at 500 Hz sample rate.",
    specs: [
      "64 Active Ag/AgCl Electrodes",
      "500 Hz Sampling Frequency",
      "24-Bit ADC Resolution",
      "Real-Time Impedance Check (<5kΩ)",
    ],
    metric: "64 CHANNELS @ 500Hz",
  },
  {
    step: "02",
    label: "PREPROCESSING",
    sublabel: "Filtering, artifact removal",
    title: "Signal Purification & DSP",
    type: "text",
    color: "cyan",
    desc: "Digital signal processing to suppress electrical line interference, muscle movement, and ocular blinks.",
    specs: [
      "0.5–45 Hz Butterworth Bandpass",
      "50/60 Hz Notch Comb Filter",
      "Ocular (EOG) Artifact Rejection",
      "Baseline Drift Normalization",
    ],
    metric: "SNR GAIN: +19.4 dB",
  },
  {
    step: "03",
    label: "FEATURE EXTRACTION",
    sublabel: "CSP, PSD, ERD/ERS",
    title: "Spatial & Spectral Features",
    type: "text",
    color: "violet",
    desc: "Isolating sensorimotor rhythm dynamics across frequency bands and optimizing channel spatial projections.",
    specs: [
      "Common Spatial Pattern (CSP)",
      "μ-Rhythm (8–12 Hz) ERD Tracking",
      "β-Band (13–30 Hz) Rebound Sync",
      "Fast Fourier Power Spectral Density",
    ],
    metric: "8 CSP EIGENVECTORS",
  },
  {
    step: "04",
    label: "NEURAL NETWORK",
    sublabel: "EEGNet / CNN / LSTM",
    title: "Deep Spatio-Temporal Model",
    type: "text",
    color: "violet",
    desc: "Compact deep convolutional architecture trained to decode multi-class motor intention from filtered EEG trials.",
    specs: [
      "Temporal 2D Convolution (Phase)",
      "Depthwise Spatial Convolution",
      "Separable Convolution (Features)",
      "Softmax Head: Intent Probability",
    ],
    metric: "ACCURACY: 96.4%",
  },
  {
    step: "05",
    label: "MOVEMENT INTENTION",
    sublabel: "Direction, magnitude, segment",
    title: "Kinematic Retargeting",
    type: "text",
    color: "cyan",
    desc: "Mapping decoded neural probabilities into continuous 3D velocity vectors and whole-body joint trajectories.",
    specs: [
      "3D Cartesian Velocity Vectors",
      "28-DOF Humanoid Joint Retargeting",
      "Whole-Body Balance & WBC Loop",
      "100 Hz Real-Time Actuation Stream",
    ],
    metric: "LATENCY: < 16ms",
  },
];

/* ── Connectors ── */
function HConnector({
  color,
  active,
}: {
  color: string;
  active: boolean;
}) {
  return (
    <div className="relative flex-shrink-0 hidden xl:flex items-center justify-center" style={{ width: 44 }}>
      <div
        className="w-full h-[2px] transition-all duration-300"
        style={{
          background: active
            ? `linear-gradient(90deg, ${color}, #22c55e)`
            : `linear-gradient(90deg, ${color}60, ${color}25)`,
          boxShadow: active ? `0 0 8px ${color}` : "none",
        }}
      />
      <div
        className="w-2 h-2 rounded-full absolute"
        style={{
          background: active ? "#22c55e" : color,
          boxShadow: `0 0 8px ${active ? "#22c55e" : color}`,
          animation: active ? "pulse 1.5s ease-in-out infinite" : "none",
        }}
      />
    </div>
  );
}

function VConnector({ color }: { color: string }) {
  return (
    <div className="relative flex xl:hidden items-center justify-center py-2" style={{ height: 32 }}>
      <div className="w-[2px] h-full" style={{ background: `${color}40` }} />
      <div className="w-2 h-2 rounded-full absolute" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
    </div>
  );
}

export default function NeuralDecoderSection() {
  const { ref, inView } = useInView(0.12);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const cyanCol = isDark ? "#00d4ff" : "#0284c7";
  const violetCol = isDark ? "#c084fc" : "#7c3aed";

  return (
    <section className="relative py-32 overflow-hidden bg-background transition-colors duration-500">
      <div className="section-divider absolute top-0 left-0 right-0" />

      {/* Atmospheric ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: "50vw",
            height: "50vw",
            top: "10%",
            left: "-10%",
            background: isDark
              ? "radial-gradient(circle, rgba(0, 212, 255, 0.05), transparent 70%)"
              : "radial-gradient(circle, rgba(2, 132, 199, 0.05), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "50vw",
            height: "50vw",
            top: "20%",
            right: "-10%",
            background: isDark
              ? "radial-gradient(circle, rgba(192, 132, 252, 0.06), transparent 70%)"
              : "radial-gradient(circle, rgba(124, 58, 237, 0.05), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div ref={ref} className="relative z-10 max-w-[1400px] mx-auto px-6">

        {/* Section Header */}
        <div
          className="text-center mb-16 transition-all duration-1000"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div
            className="inline-flex items-center gap-2.5 mb-5 px-4 py-1.5 rounded-full border"
            style={{
              borderColor: isDark ? "rgba(0, 212, 255, 0.3)" : "rgba(2, 132, 199, 0.3)",
              background: isDark ? "rgba(0, 212, 255, 0.08)" : "rgba(2, 132, 199, 0.08)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: cyanCol, boxShadow: `0 0 6px ${cyanCol}` }}
            />
            <span
              className="tech-label font-bold text-[10.5px] tracking-[0.22em] uppercase"
              style={{ color: cyanCol }}
            >
              DECODING LAYER · SIGNAL PIPELINE
            </span>
          </div>

          <h2
            className="font-black leading-[1.08] tracking-tight mb-4"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(2rem, 4.5vw, 3.6rem)",
              color: "hsl(var(--foreground))",
            }}
          >
            NEURAL <span className="gradient-text-dynamic">DECODER</span>
          </h2>

          <p
            className="max-w-2xl mx-auto text-sm sm:text-base leading-relaxed opacity-75 font-normal"
            style={{ color: "hsl(var(--foreground))" }}
          >
            From scalp-level microvolt oscillations to high-frequency kinematic joint streams in under 16 milliseconds.
          </p>
        </div>

        {/* ── 5-STEP PIPELINE (STEP 1 IMAGE + STEPS 2-5 CLEAN TEXT CARDS) ── */}
        <div
          className="transition-all duration-1000 delay-200"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="flex flex-col xl:flex-row items-stretch justify-center gap-0">
            {steps.map((item, i) => {
              const isLast = i === steps.length - 1;
              const accentColor = item.color === "cyan" ? cyanCol : violetCol;
              const isHovered = hoveredIdx === i;

              return (
                <div key={item.step} className="flex flex-col xl:flex-row items-center flex-1 min-w-0">

                  {/* Card Body */}
                  <div
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="w-full xl:w-[250px] 2xl:w-[265px] rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 relative group overflow-hidden"
                    style={{
                      minHeight: "360px",
                      background: isDark
                        ? isHovered
                          ? `linear-gradient(160deg, ${accentColor}18 0%, rgba(10, 15, 28, 0.98) 100%)`
                          : "linear-gradient(160deg, rgba(14, 20, 36, 0.85) 0%, rgba(8, 12, 24, 0.95) 100%)"
                        : isHovered
                        ? `linear-gradient(160deg, ${accentColor}15 0%, rgba(255, 255, 255, 0.98) 100%)`
                        : "linear-gradient(160deg, rgba(255, 255, 255, 0.92) 0%, rgba(246, 240, 230, 0.98) 100%)",
                      borderColor: isHovered
                        ? `${accentColor}80`
                        : isDark
                        ? `${accentColor}30`
                        : `${accentColor}40`,
                      boxShadow: isHovered
                        ? `0 16px 36px rgba(0,0,0,0.35), 0 0 24px ${accentColor}25`
                        : isDark
                        ? "0 8px 24px rgba(0,0,0,0.3)"
                        : "0 4px 16px rgba(0,0,0,0.06)",
                      transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                    }}
                  >
                    {/* Top Step Number & Category Pill */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className="px-2.5 py-0.5 rounded-full text-[9.5px] font-mono font-black tracking-widest border uppercase"
                          style={{
                            borderColor: `${accentColor}50`,
                            background: `${accentColor}15`,
                            color: accentColor,
                          }}
                        >
                          STEP {item.step}
                        </div>
                        <span
                          className="text-[9.5px] font-mono font-bold tracking-wider opacity-60 uppercase"
                          style={{ color: "hsl(var(--foreground))" }}
                        >
                          {item.label}
                        </span>
                      </div>

                      {/* Main Title */}
                      <h3
                        className="text-base font-black tracking-tight leading-snug mb-1"
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          color: "hsl(var(--foreground))",
                        }}
                      >
                        {item.title}
                      </h3>

                      <p
                        className="text-[11px] font-mono mb-3"
                        style={{ color: accentColor }}
                      >
                        {item.sublabel}
                      </p>

                      {/* STEP 1: KEEP RAW EEG INPUT IMAGE */}
                      {item.type === "image" ? (
                        <div
                          className="relative rounded-xl overflow-hidden mb-3 border"
                          style={{
                            height: 150,
                            borderColor: `${accentColor}40`,
                            background: "#000",
                          }}
                        >
                          <img
                            src={item.img}
                            alt="Raw EEG Input"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div
                            className="absolute inset-0"
                            style={{ background: `${accentColor}15` }}
                          />
                          <div
                            className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
                            style={{ background: cyanCol, boxShadow: `0 0 8px ${cyanCol}` }}
                          />
                          <div
                            className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded bg-black/70 backdrop-blur-sm flex items-center justify-between text-[8px] font-mono font-bold"
                            style={{ color: cyanCol }}
                          >
                            <span>64 CHANNELS</span>
                            <span>500 Hz ACTIVE</span>
                          </div>
                        </div>
                      ) : (
                        /* STEPS 2-5: CLEAN, STRUCTURED TECHNICAL TEXT CARDS */
                        <div className="flex flex-col gap-2 my-2">
                          <p
                            className="text-xs leading-relaxed opacity-80 mb-1"
                            style={{ color: "hsl(var(--foreground))" }}
                          >
                            {item.desc}
                          </p>

                          <div
                            className="p-2.5 rounded-xl border flex flex-col gap-1.5"
                            style={{
                              background: isDark ? "rgba(0, 0, 0, 0.25)" : "rgba(0, 0, 0, 0.03)",
                              borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                            }}
                          >
                            {item.specs.map((spec, sIdx) => (
                              <div
                                key={sIdx}
                                className="flex items-start gap-1.5 text-[10.5px] font-mono leading-tight"
                                style={{ color: "hsl(var(--muted-foreground))" }}
                              >
                                <span style={{ color: accentColor }}>▸</span>
                                <span className="truncate">{spec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Metric Badge */}
                    <div
                      className="pt-3 mt-3 border-t flex items-center justify-between text-[9.5px] font-mono font-bold tracking-wider"
                      style={{
                        borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <span className="opacity-60" style={{ color: "hsl(var(--foreground))" }}>
                        TELEMETRY:
                      </span>
                      <span style={{ color: accentColor }}>
                        {item.metric}
                      </span>
                    </div>

                  </div>

                  {/* Horizontal Connector (Desktop) */}
                  {!isLast && (
                    <HConnector
                      color={accentColor}
                      active={isHovered || hoveredIdx === i + 1}
                    />
                  )}

                  {/* Vertical Connector (Mobile) */}
                  {!isLast && (
                    <VConnector color={accentColor} />
                  )}

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
