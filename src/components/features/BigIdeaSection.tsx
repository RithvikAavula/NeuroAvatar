import { useState, useEffect } from "react";
import { useInView } from "@/hooks/useInView";
const bodyRegions = [
  { label: "HEAD", humanTop: "8%", robotTop: "8%", delay: 0 },
  { label: "LEFT ARM", humanTop: "30%", robotTop: "30%", delay: 400 },
  { label: "RIGHT ARM", humanTop: "30%", robotTop: "30%", delay: 800 },
  { label: "TORSO", humanTop: "42%", robotTop: "42%", delay: 1200 },
  { label: "LEFT LEG", humanTop: "62%", robotTop: "62%", delay: 1600 },
  { label: "RIGHT LEG", humanTop: "70%", robotTop: "70%", delay: 2000 },
];

export default function BigIdeaSection() {
  const { ref, inView } = useInView(0.2);
  const [activeRegion, setActiveRegion] = useState(0);
  const [cycling, setCycling] = useState(true);

  useEffect(() => {
    if (!cycling) return;
    const interval = setInterval(() => {
      setActiveRegion(prev => (prev + 1) % bodyRegions.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [cycling]);

  return (
    <section className="relative py-32 overflow-hidden" style={{ background: 'hsl(220 25% 5%)' }}>
      <div className="section-divider absolute top-0 left-0 right-0" />

      {/* Background subtle gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, hsl(191 100% 50% / 0.04), transparent)' }}
      />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6">
        <div className={`text-center mb-20 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="tech-label mb-6 opacity-50">THE BIG IDEA</div>
          <h2
            className="font-bold leading-tight text-white"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 3.8rem)', letterSpacing: '-0.02em' }}
          >
            WHAT IF A ROBOT COULD BECOME
            <br />
            <span className="gradient-text-cyan">AN EXTENSION OF YOUR BODY?</span>
          </h2>
        </div>

        <div className={`transition-all duration-1000 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="grid grid-cols-3 gap-8 items-center">
            {/* Human silhouette */}
            <div className="flex flex-col items-center">
              <div className="tech-label mb-6 opacity-60">HUMAN</div>
              <HumanSilhouette activeRegion={activeRegion} />
            </div>

            {/* Connection visualization */}
            <div className="flex flex-col items-center gap-4">
              <div className="tech-label mb-4 opacity-50">NEURAL BRIDGE</div>
              <div className="relative w-full">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[hsl(var(--neural-cyan))/15]" />
                <div className="flex flex-col gap-3 py-4">
                  {bodyRegions.map((region, i) => (
                    <div
                      key={region.label}
                      className={`glass-panel rounded px-3 py-2 text-center transition-all duration-400 ${
                        i === activeRegion
                          ? 'border-[hsl(var(--neural-cyan))/60] bg-[hsl(var(--neural-cyan))/10]'
                          : 'opacity-30'
                      }`}
                    >
                      <div
                        className={`text-xs font-bold tracking-widest transition-colors duration-300 ${
                          i === activeRegion ? 'text-[hsl(var(--neural-cyan))]' : 'text-white/40'
                        }`}
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {region.label}
                      </div>
                      {i === activeRegion && (
                        <div className="mt-1 h-px relative overflow-hidden">
                          <div className="neural-line absolute inset-0 h-full" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="tech-label text-[hsl(var(--neural-cyan))] mt-2"
                style={{ fontSize: '8px' }}
              >
                MOTOR INTENTION → ROBOT MOVEMENT
              </div>
            </div>

            {/* Robot silhouette */}
            <div className="flex flex-col items-center">
              <div className="tech-label mb-6 opacity-60">HUMANOID</div>
              <RobotSilhouette activeRegion={activeRegion} />
            </div>
          </div>

          {/* Region selector buttons */}
          <div className="flex items-center justify-center gap-3 mt-12 flex-wrap">
            {bodyRegions.map((region, i) => (
              <button
                key={region.label}
                onClick={() => { setCycling(false); setActiveRegion(i); }}
                className={`px-4 py-2 rounded text-xs font-bold tracking-widest transition-all duration-200 border ${
                  i === activeRegion
                    ? 'border-[hsl(var(--neural-cyan))] text-[hsl(var(--neural-cyan))] bg-[hsl(var(--neural-cyan))/10]'
                    : 'border-white/10 text-white/40 hover:border-white/30'
                }`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                data-interactive="true"
              >
                {region.label}
              </button>
            ))}
            <button
              onClick={() => setCycling(true)}
              className="px-4 py-2 rounded text-xs font-bold tracking-widest border border-white/20 text-white/50 hover:border-white/40 transition-all duration-200"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              data-interactive="true"
            >
              AUTO
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function HumanSilhouette({ activeRegion }: { activeRegion: number }) {
  const parts = [
    { label: "Head", cx: 50, cy: 10, r: 8, index: 0 },
    { label: "Left Arm", x1: 28, y1: 28, x2: 15, y2: 50, index: 1 },
    { label: "Right Arm", x1: 72, y1: 28, x2: 85, y2: 50, index: 2 },
    { label: "Torso", x: 37, y: 22, w: 26, h: 30, index: 3 },
    { label: "Left Leg", x1: 42, y1: 55, x2: 35, y2: 90, index: 4 },
    { label: "Right Leg", x1: 58, y1: 55, x2: 65, y2: 90, index: 5 },
  ];

  return (
    <svg viewBox="0 0 100 100" className="w-32 h-48">
      {/* Torso */}
      <rect x="37" y="22" width="26" height="30" rx="4"
        fill={activeRegion === 3 ? 'hsl(191 100% 50% / 0.3)' : 'hsl(210 20% 30% / 0.3)'}
        stroke={activeRegion === 3 ? 'hsl(191 100% 50%)' : 'hsl(210 20% 50% / 0.3)'}
        strokeWidth="1"
        style={{ transition: 'all 0.4s ease', filter: activeRegion === 3 ? 'drop-shadow(0 0 4px hsl(191 100% 50%))' : 'none' }}
      />
      {/* Head */}
      <circle cx="50" cy="10" r="8"
        fill={activeRegion === 0 ? 'hsl(191 100% 50% / 0.3)' : 'hsl(210 20% 30% / 0.3)'}
        stroke={activeRegion === 0 ? 'hsl(191 100% 50%)' : 'hsl(210 20% 50% / 0.3)'}
        strokeWidth="1"
        style={{ transition: 'all 0.4s ease', filter: activeRegion === 0 ? 'drop-shadow(0 0 4px hsl(191 100% 50%))' : 'none' }}
      />
      {/* Left arm */}
      <line x1="37" y1="27" x2="20" y2="50"
        stroke={activeRegion === 1 ? 'hsl(191 100% 50%)' : 'hsl(210 20% 50% / 0.3)'}
        strokeWidth={activeRegion === 1 ? "3" : "2"} strokeLinecap="round"
        style={{ transition: 'all 0.4s ease', filter: activeRegion === 1 ? 'drop-shadow(0 0 3px hsl(191 100% 50%))' : 'none' }}
      />
      {/* Right arm */}
      <line x1="63" y1="27" x2="80" y2="50"
        stroke={activeRegion === 2 ? 'hsl(191 100% 50%)' : 'hsl(210 20% 50% / 0.3)'}
        strokeWidth={activeRegion === 2 ? "3" : "2"} strokeLinecap="round"
        style={{ transition: 'all 0.4s ease', filter: activeRegion === 2 ? 'drop-shadow(0 0 3px hsl(191 100% 50%))' : 'none' }}
      />
      {/* Left leg */}
      <line x1="44" y1="52" x2="36" y2="90"
        stroke={activeRegion === 4 ? 'hsl(191 100% 50%)' : 'hsl(210 20% 50% / 0.3)'}
        strokeWidth={activeRegion === 4 ? "3" : "2"} strokeLinecap="round"
        style={{ transition: 'all 0.4s ease', filter: activeRegion === 4 ? 'drop-shadow(0 0 3px hsl(191 100% 50%))' : 'none' }}
      />
      {/* Right leg */}
      <line x1="56" y1="52" x2="64" y2="90"
        stroke={activeRegion === 5 ? 'hsl(191 100% 50%)' : 'hsl(210 20% 50% / 0.3)'}
        strokeWidth={activeRegion === 5 ? "3" : "2"} strokeLinecap="round"
        style={{ transition: 'all 0.4s ease', filter: activeRegion === 5 ? 'drop-shadow(0 0 3px hsl(191 100% 50%))' : 'none' }}
      />
      {/* Signal dot on active part */}
      {activeRegion === 0 && <circle cx="50" cy="10" r="3" fill="hsl(191 100% 50%)" style={{ animation: 'pulse-ring 1s ease-out infinite' }} />}
    </svg>
  );
}

function RobotSilhouette({ activeRegion }: { activeRegion: number }) {
  return (
    <svg viewBox="0 0 100 100" className="w-32 h-48">
      {/* Torso - square robotic */}
      <rect x="35" y="22" width="30" height="28" rx="2"
        fill={activeRegion === 3 ? 'hsl(262 80% 60% / 0.3)' : 'hsl(210 20% 20% / 0.3)'}
        stroke={activeRegion === 3 ? 'hsl(262 80% 60%)' : 'hsl(210 20% 40% / 0.3)'}
        strokeWidth="1"
        style={{ transition: 'all 0.4s ease', filter: activeRegion === 3 ? 'drop-shadow(0 0 4px hsl(262 80% 60%))' : 'none' }}
      />
      {/* Head - robotic */}
      <rect x="40" y="4" width="20" height="14" rx="2"
        fill={activeRegion === 0 ? 'hsl(262 80% 60% / 0.3)' : 'hsl(210 20% 20% / 0.3)'}
        stroke={activeRegion === 0 ? 'hsl(262 80% 60%)' : 'hsl(210 20% 40% / 0.3)'}
        strokeWidth="1"
        style={{ transition: 'all 0.4s ease', filter: activeRegion === 0 ? 'drop-shadow(0 0 4px hsl(262 80% 60%))' : 'none' }}
      />
      {/* Eye dots */}
      <circle cx="46" cy="11" r="1.5" fill={activeRegion === 0 ? 'hsl(191 100% 50%)' : 'hsl(210 20% 50% / 0.5)'} />
      <circle cx="54" cy="11" r="1.5" fill={activeRegion === 0 ? 'hsl(191 100% 50%)' : 'hsl(210 20% 50% / 0.5)'} />
      {/* Neck */}
      <rect x="46" y="18" width="8" height="4" rx="1"
        fill={activeRegion === 0 ? 'hsl(262 80% 60% / 0.2)' : 'hsl(210 20% 20% / 0.2)'}
        stroke={activeRegion === 0 ? 'hsl(262 80% 60% / 0.5)' : 'hsl(210 20% 40% / 0.2)'}
        strokeWidth="0.5"
      />
      {/* Left arm */}
      <line x1="35" y1="27" x2="18" y2="50"
        stroke={activeRegion === 1 ? 'hsl(262 80% 60%)' : 'hsl(210 20% 40% / 0.3)'}
        strokeWidth={activeRegion === 1 ? "3" : "2"} strokeLinecap="square"
        style={{ transition: 'all 0.4s ease', filter: activeRegion === 1 ? 'drop-shadow(0 0 3px hsl(262 80% 60%))' : 'none' }}
      />
      {/* Right arm */}
      <line x1="65" y1="27" x2="82" y2="50"
        stroke={activeRegion === 2 ? 'hsl(262 80% 60%)' : 'hsl(210 20% 40% / 0.3)'}
        strokeWidth={activeRegion === 2 ? "3" : "2"} strokeLinecap="square"
        style={{ transition: 'all 0.4s ease', filter: activeRegion === 2 ? 'drop-shadow(0 0 3px hsl(262 80% 60%))' : 'none' }}
      />
      {/* Left leg */}
      <line x1="44" y1="50" x2="38" y2="90"
        stroke={activeRegion === 4 ? 'hsl(262 80% 60%)' : 'hsl(210 20% 40% / 0.3)'}
        strokeWidth={activeRegion === 4 ? "3" : "2"} strokeLinecap="square"
        style={{ transition: 'all 0.4s ease', filter: activeRegion === 4 ? 'drop-shadow(0 0 3px hsl(262 80% 60%))' : 'none' }}
      />
      {/* Right leg */}
      <line x1="56" y1="50" x2="62" y2="90"
        stroke={activeRegion === 5 ? 'hsl(262 80% 60%)' : 'hsl(210 20% 40% / 0.3)'}
        strokeWidth={activeRegion === 5 ? "3" : "2"} strokeLinecap="square"
        style={{ transition: 'all 0.4s ease', filter: activeRegion === 5 ? 'drop-shadow(0 0 3px hsl(262 80% 60%))' : 'none' }}
      />
      {/* Chest panel detail */}
      <rect x="43" y="28" width="14" height="8" rx="1"
        fill={activeRegion === 3 ? 'hsl(191 100% 50% / 0.15)' : 'hsl(210 20% 15% / 0.3)'}
        stroke={activeRegion === 3 ? 'hsl(191 100% 50% / 0.5)' : 'hsl(210 20% 40% / 0.2)'}
        strokeWidth="0.5"
      />
    </svg>
  );
}
