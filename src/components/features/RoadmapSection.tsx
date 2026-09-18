import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const phases = [
  {
    num: "01",
    title: "BCI SIGNAL ACQUISITION",
    desc: "Establish reliable non-invasive EEG recording pipeline. Hardware selection, electrode placement, signal quality benchmarking.",
    status: "ACTIVE",
  },
  {
    num: "02",
    title: "MOTOR-INTENTION CLASSIFICATION",
    desc: "Train and validate ML models to reliably classify motor imagery states from EEG signals with acceptable accuracy.",
    status: "ACTIVE",
  },
  {
    num: "03",
    title: "SIMULATED HUMANOID CONTROL",
    desc: "Drive a physics-based humanoid simulation (MuJoCo / Gazebo) using decoded motor intentions. Validate end-to-end pipeline.",
    status: "UPCOMING",
  },
  {
    num: "04",
    title: "SMALL PHYSICAL PROTOTYPE",
    desc: "Develop or adapt a ~40–60 cm physical humanoid robot platform. Implement basic BCI-driven movement on real hardware.",
    status: "UPCOMING",
  },
  {
    num: "05",
    title: "CONTINUOUS MOVEMENT CONTROL",
    desc: "Move beyond discrete state classification toward continuous kinematic control streams. Improve latency and responsiveness.",
    status: "PLANNED",
  },
  {
    num: "06",
    title: "WHOLE-BODY TELEOPERATION",
    desc: "Achieve coordinated whole-body control: locomotion, arm movement, and balance — all driven from neural intention.",
    status: "PLANNED",
  },
  {
    num: "07",
    title: "VISUAL TELEPRESENCE",
    desc: "Integrate robot-mounted cameras for first-person visual feedback. Build a coherent sense of remote embodiment.",
    status: "PLANNED",
  },
  {
    num: "08",
    title: "ADVANCED SENSORY FEEDBACK",
    desc: "Explore non-invasive sensory return channels — haptic, vibrotactile, visual augmentation — to close the sensory loop.",
    status: "RESEARCH",
  },
  {
    num: "09",
    title: "ASSISTIVE APPLICATIONS",
    desc: "Pilot programs with research partners exploring potential assistive and rehabilitation applications. Regulatory pathway research.",
    status: "RESEARCH",
  },
  {
    num: "10",
    title: "SCALABLE NEUROAVATAR PLATFORM",
    desc: "Develop the full NeuroAvatar platform: hardware, software stack, SDK, and developer ecosystem.",
    status: "VISION",
  },
];

const statusColors: Record<string, string> = {
  ACTIVE: "text-green-400 border-green-400/40 bg-green-400/8",
  UPCOMING:
    "text-[hsl(var(--neural-cyan))] border-[hsl(var(--neural-cyan))/40] bg-[hsl(var(--neural-cyan))/8]",
  PLANNED:
    "text-[hsl(var(--neural-violet))] border-[hsl(var(--neural-violet))/40] bg-[hsl(var(--neural-violet))/8]",
  RESEARCH: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  VISION: "text-white/50 border-white/20 bg-white/5",
};

const statusDotColors: Record<string, string> = {
  ACTIVE: "hsl(142 70% 45%)",
  UPCOMING: "hsl(191 100% 50%)",
  PLANNED: "hsl(262 80% 60%)",
  RESEARCH: "hsl(45 90% 55%)",
  VISION: "hsl(220 15% 35%)",
};

export default function RoadmapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    const titleEl = titleRef.current;
    if (!section || !wrapper || !track) return;

    // Title reveal
    const ctx = gsap.context(() => {
      if (titleEl) {
        gsap.fromTo(
          titleEl.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: titleEl,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Horizontal scroll for the card track
      const cards = track.querySelectorAll<HTMLElement>(".roadmap-card");

      // Animate each card in as they come into view during horizontal scroll
      gsap.set(cards, { opacity: 0, y: 30 });

      const totalWidth = track.scrollWidth - wrapper.offsetWidth;

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${totalWidth + window.innerHeight * 0.5}`,
        pin: true,
        anticipatePin: 1,
        scrub: 1.2,
        onUpdate: (self) => {
          // Move the track horizontally
          gsap.set(track, { x: -self.progress * totalWidth });

          // Reveal cards as they scroll into view
          cards.forEach((card, i) => {
            const threshold = i / (cards.length + 1);
            if (self.progress > threshold - 0.05) {
              gsap.to(card, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", overwrite: "auto" });
            }
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="roadmap"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "hsl(220 25% 5%)", height: "100vh" }}
    >
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="relative z-10 h-full flex flex-col px-6 pt-16 pb-8 max-w-none">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-10 max-w-5xl mx-auto w-full">
          <div className="tech-label mb-3 opacity-50" style={{ opacity: 0 }}>
            DEVELOPMENT TRAJECTORY
          </div>
          <h2
            className="font-bold text-white"
            style={{
              fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
              letterSpacing: "-0.02em",
              opacity: 0,
            }}
          >
            RESEARCH <span className="gradient-text-cyan">ROADMAP</span>
          </h2>

          {/* Status legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-5" style={{ opacity: 0 }}>
            {Object.entries(statusColors).map(([status, cls]) => (
              <div
                key={status}
                className={`px-3 py-1 rounded text-[10px] font-bold tracking-widest border ${cls}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {status}
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal scroll wrapper */}
        <div ref={wrapperRef} className="flex-1 overflow-hidden relative">
          {/* Connecting line behind cards */}
          <div
            className="absolute top-1/2 left-0 h-px pointer-events-none"
            style={{
              width: `${phases.length * 340 + 120}px`,
              background:
                "linear-gradient(90deg, hsl(142 70% 45% / 0.4), hsl(191 100% 50% / 0.3), hsl(262 80% 60% / 0.2), hsl(45 90% 55% / 0.15), hsl(220 15% 30% / 0.1))",
              transform: "translateY(-50%)",
            }}
          />

          <div
            ref={trackRef}
            className="flex gap-6 items-center h-full"
            style={{ width: "max-content", paddingLeft: "48px", paddingRight: "120px" }}
          >
            {phases.map((phase, i) => (
              <div
                key={phase.num}
                className="roadmap-card relative flex-shrink-0"
                style={{ width: "300px" }}
              >
                {/* Phase number / node */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0"
                    style={{
                      background: statusDotColors[phase.status],
                      boxShadow: `0 0 16px ${statusDotColors[phase.status]}60`,
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: phase.status === "VISION" ? "hsl(210 15% 65%)" : "hsl(220 27% 4%)",
                    }}
                  >
                    {phase.num}
                  </div>
                  <div className="h-px flex-1 opacity-20" style={{ background: statusDotColors[phase.status] }} />
                  <span
                    className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded border flex-shrink-0 ${statusColors[phase.status]}`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {phase.status}
                  </span>
                </div>

                {/* Card */}
                <div
                  className="glass-panel rounded-2xl p-6 h-44 flex flex-col justify-between relative overflow-hidden group hover:border-[hsl(var(--neural-cyan))/30] transition-all duration-300"
                  style={{
                    borderColor:
                      phase.status === "ACTIVE"
                        ? "hsl(142 70% 45% / 0.3)"
                        : phase.status === "UPCOMING"
                        ? "hsl(191 100% 50% / 0.2)"
                        : undefined,
                  }}
                >
                  {/* Subtle glow top */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px opacity-40"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${statusDotColors[phase.status]}, transparent)`,
                    }}
                  />

                  <div>
                    <div className="tech-label opacity-40 mb-2">PHASE {phase.num}</div>
                    <h3
                      className="text-sm font-bold text-white leading-snug"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.01em" }}
                    >
                      {phase.title}
                    </h3>
                  </div>
                  <p className="text-xs opacity-50 leading-relaxed line-clamp-3">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="flex items-center justify-center gap-3 mt-4 opacity-30">
          <div className="w-8 h-px bg-white/40" />
          <span className="tech-label" style={{ fontSize: "9px" }}>
            SCROLL TO ADVANCE THROUGH PHASES
          </span>
          <div className="flex gap-1">
            {phases.map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-white/30" />
            ))}
          </div>
          <div className="w-8 h-px bg-white/40" />
        </div>
      </div>
    </section>
  );
}
