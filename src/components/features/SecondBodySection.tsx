import { useState, useEffect } from "react";
import { useInView } from "@/hooks/useInView";

const sequence = [
  { time: "0.0s", human: "RESTING STATE", signal: "Mu rhythm — baseline", robot: "IDLE", note: "Motor system at rest" },
  { time: "0.8s", human: "IMAGINE FORWARD WALK", signal: "Bilateral Cz ERD detected", robot: "FORWARD MOVEMENT INITIATED", note: "Motor intention decoded" },
  { time: "2.1s", human: "INTEND: TURN RIGHT", signal: "Lateralized C4 activation", robot: "RIGHT ROTATION", note: "Direction classified" },
  { time: "3.4s", human: "RIGHT ARM REACH", signal: "C4 desynchronization", robot: "RIGHT ARM EXTENSION +45°", note: "Limb intent decoded" },
  { time: "4.7s", human: "HAND EXTEND", signal: "Extension motor imagery", robot: "GRIPPER OPEN: 80mm", note: "Fine motor intent" },
  { time: "5.9s", human: "STOP INTENTION", signal: "Rest state detected", robot: "ALL MOTION — HALT", note: "Safe stop executed" },
];

export default function SecondBodySection() {
  const { ref, inView } = useInView(0.2);
  const [activeFrame, setActiveFrame] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setActiveFrame(prev => {
        if (prev >= sequence.length - 1) {
          setPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1400);
    return () => clearInterval(interval);
  }, [playing]);

  const frame = sequence[activeFrame];

  return (
    <section className="relative py-32 overflow-hidden bg-background">
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="tech-label mb-4 opacity-50">VISION DEMONSTRATION</div>
          <h2
            className="font-bold gradient-text-white mb-4"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}
          >
            THE SECOND BODY
            <br />
            <span className="gradient-text-cyan">EXPERIENCE</span>
          </h2>
          <p className="opacity-60 max-w-xl mx-auto">
            A simulated scenario demonstrating the long-term vision of direct motor-intention teleoperation.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="tech-label text-amber-400 opacity-80">CONCEPTUAL DEMONSTRATION</span>
          </div>
        </div>

        <div className={`transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {/* Main visualization */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Human side */}
            <div className="glass-panel-bright rounded-2xl p-6 flex flex-col">
              <div className="tech-label mb-4 opacity-95 font-extrabold text-[12.5px]">HUMAN OPERATOR</div>
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                {/* EEG headset icon */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-muted border border-[hsl(var(--neural-cyan))/20] flex items-center justify-center text-3xl">
                    🧑
                  </div>
                  {/* EEG arcs */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 64 64">
                    <path d="M8 32 Q 8 8 32 8 Q 56 8 56 32" fill="none"
                      stroke="hsl(191 100% 50% / 0.4)" strokeWidth="1.5" strokeLinecap="round"
                      strokeDasharray="4 3"
                      style={{ animation: playing ? 'data-flow 1s linear infinite' : 'none' }} />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-[hsl(var(--neural-cyan))] mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {frame.human}
                  </div>
                  <div className="text-[10px] opacity-40">MOTOR INTENTION</div>
                </div>
              </div>
            </div>

            {/* Signal column */}
            <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center">
              <div className="tech-label mb-6 opacity-50 text-center">NEURAL CHANNEL</div>
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="w-full h-px bg-[hsl(var(--border))/30]" />
                <div className={`py-3 px-4 rounded-lg w-full text-center transition-all duration-500 ${playing ? 'border border-[hsl(var(--neural-cyan))/40] bg-[hsl(var(--neural-cyan))/8]' : 'border border-foreground/5'}`}>
                  <div className="tech-label text-[hsl(var(--neural-cyan))]" style={{ fontSize: '9px' }}>
                    {frame.signal}
                  </div>
                </div>
                {/* Animated data line */}
                <div className="w-full h-8 relative overflow-hidden">
                  <svg viewBox="0 0 200 30" className="w-full h-full">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const x = i * 22;
                      const y = 15 + (playing ? Math.sin(i * 1.2 + activeFrame) * 8 : Math.sin(i * 0.5) * 3);
                      return null;
                    })}
                    <polyline
                      points={Array.from({ length: 40 }, (_, i) => {
                        const x = i * 5;
                        const y = 15 + (playing
                          ? Math.sin(i * 0.8 + activeFrame * 2) * 8 + Math.sin(i * 1.5) * 4
                          : Math.sin(i * 0.3) * 3
                        );
                        return `${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke={playing ? 'hsl(191 100% 50%)' : 'hsl(var(--border))'}
                      strokeWidth="1.5"
                      style={{ filter: playing ? 'drop-shadow(0 0 3px hsl(191 100% 50%))' : 'none' }}
                    />
                  </svg>
                </div>
                <div className={`py-2 px-4 rounded text-center text-[10px] font-bold tracking-wider transition-all duration-500 ${playing ? 'text-[hsl(var(--neural-violet))]' : 'text-foreground/20'}`} style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {frame.note}
                </div>
                <div className="w-full h-px bg-[hsl(var(--border))/30]" />
              </div>
              <div className="mt-4 text-[10px] opacity-30 font-mono">t = {frame.time}</div>
            </div>

            {/* Robot side */}
            <div className="glass-panel-bright rounded-2xl p-6 flex flex-col">
              <div className="tech-label mb-4 opacity-95 font-extrabold text-[12.5px]" style={{ color: "hsl(var(--neural-violet))" }}>HUMANOID AVATAR</div>
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-lg bg-muted border border-[hsl(var(--neural-violet))/30] flex items-center justify-center text-3xl"
                    style={{ boxShadow: playing ? '0 0 20px hsl(262 80% 60% / 0.2)' : 'none', transition: 'box-shadow 0.5s ease' }}>
                    🤖
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-xs font-bold mb-1 transition-all duration-500 ${playing ? 'text-[hsl(var(--neural-violet))]' : 'text-foreground/30'}`} style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {frame.robot}
                  </div>
                  <div className="text-[10px] opacity-40">ROBOT EXECUTION</div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="glass-panel rounded-xl p-4 mb-6">
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {sequence.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setPlaying(false); setActiveFrame(i); }}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded transition-all duration-200 ${
                    i === activeFrame
                      ? 'bg-[hsl(var(--neural-cyan))/10] border border-[hsl(var(--neural-cyan))/30]'
                      : 'hover:bg-foreground/5'
                  }`}
                  data-interactive="true"
                >
                  <div className="text-[9px] font-mono text-[hsl(var(--neural-cyan))/60]">{s.time}</div>
                  <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${i === activeFrame ? 'bg-[hsl(var(--neural-cyan))]' : 'bg-foreground/20'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Play button */}
          <div className="flex justify-center">
            <button
              onClick={() => { setActiveFrame(0); setPlaying(true); }}
              disabled={playing}
              className={`px-8 py-4 rounded-lg text-sm font-bold tracking-widest transition-all duration-200 border ${
                playing
                  ? 'border-[hsl(var(--neural-cyan))/40] text-[hsl(var(--neural-cyan))/50] bg-[hsl(var(--neural-cyan))/5]'
                  : 'border-[hsl(var(--neural-cyan))] text-[hsl(var(--neural-cyan))] hover:bg-[hsl(var(--neural-cyan))/10]'
              }`}
              style={{ fontFamily: "'Outfit', sans-serif" }}
              data-interactive="true"
            >
              {playing ? '▶ SEQUENCE RUNNING...' : '▶ PLAY SEQUENCE'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
