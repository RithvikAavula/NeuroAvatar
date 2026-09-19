import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const CAM_Z          = 3.5;
const FOV            = 42;
const VISIBLE_HEIGHT = 2 * Math.tan((FOV * Math.PI) / 180 / 2) * CAM_Z;
const FILL           = 0.88;

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
  fitCache.set(url, { autoScale, centerY });
  return fitCache.get(url)!;
}

function DraggableModel({ url }: { url: string }) {
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

interface ViewerProps {
  url: string;
  label: string;
  accentHex: string;
  isDark: boolean;
  signalLabel?: string;
  signalSub?: string;
}

export function CharacterViewer({ url, label, accentHex, isDark, signalLabel, signalSub }: ViewerProps) {
  const canvasBg      = isDark ? "transparent"                    : "hsl(36 22% 96% / 0.6)";
  const canvasBorder  = isDark ? `${accentHex}18`                 : `${accentHex}30`;
  const canvasShadow  = isDark ? `0 0 32px ${accentHex}12`        : `0 0 20px ${accentHex}18, 0 2px 12px rgba(0,0,0,0.08)`;
  const labelColor    = accentHex;
  const labelBg       = isDark ? `${accentHex}08`                 : `${accentHex}10`;
  const labelBorder   = isDark ? `${accentHex}30`                 : `${accentHex}40`;
  const dragHintColor = isDark ? "rgba(255,255,255,0.25)"         : "hsl(215 20% 50%)";
  const signalColor   = accentHex;
  const signalSubColor = isDark ? `${accentHex}60`                : `${accentHex}80`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, fontWeight: 800,
        letterSpacing: "0.22em", color: labelColor, opacity: isDark ? 0.95 : 1,
        marginBottom: 10, border: `1px solid ${labelBorder}`,
        padding: "5px 14px", borderRadius: 6, background: labelBg,
      }}>{label}</div>

      <div
        style={{
          width: "100%", height: 420, borderRadius: 16, overflow: "hidden",
          border: `1px solid ${canvasBorder}`,
          boxShadow: canvasShadow,
          background: canvasBg,
          cursor: "grab", touchAction: "none",
        }}
        className="active:cursor-grabbing"
      >
        <Canvas
          camera={{ position: [0, 0, CAM_Z], fov: FOV }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
          dpr={[1, 1.5]}
        >
          {/* Lights — neutral, no color tinting on the model */}
          <ambientLight intensity={isDark ? 0.6 : 1.0} />
          <directionalLight position={[3, 6, 4]} intensity={isDark ? 1.2 : 1.6} />
          <pointLight position={[-3, 2, -2]} intensity={isDark ? 0.4 : 0.3} color={accentHex} />
          <Suspense fallback={null}>
            <DraggableModel url={url} />
            <ContactShadows
              position={[0, -1.4, 0]}
              opacity={isDark ? 0.2 : 0.12}
              scale={4}
              blur={2}
              color={isDark ? accentHex : "#000000"}
            />
            <Environment preset={isDark ? "city" : "apartment"} />
          </Suspense>
        </Canvas>
      </div>

      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 700,
        letterSpacing: "0.18em", color: dragHintColor, marginTop: 8,
      }}>DRAG TO ROTATE</div>

      {signalLabel && (
        <div style={{
          marginTop: 8, textAlign: "center",
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 800,
          letterSpacing: "0.16em", color: signalColor,
          opacity: isDark ? 0.9 : 1, lineHeight: 1.7,
        }}>
          {signalLabel}
          {signalSub && <><br /><span style={{ color: signalSubColor, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em" }}>{signalSub}</span></>}
        </div>
      )}
    </div>
  );
}

useGLTF.preload("/Meshy_AI_Neural_Vanguard_0918185718_texture.glb");
useGLTF.preload("/Meshy_AI_Cybernetic_Sentinel_0918184736_texture.glb");
