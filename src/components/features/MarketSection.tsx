import { useInView } from "@/hooks/useInView";

const businessLayers = [
  { label: "NEUROAVATAR HARDWARE", desc: "BCI headset + humanoid platform", color: "cyan" },
  { label: "BCI SOFTWARE PLATFORM", desc: "Signal processing + decoder stack", color: "violet" },
  { label: "ROBOT CONTROL SOFTWARE", desc: "Whole-body controller + retargeting", color: "cyan" },
  { label: "DEVELOPER SDK", desc: "Third-party integration APIs", color: "violet" },
  { label: "TELEPRESENCE PLATFORM", desc: "End-to-end avatar experience", color: "cyan" },
];

const customers = [
  "Research institutions & universities",
  "Neuroscience & BCI research labs",
  "Healthcare technology companies",
  "Assistive technology organizations",
  "Industrial teleoperation companies",
  "Aerospace / hazardous-environment operators",
  "Robotics platform developers",
  "Defense & public safety agencies",
];

const matrix = [
  { category: "Traditional Robotics", control: "Autonomous / Programmed", intention: "None", embodiment: "Machine", continuous: "N/A" },
  { category: "Voice-Controlled", control: "Voice commands", intention: "High-level verbal", embodiment: "Machine", continuous: "Limited" },
  { category: "AI Autonomous Agents", control: "Goal-based AI", intention: "Task specification", embodiment: "Machine", continuous: "N/A" },
  { category: "Joystick Teleoperation", control: "Manual joystick", intention: "Indirect input", embodiment: "Operator-driven", continuous: "Partial" },
  { category: "NeuroAvatar (Target)", control: "Motor intention", intention: "Direct neural", embodiment: "Physical extension", continuous: "Research goal", highlight: true },
];

export default function MarketSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section id="invest" ref={ref} className="relative py-32 overflow-hidden" style={{ background: 'hsl(220 25% 5%)' }}>
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className={`text-center mb-20 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="tech-label mb-4 opacity-50">MARKET OPPORTUNITY</div>
          <h2
            className="font-bold text-white"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}
          >
            THE PLATFORM <span className="gradient-text-cyan">MODEL</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Business model */}
          <div className={`transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <div className="tech-label mb-6 opacity-60">REVENUE ARCHITECTURE</div>
            <div className="flex flex-col gap-0">
              {businessLayers.map((layer, i) => (
                <div key={layer.label} className="flex flex-col">
                  <div className={`p-4 rounded-lg border ${
                    layer.color === 'cyan'
                      ? 'border-[hsl(var(--neural-cyan))/25] bg-[hsl(var(--neural-cyan))/5]'
                      : 'border-[hsl(var(--neural-violet))/25] bg-[hsl(var(--neural-violet))/5]'
                  }`}>
                    <div className={`tech-label mb-1 ${layer.color === 'cyan' ? 'text-[hsl(var(--neural-cyan))]' : 'text-[hsl(var(--neural-violet))]'}`}>
                      {layer.label}
                    </div>
                    <div className="text-sm opacity-50">{layer.desc}</div>
                  </div>
                  {i < businessLayers.length - 1 && (
                    <div className="w-px h-3 ml-6 bg-white/10" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* TAM/SAM/SOM + customers */}
          <div className={`transition-all duration-1000 delay-400 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="tech-label mb-6 opacity-60">MARKET SIZE (PLACEHOLDER)</div>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { label: "TAM", sublabel: "Total Addressable Market", note: "Insert verified figure" },
                { label: "SAM", sublabel: "Serviceable Market", note: "Insert verified figure" },
                { label: "SOM", sublabel: "Obtainable Market", note: "Insert verified figure" },
              ].map((m) => (
                <div key={m.label} className="glass-panel rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold gradient-text-cyan mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{m.label}</div>
                  <div className="text-xs opacity-40 mb-2">{m.sublabel}</div>
                  <div className="text-[9px] text-amber-400/60 border border-amber-400/20 rounded px-2 py-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{m.note}</div>
                </div>
              ))}
            </div>

            <div className="tech-label mb-4 opacity-60">TARGET CUSTOMER SEGMENTS</div>
            <div className="flex flex-col gap-2">
              {customers.map((c) => (
                <div key={c} className="flex items-center gap-3 text-sm opacity-70">
                  <div className="w-1 h-1 rounded-full bg-[hsl(var(--neural-cyan))/50] flex-shrink-0" />
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Competitive matrix */}
        <div className={`transition-all duration-1000 delay-600 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="tech-label mb-6 opacity-60">COMPETITIVE POSITIONING</div>
          <div className="overflow-x-auto rounded-xl glass-panel">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[hsl(var(--border))/50]">
                  {['APPROACH', 'CONTROL INPUT', 'MOTOR INTENTION', 'EMBODIMENT', 'CONTINUOUS CONTROL'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left tech-label opacity-50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr
                    key={row.category}
                    className={`border-b border-[hsl(var(--border))/30] last:border-0 ${
                      row.highlight ? 'bg-[hsl(var(--neural-cyan))/5]' : ''
                    }`}
                  >
                    <td className={`px-4 py-3 font-semibold text-xs ${row.highlight ? 'text-[hsl(var(--neural-cyan))]' : 'text-white/70'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {row.category}
                    </td>
                    <td className={`px-4 py-3 text-xs ${row.highlight ? 'text-[hsl(var(--neural-cyan))/80]' : 'opacity-50'}`}>{row.control}</td>
                    <td className={`px-4 py-3 text-xs ${row.highlight ? 'text-[hsl(var(--neural-cyan))/80]' : 'opacity-50'}`}>{row.intention}</td>
                    <td className={`px-4 py-3 text-xs ${row.highlight ? 'text-[hsl(var(--neural-cyan))/80]' : 'opacity-50'}`}>{row.embodiment}</td>
                    <td className={`px-4 py-3 text-xs ${row.highlight ? 'text-[hsl(var(--neural-cyan))/80]' : 'opacity-50'}`}>{row.continuous}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs opacity-30 mt-3 text-center">
            Competitive comparison based on publicly known characteristics. Does not constitute verified benchmarking data.
          </p>
        </div>
      </div>
    </section>
  );
}
