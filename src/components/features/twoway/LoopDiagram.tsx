interface Props {
  visible: boolean;
  isDark: boolean;
}

const steps = [
  { label: "HUMAN INTENTION", darkColor: "#00d4ff", lightColor: "#0284c7", angle: 270 },
  { label: "ROBOT ACTION",    darkColor: "#60a5fa", lightColor: "#2563eb", angle: 342 },
  { label: "ROBOT SENSATION", darkColor: "#a78bfa", lightColor: "#6d28d9", angle: 54  },
  { label: "HUMAN FEEDBACK",  darkColor: "#a855f7", lightColor: "#7c3aed", angle: 126 },
];

export default function LoopDiagram({ visible, isDark }: Props) {
  const R = 130, cx = 200, cy = 200;

  function polarToXY(angleDeg: number, r: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + Math.cos(rad) * r, y: cy + Math.sin(rad) * r };
  }

  const centerFill   = isDark ? "rgba(10,12,20,0.9)"        : "rgba(240,236,228,0.95)";
  const centerStroke = isDark ? "rgba(167,139,250,0.3)"     : "rgba(109,40,217,0.3)";
  const innerRing    = isDark ? "rgba(56,189,248,0.2)"      : "rgba(2,132,199,0.2)";
  const trackRing    = isDark ? "rgba(255,255,255,0.06)"    : "rgba(0,0,0,0.08)";
  const titleColor   = isDark ? "white"                     : "hsl(215 45% 4%)";
  const subColor1    = isDark ? "rgba(255,255,255,0.5)"     : "hsl(215 30% 30%)";
  const subColor2    = isDark ? "rgba(255,255,255,0.35)"    : "hsl(215 20% 45%)";
  const researchColor = isDark ? "rgba(167,139,250,0.6)"   : "hsl(258 60% 40%)";

  const gradStart = isDark ? "#00d4ff" : "#0284c7";
  const gradMid   = isDark ? "#a78bfa" : "#6d28d9";
  const gradEnd   = isDark ? "#a855f7" : "#7c3aed";

  return (
    <div style={{
      position: "relative", width: "100%", maxWidth: 440, margin: "0 auto",
      opacity: visible ? 1 : 0,
      transform: visible ? "scale(1)" : "scale(0.9)",
      transition: "all 1s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <svg viewBox="0 0 400 400" style={{ width: "100%", overflow: "visible" }}>
        <defs>
          <radialGradient id="loopBg2" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={gradStart} stopOpacity="0.06" />
            <stop offset="100%" stopColor={gradEnd}   stopOpacity="0.02" />
          </radialGradient>
          <linearGradient id="loopGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={gradStart} stopOpacity="0.8" />
            <stop offset="50%"  stopColor={gradMid}   stopOpacity="0.8" />
            <stop offset="100%" stopColor={gradEnd}   stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <circle cx={cx} cy={cy} r={R + 20} fill="url(#loopBg2)" />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={trackRing} strokeWidth="1" strokeDasharray="4,6" />

        <circle cx={cx} cy={cy} r={R}
          fill="none" stroke="url(#loopGrad2)" strokeWidth="2"
          strokeDasharray={`${2 * Math.PI * R * 0.7} ${2 * Math.PI * R * 0.3}`}
          strokeLinecap="round"
          style={{ animation: "slow-rotate 8s linear infinite", transformOrigin: `${cx}px ${cy}px` }}
        />

        {steps.map((s, i) => {
          const color = isDark ? s.darkColor : s.lightColor;
          const pos   = polarToXY(s.angle, R);
          return (
            <g key={i}>
              <circle cx={pos.x} cy={pos.y} r={i === 0 ? 10 : 7}
                fill={`${color}20`} stroke={color} strokeWidth="1.5"
                style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
              {i === 0 && (
                <circle cx={pos.x} cy={pos.y} r={16}
                  fill="none" stroke={color} strokeWidth="0.8" opacity="0.4"
                  style={{ animation: "pulse-ring 2s ease-out infinite" }} />
              )}
            </g>
          );
        })}

        {steps.map((s, i) => {
          const color  = isDark ? s.darkColor : s.lightColor;
          const pos    = polarToXY(s.angle, R + 36);
          const anchor = pos.x < cx - 10 ? "end" : pos.x > cx + 10 ? "start" : "middle";
          return (
            <text key={i} x={pos.x} y={pos.y}
              textAnchor={anchor} dominantBaseline="middle"
              fill={color} fontSize="9"
              fontFamily="'IBM Plex Mono', monospace" fontWeight="700" letterSpacing="0.12em"
              style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
            >{s.label}</text>
          );
        })}

        <circle cx={cx} cy={cy} r={44} fill={centerFill} stroke={centerStroke} strokeWidth="1" />
        <circle cx={cx} cy={cy} r={38}
          fill="none" stroke={innerRing} strokeWidth="0.8" strokeDasharray="3,4"
          style={{ animation: "slow-rotate 12s linear infinite reverse", transformOrigin: `${cx}px ${cy}px` }} />

        <text x={cx} y={cy - 10} textAnchor="middle" fill={titleColor}
          fontSize="13" fontFamily="'Outfit', sans-serif" fontWeight="800" letterSpacing="0.08em">
          NEUROAVATAR
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill={subColor1}
          fontSize="6.5" fontFamily="'IBM Plex Mono', monospace" letterSpacing="0.12em">
          TWO-WAY INTERFACE
        </text>
        <text x={cx} y={cy + 20} textAnchor="middle" fill={subColor2}
          fontSize="6" fontFamily="'IBM Plex Mono', monospace" letterSpacing="0.1em">
          MIND AND MACHINE
        </text>
      </svg>

      <div style={{
        textAlign: "center", marginTop: 8,
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.2em",
        color: researchColor,
      }}>LONG-TERM RESEARCH VISION</div>
    </div>
  );
}
