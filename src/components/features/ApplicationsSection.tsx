import { useInView } from "@/hooks/useInView";

const applications = [
  {
    icon: "⟳",
    title: "ASSISTIVE MOBILITY",
    desc: "Potential future avenue: enabling individuals with severe motor impairments to interact with the physical world through a humanoid avatar.",
    tag: "LONG-TERM POSSIBILITY",
    color: "cyan",
  },
  {
    icon: "⊕",
    title: "REHABILITATION",
    desc: "Robot-mediated motor training informed by neural intention patterns. Research direction for neurological rehabilitation contexts.",
    tag: "RESEARCH DIRECTION",
    color: "violet",
  },
  {
    icon: "◎",
    title: "REMOTE TELEPRESENCE",
    desc: "Physical presence in environments where travel is impractical: remote facilities, hazardous sites, international locations.",
    tag: "POTENTIAL APPLICATION",
    color: "cyan",
  },
  {
    icon: "⚡",
    title: "HAZARDOUS ENVIRONMENTS",
    desc: "Remote operation in radiation zones, disaster sites, deep-sea, or space environments where human physical presence is unsafe.",
    tag: "POTENTIAL APPLICATION",
    color: "violet",
  },
  {
    icon: "◈",
    title: "ROBOTICS RESEARCH",
    desc: "A platform for studying human-robot interfaces, motor intention decoding, and whole-body teleoperation in academic settings.",
    tag: "NEAR-TERM APPLICATION",
    color: "cyan",
  },
  {
    icon: "⟡",
    title: "INDUSTRIAL TELEOPERATION",
    desc: "Expert-guided remote robot operation for precision tasks in manufacturing, maintenance, and inspection environments.",
    tag: "POTENTIAL APPLICATION",
    color: "violet",
  },
  {
    icon: "⊙",
    title: "MEDICAL TRAINING",
    desc: "Embodied simulation platforms for surgical training or physical therapy education with realistic motor feedback.",
    tag: "RESEARCH DIRECTION",
    color: "cyan",
  },
  {
    icon: "⌘",
    title: "DEVELOPER PLATFORM",
    desc: "SDK and API platform for researchers and companies building on top of the NeuroAvatar BCI-robot interface stack.",
    tag: "PLATFORM VISION",
    color: "violet",
  },
];

export default function ApplicationsSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section id="applications" ref={ref} className="relative py-32 overflow-hidden bg-background">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(hsl(var(--neural-violet) / 0.3) 1px, transparent 1px),
          linear-gradient(90deg, hsl(var(--neural-violet) / 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className={`text-center mb-20 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="tech-label mb-4 opacity-50">POTENTIAL APPLICATIONS</div>
          <h2
            className="font-bold gradient-text-white mb-6"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}
          >
            RESTORING THE ABILITY
            <br />
            <span className="gradient-text-cyan">TO ACT.</span>
          </h2>
          <p className="text-lg opacity-60 max-w-2xl mx-auto">
            The following are potential future applications. They represent research directions
            and long-term possibilities, not current capabilities or medical claims.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {applications.map((app, i) => (
            <div
              key={app.title}
              className={`glass-panel rounded-xl p-5 hover:border-[hsl(var(--neural-cyan))/25] transition-all duration-700 group ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className={`text-2xl mb-4 ${app.color === 'cyan' ? 'text-[hsl(var(--neural-cyan))]' : 'text-[hsl(var(--neural-violet))]'}`}>
                {app.icon}
              </div>
              <h3 className="text-sm font-bold text-foreground mb-2" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '0.05em' }}>
                {app.title}
              </h3>
              <p className="text-xs leading-relaxed opacity-55 mb-4">
                {app.desc}
              </p>
              <div className={`text-[9px] font-bold tracking-widest px-2 py-1 rounded border inline-block ${
                app.color === 'cyan'
                  ? 'border-[hsl(var(--neural-cyan))/30] text-[hsl(var(--neural-cyan))/70]'
                  : 'border-[hsl(var(--neural-violet))/30] text-[hsl(var(--neural-violet))/70]'
              }`} style={{ fontFamily: "'Outfit', sans-serif" }}>
                {app.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
