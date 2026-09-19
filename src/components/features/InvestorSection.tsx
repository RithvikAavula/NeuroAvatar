import { useInView } from "@/hooks/useInView";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";

const visionPipeline = [
  {
    id: "human",
    label: "HUMAN",
    sublabel: "Motor intention",
    icon: "◉",
    spec: "Cortical Intent",
    metric: "0.0 ms",
    detail: "Supplementary Motor Area (SMA) & Basal Ganglia planning without peripheral muscle movement.",
    color: "#00d4ff",
  },
  {
    id: "brain",
    label: "BRAIN",
    sublabel: "Neural signals",
    icon: "⟡",
    spec: "Oscillatory Dynamics",
    metric: "8–30 Hz",
    detail: "Event-Related Desynchronization (ERD) in sensorimotor rhythm over C3, C4, and Cz electrodes.",
    color: "#38bdf8",
  },
  {
    id: "bci",
    label: "BCI",
    sublabel: "Signal capture",
    icon: "⚡",
    spec: "Non-Invasive EEG",
    metric: "64ch @ 500Hz",
    detail: "Active impedance rejection (< 5kΩ), low-noise differential amplifiers with 24-bit ADC quantization.",
    color: "#a855f7",
  },
  {
    id: "decoder",
    label: "AI DECODER",
    sublabel: "Intent extraction",
    icon: "◈",
    spec: "Temporal ConvNet",
    metric: "< 16 ms",
    detail: "Sub-16ms neural feature extraction delivering continuous 3D velocity vectors at 60 Hz.",
    color: "#c084fc",
  },
  {
    id: "humanoid",
    label: "HUMANOID",
    sublabel: "Physical execution",
    icon: "⊕",
    spec: "Whole-Body Control",
    metric: "28-DOF",
    detail: "Real-time inverse dynamics, center-of-mass stabilization, and motor torque limits at robot edge.",
    color: "#34d399",
  },
  {
    id: "physical",
    label: "PHYSICAL WORLD",
    sublabel: "Real interaction",
    icon: "◎",
    spec: "Embodied Presence",
    metric: "Real-time",
    detail: "Tactile telepresence, environmental manipulation, and sensory feedback completing the loop.",
    color: "#f59e0b",
  },
];

const futureChannels = [
  {
    from: "RESEARCH",
    badge: "FOUNDATIONAL",
    tam: "$4.2B TAM",
    to: ["BCI platforms", "Academic licensing"],
    deliverable: "Standardized neural streaming SDK & open benchmarks for universities and labs.",
    color: "#00d4ff",
  },
  {
    from: "HEALTHCARE",
    badge: "PRIMARY MISSION",
    tam: "$18.5B TAM",
    to: ["Assistive tech", "Rehab systems"],
    deliverable: "Motor-complete paralysis restoration, stroke neuro-rehabilitation, and ALS independence.",
    color: "#c084fc",
  },
  {
    from: "TELEPRESENCE",
    badge: "ENTERPRISE",
    tam: "$31.0B TAM",
    to: ["Enterprise", "Industrial ops"],
    deliverable: "Remote hazardous inspection, deep-sea maintenance, and remote physical labor.",
    color: "#34d399",
  },
  {
    from: "PLATFORM",
    badge: "INFRASTRUCTURE",
    tam: "$12.8B TAM",
    to: ["Developer SDK", "SaaS licensing"],
    deliverable: "Cloud BCI decoding engine, unified hardware abstraction layer, and app ecosystem.",
    color: "#f59e0b",
  },
];

const whyNowCatalysts = [
  {
    point: "BCI hardware is maturing",
    metric: "TRL 7/9",
    detail: "Consumer-grade EEG devices achieving research-quality signals with dry electrode arrays and active noise cancellation.",
    tag: "Hardware Parity",
  },
  {
    point: "Humanoid robotics is accelerating",
    metric: "Cost Parity",
    detail: "Multiple hardware platforms approaching commercial viability with high torque density and agile bipedal balance.",
    tag: "Actuation Revolution",
  },
  {
    point: "AI decoding is advancing rapidly",
    metric: "< 16ms Latency",
    detail: "Deep learning foundation models and temporal convolutions enabling continuous multi-DOF trajectory inference.",
    tag: "Algorithmic Leap",
  },
  {
    point: "Market demand is emerging",
    metric: "+34% CAGR",
    detail: "Assistive healthcare, hazardous industrial telepresence, and distributed remote work sectors expanding worldwide.",
    tag: "Macro Tailwinds",
  },
];

export default function InvestorSection() {
  const { ref, inView } = useInView(0.12);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeStage, setActiveStage] = useState<number>(0);
  const [formState, setFormState] = useState({ name: "", email: "", org: "", submitted: false });
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, submitted: true }));
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("invest@neuroavatar.ai");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const activeNode = visionPipeline[activeStage];

  return (
    <section
      id="invest"
      ref={ref}
      className="relative py-32 overflow-hidden bg-background"
    >
      <div className="section-divider absolute top-0 left-0 right-0" />

      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: "55vw",
            height: "55vw",
            top: "5%",
            left: "-15%",
            background: isDark
              ? "radial-gradient(circle, rgba(0, 212, 255, 0.07), transparent 70%)"
              : "radial-gradient(circle, rgba(2, 132, 199, 0.05), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "50vw",
            height: "50vw",
            bottom: "10%",
            right: "-15%",
            background: isDark
              ? "radial-gradient(circle, rgba(168, 85, 247, 0.08), transparent 70%)"
              : "radial-gradient(circle, rgba(147, 51, 234, 0.06), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Section Header */}
        <div
          className="text-center mb-16 transition-all duration-1000"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="inline-flex items-center gap-2.5 mb-4 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-cyan-600 dark:text-cyan-400 uppercase">
              INVESTOR BRIEF · EXECUTIVE OVERVIEW
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
            THE NEXT INTERFACE
            <br />
            <span className="gradient-text-cyan">BETWEEN HUMANS</span>
            <br />
            AND MACHINES.
          </h2>

          <p className="text-base sm:text-lg max-w-2xl mx-auto text-muted-foreground leading-relaxed font-normal">
            We are building toward a world where physical presence is no longer limited by the body.
          </p>
        </div>

        {/* ── Interactive 6-Stage Architecture Pipeline ── */}
        <div
          className="mb-16 rounded-2xl border p-6 sm:p-8 transition-all duration-1000"
          style={{
            background: isDark
              ? "linear-gradient(145deg, rgba(10, 18, 36, 0.9) 0%, rgba(5, 10, 22, 0.95) 100%)"
              : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 248, 255, 0.98) 100%)",
            borderColor: isDark ? "rgba(0, 212, 255, 0.28)" : "rgba(2, 132, 199, 0.25)",
            boxShadow: isDark
              ? "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 212, 255, 0.08)"
              : "0 15px 35px rgba(0, 0, 0, 0.06), 0 0 25px rgba(2, 132, 199, 0.05)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transitionDelay: "150ms",
          }}
        >
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-cyan-600 dark:text-cyan-400">
                SYSTEM PIPELINE · CLICK TO INSPECT TELEMETRY
              </span>
            </div>
            <div className="text-[10.5px] font-mono text-muted-foreground">
              ACTIVE STAGE: {activeStage + 1} OF 6
            </div>
          </div>

          {/* Nodes Row with signal line */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 relative">
            {visionPipeline.map((node, i) => {
              const isSelected = activeStage === i;
              return (
                <button
                  key={node.id}
                  onClick={() => setActiveStage(i)}
                  onMouseEnter={() => setActiveStage(i)}
                  className="group relative p-3 rounded-xl border text-left transition-all duration-300 focus:outline-none"
                  style={{
                    background: isSelected
                      ? isDark ? `${node.color}15` : `${node.color}12`
                      : isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                    borderColor: isSelected
                      ? node.color
                      : isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
                    boxShadow: isSelected
                      ? `0 0 20px ${node.color}35`
                      : "none",
                    transform: isSelected ? "translateY(-3px)" : "translateY(0)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-lg font-black transition-transform duration-300 group-hover:scale-125"
                      style={{ color: node.color }}
                    >
                      {node.icon}
                    </span>
                    <span
                      className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border"
                      style={{
                        borderColor: `${node.color}50`,
                        color: node.color,
                        background: `${node.color}10`,
                      }}
                    >
                      0{i + 1}
                    </span>
                  </div>

                  <div
                    className="text-xs font-black tracking-wider truncate mb-0.5"
                    style={{ fontFamily: "'Outfit', sans-serif", color: isSelected ? node.color : "hsl(var(--foreground))" }}
                  >
                    {node.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {node.sublabel}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Stage Live Telemetry Readout */}
          <div
            className="p-5 rounded-xl border transition-all duration-500"
            style={{
              background: isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.7)",
              borderColor: `${activeNode.color}40`,
            }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl" style={{ color: activeNode.color }}>
                  {activeNode.icon}
                </span>
                <div>
                  <div className="text-sm font-black text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Stage 0{activeStage + 1} · {activeNode.label} ({activeNode.sublabel})
                  </div>
                  <div className="text-xs font-mono font-semibold" style={{ color: activeNode.color }}>
                    {activeNode.spec}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ borderColor: `${activeNode.color}50`, background: `${activeNode.color}10` }}>
                <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">THROUGHPUT:</span>
                <span className="text-xs font-mono font-black" style={{ color: activeNode.color }}>
                  {activeNode.metric}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {activeNode.detail}
            </p>
          </div>
        </div>

        {/* ── Long-Term Platform Expansion & Why Now Grid ── */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">

          {/* Long-Term Platform Expansion */}
          <div
            className="rounded-2xl border p-6 sm:p-8 transition-all duration-1000"
            style={{
              background: isDark
                ? "linear-gradient(145deg, rgba(12, 18, 34, 0.8) 0%, rgba(6, 10, 20, 0.95) 100%)"
                : "linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 245, 255, 0.95) 100%)",
              borderColor: isDark ? "rgba(168, 85, 247, 0.3)" : "rgba(147, 51, 234, 0.25)",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(24px)",
              transitionDelay: "300ms",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-[11px] font-mono font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase">
                  LONG-TERM PLATFORM EXPANSION
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">4 COMMERCIAL VERTICALS</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5">
              {futureChannels.map((channel) => (
                <div
                  key={channel.from}
                  className="p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-xs font-black tracking-wider"
                      style={{ fontFamily: "'Outfit', sans-serif", color: channel.color }}
                    >
                      {channel.from}
                    </span>
                    <span
                      className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border"
                      style={{
                        borderColor: `${channel.color}40`,
                        color: channel.color,
                        background: `${channel.color}10`,
                      }}
                    >
                      {channel.tam}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {channel.to.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded border text-foreground/80"
                        style={{
                          borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.1)",
                          background: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {channel.deliverable}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Now */}
          <div
            className="rounded-2xl border p-6 sm:p-8 transition-all duration-1000"
            style={{
              background: isDark
                ? "linear-gradient(145deg, rgba(10, 22, 38, 0.8) 0%, rgba(5, 12, 24, 0.95) 100%)"
                : "linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 248, 255, 0.95) 100%)",
              borderColor: isDark ? "rgba(0, 212, 255, 0.3)" : "rgba(2, 132, 199, 0.25)",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(24px)",
              transitionDelay: "450ms",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
                  WHY NOW · CATALYSTS ALIGNMENT
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">STRATEGIC INFLECTION</span>
            </div>

            <div className="flex flex-col gap-3">
              {whyNowCatalysts.map((item, idx) => (
                <div
                  key={item.point}
                  className="p-3.5 rounded-xl border flex items-start justify-between gap-4 transition-all duration-300 hover:scale-[1.01]"
                  style={{
                    background: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
                    borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono font-bold text-cyan-500 mt-0.5">
                      0{idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-foreground mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {item.point}
                      </div>
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        {item.detail}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 block whitespace-nowrap">
                      {item.metric}
                    </span>
                    <span className="text-[9px] text-muted-foreground opacity-60 block mt-1">
                      {item.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Build The Future With Us (Deck Request Form) ── */}
        <div
          className="rounded-2xl border p-8 md:p-12 text-center transition-all duration-1000 max-w-3xl mx-auto"
          style={{
            background: isDark
              ? "linear-gradient(145deg, rgba(14, 24, 48, 0.9) 0%, rgba(6, 12, 26, 0.98) 100%)"
              : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 248, 255, 0.98) 100%)",
            borderColor: isDark ? "rgba(0, 212, 255, 0.4)" : "rgba(2, 132, 199, 0.35)",
            boxShadow: isDark
              ? "0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 212, 255, 0.15)"
              : "0 15px 40px rgba(0, 0, 0, 0.08), 0 0 25px rgba(2, 132, 199, 0.1)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transitionDelay: "600ms",
          }}
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono font-black tracking-[0.25em] text-cyan-600 dark:text-cyan-400 uppercase">
              BUILD THE FUTURE WITH US
            </span>
          </div>

          <h3
            className="text-2xl sm:text-3xl font-black text-foreground mb-3 tracking-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Request the Investor Deck
          </h3>

          <p className="mb-8 max-w-lg mx-auto text-sm text-muted-foreground leading-relaxed">
            We are actively seeking research partners and early-stage investors aligned with our mission.
          </p>

          {formState.submitted ? (
            <div className="py-8 flex flex-col items-center gap-3">
              <div
                className="w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl"
                style={{ borderColor: "hsl(var(--neural-cyan))", color: "hsl(var(--neural-cyan))" }}
              >
                ✓
              </div>
              <div className="text-sm font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400">
                REQUEST RECEIVED
              </div>
              <p className="text-xs text-muted-foreground max-w-sm">
                Thank you, {formState.name || "partner"}. The confidential executive investor brief has been queued for delivery to {formState.email}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={formState.name}
                onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl outline-none text-foreground text-sm transition-all duration-200 border"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  background: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.12)",
                }}
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={formState.email}
                onChange={e => setFormState(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl outline-none text-foreground text-sm transition-all duration-200 border"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  background: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.12)",
                }}
              />
              <input
                type="text"
                placeholder="Organization (optional)"
                value={formState.org}
                onChange={e => setFormState(prev => ({ ...prev, org: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl outline-none text-foreground text-sm transition-all duration-200 border"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  background: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                  borderColor: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.12)",
                }}
              />

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3.5 px-6 text-xs font-mono font-bold tracking-widest rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg"
                  style={{
                    background: isDark ? "#00d4ff" : "#0284c7",
                    color: isDark ? "#080b11" : "#ffffff",
                    boxShadow: isDark ? "0 0 20px rgba(0, 212, 255, 0.4)" : "0 0 15px rgba(2, 132, 199, 0.3)",
                  }}
                  data-interactive="true"
                >
                  REQUEST DECK
                </button>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="flex-1 py-3.5 px-6 border text-foreground text-xs font-mono font-bold tracking-widest rounded-xl transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.15)",
                    background: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)",
                  }}
                  data-interactive="true"
                >
                  {copiedEmail ? "EMAIL COPIED!" : "CONTACT TEAM"}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
