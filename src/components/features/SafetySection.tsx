import { useInView } from "@/hooks/useInView";

const safetyLayers = [
  {
    icon: "⊗",
    title: "EMERGENCY STOP",
    desc: "Hardware and software E-stop mechanisms that immediately halt all robot motion and enter a safe state, overriding any BCI command.",
    color: "red",
  },
  {
    icon: "◫",
    title: "JOINT LIMITS",
    desc: "Software and hardware joint angle limits prevent the robot from reaching mechanically harmful configurations regardless of commanded motion.",
    color: "amber",
  },
  {
    icon: "◎",
    title: "COLLISION DETECTION",
    desc: "Real-time proximity sensing and collision detection systems halt motion before contact with obstacles or people in the workspace.",
    color: "cyan",
  },
  {
    icon: "⊕",
    title: "BALANCE CONTROL",
    desc: "Whole-body balance controllers ensure the robot maintains stable posture during teleoperation, preventing falls from executed motor commands.",
    color: "cyan",
  },
  {
    icon: "◈",
    title: "COMMAND CONFIDENCE THRESHOLD",
    desc: "Only motor intention commands above a minimum decoder confidence threshold are executed. Low-confidence or ambiguous signals default to a rest or stop state.",
    color: "violet",
  },
  {
    icon: "⟡",
    title: "SAFE STATE ARCHITECTURE",
    desc: "In the absence of a valid BCI command, the robot defaults to a stable, stationary safe state rather than maintaining any previous motion command.",
    color: "violet",
  },
  {
    icon: "⌘",
    title: "HARDWARE LIMITS",
    desc: "Physical torque and velocity limits at each actuator provide a final layer of protection against commands that would exceed safe operating parameters.",
    color: "amber",
  },
];

const colorMap: Record<string, string> = {
  red: 'border-red-500/40 text-red-400',
  amber: 'border-amber-400/40 text-amber-400',
  cyan: 'border-[hsl(var(--neural-cyan))/40] text-[hsl(var(--neural-cyan))]',
  violet: 'border-[hsl(var(--neural-violet))/40] text-[hsl(var(--neural-violet))]',
};

export default function SafetySection() {
  const { ref, inView } = useInView(0.15);

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 40% 50% at 10% 50%, hsl(0 60% 6%), hsl(220 27% 4%))' }} />

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="tech-label mb-4 opacity-50">SAFETY ARCHITECTURE</div>
          <h2
            className="font-bold text-white mb-6"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
          >
            SAFETY BY <span className="gradient-text-cyan">DESIGN</span>
          </h2>
          <p className="text-lg opacity-60 max-w-2xl mx-auto mb-4">
            The human provides movement intention. Robot-side control systems enforce physical safety.
            This distinction is fundamental to the NeuroAvatar architecture.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {safetyLayers.map((layer, i) => (
            <div
              key={layer.title}
              className={`glass-panel rounded-xl p-5 flex items-start gap-4 transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 ${colorMap[layer.color]}`}>
                <span className="text-lg">{layer.icon}</span>
              </div>
              <div>
                <div className={`tech-label mb-1 ${colorMap[layer.color].split(' ')[1]}`}>{layer.title}</div>
                <p className="text-sm opacity-60 leading-relaxed">{layer.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={`glass-panel-bright rounded-xl p-6 text-center transition-all duration-1000 delay-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="tech-label text-[hsl(var(--neural-cyan))] mb-2">DESIGN PRINCIPLE</div>
          <p className="opacity-70">
            The BCI system translates motor intention into robot commands.
            An independent, dedicated safety layer validates and executes those commands safely.
            The two systems are architecturally separated.
          </p>
        </div>
      </div>
    </section>
  );
}
