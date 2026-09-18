import { useInView } from "@/hooks/useInView";

const conventionalSteps = [
  { step: "Human says", value: '"Get the apple"', type: 'human' },
  { step: "AI Planning", value: "Task decomposition", type: 'ai' },
  { step: "Navigation", value: "Path planning", type: 'ai' },
  { step: "Perception", value: "Object detection", type: 'ai' },
  { step: "Grasping", value: "Grasp planning", type: 'ai' },
  { step: "Robot", value: "Executes autonomously", type: 'result' },
];

const neuroSteps = [
  { step: "Motor intention", value: "Imagine grasping", type: 'human' },
  { step: "BCI", value: "Neural signal capture", type: 'neuro' },
  { step: "Decoder", value: "Movement intention", type: 'neuro' },
  { step: "Retargeting", value: "Map to robot kinematics", type: 'neuro' },
  { step: "Robot", value: "Mirrors motor intention", type: 'result' },
];

export default function NotAnAISection() {
  const { ref, inView } = useInView(0.15);

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 80% 50%, hsl(262 60% 8%), hsl(220 27% 4%))' }} />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6">
        <div className={`text-center mb-20 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="tech-label mb-6 opacity-50">THE DISTINCTION</div>
          <h2
            className="font-bold leading-tight text-white"
            style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)', letterSpacing: '-0.02em' }}
          >
            NOT AN AI ASSISTANT.
            <br />
            <span className="gradient-text-cyan">A PHYSICAL AVATAR.</span>
          </h2>
        </div>

        <div className={`grid md:grid-cols-2 gap-8 transition-all duration-1000 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {/* Conventional AI path */}
          <div className="glass-panel rounded-2xl p-8 border-l-4 border-red-500/30">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full bg-red-500/60" />
              <span className="tech-label text-red-400 opacity-80">CONVENTIONAL AI ROBOTICS</span>
            </div>
            <div className="flex flex-col gap-0">
              {conventionalSteps.map((step, i) => (
                <div key={i} className="flex flex-col">
                  <div className={`p-4 rounded-lg ${
                    step.type === 'human' ? 'bg-white/8 border border-white/10' :
                    step.type === 'ai' ? 'bg-red-500/5 border border-red-500/20 opacity-70' :
                    'bg-white/8 border border-white/10'
                  }`}>
                    <div className="text-xs opacity-50 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.08em' }}>
                      {step.step}
                    </div>
                    <div className={`text-sm font-semibold ${step.type === 'ai' ? 'text-red-300' : 'text-white'}`}>
                      {step.value}
                    </div>
                  </div>
                  {i < conventionalSteps.length - 1 && (
                    <div className="w-px h-4 bg-red-500/20 ml-4" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
              <p className="text-xs opacity-60 leading-relaxed text-red-300">
                The AI decides what to do. The human gives a goal. The machine plans autonomously.
              </p>
            </div>
          </div>

          {/* NeuroAvatar path */}
          <div className="glass-panel-bright rounded-2xl p-8 border-l-4 border-[hsl(var(--neural-cyan))/50]">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--neural-cyan))] glow-pulse" />
              <span className="tech-label text-[hsl(var(--neural-cyan))]">NEUROAVATAR PARADIGM</span>
            </div>
            <div className="flex flex-col gap-0">
              {neuroSteps.map((step, i) => (
                <div key={i} className="flex flex-col">
                  <div className={`p-4 rounded-lg ${
                    step.type === 'human' ? 'bg-white/8 border border-white/10' :
                    step.type === 'neuro' ? 'bg-[hsl(var(--neural-cyan))/8] border border-[hsl(var(--neural-cyan))/25]' :
                    'bg-[hsl(var(--neural-cyan))/12] border border-[hsl(var(--neural-cyan))/40]'
                  }`}>
                    <div className="text-xs opacity-50 mb-1 text-[hsl(var(--neural-cyan))/70]" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.08em' }}>
                      {step.step}
                    </div>
                    <div className={`text-sm font-semibold ${step.type === 'neuro' ? 'text-[hsl(var(--neural-cyan))]' : step.type === 'result' ? 'text-[hsl(var(--neural-cyan))]' : 'text-white'}`}>
                      {step.value}
                    </div>
                  </div>
                  {i < neuroSteps.length - 1 && (
                    <div className="w-px h-4 ml-4 relative overflow-hidden bg-[hsl(var(--neural-cyan))/20]">
                      <div
                        className="absolute w-full h-3 bg-[hsl(var(--neural-cyan))]"
                        style={{ animation: `signal-move ${0.8 + i * 0.15}s ease-in-out ${i * 0.1}s infinite` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 p-3 rounded-lg bg-[hsl(var(--neural-cyan))/5] border border-[hsl(var(--neural-cyan))/20]">
              <p className="text-xs leading-relaxed text-[hsl(var(--neural-cyan))/80]">
                The human moves. The robot mirrors. No autonomous AI planning — direct motor-intention teleoperation.
              </p>
            </div>
          </div>
        </div>

        {/* Clarification note */}
        <div className={`mt-12 glass-panel rounded-xl p-6 border-[hsl(var(--neural-violet))/30] border text-center transition-all duration-1000 delay-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="tech-label text-[hsl(var(--neural-violet))] mb-3 opacity-80">LONG-TERM RESEARCH DIRECTION</div>
          <p className="text-sm leading-relaxed opacity-70 max-w-3xl mx-auto">
            Our long-term goal is direct motor-intention teleoperation. In the current research stage,
            we are developing the BCI decoding pipeline and simulated humanoid control. Robot-side
            controllers will handle low-level balance, joint coordination, and safety constraints.
          </p>
        </div>
      </div>
    </section>
  );
}
