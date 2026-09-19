import { useEffect, useRef, useState } from "react";

type ThinkStage = "idle" | "thinking" | "transmitting" | "executing";

interface Intent {
  key: string;
  label: string;
  thought: string;
  signal: string;
  color: string;
  icon: string;
  brainRegion: string;
}

interface OneWaySignalBridgeProps {
  stage: ThinkStage;
  selectedIntent: Intent | null;
  activeColor: string;
  cyanAccent: string;
  isDark: boolean;
}

interface Particle {
  t: number;
  lane: number;
  speed: number;
  size: number;
  pulsePhase: number;
  history: { x: number; y: number }[];
}

function bezierCoord(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  if (isNaN(num)) return { r: 0, g: 212, b: 255 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

const LANES = 12;
const PARTICLE_COUNT = 70;

export default function OneWaySignalBridge({
  stage,
  selectedIntent,
  activeColor,
  cyanAccent,
  isDark,
}: OneWaySignalBridgeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [dims, setDims] = useState({ w: 160, h: 460 });

  const isTransmitting = stage === "transmitting";
  const isExecuting = stage === "executing";
  const isThinking = stage === "thinking";
  const isIdle = stage === "idle";

  // Measure container dimensions
  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        setDims({
          w: Math.max(120, Math.round(r.width || 160)),
          h: Math.max(420, Math.round(r.height || 460)),
        });
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Initialize particles strictly flowing Left -> Right (t = 0 to 1)
  const particlesRef = useRef<Particle[]>([]);
  useEffect(() => {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      t: Math.random(),
      lane: i % LANES,
      speed: 0.003 + Math.random() * 0.004,
      size: 1.4 + Math.random() * 2.0,
      pulsePhase: Math.random() * Math.PI * 2,
      history: [],
    }));
  }, []);

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { r, g, b } = hexToRgb(activeColor);
    const cyanRgb = hexToRgb(cyanAccent);
    const W = dims.w;
    const H = dims.h;

    // Retina DPR scaling for crisp graphics
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const centerY = H / 2;

    // Speed multiplier depending on stage
    let speedFactor = 1.0;
    if (isIdle) speedFactor = 0.7;
    else if (isThinking) speedFactor = 1.4;
    else if (isTransmitting) speedFactor = 3.2;
    else if (isExecuting) speedFactor = 2.0;

    function getLaneCoords(lane: number) {
      const norm = (lane / (LANES - 1)) - 0.5; // -0.5 to +0.5
      // Left side: spread out over Human card egress
      const y0 = centerY + norm * (H * 0.74);
      // Center convergence near BCI core with gentle harmonic wave
      const bulge = (lane % 2 === 0 ? 1 : -1) * (10 + (lane % 3) * 4);
      const y1 = centerY + norm * (H * 0.24) + bulge;
      const y2 = centerY + norm * (H * 0.24) - bulge;
      // Right side: spread out entering Humanoid card receiver
      const y3 = centerY + norm * (H * 0.74);

      const x0 = 0;
      const x1 = W * 0.28;
      const x2 = W * 0.72;
      const x3 = W;

      return { x0, y0, x1, y1, x2, y2, x3, y3 };
    }

    function render() {
      ctx!.clearRect(0, 0, W, H);

      // 1. Draw static / pulsing neural fiber tracks
      for (let lane = 0; lane < LANES; lane++) {
        const { x0, y0, x1, y1, x2, y2, x3, y3 } = getLaneCoords(lane);

        ctx!.beginPath();
        ctx!.moveTo(x0, y0);
        ctx!.bezierCurveTo(x1, y1, x2, y2, x3, y3);

        const baseAlpha = isTransmitting
          ? (isDark ? 0.25 : 0.4)
          : isExecuting
          ? (isDark ? 0.18 : 0.32)
          : isThinking
          ? (isDark ? 0.14 : 0.24)
          : (isDark ? 0.08 : 0.16);
        const strokeColor = lane % 2 === 0
          ? `rgba(${r}, ${g}, ${b}, ${baseAlpha})`
          : `rgba(${cyanRgb.r}, ${cyanRgb.g}, ${cyanRgb.b}, ${baseAlpha * 0.9})`;

        ctx!.strokeStyle = strokeColor;
        ctx!.lineWidth = lane % 3 === 0 ? 1.4 : 0.8;
        ctx!.stroke();
      }

      // 2. Draw transmission particles strictly Left -> Right
      particlesRef.current.forEach((p) => {
        const { x0, y0, x1, y1, x2, y2, x3, y3 } = getLaneCoords(p.lane);

        // Current coordinate
        const currentX = bezierCoord(p.t, x0, x1, x2, x3);
        const currentY = bezierCoord(p.t, y0, y1, y2, y3);

        // Maintain tail history (up to 4 points)
        p.history.push({ x: currentX, y: currentY });
        if (p.history.length > 5) p.history.shift();

        // Parabolic alpha fade: 0 at left egress, max at center, 0 at right ingress
        const arcAlpha = Math.sin(p.t * Math.PI);
        const stageBoost = isTransmitting ? 0.95 : isExecuting ? 0.75 : isThinking ? 0.6 : 0.4;
        const finalAlpha = Math.max(0, Math.min(1, arcAlpha * stageBoost));

        // Draw glowing motion trail (comet tail)
        if (p.history.length > 1 && finalAlpha > 0.05) {
          ctx!.beginPath();
          ctx!.moveTo(p.history[0].x, p.history[0].y);
          for (let h = 1; h < p.history.length; h++) {
            ctx!.lineTo(p.history[h].x, p.history[h].y);
          }
          ctx!.strokeStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha * 0.45})`;
          ctx!.lineWidth = p.size * (isTransmitting ? 1.2 : 0.8);
          ctx!.lineCap = "round";
          ctx!.stroke();
        }

        // Draw particle head
        ctx!.beginPath();
        const drawSize = p.size * (isTransmitting ? 1.3 : 1.0);
        ctx!.arc(currentX, currentY, drawSize, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
        ctx!.shadowColor = activeColor;
        ctx!.shadowBlur = isDark ? 10 : 6;
        ctx!.fill();

        // High-energy inner white photon core during active transmission
        if ((isTransmitting || isExecuting) && finalAlpha > 0.3) {
          ctx!.beginPath();
          ctx!.arc(currentX, currentY, drawSize * 0.45, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(255, 255, 255, ${finalAlpha * 0.9})`;
          ctx!.fill();
        }

        ctx!.shadowBlur = 0;

        // Advance particle strictly forward (One-Way: Left -> Right)
        p.t += p.speed * speedFactor;
        if (p.t > 1) {
          p.t = 0;
          p.lane = Math.floor(Math.random() * LANES);
          p.history = [];
        }
      });

      // 3. Ambient terminal glows at left egress (Human) & right ingress (Robot)
      if (isTransmitting || isExecuting) {
        const time = performance.now() * 0.003;
        const pulse = (Math.sin(time) + 1) * 0.5;

        // Human emission node (Left)
        const leftGrad = ctx!.createRadialGradient(0, centerY, 4, 0, centerY, 36);
        leftGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.35 + pulse * 0.25})`);
        leftGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx!.fillStyle = leftGrad;
        ctx!.fillRect(0, centerY - 40, 40, 80);

        // Robot receiver node (Right)
        const rightGrad = ctx!.createRadialGradient(W, centerY, 4, W, centerY, 36);
        rightGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.35 + pulse * 0.25})`);
        rightGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx!.fillStyle = rightGrad;
        ctx!.fillRect(W - 40, centerY - 40, 40, 80);
      }

      animRef.current = requestAnimationFrame(render);
    }

    animRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animRef.current);
  }, [stage, activeColor, cyanAccent, isDark, dims, isTransmitting, isExecuting, isThinking, isIdle]);

  // Status message and badge styling
  let statusText = "STANDBY · AWAITING INTENT";
  let statusSub = "NON-INVASIVE EEG LINK";
  if (isThinking) {
    statusText = "DECODING MOTOR IMAGERY";
    statusSub = selectedIntent ? `${selectedIntent.brainRegion}` : "PROCESSING BRAIN SIGNALS";
  } else if (isTransmitting) {
    statusText = "TRANSMITTING TO AVATAR";
    statusSub = selectedIntent ? `PACKET: ${selectedIntent.label}` : "STREAMING KINEMATICS";
  } else if (isExecuting) {
    statusText = "TELEOPERATION ACTIVE";
    statusSub = "SYNCHRONIZED IN-PLACE MIRROR";
  }

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center select-none"
      style={{
        width: "100%",
        height: 460,
        position: "relative",
      }}
    >
      <style>{`
        @keyframes bridge-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bridge-ping {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes bridge-wave {
          0% { stroke-dashoffset: 60; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes arrow-bounce {
          0%, 100% { transform: translateX(0); opacity: 0.4; }
          50% { transform: translateX(4px); opacity: 1; }
        }
      `}</style>

      {/* Background One-Way Neural Fiber Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Top Protocol Header */}
      <div
        className="relative z-10 mb-auto pt-3 flex flex-col items-center gap-1.5"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border shadow-sm"
          style={{
            background: isDark ? "rgba(10, 16, 30, 0.85)" : "hsl(36 22% 96% / 0.92)",
            borderColor: `${activeColor}55`,
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: activeColor,
              boxShadow: `0 0 8px ${activeColor}`,
              animation: isTransmitting || isExecuting ? "glow-pulse 1.2s ease-in-out infinite" : "none",
            }}
          />
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10.5,
              fontWeight: 800,
              letterSpacing: "0.18em",
              color: activeColor,
            }}
          >
            ONE-WAY BCI STREAM
          </span>
        </div>

        {/* Direction Indicator */}
        <div
          className="flex items-center gap-1.5 text-[10.5px] font-extrabold tracking-[0.22em]"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: isDark ? "rgba(255,255,255,0.75)" : "hsl(215 35% 25%)",
          }}
        >
          <span>HUMAN</span>
          <span
            style={{
              color: activeColor,
              display: "inline-block",
              animation: isTransmitting || isExecuting ? "arrow-bounce 1s ease-in-out infinite" : "none",
            }}
          >
            ➔
          </span>
          <span>ROBOT</span>
        </div>
      </div>

      {/* Center Cybernetic BCI Decoder Core */}
      <div
        className="relative z-10 flex items-center justify-center my-auto"
        style={{ width: 110, height: 110 }}
      >
        {/* Outer Rotating Calibration Ring */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            border: `1px dashed ${activeColor}${isDark ? "40" : "60"}`,
            animation: "bridge-spin 18s linear infinite",
            transition: "border-color 0.5s ease",
          }}
        />

        {/* Middle Diamond Synaptic Ring */}
        <div
          className="absolute rounded-2xl pointer-events-none"
          style={{
            width: 76,
            height: 76,
            border: `1px solid ${activeColor}${isDark ? "30" : "50"}`,
            animation: "bridge-spin 9s linear infinite reverse",
            transition: "border-color 0.5s ease",
          }}
        >
          {/* 4 Corner Synaptic Ticks */}
          {[
            { top: -3, left: -3 },
            { top: -3, right: -3 },
            { bottom: -3, left: -3 },
            { bottom: -3, right: -3 },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                ...pos,
                background: activeColor,
                boxShadow: `0 0 6px ${activeColor}`,
              }}
            />
          ))}
        </div>

        {/* Central Glowing Core Sphere */}
        <div
          className="relative rounded-full flex items-center justify-center transition-all duration-500"
          style={{
            width: 54,
            height: 54,
            background: isDark
              ? `radial-gradient(circle at 35% 35%, ${activeColor}35, rgba(8, 14, 28, 0.95))`
              : `radial-gradient(circle at 35% 35%, ${activeColor}25, hsl(36 22% 98% / 0.95))`,
            border: `2px solid ${activeColor}${isDark ? "85" : "aa"}`,
            boxShadow: `0 0 24px ${activeColor}${isTransmitting ? "75" : isExecuting ? "50" : "25"}, inset 0 0 14px ${activeColor}30`,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {/* Signal Ping Rings during transmission */}
          {(isTransmitting || isThinking) && (
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: `1.5px solid ${activeColor}`,
                animation: "bridge-ping 1.1s ease-out infinite",
              }}
            />
          )}

          {/* Core Animated Glyph / Waveform */}
          <div className="relative flex flex-col items-center justify-center">
            <span
              style={{
                fontSize: 18,
                filter: `drop-shadow(0 0 6px ${activeColor})`,
                transition: "all 0.4s ease",
              }}
            >
              {selectedIntent?.icon ?? "🧠"}
            </span>

            {/* Neural Sine Wave SVG underneath */}
            <svg width="34" height="8" viewBox="0 0 34 8" fill="none" className="mt-0.5 opacity-80">
              <path
                d="M1 4 Q9 0 17 4 T33 4"
                stroke={activeColor}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeDasharray="4 2"
                style={{
                  animation: isTransmitting || isExecuting ? "bridge-wave 1.2s linear infinite" : "none",
                }}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Card */}
      <div
        className="relative z-10 mt-auto pb-2 flex flex-col items-center text-center px-2"
        style={{ pointerEvents: "none", width: "100%" }}
      >
        <div
          className="font-black tracking-[0.16em] text-[11.5px] transition-colors duration-400"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: isTransmitting ? (isDark ? "#34d399" : "#059669") : activeColor,
          }}
        >
          {statusText}
        </div>

        <div
          className="text-[10px] font-bold tracking-[0.12em] mt-1 line-clamp-1"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: isDark ? "rgba(255, 255, 255, 0.75)" : "hsl(215 35% 20%)",
            maxWidth: 160,
          }}
        >
          {statusSub}
        </div>

        <div
          className="mt-1.5 px-3 py-1 rounded border text-[9.5px] font-black tracking-[0.16em]"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            borderColor: `${activeColor}50`,
            background: isDark ? `${activeColor}15` : `${activeColor}18`,
            color: isDark ? "rgba(255, 255, 255, 0.9)" : "hsl(215 45% 12%)",
          }}
        >
          LATENCY &lt; 16ms · 120Hz EEG
        </div>
      </div>
    </div>
  );
}
