import { Suspense, useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useInView } from "@/hooks/useInView";
import { useTheme } from "@/hooks/useTheme";
import OneWaySignalBridge from "./demo/OneWaySignalBridge";

type ActionKey = "dance" | "run" | "box" | "agree";
type ThinkStage = "idle" | "thinking" | "transmitting" | "executing";

interface Intent {
  key: ActionKey;
  label: string;
  thought: string;
  signal: string;
  color: string;
  icon: string;
  robotGlb: string;
  animName: string;
  brainRegion: string;
}

const INTENTS: Intent[] = [
  {
    key: "dance", label: "DANCE", icon: "🕺", color: "#f472b6",
    thought: "Rhythmic full-body movement",
    signal: "Bilateral limb coordination pattern",
    brainRegion: "Motor Cortex · Cerebellum",
    robotGlb: "/Meshy_AI_Cybernetic_Sentinel_All_Night_Dance.glb",
    animName: "All_Night_Dance",
  },
  {
    key: "run", label: "RUN", icon: "🏃", color: "#34d399",
    thought: "Forward locomotion imagery",
    signal: "Gait pattern — SMA activation",
    brainRegion: "SMA · Basal Ganglia",
    robotGlb: "/Meshy_AI_Cybernetic_Sentinel_Running.glb",
    animName: "Running",
  },
  {
    key: "box", label: "STRIKE", icon: "🥊", color: "#f97316",
    thought: "Rapid arm extension imagery",
    signal: "Upper limb ERD — M1 activation",
    brainRegion: "Primary Motor Cortex",
    robotGlb: "/Meshy_AI_Cybernetic_Sentinel_Boxing_Practice.glb",
    animName: "Boxing_Practice",
  },
  {
    key: "agree", label: "AGREE", icon: "👍", color: "#00d4ff",
    thought: "Affirmative gesture imagery",
    signal: "Premotor cortex — gesture encoding",
    brainRegion: "Premotor Cortex · PMC",
    robotGlb: "/Meshy_AI_Cybernetic_Sentinel_Agree_Gesture.glb",
    animName: "Agree_Gesture",
  },
];

const fitCache = new Map<string, { scale: number; offsetY: number }>();

function fitScene(scene: THREE.Object3D, fill = 0.64, cacheKey?: string, cameraZ = 3.6) {
  const key = cacheKey ? `${cacheKey}-${fill}-${cameraZ}` : null;
  if (key && fitCache.has(key)) {
    return fitCache.get(key)!;
  }
  const box = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  const visH = 2 * Math.tan((42 * Math.PI) / 360) * cameraZ;
  const s = (visH * fill) / Math.max(size.x, size.y, size.z);
  const result = { scale: s, offsetY: -center.y * s };
  if (key) {
    fitCache.set(key, result);
  }
  return result;
}

// ── Human model ────────────────────────────────────────────────────────────
type HumanModelProps = Readonly<{ thinking: boolean; color: string }>;

function HumanModel({ thinking, color }: HumanModelProps) {
  const { scene } = useGLTF("/Meshy_AI_Neural_Vanguard_0918185718_texture.glb");
  const groupRef = useRef<THREE.Group>(null!);
  const { scale, offsetY } = fitScene(scene, 0.85, "human-operator");
  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.y += dt * (thinking ? 1.6 : 0.35);
  });
  return (
    <group ref={groupRef}>
      {thinking && <pointLight position={[0, 1.5, 1.5]} intensity={4} color={color} distance={5} />}
      <group scale={scale} position={[0, offsetY, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

// ── Idle robot (base texture GLB, no animation) ────────────────────────────
type IdleRobotMeshProps = Readonly<{
  opacity: React.MutableRefObject<number>;
  stage: ThinkStage;
}>;

function IdleRobotMesh({ opacity, stage }: IdleRobotMeshProps) {
  const { scene } = useGLTF("/Meshy_AI_Cybernetic_Sentinel_0918184736_texture.glb");
  const groupRef = useRef<THREE.Group>(null!);
  // Use consistent scale matching ActionRobotMesh so model does not shrink or pop
  const { scale, offsetY } = fitScene(scene, 0.85, "robot-sentinel-idle");

  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m: THREE.Material) => {
          m.transparent = false;
          m.opacity = 1;
        });
      }
    });
  }, [scene]);

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    if (stage === "transmitting") {
      // Smoothly orient towards front in anticipation of executing the action
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, dt * 5);
    } else if (stage === "idle" || stage === "thinking") {
      groupRef.current.rotation.y += dt * 0.35;
    }
    groupRef.current.visible = opacity.current > 0.5;
  });

  return (
    <group ref={groupRef}>
      <group scale={scale} position={[0, offsetY, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

// ── Action robot (animation GLB) ───────────────────────────────────────────
type ActionRobotMeshProps = Readonly<{
  intent: Intent;
  opacities: React.MutableRefObject<Record<ActionKey, number>>;
}>;

function ActionRobotMesh({
  intent, opacities,
}: ActionRobotMeshProps) {
  const { scene, animations } = useGLTF(intent.robotGlb);
  const groupRef = useRef<THREE.Group>(null!);

  // Strip lateral (X) and depth (Z) root-motion drift across ALL actions (dance, run, strike, agree),
  // guaranteeing the humanoid performs in-place without crosscutting or clipping the card boundaries,
  // while preserving natural vertical bounce and motion dynamics (Y).
  const inPlaceAnimations = useMemo(() => {
    return animations.map((clip) => {
      const cloned = clip.clone();
      cloned.tracks = cloned.tracks.map((track) => {
        if (
          track.name.toLowerCase().includes("hips.position") ||
          track.name.toLowerCase().includes("hips.translation")
        ) {
          const cloneTrack = track.clone();
          const vals = cloneTrack.values;
          // Compensate lateral center per action:
          // Dance has arm choreography swinging slightly left (-0.158m), so +0.158 centers it
          // Run, Strike, and Agree are already symmetric around 0
          const lateralOffset = intent.key === "dance" ? 0.158 : 0;
          for (let i = 0; i < vals.length; i += 3) {
            vals[i] = lateralOffset; // Center lateral root position
            vals[i + 2] = 0;         // Lock depth root position
          }
          return cloneTrack;
        }
        return track;
      });
      return cloned;
    });
  }, [animations, intent.key]);

  const { actions } = useAnimations(inPlaceAnimations, groupRef);
  // Consistent fill ratio with IdleRobotMesh ensuring no size jump and ample headroom for all actions
  const { scale, offsetY } = fitScene(scene, 0.85, `robot-action-${intent.key}`);
  const startedRef = useRef(false);
  const wasActiveRef = useRef(opacities.current[intent.key] > 0.5);

  // Optimal showcase orientation for each action:
  // Run: 0.38 rad (~22 deg) dynamic angle showcasing running gait and stride
  // Strike (Box): -0.22 rad (~-12.5 deg) orthodox boxing stance angle
  // Dance & Agree: 0 rad (facing front)
  const targetAngle = intent.key === "run" ? 0.38 : intent.key === "box" ? -0.22 : 0;

  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m: THREE.Material) => { m.transparent = false; m.opacity = 1; });
      }
    });
  }, [scene]);

  // start animation immediately on mount — it runs hidden until crossfade
  useEffect(() => {
    if (startedRef.current) return;
    const actionName = Object.keys(actions).find((name) =>
      name === intent.animName || name.startsWith(`${intent.animName}.`),
    );
    const action = actionName ? actions[actionName] : actions[Object.keys(actions)[0]];
    if (action) {
      startedRef.current = true;
      action.reset().setLoop(THREE.LoopRepeat, Infinity).play();
    }
  }, [actions]);

  useFrame((_, dt) => {
    const isActive = opacities.current[intent.key] > 0.5;
    if (groupRef.current) {
      groupRef.current.visible = isActive;
      if (isActive) {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          targetAngle,
          dt * 5,
        );
      } else {
        groupRef.current.rotation.y = 0;
      }
    }

    // When becoming active, synchronize and play smoothly from the beginning
    if (isActive && !wasActiveRef.current) {
      const actionName = Object.keys(actions).find((name) =>
        name === intent.animName || name.startsWith(`${intent.animName}.`),
      );
      const action = actionName ? actions[actionName] : actions[Object.keys(actions)[0]];
      if (action) {
        action.reset().fadeIn(0.2).play();
      }
    } else if (!isActive && wasActiveRef.current) {
      const actionName = Object.keys(actions).find((name) =>
        name === intent.animName || name.startsWith(`${intent.animName}.`),
      );
      const action = actionName ? actions[actionName] : actions[Object.keys(actions)[0]];
      if (action) {
        action.fadeOut(0.2);
      }
    }
    wasActiveRef.current = isActive;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <group scale={scale} position={[0, offsetY, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

// ── Crossfade controller ───────────────────────────────────────────────────
type CrossfadeControllerProps = Readonly<{
  intentKey: ActionKey | null;
  executing: boolean;
  accentColor: string;
  stage: ThinkStage;
}>;

function CrossfadeController({
  intentKey, executing, accentColor, stage,
}: CrossfadeControllerProps) {
  const idleOpacity = useRef(executing && intentKey ? 0 : 1);
  const actionOpacities = useRef<Record<ActionKey, number>>({
    dance: executing && intentKey === "dance" ? 1 : 0,
    run:   executing && intentKey === "run"   ? 1 : 0,
    box:   executing && intentKey === "box"   ? 1 : 0,
    agree: executing && intentKey === "agree" ? 1 : 0,
  });

  useFrame(() => {
    const targetIdle = executing && intentKey ? 0 : 1;
    idleOpacity.current = targetIdle;
    (Object.keys(actionOpacities.current) as ActionKey[]).forEach((k) => {
      const target = executing && intentKey === k ? 1 : 0;
      actionOpacities.current[k] = target;
    });
  });

  return (
    <>
      <IdleRobotMesh opacity={idleOpacity} stage={stage} />
      {INTENTS.map((intent) => (
        <ActionRobotMesh key={intent.key} intent={intent} opacities={actionOpacities} />
      ))}
      {executing && <pointLight position={[0, 2, 2]} intensity={1.8} color={accentColor} />}
    </>
  );
}

// ── Thinking overlay on human card ─────────────────────────────────────────
type ThinkingOverlayProps = Readonly<{ stage: ThinkStage; intent: Intent | null }>;

function ThinkingOverlay({ stage, intent }: ThinkingOverlayProps) {
  if (stage === "idle" || !intent) return null;
  const c = intent.color;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none", borderRadius: 16, overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 50% 15%, ${c}28 0%, transparent 65%)`,
        animation: "demo-breathe 1.1s ease-in-out infinite",
      }} />
      {stage === "thinking" && (
        <div style={{
          position: "absolute", left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${c}dd, transparent)`,
          animation: "demo-scan 1s ease-in-out infinite",
        }} />
      )}
      {stage === "thinking" && [
        { x: "22%", y: "14%" }, { x: "50%", y: "9%" }, { x: "78%", y: "14%" },
        { x: "32%", y: "26%" }, { x: "68%", y: "26%" },
      ].map((p, i) => (
        <div key={`${p.x}-${p.y}`} style={{
          position: "absolute", left: p.x, top: p.y,
          width: 7, height: 7, borderRadius: "50%", background: c,
          animation: `demo-node 0.75s ${i * 0.15}s ease-in-out infinite`,
        }} />
      ))}
      <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 900,
          letterSpacing: "0.18em", color: c,
          background: `${c}22`, border: `1.5px solid ${c}80`,
          padding: "6px 16px", borderRadius: 7, backdropFilter: "blur(8px)",
          boxShadow: `0 0 16px ${c}40`,
        }}>
          {stage === "thinking" ? `IMAGINING: ${intent.label}` : "SIGNAL CAPTURED"}
        </div>
      </div>
    </div>
  );
}

// ── Main section ───────────────────────────────────────────────────────────
export default function DemoSection() {
  const { ref: sectionRef, inView } = useInView(0.1);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [selected, setSelected] = useState<Intent | null>(null);
  const [stage, setStage] = useState<ThinkStage>("idle");
  const [phase, setPhase] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const cyanAccent   = isDark ? "#00d4ff" : "#0284c7";
  const purpleAccent = isDark ? "#c084fc" : "#6d28d9";
  const activeColor = selected?.color ?? cyanAccent;
  const isTransmitting = stage === "transmitting";
  const isExecuting    = stage === "executing";
  const busy = stage === "thinking" || stage === "transmitting";
  let signalColor = "hsl(var(--muted-foreground))";
  let signalStatus = "AWAITING INTENT";
  if (isTransmitting) {
    signalColor = activeColor;
    signalStatus = "TRANSMITTING...";
  } else if (isExecuting) {
    signalColor = "#34d399";
    signalStatus = "SIGNAL RECEIVED";
  }

  useEffect(() => {
    if (inView && phase === 0) setTimeout(() => setPhase(1), 200);
  }, [inView]);

  function handleSelect(intent: Intent) {
    if (busy) return;
    timers.current.forEach(clearTimeout);
    setSelected(intent);
    setStage("thinking");
    timers.current = [
      setTimeout(() => setStage("transmitting"), 1700),
      setTimeout(() => setStage("executing"),    3100),
    ];
  }

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <section
      id="demo"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative overflow-hidden bg-background"
      style={{ paddingTop: 80, paddingBottom: 100 }}
    >
      <style>{`
        @keyframes demo-dot {
          0%   { offset-distance:0%;   opacity:0; }
          8%   { opacity:1; }
          92%  { opacity:1; }
          100% { offset-distance:100%; opacity:0; }
        }
        @keyframes demo-ping {
          0%   { transform:scale(1);   opacity:0.6; }
          100% { transform:scale(2.4); opacity:0; }
        }
        @keyframes demo-scan {
          0%   { top:-2px; opacity:0; }
          10%  { opacity:1; }
          90%  { opacity:1; }
          100% { top:100%; opacity:0; }
        }
        @keyframes demo-breathe {
          0%,100% { opacity:0.5; }
          50%     { opacity:1; }
        }
        @keyframes demo-node {
          0%,100% { transform:scale(1);   opacity:0.9; }
          50%     { transform:scale(2);   opacity:0.2; }
        }
      `}</style>

      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute rounded-full" style={{
          left: "8%", top: "15%", width: 500, height: 500,
          background: `radial-gradient(circle, ${activeColor}09 0%, transparent 70%)`,
          filter: "blur(80px)", transition: "background 0.8s",
        }} />
        <div className="absolute rounded-full" style={{
          right: "8%", bottom: "15%", width: 400, height: 400,
          background: `radial-gradient(circle, ${activeColor}06 0%, transparent 70%)`,
          filter: "blur(80px)", transition: "background 0.8s",
        }} />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">

        {/* header */}
        <div className="text-center mb-10 transition-all duration-700"
          style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateY(0)" : "translateY(24px)" }}>
          <div className="inline-flex items-center gap-2.5 mb-5 px-3.5 py-1.5 rounded border"
            style={{ borderColor: `${cyanAccent}30`, background: `${cyanAccent}08` }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: cyanAccent, animation: "glow-pulse 2s ease-in-out infinite" }} />
            <span className="tech-label" style={{ color: cyanAccent }}>INTERACTIVE DEMO · SIMULATED BCI</span>
          </div>
          <div className="font-black mb-3" style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            letterSpacing: "-0.03em", lineHeight: 1.05,
            color: "hsl(var(--foreground))",
          }}>
            THINK IT.{" "}
            <span className="gradient-text-dynamic">THE ROBOT DOES IT.</span>
          </div>
          <p className="text-sm max-w-md mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            Select a motor intention. The human imagines it — the neural signal transmits — the humanoid mirrors it.
          </p>
        </div>

        {/* intent buttons */}
        <div className="flex justify-center gap-3.5 mb-10 flex-wrap"
          style={{ opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.7s ease 0.15s" }}>
          {INTENTS.map((intent) => {
            const isActive = selected?.key === intent.key;
            const intentBorder = isActive ? intent.color : `${intent.color}45`;
            return (
              <button key={intent.key} onClick={() => handleSelect(intent)} disabled={busy}
                style={{
                  position: "relative",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 13.5, fontWeight: 900, letterSpacing: "0.18em",
                  padding: "14px 28px", borderRadius: 10,
                  background: isActive ? `${intent.color}22` : "rgba(255,255,255,0.03)",
                  border: `1.5px solid ${intentBorder}`,
                  color: isActive ? intent.color : "hsl(var(--muted-foreground))",
                  boxShadow: isActive ? `0 0 24px ${intent.color}45, inset 0 0 12px ${intent.color}20` : "none",
                  cursor: busy ? "not-allowed" : "pointer",
                  opacity: busy && !isActive ? 0.35 : 1,
                  transform: isActive ? "scale(1.04)" : "scale(1)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}>
                <span style={{ marginRight: 8, fontSize: "1.15em", verticalAlign: "middle" }}>{intent.icon}</span>
                <span style={{ verticalAlign: "middle" }}>{intent.label}</span>
                {isActive && (
                  <span style={{
                    position: "absolute", inset: -2, borderRadius: 12,
                    border: `1.5px solid ${intent.color}80`,
                    animation: "demo-ping 1.6s ease-out infinite",
                    pointerEvents: "none",
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* 3-column viewer */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr clamp(150px, 18vw, 190px) 1fr",
          gap: 12, alignItems: "center",
          opacity: phase >= 1 ? 1 : 0,
          transition: "opacity 0.7s ease 0.25s",
        }}>

          {/* HUMAN */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5, fontWeight: 900,
              letterSpacing: "0.22em", color: cyanAccent, marginBottom: 12,
              border: `1.5px solid ${cyanAccent}70`, padding: "7px 18px",
              borderRadius: 8, background: `${cyanAccent}18`,
              boxShadow: `0 0 16px ${cyanAccent}25`,
            }}>HUMAN OPERATOR</div>

            <div style={{
              width: "100%", height: 460, borderRadius: 16, overflow: "hidden",
              border: `1.5px solid ${stage !== "idle" ? activeColor + "60" : cyanAccent + "30"}`,
              boxShadow: stage !== "idle" ? `0 0 32px ${activeColor}25` : `0 0 20px ${cyanAccent}10`,
              background: isDark ? "transparent" : "hsl(36 22% 96% / 0.6)",
              position: "relative", transition: "border-color 0.5s, box-shadow 0.5s",
            }}>
              <ThinkingOverlay stage={stage} intent={selected} />
              <Canvas camera={{ position: [0, 0, 3.6], fov: 42 }}
                gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
                <ambientLight intensity={isDark ? 0.65 : 1.1} />
                <directionalLight position={[3, 6, 4]} intensity={isDark ? 1.3 : 1.7} />
                <Suspense fallback={null}>
                  <HumanModel thinking={stage === "thinking"} color={activeColor} />
                  <ContactShadows position={[0, -1.2, 0]} opacity={0.2} scale={3.5} blur={2} />
                  <Environment preset="city" />
                </Suspense>
              </Canvas>
            </div>

            <div style={{ marginTop: 14, minHeight: 52, textAlign: "center" }}>
              {selected && stage !== "idle" ? (
                <>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 900,
                    letterSpacing: "0.2em", color: isDark ? "#ffffff" : "hsl(215 35% 15%)", marginBottom: 4,
                  }}>MOTOR IMAGERY ACTIVE</div>
                  <div style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 900, color: selected.color,
                  }}>{selected.thought}</div>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, fontWeight: 800,
                    letterSpacing: "0.14em", color: isDark ? "rgba(255,255,255,0.85)" : "hsl(215 35% 22%)", opacity: 0.95, marginTop: 4,
                  }}>{selected.brainRegion}</div>
                </>
              ) : (
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 800,
                  letterSpacing: "0.18em", color: "hsl(var(--muted-foreground))", opacity: 0.85,
                }}>SELECT AN INTENTION ABOVE</div>
              )}
            </div>
          </div>

          {/* ONE-WAY SIGNAL TRANSMISSION BRIDGE (Human -> Robot) */}
          <OneWaySignalBridge
            stage={stage}
            selectedIntent={selected}
            activeColor={activeColor}
            cyanAccent={cyanAccent}
            isDark={isDark}
          />

          {/* ROBOT — single persistent Canvas with one visible model */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5, fontWeight: 900,
              letterSpacing: "0.22em", color: "#c084fc", marginBottom: 12,
              border: "1.5px solid #c084fc70", padding: "7px 18px",
              borderRadius: 8, background: "#c084fc18",
              boxShadow: "0 0 16px #c084fc25",
            }}>HUMANOID AVATAR</div>

            <div style={{
              width: "100%", height: 460, borderRadius: 16, overflow: "hidden",
              border: `1.5px solid ${isExecuting && selected ? selected.color + "60" : "#c084fc30"}`,
              boxShadow: isExecuting && selected ? `0 0 32px ${selected.color}25` : "none",
              background: isDark ? "transparent" : "hsl(36 22% 96% / 0.6)",
              position: "relative", transition: "border-color 0.6s, box-shadow 0.6s",
            }}>
              {/* Keep the Canvas mounted while switching between robot models. */}
              <Canvas camera={{ position: [0, 0, 3.6], fov: 42 }}
                gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
                <ambientLight intensity={isDark ? 0.65 : 1.1} />
                <directionalLight position={[3, 6, 4]} intensity={isDark ? 1.3 : 1.7} />
                <Suspense fallback={null}>
                  <CrossfadeController
                    intentKey={selected?.key ?? null}
                    executing={isExecuting}
                    accentColor={activeColor}
                    stage={stage}
                  />
                  <ContactShadows position={[0, -1.2, 0]} opacity={0.2} scale={3.5} blur={2} />
                  <Environment preset="city" />
                </Suspense>
              </Canvas>
            </div>

            <div style={{ marginTop: 14, minHeight: 52, textAlign: "center" }}>
              {isExecuting && selected ? (
                <>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, fontWeight: 900,
                    letterSpacing: "0.2em", color: isDark ? "#ffffff" : "hsl(215 35% 15%)", marginBottom: 4,
                  }}>EXECUTING ACTION</div>
                  <div style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 900, color: selected.color,
                  }}>{selected.icon} {selected.label}</div>
                </>
              ) : selected ? (
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 800,
                  letterSpacing: "0.18em", color: activeColor, opacity: 0.9,
                }}>PROCESSING NEURAL TELEMETRY...</div>
              ) : (
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 800,
                  letterSpacing: "0.18em", color: "hsl(var(--muted-foreground))", opacity: 0.8,
                }}>AWAITING NEURAL SIGNAL</div>
              )}
            </div>
          </div>
        </div>

        <p className="text-center mt-10 opacity-30" style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.18em",
        }}>
          SIMULATED MOTOR IMAGERY · NOT LIVE BRAIN DATA · FOR DEMONSTRATION PURPOSES ONLY
        </p>
      </div>
    </section>
  );
}

useGLTF.preload("/Meshy_AI_Cybernetic_Sentinel_0918184736_texture.glb");
useGLTF.preload("/Meshy_AI_Neural_Vanguard_0918185718_texture.glb");
useGLTF.preload("/Meshy_AI_Cybernetic_Sentinel_All_Night_Dance.glb");
useGLTF.preload("/Meshy_AI_Cybernetic_Sentinel_Running.glb");
useGLTF.preload("/Meshy_AI_Cybernetic_Sentinel_Boxing_Practice.glb");
useGLTF.preload("/Meshy_AI_Cybernetic_Sentinel_Agree_Gesture.glb");
