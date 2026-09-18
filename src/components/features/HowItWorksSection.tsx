import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const pipeline = [
  {
    num: "01",
    label: "BRAIN",
    sublabel: "Motor cortex activity",
    desc: "The human imagines or intends a movement. The motor cortex generates characteristic neural oscillations — particularly in the mu and beta frequency bands.",
    icon: "🧠",
  },
  {
    num: "02",
    label: "BCI",
    sublabel: "Non-invasive neural capture",
    desc: "An EEG-based brain-computer interface captures scalp-level neural activity in real time. High-density electrode arrays sample signals across multiple cortical regions.",
    icon: "⚡",
  },
  {
    num: "03",
    label: "SIGNAL PROCESSING",
    sublabel: "Preprocessing pipeline",
    desc: "Raw EEG signals are cleaned of artifacts (eye blinks, muscle activity) and filtered. Spatial filtering techniques like CAR and Laplacian improve signal quality.",
    icon: "〜",
  },
  {
    num: "04",
    label: "NEURAL DECODER",
    sublabel: "Motor-intention classification",
    desc: "Machine learning models decode movement intentions from EEG features. Algorithms including EEGNet, CSP-LDA, and transformer-based models classify motor imagery patterns.",
    icon: "◈",
  },
  {
    num: "05",
    label: "MOVEMENT REPRESENTATION",
    sublabel: "Kinematic intent estimation",
    desc: "Decoded motor intentions are translated into a kinematic representation: which body segment should move, in which direction, and at what velocity.",
    icon: "◎",
  },
  {
    num: "06",
    label: "MOTION RETARGETING",
    sublabel: "Human-to-robot mapping",
    desc: "Human kinematics are retargeted to robot joint space. This accounts for morphological differences between human and robot bodies while preserving movement intent.",
    icon: "⇄",
  },
  {
    num: "07",
    label: "WHOLE-BODY CONTROL",
    sublabel: "Physical execution layer",
    desc: "A whole-body controller resolves intended movement into joint torques, while enforcing balance constraints, joint limits, and collision avoidance in real time.",
    icon: "⊕",
  },
  {
    num: "08",
    label: "HUMANOID",
    sublabel: "Physical avatar",
    desc: "The humanoid robot executes the intended movement as its physical extension. The cycle from neural signal to robot motion is designed to be low-latency and continuous.",
    icon: "⟡",
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title reveal
      if (titleRef.current) {
        const children = Array.from(titleRef.current.children) as HTMLElement[];
        gsap.fromTo(
          children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Each pipeline card staggers in
      if (stepsRef.current) {
        const cards = stepsRef.current.querySelectorAll<HTMLElement>(".pipeline-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: stepsRef.current,
              start: "top 75%",
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
      id="technology"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
      style={{ background: "hsl(220 27% 4%)" }}
    >
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(191 100% 50%) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div ref={titleRef} className="text-center mb-20">
          <div className="tech-label mb-6 opacity-0">THE SYSTEM</div>
          <h2
            className="font-bold leading-tight text-white opacity-0"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)", letterSpacing: "-0.02em" }}
          >
            HOW IT WORKS
          </h2>
          <p className="mt-4 opacity-0 max-w-2xl mx-auto text-lg" style={{ color: "hsl(210 15% 65%)" }}>
            Eight stages transform neural intention into physical robot movement.
          </p>
        </div>

        {/* Pipeline */}
        <div ref={stepsRef} className="relative">
          {/* Central connecting line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[hsl(var(--neural-cyan))/40] via-[hsl(var(--neural-violet))/40] to-[hsl(var(--neural-cyan))/10]" />

          <div className="flex flex-col gap-0">
            {pipeline.map((step, i) => (
              <div
                key={step.num}
                className={`pipeline-card relative flex gap-8 items-start ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                style={{ opacity: 0 }}
              >
                {/* Content */}
                <div
                  className={`flex-1 pb-12 ${
                    i % 2 === 0 ? "md:text-right md:pr-16" : "md:text-left md:pl-16"
                  } pl-16 md:pl-0`}
                >
                  <button
                    onClick={() => setActiveStep(activeStep === i ? null : i)}
                    className={`w-full group text-left md:${
                      i % 2 === 0 ? "text-right" : "text-left"
                    } glass-panel rounded-xl p-6 hover:border-[hsl(var(--neural-cyan))/30] transition-all duration-300 ${
                      activeStep === i
                        ? "border-[hsl(var(--neural-cyan))/40] bg-[hsl(var(--neural-cyan))/5]"
                        : ""
                    }`}
                    data-interactive="true"
                  >
                    <div
                      className={`flex items-center gap-3 mb-2 ${
                        i % 2 === 0 ? "md:justify-end" : "justify-start"
                      }`}
                    >
                      <span className="text-xl">{step.icon}</span>
                      <span className="tech-label text-[hsl(var(--neural-cyan))]">{step.num}</span>
                    </div>
                    <h3
                      className="text-lg font-bold text-white mb-1"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.01em" }}
                    >
                      {step.label}
                    </h3>
                    <p
                      className="text-xs opacity-50 mb-2"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.1em" }}
                    >
                      {step.sublabel}
                    </p>
                    {activeStep === i && (
                      <p className="text-sm leading-relaxed opacity-70 mt-3 border-t border-[hsl(var(--border))/30] pt-3">
                        {step.desc}
                      </p>
                    )}
                  </button>
                </div>

                {/* Node on the line */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                      activeStep === i
                        ? "bg-[hsl(var(--neural-cyan))] border-[hsl(var(--neural-cyan))]"
                        : "bg-[hsl(var(--surface-2))] border-[hsl(var(--neural-cyan))/40]"
                    }`}
                    style={{
                      boxShadow: activeStep === i ? "0 0 12px hsl(191 100% 50%)" : "none",
                    }}
                  />
                </div>

                {/* Empty side on desktop */}
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8 opacity-40">
          <p className="text-sm">Click any stage for detailed description</p>
        </div>
      </div>
    </section>
  );
}
