import { useState } from "react";
import { useInView } from "@/hooks/useInView";

type CommandKey = 'LEFT HAND' | 'RIGHT HAND' | 'FORWARD' | 'TURN LEFT' | 'TURN RIGHT' | 'ARM RAISE' | 'ARM LOWER' | 'HAND OPEN' | 'HAND CLOSE' | 'STOP';

interface Command {
  label: CommandKey;
  humanPart: string;
  robotAction: string;
  signal: string;
}

const commands: Command[] = [
  { label: 'LEFT HAND', humanPart: 'left-arm', robotAction: 'Left arm extends forward', signal: 'C3 ERD detected' },
  { label: 'RIGHT HAND', humanPart: 'right-arm', robotAction: 'Right arm extends forward', signal: 'C4 ERD detected' },
  { label: 'FORWARD', humanPart: 'legs', robotAction: 'Walk forward (simulated)', signal: 'Cz bilateral ERD' },
  { label: 'TURN LEFT', humanPart: 'torso', robotAction: 'Torso left rotation', signal: 'Lateralized intention' },
  { label: 'TURN RIGHT', humanPart: 'torso', robotAction: 'Torso right rotation', signal: 'Lateralized intention' },
  { label: 'ARM RAISE', humanPart: 'right-arm', robotAction: 'Right arm elevation +60°', signal: 'Shoulder motor intent' },
  { label: 'ARM LOWER', humanPart: 'right-arm', robotAction: 'Right arm lowered -30°', signal: 'Deceleration pattern' },
  { label: 'HAND OPEN', humanPart: 'right-hand', robotAction: 'Gripper open: 90mm', signal: 'Extension imagery' },
  { label: 'HAND CLOSE', humanPart: 'right-hand', robotAction: 'Gripper close: 15mm', signal: 'Flexion imagery' },
  { label: 'STOP', humanPart: 'none', robotAction: 'All motion halted', signal: 'STOP command' },
];

export default function LiveDemoSection() {
  const { ref, inView } = useInView(0.15);
  const [active, setActive] = useState<CommandKey | null>(null);
  const [signalHistory, setSignalHistory] = useState<string[]>([]);

  const activate = (cmd: Command) => {
    setActive(cmd.label);
    setSignalHistory(prev => [`[${new Date().toLocaleTimeString()}] ${cmd.signal} → ${cmd.robotAction}`, ...prev.slice(0, 4)]);
    if (cmd.label !== 'STOP') {
      setTimeout(() => setActive(null), 2000);
    } else {
      setTimeout(() => setActive(null), 500);
    }
  };

  const activeCmd = commands.find(c => c.label === active);

  return (
    <section id="demo" ref={ref} className="relative py-32 overflow-hidden" style={{ background: 'hsl(220 27% 4%)' }}>
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="tech-label mb-4 opacity-50">INTERACTIVE DEMO</div>
          <h2
            className="font-bold text-white mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
          >
            SIMULATED <span className="gradient-text-cyan">CONTROL INTERFACE</span>
          </h2>
          <div className="inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="tech-label text-amber-400 opacity-80">SIMULATED MOTOR-INTENTION INPUT — NOT LIVE CONTROL</span>
          </div>
        </div>

        <div className={`grid lg:grid-cols-3 gap-8 transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {/* Human */}
          <div className="glass-panel-bright rounded-2xl p-6 flex flex-col items-center">
            <div className="tech-label mb-6 opacity-60">HUMAN OPERATOR</div>
            <DemoHumanFigure activePart={activeCmd?.humanPart ?? null} />
            <div className="mt-4 text-center">
              <div className="tech-label opacity-40 mb-1">MOTOR INTENTION</div>
              <div className={`text-sm font-bold transition-all duration-300 ${active ? 'text-[hsl(var(--neural-cyan))]' : 'text-white/30'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {active ? `${active} DETECTED` : 'STANDBY'}
              </div>
            </div>
          </div>

          {/* Signal flow */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col">
            <div className="tech-label mb-6 opacity-60 text-center">NEURAL SIGNAL FLOW</div>

            {/* Signal visualization */}
            <div className="flex-1 flex flex-col justify-center gap-3">
              {['BCI CAPTURE', 'PREPROCESSING', 'DECODER', 'RETARGETING', 'ROBOT COMMAND'].map((stage, i) => (
                <div key={stage} className="flex flex-col items-center gap-0">
                  <div className={`w-full px-4 py-3 rounded-lg text-center text-xs font-bold tracking-wider transition-all duration-300 border ${
                    active
                      ? 'border-[hsl(var(--neural-cyan))/40] bg-[hsl(var(--neural-cyan))/8] text-[hsl(var(--neural-cyan))]'
                      : 'border-white/5 text-white/20'
                  }`} style={{ fontFamily: "'Space Grotesk', sans-serif", transitionDelay: `${i * 60}ms` }}>
                    {stage}
                  </div>
                  {i < 4 && (
                    <div className="w-px h-4 relative overflow-hidden bg-white/5">
                      {active && (
                        <div
                          className="absolute w-full h-3 bg-[hsl(var(--neural-cyan))]"
                          style={{ animation: `signal-move 0.6s ease-in-out ${i * 80}ms infinite` }}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Signal log */}
            <div className="mt-4 glass-panel rounded-lg p-3 font-mono text-xs opacity-50 h-24 overflow-hidden" data-technical="true">
              {signalHistory.length === 0 ? (
                <span className="text-white/30">{'>'} awaiting input<span className="blink">_</span></span>
              ) : (
                signalHistory.map((line, i) => (
                  <div key={i} className={`${i === 0 ? 'text-[hsl(var(--neural-cyan))]' : 'text-white/30'}`}>{line}</div>
                ))
              )}
            </div>
          </div>

          {/* Robot */}
          <div className="glass-panel-bright rounded-2xl p-6 flex flex-col items-center">
            <div className="tech-label mb-6 opacity-60">HUMANOID AVATAR</div>
            <DemoRobotFigure activePart={activeCmd?.humanPart ?? null} />
            <div className="mt-4 text-center">
              <div className="tech-label opacity-40 mb-1">ROBOT ACTION</div>
              <div className={`text-sm font-bold transition-all duration-300 ${active ? 'text-[hsl(var(--neural-violet))]' : 'text-white/30'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {activeCmd?.robotAction ?? 'IDLE'}
              </div>
            </div>
          </div>
        </div>

        {/* Command buttons */}
        <div className={`mt-10 transition-all duration-1000 delay-400 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="tech-label text-center mb-4 opacity-40">SELECT SIMULATED MOTOR-INTENTION INPUT</div>
          <div className="flex flex-wrap justify-center gap-3">
            {commands.map((cmd) => (
              <button
                key={cmd.label}
                onClick={() => activate(cmd)}
                className={`px-5 py-3 rounded-lg text-xs font-bold tracking-wider transition-all duration-200 border ${
                  active === cmd.label
                    ? cmd.label === 'STOP'
                      ? 'border-red-500 bg-red-500/15 text-red-400'
                      : 'border-[hsl(var(--neural-cyan))] bg-[hsl(var(--neural-cyan))/12] text-[hsl(var(--neural-cyan))]'
                    : cmd.label === 'STOP'
                    ? 'border-red-500/30 text-red-400/60 hover:border-red-500/60'
                    : 'glass-panel border-white/10 text-white/60 hover:border-white/25 hover:text-white/80'
                }`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                data-interactive="true"
              >
                {cmd.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoHumanFigure({ activePart }: { activePart: string | null }) {
  const active = (part: string) => activePart === part || activePart === 'none';
  const glow = 'hsl(191 100% 50%)';
  return (
    <svg viewBox="0 0 80 120" className="w-24 h-36">
      <circle cx="40" cy="12" r="10" fill="hsl(220 25% 12%)" stroke={active('head') ? glow : 'hsl(210 20% 30%)'} strokeWidth="1.5" />
      <rect x="28" y="26" width="24" height="30" rx="4" fill="hsl(220 25% 12%)" stroke={active('torso') ? glow : 'hsl(210 20% 30%)'} strokeWidth="1.5" />
      <line x1="28" y1="30" x2="12" y2="55" stroke={activePart === 'left-arm' || activePart === 'right-hand' ? glow : 'hsl(210 20% 30%)'} strokeWidth={activePart === 'left-arm' ? "3" : "1.5"} strokeLinecap="round" style={{ transition: 'all 0.3s ease', filter: activePart === 'left-arm' ? `drop-shadow(0 0 3px ${glow})` : 'none' }} />
      <line x1="52" y1="30" x2="68" y2="55" stroke={activePart === 'right-arm' || activePart === 'right-hand' ? glow : 'hsl(210 20% 30%)'} strokeWidth={activePart === 'right-arm' || activePart === 'right-hand' ? "3" : "1.5"} strokeLinecap="round" style={{ transition: 'all 0.3s ease', filter: activePart === 'right-arm' || activePart === 'right-hand' ? `drop-shadow(0 0 3px ${glow})` : 'none' }} />
      <line x1="35" y1="56" x2="28" y2="90" stroke={activePart === 'legs' ? glow : 'hsl(210 20% 30%)'} strokeWidth={activePart === 'legs' ? "3" : "1.5"} strokeLinecap="round" style={{ filter: activePart === 'legs' ? `drop-shadow(0 0 3px ${glow})` : 'none' }} />
      <line x1="45" y1="56" x2="52" y2="90" stroke={activePart === 'legs' ? glow : 'hsl(210 20% 30%)'} strokeWidth={activePart === 'legs' ? "3" : "1.5"} strokeLinecap="round" style={{ filter: activePart === 'legs' ? `drop-shadow(0 0 3px ${glow})` : 'none' }} />
    </svg>
  );
}

function DemoRobotFigure({ activePart }: { activePart: string | null }) {
  const glow = 'hsl(262 80% 60%)';
  return (
    <svg viewBox="0 0 80 120" className="w-24 h-36">
      <rect x="30" y="4" width="20" height="16" rx="2" fill="hsl(220 25% 10%)" stroke={activePart === 'head' ? glow : 'hsl(210 20% 25%)'} strokeWidth="1.5" />
      <circle cx="36" cy="12" r="2" fill={activePart === 'head' ? glow : 'hsl(210 20% 40%)'} />
      <circle cx="44" cy="12" r="2" fill={activePart === 'head' ? glow : 'hsl(210 20% 40%)'} />
      <rect x="26" y="24" width="28" height="28" rx="2" fill="hsl(220 25% 10%)" stroke={activePart === 'torso' ? glow : 'hsl(210 20% 25%)'} strokeWidth="1.5" />
      <rect x="32" y="30" width="16" height="10" rx="1" fill={activePart === 'torso' ? 'hsl(262 80% 60% / 0.1)' : 'hsl(220 25% 8%)'} stroke={activePart === 'torso' ? glow : 'hsl(210 20% 20%)'} strokeWidth="0.5" />
      <line x1="26" y1="29" x2="10" y2="54" stroke={activePart === 'left-arm' ? glow : 'hsl(210 20% 25%)'} strokeWidth={activePart === 'left-arm' ? "3" : "1.5"} strokeLinecap="square" style={{ filter: activePart === 'left-arm' ? `drop-shadow(0 0 3px ${glow})` : 'none' }} />
      <line x1="54" y1="29" x2="70" y2={activePart === 'right-arm' || activePart === 'right-hand' ? "40" : "54"} stroke={activePart === 'right-arm' || activePart === 'right-hand' ? glow : 'hsl(210 20% 25%)'} strokeWidth={activePart === 'right-arm' || activePart === 'right-hand' ? "3" : "1.5"} strokeLinecap="square" style={{ transition: 'all 0.4s ease', filter: activePart === 'right-arm' || activePart === 'right-hand' ? `drop-shadow(0 0 3px ${glow})` : 'none' }} />
      <line x1="34" y1="52" x2="28" y2={activePart === 'legs' ? "80" : "90"} stroke={activePart === 'legs' ? glow : 'hsl(210 20% 25%)'} strokeWidth={activePart === 'legs' ? "3" : "1.5"} strokeLinecap="square" style={{ transition: 'all 0.4s ease', filter: activePart === 'legs' ? `drop-shadow(0 0 3px ${glow})` : 'none' }} />
      <line x1="46" y1="52" x2="52" y2={activePart === 'legs' ? "80" : "90"} stroke={activePart === 'legs' ? glow : 'hsl(210 20% 25%)'} strokeWidth={activePart === 'legs' ? "3" : "1.5"} strokeLinecap="square" style={{ transition: 'all 0.4s ease', filter: activePart === 'legs' ? `drop-shadow(0 0 3px ${glow})` : 'none' }} />
    </svg>
  );
}
