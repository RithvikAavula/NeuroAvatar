import { useState } from "react";

interface Sensor {
  id: string;
  title: string;
  desc: string;
  status: string;
  statusColor: string;
  lightStatusColor: string;
  animation: React.ReactNode;
}

interface Props {
  onHover: (id: string | null) => void;
  isDark: boolean;
}

function VisionIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48">
      <rect x="6" y="14" width="36" height="24" rx="4" fill="none" stroke={color} strokeWidth="1.5"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      <circle cx="24" cy="26" r="7" fill="none" stroke={color} strokeWidth="1.2" />
      <circle cx="24" cy="26" r="3" fill={`${color}40`} stroke={color} strokeWidth="1" />
      <line x1="6" y1="14" x2="2" y2="10" stroke={color} strokeWidth="1" />
      <line x1="42" y1="14" x2="46" y2="10" stroke={color} strokeWidth="1" />
      <rect x="1" y="7" width="8" height="5" rx="1" fill="none" stroke={`${color}60`} strokeWidth="0.8" />
      <rect x="39" y="7" width="8" height="5" rx="1" fill="none" stroke={`${color}60`} strokeWidth="0.8" />
      <line x1="6" y1="26" x2="10" y2="26" stroke={color} strokeWidth="1" strokeDasharray="2,2"
        style={{ animation: "neural-scan 1.5s linear infinite" }} />
      <line x1="38" y1="26" x2="42" y2="26" stroke={color} strokeWidth="1" strokeDasharray="2,2" />
    </svg>
  );
}

function TouchIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48">
      <circle cx="24" cy="24" r="4" fill={`${color}80`} stroke={color} strokeWidth="1.5" />
      <circle cx="24" cy="24" r="9" fill="none" stroke={color} strokeWidth="1"
        opacity="0.7" style={{ animation: "ripple 2s ease-out infinite" }} />
      <circle cx="24" cy="24" r="15" fill="none" stroke={color} strokeWidth="0.8"
        opacity="0.4" style={{ animation: "ripple 2s ease-out 0.5s infinite" }} />
      <circle cx="24" cy="24" r="21" fill="none" stroke={color} strokeWidth="0.5"
        opacity="0.2" style={{ animation: "ripple 2s ease-out 1s infinite" }} />
    </svg>
  );
}

function PressureIcon({ color }: { color: string }) {
  const rows = 4, cols = 6;
  const vals = [0.2,0.4,0.7,0.7,0.4,0.2, 0.4,0.8,1,1,0.8,0.4, 0.3,0.6,0.9,0.9,0.6,0.3, 0.1,0.3,0.5,0.5,0.3,0.1];
  return (
    <svg viewBox="0 0 48 48" width="48" height="48">
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const v = vals[r * cols + c];
          return (
            <rect key={`${r}-${c}`} x={4 + c * 7} y={8 + r * 8} width="5" height="6" rx="1"
              fill={`${color}${Math.round(v * 0.8 * 255).toString(16).padStart(2,"0")}`}
              stroke={`${color}${Math.round(v * 0.5 * 255).toString(16).padStart(2,"0")}`}
              strokeWidth="0.5" />
          );
        })
      )}
      <rect x="2" y="6" width="44" height="36" rx="3" fill="none" stroke={`${color}60`} strokeWidth="1" />
    </svg>
  );
}

function ProprioceptionIcon({ color }: { color: string }) {
  const joints: [number,number][] = [[24,8],[24,20],[16,28],[32,28],[24,30],[20,40],[28,40]];
  return (
    <svg viewBox="0 0 48 48" width="48" height="48">
      {[
        [24,12,24,20],[24,20,16,28],[24,20,32,28],[24,20,24,30],[24,30,20,40],[24,30,28,40]
      ].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" />
      ))}
      {joints.map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5"
          fill={`${color}40`} stroke={color} strokeWidth="1"
          style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
      ))}
      <circle cx="24" cy="20" r="6" fill="none" stroke={`${color}40`} strokeWidth="0.8"
        style={{ animation: "pulse-ring 2s ease-out infinite" }} />
    </svg>
  );
}

const sensorDefs = [
  { id: "vision",         title: "VISION",         desc: "See through the robot.",                  status: "LONG-TERM", darkColor: "#00d4ff", lightColor: "#0284c7" },
  { id: "touch",          title: "TOUCH",           desc: "Feel contact through the robot.",         status: "RESEARCH",  darkColor: "#c084fc", lightColor: "#6d28d9" },
  { id: "pressure",       title: "PRESSURE",        desc: "Sense force at the end-effectors.",       status: "FUTURE",    darkColor: "#fbbf24", lightColor: "#b45309" },
  { id: "proprioception", title: "PROPRIOCEPTION",  desc: "Know the robot's body configuration.",    status: "RESEARCH",  darkColor: "#e879f9", lightColor: "#7e22ce" },
];

export default function SensorModules({ onHover, isDark }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - rect.top)  / rect.height - 0.5) * 12,
      y: -((e.clientX - rect.left) / rect.width  - 0.5) * 12,
    });
  }

  const cardBg     = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.7)";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const descColor  = isDark ? "rgba(255,255,255,0.82)" : "hsl(215 30% 20%)";
  const cardShadow = isDark ? "0 2px 12px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.06)";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, width: "100%", maxWidth: 560, margin: "0 auto" }}>
      {sensorDefs.map(s => {
        const color = isDark ? s.darkColor : s.lightColor;
        const isHov = hovered === s.id;
        const icon = s.id === "vision"         ? <VisionIcon color={color} />
                   : s.id === "touch"          ? <TouchIcon color={color} />
                   : s.id === "pressure"       ? <PressureIcon color={color} />
                   : <ProprioceptionIcon color={color} />;

        return (
          <div
            key={s.id}
            onMouseEnter={() => { setHovered(s.id); onHover(s.id); }}
            onMouseLeave={() => { setHovered(null); onHover(null); }}
            onMouseMove={handleMouseMove}
            style={{
              position: "relative", padding: "20px 18px", borderRadius: 16,
              background: isHov ? `${color}12` : cardBg,
              border: `1px solid ${isHov ? color + "60" : cardBorder}`,
              boxShadow: isHov ? `0 0 24px ${color}28, 0 8px 32px rgba(0,0,0,${isDark ? 0.3 : 0.1})` : cardShadow,
              transform: isHov
                ? `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
                : "perspective(600px) rotateX(0) rotateY(0) translateY(0)",
              transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
              cursor: "default",
              backdropFilter: "blur(12px)",
            }}
          >
            {isHov && (
              <div style={{ position: "absolute", inset: 0, borderRadius: 16, overflow: "hidden", pointerEvents: "none" }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{
                    position: "absolute", width: 3, height: 3, borderRadius: "50%",
                    background: color, left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 30}%`,
                    opacity: isDark ? 0.4 : 0.25,
                    animation: `float-particle ${2 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            )}

            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ flexShrink: 0, transform: isHov ? "scale(1.1)" : "scale(1)", transition: "transform 0.3s ease" }}>
                {icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.18em", color,
                    textShadow: isHov ? `0 0 8px ${color}` : "none",
                    transition: "text-shadow 0.3s",
                  }}>{s.title}</span>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, fontWeight: 700,
                    letterSpacing: "0.15em", color,
                    border: `1px solid ${color}50`, padding: "2px 6px", borderRadius: 4, opacity: 0.85,
                  }}>{s.status}</span>
                </div>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 13,
                  color: descColor, lineHeight: 1.5, fontWeight: 400, margin: 0,
                }}>{s.desc}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
