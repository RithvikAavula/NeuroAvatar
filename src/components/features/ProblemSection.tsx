import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@/hooks/useTheme";

gsap.registerPlugin(ScrollTrigger);

const BOTTLENECKS = [
  {
    num: "01",
    icon: "🎙️",
    name: "Voice Commands",
    subtitle: "High Latency & Semantic Drift",
    friction: "ACOUSTIC BOTTLENECK",
    desc: "Vocal commands introduce 1,000ms+ latency, degrade in noisy ambient environments, and offer zero fine-grained continuous motor control.",
  },
  {
    num: "02",
    icon: "🔘",
    name: "Physical Buttons",
    subtitle: "Dexterity Requirement",
    friction: "PHYSICAL EXCLUSION",
    desc: "Requires preserved finger and hand dexterity that individuals living with ALS, stroke, cerebral palsy, and high-level SCI do not possess.",
  },
  {
    num: "03",
    icon: "🕹️",
    name: "Joysticks & Toggles",
    subtitle: "Coordinate Abstraction",
    friction: "COGNITIVE FATIGUE",
    desc: "Translates complex multi-joint movement into rigid 2D mechanical axes, demanding constant visual correction and severe mental exertion.",
  },
  {
    num: "04",
    icon: "🤖",
    name: "Autonomous AI Planners",
    subtitle: "Decoupled Human Agency",
    friction: "LOSS OF EMBODIMENT",
    desc: "Black-box AI models decide how, when, and where the robot moves. The human is reduced to an external observer rather than an embodied agent.",
  },
];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cyanAccent = isDark ? "#00d4ff" : "#0284c7";
  const amberAccent = isDark ? "#fbbf24" : "#b45309";
  const redAccent = isDark ? "#f87171" : "#dc2626";

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          Array.from(headerRef.current.children),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: headerRef.current, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      }

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".bottleneck-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: { trigger: cardsRef.current, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      }

      if (comparisonRef.current) {
        gsap.fromTo(
          comparisonRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: comparisonRef.current, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="vision"
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-background transition-colors duration-500"
    >
      <div className="section-divider absolute top-0 left-0 right-0" />

      {/* Atmospheric ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: "50vw",
            height: "50vw",
            top: "5%",
            left: "-15%",
            background: isDark
              ? "radial-gradient(circle, rgba(239, 68, 68, 0.05), transparent 70%)"
              : "radial-gradient(circle, rgba(180, 83, 9, 0.06), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "50vw",
            height: "50vw",
            top: "25%",
            right: "-15%",
            background: isDark
              ? "radial-gradient(circle, rgba(0, 212, 255, 0.06), transparent 70%)"
              : "radial-gradient(circle, rgba(2, 132, 199, 0.06), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* ── HEADER ── */}
        <div ref={headerRef} className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2.5 mb-5 px-4 py-1.5 rounded-full border"
            style={{
              borderColor: isDark ? "rgba(0, 212, 255, 0.35)" : "rgba(180, 83, 9, 0.35)",
              background: isDark ? "rgba(0, 212, 255, 0.08)" : "rgba(180, 83, 9, 0.08)",
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                background: cyanAccent,
                boxShadow: `0 0 8px ${cyanAccent}`,
              }}
            />
            <span
              className="tech-label font-extrabold text-[11px] tracking-[0.22em] uppercase"
              style={{ color: cyanAccent }}
            >
              THE PARADOX · MOTOR EMBODIMENT GAP
            </span>
          </div>

          <h2
            className="font-black leading-[1.06] tracking-tight mb-6"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              color: "hsl(var(--foreground))",
            }}
          >
            ROBOTICS CAN MOVE.
            <br />
            <span className="gradient-text-dynamic">
              BUT HUMANS CAN'T ALWAYS MOVE WITH IT.
            </span>
          </h2>

          <p
            className="max-w-3xl mx-auto text-base sm:text-lg leading-relaxed font-normal opacity-85"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Modern robotics has achieved astonishing physical dexterity. Yet for millions living with severe motor impairments, the bridge between human motor intention and robotic actuation remains broken.
          </p>
        </div>

        {/* ── EXECUTIVE CORE DILEMMA CALLOUT ── */}
        <div
          className="rounded-2xl p-7 sm:p-9 mb-16 border relative overflow-hidden transition-all duration-300"
          style={{
            background: isDark
              ? "linear-gradient(145deg, rgba(18, 24, 40, 0.85) 0%, rgba(10, 14, 24, 0.95) 100%)"
              : "linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 240, 230, 0.95) 100%)",
            borderColor: isDark ? "rgba(251, 191, 36, 0.35)" : "rgba(180, 83, 9, 0.35)",
            boxShadow: isDark
              ? "0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(251, 191, 36, 0.08)"
              : "0 10px 30px rgba(0,0,0,0.06), 0 0 20px rgba(180, 83, 9, 0.08)",
          }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div
                className="text-[10.5px] font-mono font-bold tracking-[0.24em] mb-2 uppercase"
                style={{ color: amberAccent }}
              >
                THE CORE BOTTLENECK
              </div>
              <h3
                className="text-xl sm:text-2xl font-black mb-2 tracking-tight"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  color: "hsl(var(--foreground))",
                }}
              >
                The mechanical capability exists. The direct neurological interface does not.
              </h3>
              <p
                className="text-sm sm:text-base leading-relaxed opacity-80 max-w-3xl"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Conventional robotic interfaces rely on preserved gross motor dexterity or surrender autonomy to AI planning agents—depriving users of real-time subjective agency and physical embodiment.
              </p>
            </div>

            <div
              className="px-5 py-3 rounded-xl border flex-shrink-0 text-center"
              style={{
                borderColor: isDark ? "rgba(251, 191, 36, 0.3)" : "rgba(180, 83, 9, 0.3)",
                background: isDark ? "rgba(251, 191, 36, 0.08)" : "rgba(180, 83, 9, 0.08)",
              }}
            >
              <div
                className="text-2xl sm:text-3xl font-black mb-0.5"
                style={{ fontFamily: "'Outfit', sans-serif", color: amberAccent }}
              >
                54M+
              </div>
              <div
                className="text-[10px] font-mono font-bold tracking-wider opacity-75 uppercase"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Individuals Excluded Worldwide
              </div>
            </div>
          </div>
        </div>

        {/* ── 4 BOTTLENECK CARDS (SPACIOUS & ELEGANT) ── */}
        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {BOTTLENECKS.map((b) => (
            <div
              key={b.num}
              className="bottleneck-card rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1.5"
              style={{
                background: isDark
                  ? "linear-gradient(160deg, rgba(16, 22, 38, 0.85) 0%, rgba(8, 12, 22, 0.95) 100%)"
                  : "linear-gradient(160deg, rgba(255, 255, 255, 0.85) 0%, rgba(248, 243, 235, 0.95) 100%)",
                borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.1)",
                boxShadow: isDark
                  ? "0 10px 30px rgba(0,0,0,0.4)"
                  : "0 6px 20px rgba(0,0,0,0.05)",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      background: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)",
                      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"}`,
                    }}
                  >
                    {b.icon}
                  </div>
                  <span
                    className="text-xs font-mono font-bold tracking-widest opacity-40"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    {b.num}
                  </span>
                </div>

                <div
                  className="text-[10px] font-mono font-bold tracking-widest uppercase mb-1"
                  style={{ color: redAccent }}
                >
                  {b.friction}
                </div>

                <h3
                  className="text-lg font-bold mb-1.5"
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  {b.name}
                </h3>

                <p
                  className="text-xs font-medium opacity-65 mb-3"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {b.subtitle}
                </p>

                <p
                  className="text-xs sm:text-[13px] leading-relaxed opacity-80"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {b.desc}
                </p>
              </div>

              <div
                className="mt-6 pt-3 border-t text-[10px] font-mono tracking-wider opacity-60 flex items-center justify-between"
                style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)" }}
              >
                <span>CONVENTIONAL INTERFACE</span>
                <span style={{ color: redAccent }}>INSUFFICIENT</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── ARCHITECTURAL COMPARISON: CONVENTIONAL VS NEUROAVATAR ── */}
        <div
          ref={comparisonRef}
          className="rounded-3xl p-8 sm:p-12 border relative overflow-hidden"
          style={{
            background: isDark
              ? "linear-gradient(150deg, rgba(12, 18, 32, 0.95) 0%, rgba(6, 9, 18, 0.98) 100%)"
              : "linear-gradient(150deg, rgba(255, 255, 255, 0.95) 0%, rgba(246, 240, 230, 0.98) 100%)",
            borderColor: isDark ? "rgba(0, 212, 255, 0.28)" : "rgba(180, 83, 9, 0.25)",
            boxShadow: isDark
              ? "0 30px 70px rgba(0,0,0,0.6), 0 0 50px rgba(0, 212, 255, 0.08)"
              : "0 15px 40px rgba(0,0,0,0.08), 0 0 30px rgba(180, 83, 9, 0.06)",
          }}
        >
          <div className="text-center mb-10">
            <div
              className="text-[11px] font-mono font-bold tracking-[0.24em] uppercase mb-2"
              style={{ color: cyanAccent }}
            >
              PARADIGM MATRIX
            </div>
            <h3
              className="text-2xl sm:text-3xl font-black tracking-tight"
              style={{ fontFamily: "'Outfit', sans-serif", color: "hsl(var(--foreground))" }}
            >
              Conventional AI Robotics vs. NeuroAvatar Direct Embodiment
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Left: Conventional Robotics */}
            <div
              className="rounded-2xl p-6 sm:p-8 border flex flex-col justify-between"
              style={{
                background: isDark ? "rgba(239, 68, 68, 0.04)" : "rgba(220, 38, 38, 0.03)",
                borderColor: isDark ? "rgba(239, 68, 68, 0.25)" : "rgba(220, 38, 38, 0.2)",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-mono font-bold tracking-widest uppercase"
                    style={{ color: redAccent }}
                  >
                    CONVENTIONAL AI ROBOTICS
                  </span>
                  <span
                    className="text-[9.5px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase"
                    style={{
                      borderColor: isDark ? "rgba(239, 68, 68, 0.4)" : "rgba(220, 38, 38, 0.3)",
                      color: redAccent,
                      background: isDark ? "rgba(239, 68, 68, 0.1)" : "rgba(220, 38, 38, 0.08)",
                    }}
                  >
                    LATENCY &gt; 1500ms
                  </span>
                </div>

                <h4
                  className="text-lg font-bold mb-3"
                  style={{ fontFamily: "'Outfit', sans-serif", color: "hsl(var(--foreground))" }}
                >
                  Autonomous Machine Goal Execution
                </h4>

                <div className="flex flex-col gap-2.5 my-5 text-xs font-mono">
                  {[
                    "Human issues symbolic instruction (\"Get that object\")",
                    "Large Language Model / AI decomposes task goals",
                    "Autonomous path planner generates trajectories",
                    "Robot performs action independently in world",
                  ].map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3 rounded-lg border flex items-center gap-3"
                      style={{
                        background: isDark ? "rgba(0, 0, 0, 0.25)" : "rgba(255, 255, 255, 0.6)",
                        borderColor: isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(220, 38, 38, 0.15)",
                        color: "hsl(var(--foreground))",
                      }}
                    >
                      <span className="w-5 h-5 rounded-full bg-red-500/15 text-red-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                        {sIdx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="p-4 rounded-xl border text-xs leading-relaxed"
                style={{
                  background: isDark ? "rgba(239, 68, 68, 0.08)" : "rgba(220, 38, 38, 0.05)",
                  borderColor: isDark ? "rgba(239, 68, 68, 0.2)" : "rgba(220, 38, 38, 0.2)",
                  color: isDark ? "rgba(248, 113, 113, 0.95)" : "rgb(185, 28, 28)",
                }}
              >
                <strong>The Decoupled Reality:</strong> The user is an external supervisor. The AI makes the choices, controls the timing, and strips away the feeling of physical selfhood.
              </div>
            </div>

            {/* Right: NeuroAvatar Direct Embodiment */}
            <div
              className="rounded-2xl p-6 sm:p-8 border flex flex-col justify-between"
              style={{
                background: isDark ? "rgba(0, 212, 255, 0.05)" : "rgba(2, 132, 199, 0.04)",
                borderColor: isDark ? "rgba(0, 212, 255, 0.35)" : "rgba(2, 132, 199, 0.3)",
                boxShadow: isDark
                  ? "0 0 30px rgba(0, 212, 255, 0.1)"
                  : "0 0 20px rgba(2, 132, 199, 0.08)",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-mono font-bold tracking-widest uppercase"
                    style={{ color: cyanAccent }}
                  >
                    NEUROAVATAR PARADIGM
                  </span>
                  <span
                    className="text-[9.5px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase"
                    style={{
                      borderColor: isDark ? "rgba(0, 212, 255, 0.45)" : "rgba(2, 132, 199, 0.4)",
                      color: cyanAccent,
                      background: isDark ? "rgba(0, 212, 255, 0.12)" : "rgba(2, 132, 199, 0.1)",
                    }}
                  >
                    LATENCY &lt; 16ms
                  </span>
                </div>

                <h4
                  className="text-lg font-bold mb-3"
                  style={{ fontFamily: "'Outfit', sans-serif", color: "hsl(var(--foreground))" }}
                >
                  Direct Motor-Intention Embodiment
                </h4>

                <div className="flex flex-col gap-2.5 my-5 text-xs font-mono">
                  {[
                    "Cortical motor imagery in primary motor cortex",
                    "High-density 64-channel EEG non-invasive capture",
                    "Deep spatial-temporal neural decoder (<16ms inference)",
                    "Direct humanoid kinematic retargeting & actuation",
                  ].map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3 rounded-lg border flex items-center gap-3"
                      style={{
                        background: isDark ? "rgba(0, 0, 0, 0.25)" : "rgba(255, 255, 255, 0.6)",
                        borderColor: isDark ? "rgba(0, 212, 255, 0.2)" : "rgba(2, 132, 199, 0.2)",
                        color: "hsl(var(--foreground))",
                      }}
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0"
                        style={{
                          background: isDark ? "rgba(0, 212, 255, 0.15)" : "rgba(2, 132, 199, 0.15)",
                          color: cyanAccent,
                        }}
                      >
                        {sIdx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="p-4 rounded-xl border text-xs leading-relaxed"
                style={{
                  background: isDark ? "rgba(0, 212, 255, 0.08)" : "rgba(2, 132, 199, 0.06)",
                  borderColor: isDark ? "rgba(0, 212, 255, 0.3)" : "rgba(2, 132, 199, 0.25)",
                  color: isDark ? "rgba(0, 212, 255, 0.95)" : "rgb(3, 105, 161)",
                }}
              >
                <strong>The Embodied Reality:</strong> No AI planning middleware. When the human imagines motion, the robot moves synchronously. The avatar is experienced as an extension of the physical self.
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
