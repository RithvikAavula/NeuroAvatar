import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useInView } from "@/hooks/useInView";

// Y-band fractions (0 = bottom of model, 1 = top of model)
const bodyRegions = [
  { label: "HEAD",      yMin: 0.83, yMax: 1.00 },
  { label: "LEFT ARM",  yMin: 0.50, yMax: 0.82 },
  { label: "RIGHT ARM", yMin: 0.50, yMax: 0.82 },
  { label: "TORSO",     yMin: 0.40, yMax: 0.82 },
  { label: "LEFT LEG",  yMin: 0.00, yMax: 0.40 },
  { label: "RIGHT LEG", yMin: 0.00, yMax: 0.40 },
];

const CAM_Z          = 3.5;
const FOV            = 42;
const VISIBLE_HEIGHT = 2 * Math.tan((FOV * Math.PI) / 180 / 2) * CAM_Z;
const FILL           = 0.88;

// Cached per-URL fit data (computed once from bounding box)
const fitCache = new Map<string, { autoScale: number; centerY: number }>();

function getFit(url: string, scene: THREE.Object3D) {
  if (fitCache.has(url)) return fitCache.get(url)!;
  const box    = new THREE.Box3().setFromObject(scene);
  const size   = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  const tallest   = Math.max(size.x, size.y, size.z);
  const autoScale = (VISIBLE_HEIGHT * FILL) / tallest;
  const centerY   = -center.y * autoScale;
  const result = { autoScale, centerY };
  fitCache.set(url, result);
  return result;
}

// ── Draggable model ───────────────────────────────────────────────────────────
function DraggableModel({
  url,
  accentHex,
}: {
  url: string;
  accentHex: string;
}) {
  const { scene }  = useGLTF(url);
  const groupRef   = useRef<THREE.Group>(null!);
  const isDragging = useRef(false);
  const prevX      = useRef(0);
  const rotY       = useRef(0);
  const velocity   = useRef(0);
  const { gl }     = useThree();

  const baseClone = useRef<THREE.Object3D | null>(null);
  if (!baseClone.current) baseClone.current = scene.clone(true);

  const fit = getFit(url, scene);
  useEffect(() => {
    const canvas = gl.domElement;
    const onDown = (e: PointerEvent) => {
      isDragging.current = true;
      prevX.current      = e.clientX;
      velocity.current   = 0;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx         = e.clientX - prevX.current;
      velocity.current = dx * 0.012;
      rotY.current    += velocity.current;
      prevX.current    = e.clientX;
    };
    const onUp = () => { isDragging.current = false; };
    canvas.addEventListener("pointerdown",  onDown);
    canvas.addEventListener("pointermove",  onMove);
    canvas.addEventListener("pointerup",    onUp);
    canvas.addEventListener("pointerleave", onUp);
    return () => {
      canvas.removeEventListener("pointerdown",  onDown);
      canvas.removeEventListener("pointermove",  onMove);
      canvas.removeEventListener("pointerup",    onUp);
      canvas.removeEventListener("pointerleave", onUp);
    };
  }, [gl]);

  useFrame(() => {
    if (!groupRef.current) return;
    if (!isDragging.current) {
      velocity.current *= 0.92;
      rotY.current     += velocity.current + 0.003;
    }
    groupRef.current.rotation.y = rotY.current;
  });

  return (
    <group ref={groupRef}>
      <group scale={fit.autoScale} position={[0, fit.centerY, 0]}>
        <primitive object={baseClone.current} />
      </group>
    </group>
  );
}

// Label positions: left-side labels anchor left edge, right-side anchor right edge
const labelPositions: Record<string, { top: string; side: "left" | "right"; offset: string }> = {
  "HEAD":      { top: "5%",  side: "left",  offset: "8%"  },
  "LEFT ARM":  { top: "28%", side: "left",  offset: "4%"  },
  "RIGHT ARM": { top: "28%", side: "right", offset: "4%"  },
  "TORSO":     { top: "46%", side: "left",  offset: "8%"  },
  "LEFT LEG":  { top: "68%", side: "left",  offset: "4%"  },
  "RIGHT LEG": { top: "68%", side: "right", offset: "4%"  },
};

// ── Canvas wrapper ────────────────────────────────────────────────────────────
function ModelViewer({
  url,
  accentHex,
  activeRegion,
}: {
  url: string;
  accentHex: string;
  activeRegion: number;
}) {
  return (
    <div className="relative w-full h-full cursor-grab active:cursor-grabbing" style={{ touchAction: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: FOV }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 6, 4]} intensity={1.2} />
        <pointLight position={[-3, 2, -2]} intensity={0.4} color={accentHex} />
        <Suspense fallback={null}>
          <DraggableModel url={url} accentHex={accentHex} />
          <ContactShadows position={[0, -1.4, 0]} opacity={0.2} scale={4} blur={2} color={accentHex} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      {/* Body part labels */}
      {bodyRegions.map((region, i) => {
        const pos      = labelPositions[region.label];
        const isActive = i === activeRegion;
        return (
          <div
            key={region.label}
            className="pointer-events-none absolute flex items-center gap-2 transition-all duration-300"
            style={{
              top:              pos.top,
              [pos.side]:       pos.offset,
              opacity:          isActive ? 1 : 0.3,
              transform:        isActive ? "scale(1.05)" : "scale(1)",
            }}
          >
            {/* line connector */}
            {pos.side === "right" && (
              <div style={{ width: 20, height: 1, background: isActive ? accentHex : "rgba(255,255,255,0.3)", transition: "all 0.3s" }} />
            )}
            {/* pill label */}
            <div
              style={{
                fontFamily:      "'Outfit', sans-serif",
                fontSize:        isActive ? "11px" : "9px",
                fontWeight:      800,
                letterSpacing:   "0.18em",
                color:           isActive ? "#000" : "rgba(255,255,255,0.6)",
                background:      isActive ? accentHex : "rgba(255,255,255,0.08)",
                border:          `1px solid ${isActive ? accentHex : "rgba(255,255,255,0.15)"}`,
                borderRadius:    4,
                padding:         isActive ? "3px 8px" : "2px 6px",
                whiteSpace:      "nowrap",
                boxShadow:       isActive ? `0 0 12px ${accentHex}, 0 0 24px ${accentHex}55` : "none",
                transition:      "all 0.3s",
              }}
            >
              {region.label}
            </div>
            {pos.side === "left" && (
              <div style={{ width: 20, height: 1, background: isActive ? accentHex : "rgba(255,255,255,0.3)", transition: "all 0.3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function BigIdeaSection() {
  const { ref, inView } = useInView(0.2);
  const [activeRegion, setActiveRegion] = useState(0);
  const [cycling, setCycling]           = useState(true);

  useEffect(() => {
    if (!cycling) return;
    const id = setInterval(() => setActiveRegion(p => (p + 1) % bodyRegions.length), 1200);
    return () => clearInterval(id);
  }, [cycling]);

  return (
    <section className="relative py-32 overflow-hidden bg-background">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, hsl(191 100% 50% / 0.04), transparent)" }}
      />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className={`text-center mb-20 transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="tech-label mb-6 opacity-50">THE BIG IDEA</div>
          <h2
            className="font-bold leading-tight gradient-text-white"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3.8rem)", letterSpacing: "-0.02em" }}
          >
            WHAT IF A ROBOT COULD BECOME
            <br />
            <span className="gradient-text-cyan">AN EXTENSION OF YOUR BODY?</span>
          </h2>
        </div>

        {/* Three-column layout */}
        <div className={`transition-all duration-1000 delay-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="grid grid-cols-3 gap-8 items-start">

            {/* HUMAN — Neural Vanguard */}
            <div className="flex flex-col items-center">
              <div className="tech-label mb-4 opacity-60">HUMAN</div>
              <div
                className="w-full glass-panel rounded-xl overflow-hidden"
                style={{ height: "480px", border: "1px solid hsl(191 100% 50% / 0.15)", boxShadow: "0 0 30px hsl(191 100% 50% / 0.06)" }}
              >
                <ModelViewer
                  url="/Meshy_AI_Neural_Vanguard_0918185718_texture.glb"
                  accentHex="#00d4ff"
                  activeRegion={activeRegion}
                />
              </div>
              <p className="mt-3 text-center opacity-40" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "9px", letterSpacing: "0.15em" }}>
                DRAG TO ROTATE
              </p>
            </div>

            {/* NEURAL BRIDGE */}
            <div className="flex flex-col items-center" style={{ height: "480px" }}>
              <div className="tech-label mb-4 opacity-50">NEURAL BRIDGE</div>
              <div className="relative w-full flex-1 flex flex-col">
                <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: "hsl(191 100% 50% / 0.12)" }} />
                <div className="flex flex-col flex-1 justify-between py-2">
                  {bodyRegions.map((region, i) => (
                    <div
                      key={region.label}
                      className={`glass-panel rounded px-3 py-2 text-center transition-all duration-400 ${
                        i === activeRegion
                          ? "border-[hsl(var(--neural-cyan))/60] bg-[hsl(var(--neural-cyan))/10]"
                          : "opacity-30"
                      }`}
                    >
                      <div
                        className={`text-xs font-bold tracking-widest transition-colors duration-300 ${
                          i === activeRegion ? "text-[hsl(var(--neural-cyan))]" : "text-foreground/40"
                        }`}
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        {region.label}
                      </div>
                      {i === activeRegion && (
                        <div className="mt-1 h-px relative overflow-hidden">
                          <div className="neural-line absolute inset-0 h-full" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="tech-label text-[hsl(var(--neural-cyan))] mt-3" style={{ fontSize: "8px" }}>
                MOTOR INTENTION → ROBOT MOVEMENT
              </div>
            </div>

            {/* HUMANOID — Cybernetic Sentinel */}
            <div className="flex flex-col items-center">
              <div className="tech-label mb-4 opacity-60">HUMANOID</div>
              <div
                className="w-full glass-panel rounded-xl overflow-hidden"
                style={{ height: "480px", border: "1px solid hsl(262 80% 60% / 0.15)", boxShadow: "0 0 30px hsl(262 80% 60% / 0.06)" }}
              >
                <ModelViewer
                  url="/Meshy_AI_Cybernetic_Sentinel_0918184736_texture.glb"
                  accentHex="#a855f7"
                  activeRegion={activeRegion}
                />
              </div>
              <p className="mt-3 text-center opacity-40" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "9px", letterSpacing: "0.15em" }}>
                DRAG TO ROTATE
              </p>
            </div>
          </div>

          {/* Region selector buttons */}
          <div className="flex items-center justify-center gap-3 mt-12 flex-wrap">
            {bodyRegions.map((region, i) => (
              <button
                key={region.label}
                onClick={() => { setCycling(false); setActiveRegion(i); }}
                className={`px-4 py-2 rounded text-xs font-bold tracking-widest transition-all duration-200 border ${
                  i === activeRegion
                    ? "border-[hsl(var(--neural-cyan))] text-[hsl(var(--neural-cyan))] bg-[hsl(var(--neural-cyan))/10]"
                    : "border-foreground/10 text-foreground/40 hover:border-foreground/30"
                }`}
                style={{ fontFamily: "'Outfit', sans-serif" }}
                data-interactive="true"
              >
                {region.label}
              </button>
            ))}
            <button
              onClick={() => setCycling(true)}
              className="px-4 py-2 rounded text-xs font-bold tracking-widest border border-foreground/20 text-foreground/50 hover:border-foreground/40 transition-all duration-200"
              style={{ fontFamily: "'Outfit', sans-serif" }}
              data-interactive="true"
            >
              AUTO
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
