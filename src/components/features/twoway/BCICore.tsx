interface Props {
  mode: "motor" | "sensory" | "full";
  active: boolean;
  isDark: boolean;
}

export default function BCICore({ mode, active, isDark }: Props) {
  const color  = mode === "motor" ? "#00d4ff" : mode === "sensory" ? "#a855f7" : "#7c3aed";
  const color2 = mode === "motor" ? "#0ea5e9" : mode === "sensory" ? "#7c3aed" : "#00d4ff";

  // In light mode reduce glow opacity so it doesn't bleed on white bg
  const ringOpacity = isDark ? ["30","50","80"] : ["40","60","90"];
  const glowStr     = isDark ? ["20","40"] : ["30","50"];

  return (
    <div style={{ position: "relative", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {[56, 44, 32].map((r, i) => (
        <div key={i} style={{
          position: "absolute",
          width: r * 2, height: r * 2, borderRadius: "50%",
          border: `1px solid ${color}${ringOpacity[i]}`,
          boxShadow: `0 0 ${8 + i * 4}px ${color}${glowStr[i === 0 ? 0 : 1]}`,
          animation: `slow-rotate ${6 + i * 3}s linear infinite${i % 2 === 1 ? " reverse" : ""}`,
          transition: "border-color 0.6s, box-shadow 0.6s",
        }}>
          {i === 1 && [0, 90, 180, 270].map((deg, j) => {
            const rad = (deg * Math.PI) / 180;
            const x = 44 + Math.cos(rad) * 44 - 3;
            const y = 44 + Math.sin(rad) * 44 - 3;
            return (
              <div key={j} style={{
                position: "absolute", left: x, top: y,
                width: 6, height: 6, borderRadius: "50%",
                background: color, boxShadow: `0 0 8px ${color}`,
              }} />
            );
          })}
        </div>
      ))}

      {/* Core sphere */}
      <div style={{
        position: "relative", width: 48, height: 48, borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${color2}50, ${color}18)`,
        border: `2px solid ${color}`,
        boxShadow: `0 0 20px ${color}70, 0 0 40px ${color}28, inset 0 0 16px ${color}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: active ? "glow-breathe 2s ease-in-out infinite" : "none",
        transition: "all 0.6s ease", zIndex: 2,
        backdropFilter: isDark ? "none" : "blur(4px)",
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 700,
          color, letterSpacing: "0.1em", textShadow: `0 0 8px ${color}`,
        }}>BCI</span>
      </div>

      {/* Waveform arc */}
      <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} viewBox="0 0 120 120">
        <path
          d="M20 60 Q30 45 40 60 Q50 75 60 60 Q70 45 80 60 Q90 75 100 60"
          fill="none" stroke={color} strokeWidth="1.2" opacity="0.5"
          strokeDasharray="4 3"
          style={{ animation: "neural-scan 2s linear infinite" }}
        />
      </svg>

      <div style={{
        position: "absolute", bottom: -28, left: "50%", transform: "translateX(-50%)",
        textAlign: "center", whiteSpace: "nowrap",
      }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.2em",
          color, opacity: isDark ? 0.9 : 1,
        }}>NEURAL INTERFACE</div>
      </div>
    </div>
  );
}
