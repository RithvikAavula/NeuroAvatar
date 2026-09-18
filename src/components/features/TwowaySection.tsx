import { useInView } from "@/hooks/useInView";

const sensoryChannels = [
  { icon: "👁", label: "VISION", desc: "Robot-mounted stereo cameras provide visual feedback to the operator", status: "NEAR-TERM" },
  { icon: "✋", label: "TOUCH", desc: "Tactile sensors on robot surface relay contact information", status: "LONG-TERM" },
  { icon: "⊕", label: "PRESSURE", desc: "Force and torque sensing at end-effectors for manipulation feedback", status: "LONG-TERM" },
  { icon: "◎", label: "PROPRIOCEPTION", desc: "Joint angle and body configuration awareness of the robot avatar", status: "RESEARCH" },
];

export default function TwowaySection() {
  const { ref, inView } = useInView(0.2);

  return (
    <section className="relative py-32 overflow-hidden" style={{ background: 'hsl(220 25% 5%)' }}>
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="tech-label mb-4 opacity-50">FUTURE DIRECTION</div>
          <h2
            className="font-bold text-white mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
          >
            FROM ONE-WAY CONTROL
            <br />
            <span className="gradient-text-cyan">TO TWO-WAY COMMUNICATION.</span>
          </h2>
          <div className="inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="tech-label text-amber-400 opacity-80">LONG-TERM RESEARCH DIRECTION — NOT CURRENT PROTOTYPE</span>
          </div>
        </div>

        {/* Bidirectional diagram */}
        <div className={`flex flex-col items-center mb-16 transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="glass-panel-bright rounded-2xl p-8 inline-flex flex-col items-center gap-6">
            {/* Human */}
            <div className="text-center">
              <div className="tech-label text-white/60 mb-2">HUMAN OPERATOR</div>
              <div className="w-16 h-16 rounded-full glass-panel border border-white/20 flex items-center justify-center text-3xl">🧑</div>
            </div>

            {/* Bidirectional arrows */}
            <div className="flex items-center gap-8">
              {/* Downward - motor commands */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-1 h-12 relative overflow-hidden bg-[hsl(var(--neural-cyan))/15] rounded-full">
                  <div className="absolute w-full h-4 bg-[hsl(var(--neural-cyan))]" style={{ animation: 'signal-move 1.2s ease-in-out infinite' }} />
                </div>
                <div className="tech-label text-[hsl(var(--neural-cyan))]" style={{ fontSize: '9px' }}>MOTOR INTENT</div>
              </div>

              {/* BCI box */}
              <div className="glass-panel px-6 py-4 rounded-xl border border-[hsl(var(--neural-cyan))/30] text-center">
                <div className="tech-label text-[hsl(var(--neural-cyan))] mb-1">BCI</div>
                <div className="text-xs opacity-40">Interface layer</div>
              </div>

              {/* Upward - sensory feedback */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-1 h-12 relative overflow-hidden bg-[hsl(var(--neural-violet))/15] rounded-full">
                  <div className="absolute w-full h-4 bg-[hsl(var(--neural-violet))]" style={{ animation: 'signal-move 1.4s ease-in-out 0.3s infinite', transform: 'scaleY(-1)' }} />
                </div>
                <div className="tech-label text-[hsl(var(--neural-violet))]" style={{ fontSize: '9px' }}>SENSORY FB</div>
              </div>
            </div>

            {/* Robot */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg glass-panel border border-[hsl(var(--neural-violet))/20] flex items-center justify-center text-3xl">🤖</div>
              <div className="tech-label text-white/60 mt-2">HUMANOID AVATAR</div>
            </div>
          </div>
        </div>

        {/* Sensory channels */}
        <div className={`grid md:grid-cols-2 gap-4 transition-all duration-1000 delay-400 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {sensoryChannels.map((ch, i) => (
            <div
              key={ch.label}
              className={`glass-panel rounded-xl p-5 flex items-start gap-4 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${400 + i * 80}ms` }}
            >
              <div className="text-2xl">{ch.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="tech-label text-[hsl(var(--neural-violet))]">{ch.label}</div>
                  <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded border ${
                    ch.status === 'NEAR-TERM' ? 'border-[hsl(var(--neural-cyan))/40] text-[hsl(var(--neural-cyan))/70]' :
                    ch.status === 'LONG-TERM' ? 'border-[hsl(var(--neural-violet))/40] text-[hsl(var(--neural-violet))/70]' :
                    'border-amber-400/30 text-amber-400/60'
                  }`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {ch.status}
                  </span>
                </div>
                <p className="text-sm opacity-55">{ch.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
