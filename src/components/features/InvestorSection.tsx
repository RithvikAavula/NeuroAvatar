import { useInView } from "@/hooks/useInView";
import { useState } from "react";

const visionPipeline = [
  { label: "HUMAN", sublabel: "Motor intention", icon: "◉" },
  { label: "BRAIN", sublabel: "Neural signals", icon: "⟡" },
  { label: "BCI", sublabel: "Signal capture", icon: "⚡" },
  { label: "AI DECODER", sublabel: "Intent extraction", icon: "◈" },
  { label: "HUMANOID", sublabel: "Physical execution", icon: "⊕" },
  { label: "PHYSICAL WORLD", sublabel: "Real interaction", icon: "◎" },
];

const futureChannels = [
  { from: "RESEARCH", to: ["BCI platforms", "Academic licensing"] },
  { from: "HEALTHCARE", to: ["Assistive tech", "Rehab systems"] },
  { from: "TELEPRESENCE", to: ["Enterprise", "Industrial ops"] },
  { from: "PLATFORM", to: ["Developer SDK", "SaaS licensing"] },
];

export default function InvestorSection() {
  const { ref, inView } = useInView(0.15);
  const [formState, setFormState] = useState({ name: '', email: '', org: '', submitted: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, submitted: true }));
  };

  return (
    <section
      id="invest"
      ref={ref}
      className="relative py-32 overflow-hidden"
      style={{ background: 'hsl(var(--surface-1))' }}
    >
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, hsl(38 70% 12% / 0.3), hsl(215 28% 5%))' }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className={`text-center mb-20 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="tech-label mb-4 opacity-50">INVESTOR BRIEF</div>
          <h2
            className="font-bold text-foreground leading-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)', letterSpacing: '-0.03em' }}
          >
            THE NEXT INTERFACE
            <br />
            <span className="gradient-text-cyan">BETWEEN HUMANS</span>
            <br />
            AND MACHINES.
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'hsl(var(--muted-foreground))' }}>
            We are building toward a world where physical presence is no longer limited by the body.
          </p>
        </div>

        {/* Architecture pipeline */}
        <div className={`mb-16 transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="flex flex-wrap items-center justify-center gap-0">
            {visionPipeline.map((node, i) => (
              <div key={node.label} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-16 h-16 rounded-full glass-panel-bright flex items-center justify-center text-2xl"
                    style={{ boxShadow: '0 0 20px hsl(var(--neural-cyan) / 0.1)' }}
                  >
                    {node.icon}
                  </div>
                  <div className="text-center">
                    <div
                      className="text-foreground font-bold"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.08em', fontSize: '10px', opacity: 0.8 }}
                    >
                      {node.label}
                    </div>
                    <div className="text-[9px] opacity-40">{node.sublabel}</div>
                  </div>
                </div>
                {i < visionPipeline.length - 1 && (
                  <div
                    className="w-8 h-px mx-1 relative overflow-hidden mb-6"
                    style={{ background: 'hsl(var(--border) / 0.4)' }}
                  >
                    <div
                      className="absolute h-full w-6 bg-[hsl(var(--neural-cyan))]"
                      style={{ animation: `signal-move ${1 + i * 0.2}s ease-in-out ${i * 0.1}s infinite` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Future expansion */}
        <div className={`grid md:grid-cols-2 gap-8 mb-16 transition-all duration-1000 delay-400 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div>
            <div className="tech-label mb-4 opacity-60">LONG-TERM PLATFORM EXPANSION</div>
            <div className="flex flex-col gap-4">
              {futureChannels.map((channel) => (
                <div key={channel.from} className="glass-panel rounded-xl p-4">
                  <div className="tech-label mb-2" style={{ color: 'hsl(var(--neural-violet))' }}>{channel.from}</div>
                  <div className="flex flex-wrap gap-2">
                    {channel.to.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-1 rounded border text-foreground/60"
                        style={{ borderColor: 'hsl(var(--border))' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="tech-label mb-4 opacity-60">WHY NOW</div>
            <div className="flex flex-col gap-4">
              {[
                { point: "BCI hardware is maturing", detail: "Consumer-grade EEG devices achieving research-quality signals" },
                { point: "Humanoid robotics is accelerating", detail: "Multiple hardware platforms approaching commercial viability" },
                { point: "AI decoding is advancing rapidly", detail: "Deep learning models enabling new EEG classification capabilities" },
                { point: "Market demand is emerging", detail: "Assistive tech, telepresence, and remote work markets expanding" },
              ].map((item) => (
                <div key={item.point} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: 'hsl(var(--neural-cyan))' }} />
                  <div>
                    <div className="text-sm font-semibold text-foreground/90">{item.point}</div>
                    <div className="text-xs opacity-50 mt-0.5">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA form */}
        <div className={`glass-panel-bright rounded-2xl p-8 md:p-12 text-center transition-all duration-1000 delay-600 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="tech-label mb-4">BUILD THE FUTURE WITH US</div>
          <h3 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Request the Investor Deck
          </h3>
          <p className="mb-8 max-w-md mx-auto text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            We are actively seeking research partners and early-stage investors aligned with our mission.
          </p>

          {formState.submitted ? (
            <div className="py-8 flex flex-col items-center gap-3">
              <div
                className="w-12 h-12 rounded-full border flex items-center justify-center text-2xl glow-pulse"
                style={{ borderColor: 'hsl(var(--neural-cyan))', color: 'hsl(var(--neural-cyan))' }}
              >
                ✓
              </div>
              <div className="tech-label">REQUEST RECEIVED</div>
              <p className="text-sm opacity-50">We'll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={formState.name}
                onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg glass-panel outline-none text-foreground text-sm transition-colors duration-200 bg-transparent"
                style={{ fontFamily: "'Inter', sans-serif", border: '1px solid hsl(var(--border) / 0.6)' }}
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={formState.email}
                onChange={e => setFormState(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg glass-panel outline-none text-foreground text-sm transition-colors duration-200 bg-transparent"
                style={{ fontFamily: "'Inter', sans-serif", border: '1px solid hsl(var(--border) / 0.6)' }}
              />
              <input
                type="text"
                placeholder="Organization (optional)"
                value={formState.org}
                onChange={e => setFormState(prev => ({ ...prev, org: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg glass-panel outline-none text-foreground text-sm transition-colors duration-200 bg-transparent"
                style={{ fontFamily: "'Inter', sans-serif", border: '1px solid hsl(var(--border) / 0.6)' }}
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 text-sm font-bold tracking-widest rounded transition-all duration-200"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    background: 'hsl(var(--neural-cyan))',
                    color: 'hsl(var(--background))',
                  }}
                  data-interactive="true"
                >
                  REQUEST DECK
                </button>
                <button
                  type="button"
                  className="flex-1 py-3 px-6 glass-panel text-foreground text-sm font-bold tracking-widest rounded transition-all duration-200"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  data-interactive="true"
                >
                  CONTACT TEAM
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
