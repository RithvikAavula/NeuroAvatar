import { useEffect, useRef } from "react";

interface Props {
  mode: "motor" | "sensory" | "full";
  width: number;
  height: number;
  isDark: boolean;
}

interface Particle {
  t: number;
  speed: number;
  lane: number;
  size: number;
  dir: "fwd" | "bwd";
}

function bezierY(t: number, y0: number, y1: number, y2: number, y3: number) {
  const u = 1 - t;
  return u*u*u*y0 + 3*u*u*t*y1 + 3*u*t*t*y2 + t*t*t*y3;
}
function bezierX(t: number, x0: number, x1: number, x2: number, x3: number) {
  const u = 1 - t;
  return u*u*u*x0 + 3*u*u*t*x1 + 3*u*t*t*x2 + t*t*t*x3;
}

const LANES = 12;

export default function NeuralBridgeCanvas({ mode, width, height, isDark }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    particles.current = Array.from({ length: 100 }, (_, i) => ({
      t:     Math.random(),
      speed: 0.003 + Math.random() * 0.004,
      lane:  Math.floor(Math.random() * LANES),
      size:  1.2 + Math.random() * 2.2,
      dir:   i % 2 === 0 ? "fwd" : "bwd",
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Colors adapt to theme
    const fwdColor  = isDark ? "0,212,255"   : "2,132,199";   // cyan
    const bwdColor  = isDark ? "168,85,247"  : "124,58,237";  // violet
    const fwdGlow   = isDark ? "#00d4ff"     : "#0284c7";
    const bwdGlow   = isDark ? "#a855f7"     : "#7c3aed";
    const fiberFwd  = isDark ? "rgba(0,212,255,0.05)"  : "rgba(2,132,199,0.08)";
    const fiberBwd  = isDark ? "rgba(168,85,247,0.05)" : "rgba(124,58,237,0.08)";

    const cx     = width / 2;
    const topY   = height * 0.04;
    const bottomY = height * 0.96;

    function getLaneX(lane: number) {
      const spread = width * 0.7;
      return cx - spread / 2 + (lane / (LANES - 1)) * spread;
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      for (let lane = 0; lane < LANES; lane++) {
        const lx    = getLaneX(lane);
        const bulge = (lane % 3 === 0 ? 1 : lane % 3 === 1 ? -1 : 0.4) * 18;
        ctx!.beginPath();
        ctx!.moveTo(cx, topY);
        ctx!.bezierCurveTo(lx + bulge, height * 0.3, lx - bulge, height * 0.7, cx, bottomY);
        ctx!.strokeStyle = lane % 2 === 0 ? fiberFwd : fiberBwd;
        ctx!.lineWidth = 1;
        ctx!.stroke();
      }

      particles.current.forEach(p => {
        const isFwd = p.dir === "fwd";
        if (isFwd  && mode === "sensory") return;
        if (!isFwd && mode === "motor")   return;

        const lx    = getLaneX(p.lane);
        const bulge = (p.lane % 3 === 0 ? 1 : p.lane % 3 === 1 ? -1 : 0.4) * 18;
        const t     = isFwd ? p.t : 1 - p.t;

        const x = bezierX(t, cx, lx + bulge, lx - bulge, cx);
        const y = bezierY(t, topY, height * 0.3, height * 0.7, bottomY);

        const alpha = Math.sin(p.t * Math.PI) * 0.85 + 0.15;
        const col   = isFwd ? fwdColor : bwdColor;
        ctx!.beginPath();
        ctx!.arc(x, y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${col},${alpha})`;
        ctx!.shadowColor = isFwd ? fwdGlow : bwdGlow;
        ctx!.shadowBlur  = isDark ? 8 : 5;
        ctx!.fill();
        ctx!.shadowBlur  = 0;

        p.t += p.speed;
        if (p.t > 1) p.t = 0;
      });

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [mode, width, height, isDark]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
    />
  );
}
