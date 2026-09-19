interface Props {
  active: boolean;
  motorActive: boolean;
  activeRegion: string | null;
  hoveredSensor: string | null;
}

export default function RobotFigure({ active, motorActive, activeRegion, hoveredSensor }: Props) {
  const headGlow = motorActive ? "#38bdf8" : active ? "#c084fc" : "#c084fc40";
  const jointColor = motorActive ? "#38bdf8" : "#c084fc";
  const jointGlow = motorActive ? "#38bdf8" : "#c084fc";

  const eyeActive = hoveredSensor === "vision" || motorActive;
  const handActive = hoveredSensor === "touch" || hoveredSensor === "pressure" || activeRegion === "hand";
  const armActive = activeRegion === "arm" || motorActive;
  const legActive = activeRegion === "leg";
  const torsoActive = activeRegion === "torso" || hoveredSensor === "proprioception";

  return (
    <svg viewBox="0 0 120 280" width="120" height="280" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="rHeadGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={headGlow} stopOpacity="0.5" />
          <stop offset="100%" stopColor={headGlow} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rBodyGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.04" />
        </radialGradient>
        <filter id="rGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Head glow aura */}
      <ellipse cx="60" cy="32" rx="36" ry="36" fill="url(#rHeadGlow)"
        style={{ transition: "all 0.6s ease" }} />

      {/* Head — angular robot */}
      <rect x="38" y="12" width="44" height="40" rx="6"
        fill="rgba(167,139,250,0.08)"
        stroke="#c084fc" strokeWidth="1.5"
        style={{ filter: "drop-shadow(0 0 6px #c084fc60)", transition: "all 0.4s" }} />

      {/* Eyes */}
      <rect x="44" y="24" width="12" height="7" rx="2"
        fill={eyeActive ? "#38bdf8" : "#c084fc40"}
        stroke={eyeActive ? "#38bdf8" : "#c084fc"}
        strokeWidth="1"
        style={{ filter: eyeActive ? "drop-shadow(0 0 8px #38bdf8)" : "none", transition: "all 0.4s" }} />
      <rect x="64" y="24" width="12" height="7" rx="2"
        fill={eyeActive ? "#38bdf8" : "#c084fc40"}
        stroke={eyeActive ? "#38bdf8" : "#c084fc"}
        strokeWidth="1"
        style={{ filter: eyeActive ? "drop-shadow(0 0 8px #38bdf8)" : "none", transition: "all 0.4s" }} />

      {/* Camera scan line on eyes */}
      {eyeActive && (
        <>
          <rect x="44" y="24" width="12" height="2" rx="1" fill="#38bdf8" opacity="0.9"
            style={{ animation: "signal-move 1s ease-in-out infinite" }} />
          <rect x="64" y="24" width="12" height="2" rx="1" fill="#38bdf8" opacity="0.9"
            style={{ animation: "signal-move 1s ease-in-out 0.3s infinite" }} />
        </>
      )}

      {/* Neural interface crown */}
      <path d="M42 12 Q60 4 78 12"
        fill="none" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 4px #c084fc)" }} />
      {[42, 51, 60, 69, 78].map((x, i) => (
        <circle key={i} cx={x} cy={i === 2 ? 4 : 12} r="2.5"
          fill={motorActive ? "#38bdf8" : "#c084fc"}
          style={{ filter: `drop-shadow(0 0 4px ${jointGlow})`, transition: "fill 0.4s" }} />
      ))}

      {/* Neck */}
      <rect x="54" y="52" width="12" height="10" rx="2"
        fill="rgba(167,139,250,0.1)" stroke="#c084fc80" strokeWidth="1" />
      <line x1="60" y1="52" x2="60" y2="62" stroke="#c084fc" strokeWidth="0.8" />

      {/* Torso */}
      <path d="M30 62 Q26 80 28 112 Q30 132 60 134 Q90 132 92 112 Q94 80 90 62 Q76 58 60 58 Q44 58 30 62Z"
        fill={torsoActive ? "rgba(192,132,252,0.18)" : "url(#rBodyGrad)"}
        stroke="#c084fc" strokeWidth="1.5"
        style={{ filter: "drop-shadow(0 0 4px #c084fc40)", transition: "fill 0.4s" }} />

      {/* Chest neural core */}
      <circle cx="60" cy="88" r="12"
        fill="none" stroke={motorActive ? "#38bdf8" : "#c084fc"}
        strokeWidth="1.5"
        style={{ filter: `drop-shadow(0 0 8px ${jointGlow})`, transition: "all 0.4s",
          animation: active ? "pulse-ring 2s ease-out infinite" : "none" }} />
      <circle cx="60" cy="88" r="5"
        fill={motorActive ? "#38bdf840" : "#c084fc40"}
        stroke={motorActive ? "#38bdf8" : "#c084fc"}
        strokeWidth="1"
        style={{ transition: "all 0.4s" }} />
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = 60 + Math.cos(rad) * 9;
        const y = 88 + Math.sin(rad) * 9;
        return <circle key={i} cx={x} cy={y} r="1.5"
          fill={motorActive ? "#38bdf8" : "#c084fc"} opacity="0.8" />;
      })}

      {/* Shoulder joints */}
      <circle cx="30" cy="66" r="6"
        fill="none" stroke={jointColor} strokeWidth="1.5"
        style={{ filter: `drop-shadow(0 0 6px ${jointGlow})`, transition: "all 0.4s" }} />
      <circle cx="90" cy="66" r="6"
        fill="none" stroke={jointColor} strokeWidth="1.5"
        style={{ filter: `drop-shadow(0 0 6px ${jointGlow})`, transition: "all 0.4s" }} />

      {/* Left arm */}
      <path d="M26 70 Q14 86 12 110 Q11 120 18 124"
        fill="none"
        stroke={armActive ? "#38bdf8" : "#c084fc80"}
        strokeWidth={armActive ? "2.5" : "1.5"}
        strokeLinecap="round"
        style={{ filter: armActive ? "drop-shadow(0 0 8px #38bdf8)" : "none", transition: "all 0.4s" }} />
      {/* Elbow joint */}
      <circle cx="14" cy="100" r="4"
        fill="none" stroke={armActive ? "#38bdf8" : jointColor} strokeWidth="1.2"
        style={{ transition: "all 0.4s" }} />

      {/* Left hand */}
      <rect x="12" y="120" width="14" height="10" rx="3"
        fill={handActive ? "rgba(56,189,248,0.2)" : "rgba(192,132,252,0.1)"}
        stroke={handActive ? "#38bdf8" : "#c084fc80"}
        strokeWidth={handActive ? "2" : "1"}
        style={{ filter: handActive ? "drop-shadow(0 0 10px #38bdf8)" : "none", transition: "all 0.4s" }} />
      {handActive && (
        <>
          <circle cx="19" cy="118" r="5" fill="none" stroke="#38bdf8" strokeWidth="0.8" opacity="0.6"
            style={{ animation: "ripple 1.5s ease-out infinite" }} />
          <circle cx="19" cy="118" r="9" fill="none" stroke="#38bdf8" strokeWidth="0.5" opacity="0.3"
            style={{ animation: "ripple 1.5s ease-out 0.5s infinite" }} />
        </>
      )}

      {/* Right arm */}
      <path d="M94 70 Q106 86 108 110 Q109 120 102 124"
        fill="none"
        stroke={armActive ? "#38bdf8" : "#c084fc80"}
        strokeWidth={armActive ? "2.5" : "1.5"}
        strokeLinecap="round"
        style={{ filter: armActive ? "drop-shadow(0 0 8px #38bdf8)" : "none", transition: "all 0.4s" }} />
      <circle cx="106" cy="100" r="4"
        fill="none" stroke={armActive ? "#38bdf8" : jointColor} strokeWidth="1.2"
        style={{ transition: "all 0.4s" }} />
      <rect x="94" y="120" width="14" height="10" rx="3"
        fill={handActive ? "rgba(56,189,248,0.2)" : "rgba(192,132,252,0.1)"}
        stroke={handActive ? "#38bdf8" : "#c084fc80"}
        strokeWidth={handActive ? "2" : "1"}
        style={{ filter: handActive ? "drop-shadow(0 0 10px #38bdf8)" : "none", transition: "all 0.4s" }} />

      {/* Hip joints */}
      <circle cx="44" cy="132" r="5"
        fill="none" stroke={jointColor} strokeWidth="1.2"
        style={{ filter: `drop-shadow(0 0 4px ${jointGlow})`, transition: "all 0.4s" }} />
      <circle cx="76" cy="132" r="5"
        fill="none" stroke={jointColor} strokeWidth="1.2"
        style={{ filter: `drop-shadow(0 0 4px ${jointGlow})`, transition: "all 0.4s" }} />

      {/* Left leg */}
      <path d="M42 136 Q38 162 36 192 Q35 212 38 222"
        fill="none"
        stroke={legActive ? "#38bdf8" : "#c084fc70"}
        strokeWidth={legActive ? "2.5" : "1.5"}
        strokeLinecap="round"
        style={{ filter: legActive ? "drop-shadow(0 0 8px #38bdf8)" : "none", transition: "all 0.4s" }} />
      <circle cx="38" cy="172" r="4"
        fill="none" stroke={legActive ? "#38bdf8" : jointColor} strokeWidth="1.2"
        style={{ transition: "all 0.4s" }} />

      {/* Right leg */}
      <path d="M78 136 Q82 162 84 192 Q85 212 82 222"
        fill="none"
        stroke={legActive ? "#38bdf8" : "#c084fc70"}
        strokeWidth={legActive ? "2.5" : "1.5"}
        strokeLinecap="round"
        style={{ filter: legActive ? "drop-shadow(0 0 8px #38bdf8)" : "none", transition: "all 0.4s" }} />
      <circle cx="82" cy="172" r="4"
        fill="none" stroke={legActive ? "#38bdf8" : jointColor} strokeWidth="1.2"
        style={{ transition: "all 0.4s" }} />

      {/* Feet */}
      <path d="M38 222 Q32 230 28 230" fill="none" stroke="#c084fc60" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M82 222 Q88 230 92 230" fill="none" stroke="#c084fc60" strokeWidth="1.5" strokeLinecap="round" />

      {/* Internal structure lines */}
      <line x1="60" y1="62" x2="60" y2="132" stroke="#c084fc30" strokeWidth="0.8" strokeDasharray="3,4" />
      <line x1="36" y1="90" x2="84" y2="90" stroke="#c084fc20" strokeWidth="0.8" strokeDasharray="3,4" />
    </svg>
  );
}
