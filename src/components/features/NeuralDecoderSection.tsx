import { useInView } from "@/hooks/useInView";

const algorithms = [
  { name: "CSP", full: "Common Spatial Patterns", status: "RESEARCH" },
  { name: "FBCSP", full: "Filter Bank CSP", status: "RESEARCH" },
  { name: "LDA", full: "Linear Discriminant Analysis", status: "RESEARCH" },
  { name: "EEGNet", full: "Compact CNN for EEG", status: "DEVELOPMENT" },
  { name: "CNN", full: "Convolutional Neural Net", status: "DEVELOPMENT" },
  { name: "LSTM", full: "Long Short-Term Memory", status: "DEVELOPMENT" },
  { name: "Transformer", full: "Attention-based EEG Model", status: "EXPLORATION" },
];

const pipelineSteps = [
  { label: "EEG INPUT", sublabel: "Raw 64ch @ 500Hz", color: "cyan" },
  { label: "PREPROCESSING", sublabel: "Filtering, artifact removal", color: "cyan" },
  { label: "FEATURE EXTRACTION", sublabel: "CSP, PSD, ERD/ERS", color: "violet" },
  { label: "NEURAL NETWORK", sublabel: "EEGNet / CNN / LSTM", color: "violet" },
  { label: "MOVEMENT INTENTION", sublabel: "Direction, magnitude, segment", color: "cyan" },
];

const networkNodes = [
  [3, 4, 3], // input layer
  [6, 6],   // hidden 1
  [4, 4],   // hidden 2
  [3],      // output
];

export default function NeuralDecoderSection() {
  const { ref, inView } = useInView(0.15);

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 50% at 20% 50%, hsl(262 40% 7%), hsl(220 27% 4%))' }} />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="tech-label mb-4 opacity-50">DECODING LAYER</div>
          <h2
            className="font-bold text-white"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
          >
            NEURAL <span className="gradient-text-cyan">DECODER</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Pipeline visualization */}
          <div className={`transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <div className="flex flex-col gap-0">
              {pipelineSteps.map((step, i) => (
                <div key={step.label} className="flex flex-col items-start">
                  <div className={`w-full glass-panel-bright rounded-xl p-5 border-l-4 ${
                    step.color === 'cyan' ? 'border-[hsl(var(--neural-cyan))/50]' : 'border-[hsl(var(--neural-violet))/50]'
                  }`}>
                    <div className={`tech-label mb-1 ${step.color === 'cyan' ? 'text-[hsl(var(--neural-cyan))]' : 'text-[hsl(var(--neural-violet))]'}`}>
                      {step.label}
                    </div>
                    <div className="text-sm opacity-60">{step.sublabel}</div>
                  </div>
                  {i < pipelineSteps.length - 1 && (
                    <div className="w-px h-6 ml-6 relative overflow-hidden bg-white/10">
                      <div
                        className={`absolute w-full h-4 ${step.color === 'cyan' ? 'bg-[hsl(var(--neural-cyan))]' : 'bg-[hsl(var(--neural-violet))]'}`}
                        style={{ animation: `signal-move 1.4s ease-in-out ${i * 0.2}s infinite` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right side: Network + Algorithms */}
          <div className={`transition-all duration-1000 delay-400 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            {/* Neural network viz */}
            <div className="glass-panel rounded-2xl p-6 mb-6" data-technical="true">
              <div className="tech-label mb-4 opacity-60">SIMPLIFIED NETWORK REPRESENTATION</div>
              <svg viewBox="0 0 300 120" className="w-full h-32">
                {/* Layer labels */}
                {['INPUT', 'HIDDEN', 'HIDDEN', 'OUTPUT'].map((label, li) => (
                  <text key={li} x={li * 80 + 30} y="115" textAnchor="middle"
                    fill="hsl(210 20% 50%)" fontSize="7" fontFamily="Space Grotesk" letterSpacing="1">
                    {label}
                  </text>
                ))}
                {/* Connections (simplified) */}
                {[0,1,2].map(li => (
                  Array.from({ length: 3 }).map((_, ni) =>
                    Array.from({ length: 4 }).map((_, nj) => (
                      <line key={`${li}-${ni}-${nj}`}
                        x1={li * 80 + 30} y1={ni * 28 + 20}
                        x2={(li + 1) * 80 + 30} y2={nj * 20 + 20}
                        stroke="hsl(262 80% 60% / 0.08)" strokeWidth="0.5" />
                    ))
                  )
                ))}
                {/* Nodes */}
                {[[30,20],[30,48],[30,76],[110,16],[110,36],[110,56],[110,76],[190,20],[190,44],[190,68],[190,92],[270,36],[270,60]].map(([cx,cy], i) => {
                  const isActive = Math.sin(Date.now() * 0.001 + i) > 0.3;
                  const color = i < 4 ? 'hsl(191 100% 50%)' : i < 11 ? 'hsl(262 80% 60%)' : 'hsl(191 100% 70%)';
                  return (
                    <g key={i}>
                      <circle cx={cx} cy={cy} r="5" fill="hsl(220 25% 10%)" stroke={color} strokeWidth="1" />
                      <circle cx={cx} cy={cy} r="2" fill={color} opacity="0.7" />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Algorithm stack */}
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="tech-label opacity-60">RESEARCH / DEVELOPMENT STACK</div>
              </div>
              <div className="flex flex-col gap-2">
                {algorithms.map((algo) => (
                  <div key={algo.name} className="flex items-center justify-between py-2 border-b border-[hsl(var(--border))/30] last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{algo.name}</span>
                      <span className="text-xs opacity-40">{algo.full}</span>
                    </div>
                    <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded border ${
                      algo.status === 'DEVELOPMENT'
                        ? 'border-[hsl(var(--neural-cyan))/40] text-[hsl(var(--neural-cyan))] bg-[hsl(var(--neural-cyan))/5]'
                        : algo.status === 'EXPLORATION'
                        ? 'border-[hsl(var(--neural-violet))/40] text-[hsl(var(--neural-violet))] bg-[hsl(var(--neural-violet))/5]'
                        : 'border-white/20 text-white/40'
                    }`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {algo.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
