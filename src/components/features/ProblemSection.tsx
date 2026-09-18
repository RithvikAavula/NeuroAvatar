import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Label fade in
      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 0.5,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: labelRef.current, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      }

      // Headline — each line slides up
      if (headlineRef.current) {
        const lines = headlineRef.current.querySelectorAll<HTMLElement>(".h-line");
        gsap.fromTo(
          lines,
          { opacity: 0, y: 50, skewY: 3 },
          {
            opacity: 1,
            y: 0,
            skewY: 0,
            duration: 0.9,
            ease: "power4.out",
            stagger: 0.13,
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Left column — slide in from left
      if (leftRef.current) {
        gsap.fromTo(
          leftRef.current,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: leftRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Right column — slide in from right with slight delay
      if (rightRef.current) {
        gsap.fromTo(
          rightRef.current,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            delay: 0.15,
            scrollTrigger: {
              trigger: rightRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
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
      className="relative py-32 overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, hsl(220 30% 8%), hsl(220 27% 4%))",
        }}
      />
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div ref={labelRef} className="tech-label mb-6 text-center" style={{ opacity: 0 }}>
          THE PROBLEM
        </div>

        <h2
          ref={headlineRef}
          className="text-center font-bold leading-none mb-16 text-white"
          style={{ fontSize: "clamp(1.8rem, 5vw, 4rem)", letterSpacing: "-0.02em" }}
        >
          <span className="h-line block" style={{ overflow: "hidden", display: "block", opacity: 0 }}>
            ROBOTICS CAN MOVE.
          </span>
          <span className="h-line block gradient-text-cyan" style={{ overflow: "hidden", display: "block", opacity: 0 }}>
            BUT HUMANS CAN'T
          </span>
          <span className="h-line block" style={{ overflow: "hidden", display: "block", opacity: 0 }}>
            ALWAYS MOVE WITH IT.
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left - Problem narrative */}
          <div ref={leftRef} style={{ opacity: 0 }}>
            <p className="text-lg leading-relaxed opacity-80 mb-6">
              Modern robotics has advanced dramatically. Machines can navigate complex environments,
              manipulate objects, and perform tasks with increasing precision.
            </p>
            <p className="text-lg leading-relaxed opacity-80 mb-6">
              Yet for millions of people with severe motor impairments, the ability to physically
              interact with the world remains profoundly limited. The technology exists. The
              interface between mind and machine does not.
            </p>
            <p className="text-lg leading-relaxed opacity-70 mb-8">
              Current interfaces often require:
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {["Voice Commands", "Physical Buttons", "Joysticks", "Switches", "High-Level AI"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 glass-panel px-4 py-3 rounded opacity-60"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right - Two pathways */}
          <div ref={rightRef} style={{ opacity: 0 }}>
            <div className="grid grid-cols-2 gap-6">
              {/* Conventional */}
              <div className="glass-panel rounded-xl p-6 border-l-2 border-red-500/40">
                <div className="tech-label mb-4 text-red-400 opacity-80">CONVENTIONAL</div>
                <div className="flex flex-col gap-2">
                  {["Human", "Command", "AI Agent", "Task Planning", "Robot"].map((step, i) => (
                    <div key={step} className="flex flex-col items-start">
                      <div
                        className={`px-3 py-2 rounded text-sm w-full ${
                          i === 0
                            ? "bg-white/10 text-white"
                            : i === 4
                            ? "bg-white/10 text-white"
                            : "bg-red-500/10 text-red-300 opacity-70"
                        }`}
                      >
                        {step}
                      </div>
                      {i < 4 && <div className="w-px h-3 bg-red-500/30 ml-4" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* NeuroAvatar */}
              <div className="glass-panel-bright rounded-xl p-6 border-l-2 border-[hsl(var(--neural-cyan))/60]">
                <div className="tech-label mb-4 text-[hsl(var(--neural-cyan))]">NEUROAVATAR</div>
                <div className="flex flex-col gap-2">
                  {["Human", "Motor Intention", "BCI", "Neural Decoder", "Robot"].map((step, i) => (
                    <div key={step} className="flex flex-col items-start">
                      <div
                        className={`px-3 py-2 rounded text-sm w-full ${
                          i === 0
                            ? "bg-white/10 text-white"
                            : i === 4
                            ? "bg-[hsl(var(--neural-cyan))/15] text-[hsl(var(--neural-cyan))]"
                            : "bg-[hsl(var(--neural-cyan))/8] text-[hsl(var(--neural-cyan))/80]"
                        }`}
                      >
                        {step}
                      </div>
                      {i < 4 && (
                        <div className="w-px h-3 ml-4 relative overflow-hidden">
                          <div className="absolute inset-0 bg-[hsl(var(--neural-cyan))/30]" />
                          <div
                            className="absolute w-full h-2 bg-[hsl(var(--neural-cyan))]"
                            style={{
                              animation: `signal-move ${1 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-6 text-sm leading-relaxed opacity-60 text-center">
              NeuroAvatar explores a different paradigm:{" "}
              <span className="text-[hsl(var(--neural-cyan))]">direct motor intention</span>,
              rather than high-level commands to an autonomous AI agent.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
