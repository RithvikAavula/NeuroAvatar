interface TimelinePoint {
  label: string;
  sub: string;
  type: "current" | "research" | "future";
}

const points: TimelinePoint[] = [
  { label: "TODAY",     sub: "MOTOR CONTROL",       type: "current"  },
  { label: "NEAR-TERM", sub: "VISUAL FEEDBACK",     type: "research" },
  { label: "MID-TERM",  sub: "MULTIMODAL SENSING",  type: "research" },
  { label: "LONG-TERM", sub: "TWO-WAY INTERFACE",   type: "future"   },
  { label: "VISION",    sub: "PHYSICAL EMBODIMENT", type: "future"   },
];

const darkColors  = { current: "#00d4ff", research: "#c084fc", future: "#e879f9" };
const lightColors = { current: "#0284c7", research: "#6d28d9", future: "#7e22ce" };

export default function FutureTimeline({ visible, isDark }: { visible: boolean; isDark: boolean }) {
  const tc = isDark ? darkColors : lightColors;
  const subColor  = isDark ? "rgba(255,255,255,0.7)" : "hsl(215 30% 22%)";
  const trackBg   = isDark
    ? "linear-gradient(90deg, #00d4ff50, #c084fc60, #e879f950)"
    : "linear-gradient(90deg, #0284c740, #6d28d960, #7e22ce40)";

  return (
    <div style={{
      width: "100%", maxWidth: 760, margin: "0 auto",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          position: "absolute", top: "50%", left: "5%", right: "5%",
          height: 1, background: trackBg, transform: "translateY(-50%)",
        }} />

        {points.map((p, i) => {
          const color = tc[p.type];
          const bgDot = isDark
            ? p.type === "current" ? "rgba(0,212,255,0.15)" : p.type === "research" ? "rgba(167,139,250,0.1)" : "rgba(168,85,247,0.08)"
            : p.type === "current" ? "rgba(2,132,199,0.15)"  : p.type === "research" ? "rgba(109,40,217,0.1)"  : "rgba(124,58,237,0.08)";

          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, zIndex: 1 }}>
              <div style={{ position: "relative" }}>
                {p.type === "current" && (
                  <div style={{
                    position: "absolute", inset: -6, borderRadius: "50%",
                    border: `1px solid ${color}60`, animation: "pulse-ring 2s ease-out infinite",
                  }} />
                )}
                <div style={{
                  width: p.type === "current" ? 14 : 10,
                  height: p.type === "current" ? 14 : 10,
                  borderRadius: "50%", background: bgDot,
                  border: `2px solid ${color}`,
                  boxShadow: `0 0 ${p.type === "current" ? 12 : 6}px ${color}${p.type === "current" ? "80" : "40"}`,
                  transition: "all 0.4s",
                }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, fontWeight: 700,
                  letterSpacing: "0.15em", color, opacity: 0.9, marginBottom: 2,
                }}>{p.label}</div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 7,
                  letterSpacing: "0.1em", color: subColor, whiteSpace: "nowrap",
                }}>{p.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 24 }}>
        {(["current","research","future"] as const).map(t => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: tc[t], boxShadow: `0 0 6px ${tc[t]}` }} />
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: "0.15em",
              color: tc[t], opacity: isDark ? 0.8 : 1, textTransform: "uppercase",
            }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
