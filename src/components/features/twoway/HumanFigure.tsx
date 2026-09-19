interface Props {
  active: boolean;
  feedbackActive: boolean;
  activeRegion: string | null;
}

export default function HumanFigure({ active, feedbackActive, activeRegion }: Props) {
  const headGlow = feedbackActive ? "#c084fc" : active ? "#38bdf8" : "#38bdf840";
  const bodyOpacity = active ? 1 : 0.6;

  return (
    <svg viewBox="0 0 120 280" width="120" height="280" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="hHeadGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={headGlow} stopOpacity="0.5" />
          <stop offset="100%" stopColor={headGlow} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hBodyGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.04" />
        </radialGradient>
        <filter id="hGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Head glow aura */}
      <ellipse cx="60" cy="32" rx="38" ry="38"
        fill="url(#hHeadGlow)"
        style={{ transition: "all 0.6s ease" }}
      />

      {/* Brain visualization */}
      {(active || feedbackActive) && (
        <g opacity="0.5" filter="url(#hGlow)">
          <path d="M48 26 Q52 20 60 22 Q68 20 72 26 Q76 32 72 38 Q68 44 60 44 Q52 44 48 38 Q44 32 48 26Z"
            fill="none" stroke={feedbackActive ? "#c084fc" : "#38bdf8"} strokeWidth="0.8"
            style={{ animation: "pulse-ring 2s ease-out infinite" }} />
          <path d="M54 28 Q58 24 62 28 Q66 32 62 36 Q58 40 54 36 Q50 32 54 28Z"
            fill="none" stroke={feedbackActive ? "#c084fc" : "#38bdf8"} strokeWidth="0.6" />
          <line x1="60" y1="22" x2="60" y2="18" stroke={feedbackActive ? "#c084fc" : "#38bdf8"} strokeWidth="0.8" />
        </g>
      )}

      {/* EEG headset */}
      <g filter="url(#hGlow)">
        <path d="M38 28 Q38 14 60 14 Q82 14 82 28"
          fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <circle cx="38" cy="28" r="3" fill="#38bdf8" opacity="0.9" />
        <circle cx="82" cy="28" r="3" fill="#38bdf8" opacity="0.9" />
        <circle cx="60" cy="14" r="3" fill="#38bdf8" opacity="0.9" />
        <circle cx="46" cy="16" r="2" fill="#38bdf8" opacity="0.7" />
        <circle cx="74" cy="16" r="2" fill="#38bdf8" opacity="0.7" />
      </g>

      {/* Head */}
      <ellipse cx="60" cy="32" rx="20" ry="22"
        fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity={bodyOpacity}
        style={{ filter: "drop-shadow(0 0 6px #38bdf8)" }} />

      {/* Neck */}
      <rect x="55" y="52" width="10" height="12" rx="3"
        fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity={bodyOpacity} />

      {/* Torso */}
      <path d="M32 64 Q28 80 30 110 Q32 130 60 132 Q88 130 90 110 Q92 80 88 64 Q76 60 60 60 Q44 60 32 64Z"
        fill={activeRegion === "torso" ? "rgba(56,189,248,0.15)" : "url(#hBodyGrad)"}
        stroke="#38bdf8" strokeWidth="1.2" opacity={bodyOpacity}
        style={{ transition: "fill 0.4s ease", filter: "drop-shadow(0 0 4px #38bdf840)" }} />

      {/* Left arm */}
      <path d="M32 68 Q18 80 16 108 Q15 118 22 120"
        fill="none"
        stroke={activeRegion === "arm" ? "#38bdf8" : "#38bdf880"}
        strokeWidth={activeRegion === "arm" ? "2.5" : "1.5"}
        strokeLinecap="round"
        style={{ filter: activeRegion === "arm" ? "drop-shadow(0 0 8px #38bdf8)" : "none", transition: "all 0.4s" }} />
      {/* Left hand */}
      <circle cx="22" cy="122" r="5"
        fill="none"
        stroke={activeRegion === "hand" ? "#38bdf8" : "#38bdf860"}
        strokeWidth={activeRegion === "hand" ? "2" : "1.2"}
        style={{ filter: activeRegion === "hand" ? "drop-shadow(0 0 8px #38bdf8)" : "none", transition: "all 0.4s" }} />

      {/* Right arm */}
      <path d="M88 68 Q102 80 104 108 Q105 118 98 120"
        fill="none"
        stroke={activeRegion === "arm" ? "#38bdf8" : "#38bdf880"}
        strokeWidth={activeRegion === "arm" ? "2.5" : "1.5"}
        strokeLinecap="round"
        style={{ filter: activeRegion === "arm" ? "drop-shadow(0 0 8px #38bdf8)" : "none", transition: "all 0.4s" }} />
      <circle cx="98" cy="122" r="5"
        fill="none"
        stroke={activeRegion === "hand" ? "#38bdf8" : "#38bdf860"}
        strokeWidth={activeRegion === "hand" ? "2" : "1.2"}
        style={{ filter: activeRegion === "hand" ? "drop-shadow(0 0 8px #38bdf8)" : "none", transition: "all 0.4s" }} />

      {/* Left leg */}
      <path d="M44 130 Q40 160 38 190 Q37 210 40 220"
        fill="none"
        stroke={activeRegion === "leg" ? "#38bdf8" : "#38bdf870"}
        strokeWidth={activeRegion === "leg" ? "2.5" : "1.5"}
        strokeLinecap="round"
        style={{ filter: activeRegion === "leg" ? "drop-shadow(0 0 8px #38bdf8)" : "none", transition: "all 0.4s" }} />
      {/* Right leg */}
      <path d="M76 130 Q80 160 82 190 Q83 210 80 220"
        fill="none"
        stroke={activeRegion === "leg" ? "#38bdf8" : "#38bdf870"}
        strokeWidth={activeRegion === "leg" ? "2.5" : "1.5"}
        strokeLinecap="round"
        style={{ filter: activeRegion === "leg" ? "drop-shadow(0 0 8px #38bdf8)" : "none", transition: "all 0.4s" }} />

      {/* Feet */}
      <path d="M40 220 Q36 228 32 228" fill="none" stroke="#38bdf860" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M80 220 Q84 228 88 228" fill="none" stroke="#38bdf860" strokeWidth="1.5" strokeLinecap="round" />

      {/* Neural interface chest */}
      {active && (
        <g opacity="0.7">
          <circle cx="60" cy="90" r="8" fill="none" stroke="#38bdf8" strokeWidth="1"
            style={{ animation: "pulse-ring 2.5s ease-out infinite" }} />
          <circle cx="60" cy="90" r="3" fill="#38bdf8" opacity="0.8" />
        </g>
      )}

      {/* EEG waveform when feedback active */}
      {feedbackActive && (
        <g transform="translate(30, 8)">
          <polyline
            points="0,6 4,2 8,10 12,0 16,8 20,4 24,6 28,2 32,8 36,4 40,6 44,2 48,8 52,4 56,6"
            fill="none" stroke="#c084fc" strokeWidth="1.2" opacity="0.8"
            style={{ animation: "neural-scan 1.5s linear infinite" }}
          />
        </g>
      )}
    </svg>
  );
}
