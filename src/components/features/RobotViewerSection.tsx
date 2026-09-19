import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@/hooks/useTheme";

gsap.registerPlugin(ScrollTrigger);

interface JointInfo {
  name: string;
  angle: number;
  dof: number;
  status: "ACTIVE" | "STANDBY" | "LOCKED";
  desc: string;
}

const JOINT_DATA: Record<string, JointInfo> = {
  head:      { name: "HEAD / NECK",   angle: 0,  dof: 3, status: "ACTIVE",  desc: "Pan · Tilt · Roll" },
  torso:     { name: "TORSO",         angle: 0,  dof: 2, status: "ACTIVE",  desc: "Yaw · Pitch" },
  lShoulder: { name: "L. SHOULDER",   angle: 42, dof: 3, status: "ACTIVE",  desc: "Flex · Abd · Rot" },
  rShoulder: { name: "R. SHOULDER",   angle: 18, dof: 3, status: "ACTIVE",  desc: "Flex · Abd · Rot" },
  lElbow:    { name: "L. ELBOW",      angle: 67, dof: 1, status: "ACTIVE",  desc: "Flexion / Extension" },
  rElbow:    { name: "R. ELBOW",      angle: 23, dof: 1, status: "ACTIVE",  desc: "Flexion / Extension" },
  lWrist:    { name: "L. WRIST",      angle: 12, dof: 2, status: "ACTIVE",  desc: "Flex · Deviation" },
  rWrist:    { name: "R. WRIST",      angle: 8,  dof: 2, status: "STANDBY", desc: "Flex · Deviation" },
  lHip:      { name: "L. HIP",        angle: 5,  dof: 3, status: "ACTIVE",  desc: "Flex · Abd · Rot" },
  rHip:      { name: "R. HIP",        angle: 5,  dof: 3, status: "ACTIVE",  desc: "Flex · Abd · Rot" },
  lKnee:     { name: "L. KNEE",       angle: 14, dof: 1, status: "ACTIVE",  desc: "Flexion / Extension" },
  rKnee:     { name: "R. KNEE",       angle: 14, dof: 1, status: "ACTIVE",  desc: "Flexion / Extension" },
  lAnkle:    { name: "L. ANKLE",      angle: 3,  dof: 2, status: "STANDBY", desc: "Dorsi · Plantar" },
  rAnkle:    { name: "R. ANKLE",      angle: 3,  dof: 2, status: "STANDBY", desc: "Dorsi · Plantar" },
};

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:  "#d97706",
  STANDBY: "#c2410c",
  LOCKED:  "#ef4444",
};

export default function RobotViewerSection() {
  const mountRef    = useRef<HTMLDivElement>(null);
  const sectionRef  = useRef<HTMLElement>(null);
  const titleRef    = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const jointsRef   = useRef<Map<string, THREE.Mesh>>(new Map());
  const frameRef    = useRef<number>();
  const [hoveredJoint, setHoveredJoint] = useState<JointInfo | null>(null);
  const [tooltipPos, setTooltipPos]     = useState({ x: 0, y: 0 });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth || 800;
    const H = mount.clientHeight || 560;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 1.2, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.1 : 1.4;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.8;
    controls.maxDistance = 8;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.target.set(0, 0.8, 0);

    // Lights — warm amber palette, adjusted for theme
    scene.add(new THREE.AmbientLight(isDark ? 0x1a1208 : 0xf5ede0, isDark ? 2.0 : 3.5));
    const key = new THREE.DirectionalLight(0xd97706, isDark ? 2.2 : 1.8);
    key.position.set(2, 4, 3);
    key.castShadow = true;
    scene.add(key);
    const fill = new THREE.DirectionalLight(isDark ? 0xc2410c : 0xe8c090, isDark ? 1.2 : 1.5);
    fill.position.set(-3, 2, -2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(isDark ? 0x78350f : 0xd4a060, isDark ? 0.7 : 1.0);
    rim.position.set(0, -1, -4);
    scene.add(rim);

    // Grid floor
    const grid = new THREE.GridHelper(6, 24, 0xd97706, 0xd97706);
    (grid.material as THREE.LineBasicMaterial).opacity = isDark ? 0.1 : 0.15;
    (grid.material as THREE.LineBasicMaterial).transparent = true;
    grid.position.y = -1.22;
    scene.add(grid);

    // Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshStandardMaterial({ color: isDark ? 0x080604 : 0xe8dece, roughness: 1, metalness: 0 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.22;
    ground.receiveShadow = true;
    scene.add(ground);

    const robot = buildRobot(jointsRef.current, isDark);
    scene.add(robot);

    const clock = new THREE.Clock();
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      robot.rotation.y = Math.sin(t * 0.25) * 0.05;
      const le = jointsRef.current.get("lElbow");
      const re = jointsRef.current.get("rElbow");
      if (le) le.rotation.z =  Math.sin(t * 0.4) * 0.05;
      if (re) re.rotation.z = -Math.sin(t * 0.4) * 0.05;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width)  *  2 - 1;
      mouse.y = -((e.clientY - rect.top)  / rect.height) *  2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const allMeshes: THREE.Mesh[] = [];
      scene.traverse(obj => { if ((obj as THREE.Mesh).isMesh) allMeshes.push(obj as THREE.Mesh); });
      const hits = raycaster.intersectObjects(allMeshes);
      if (hits.length > 0) {
        const key = hits[0].object.userData.jointKey as string;
        if (key && JOINT_DATA[key]) {
          setHoveredJoint(JOINT_DATA[key]);
          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          mount.style.cursor = "crosshair";
          return;
        }
      }
      setHoveredJoint(null);
      mount.style.cursor = "grab";
    };
    mount.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      mount.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [isDark]);

  useEffect(() => {
    const section = sectionRef.current;
    const title   = titleRef.current;
    if (!section || !title) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        Array.from(title.children),
        { opacity: 0, y: 35 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: title, start: "top 80%", toggleActions: "play none none none" },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  const statusBadgeCls = (s: string) => {
    const m: Record<string, string> = {
      ACTIVE:  "text-[#d97706] border-[#d9770633] bg-[#d977060d]",
      STANDBY: "text-[#c2410c] border-[#c2410c33] bg-[#c2410c0d]",
      LOCKED:  "text-red-400 border-red-400/30 bg-red-400/10",
    };
    return m[s] || m.STANDBY;
  };

  return (
    <section
      id="robot-viewer"
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-background"
    >
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(38 90% 52%) 1px,transparent 1px),linear-gradient(90deg,hsl(38 90% 52%) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="text-center mb-12">
          <div className="tech-label mb-4 opacity-50" style={{ opacity: 0 }}>PROTOTYPE TARGET</div>
          <h2
            className="font-bold mb-4 text-foreground"
            style={{ fontSize: "clamp(1.8rem,4vw,3rem)", letterSpacing: "-0.02em", opacity: 0 }}
          >
            HUMANOID <span className="gradient-text-cyan">ROBOT SYSTEM</span>
          </h2>
          <p
            className="max-w-2xl mx-auto"
            style={{ color: "hsl(var(--muted-foreground))", opacity: 0 }}
          >
            Interactive 3D prototype visualization. Drag to rotate · Scroll to zoom · Hover joints for specs.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 items-start">
          {/* 3D Viewer */}
          <div className="lg:col-span-3 relative">
            <div
              className="glass-panel-bright rounded-2xl overflow-hidden relative"
              style={{ height: "580px" }}
              data-technical="true"
            >
              <div
                className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-3 border-b"
                style={{
                  background: "hsl(var(--surface-1) / 0.85)",
                  backdropFilter: "blur(12px)",
                  borderColor: "hsl(var(--border) / 0.4)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full glow-pulse"
                    style={{ background: "hsl(var(--neural-cyan))" }}
                  />
                  <span className="tech-label opacity-70">NEUROAVATAR / HUMANOID-01 / VIEWER</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="tech-label opacity-40">20 DOF</span>
                  <span className="tech-label opacity-30">·</span>
                  <span className="tech-label text-green-500 opacity-70">READY</span>
                </div>
              </div>

              <div ref={mountRef} className="absolute inset-0 mt-10" style={{ cursor: "grab" }} />

              {hoveredJoint && (
                <div
                  className="absolute z-20 pointer-events-none transition-all duration-100"
                  style={{ left: Math.min(tooltipPos.x + 14, 420), top: Math.max(tooltipPos.y - 10, 60) }}
                >
                  <div
                    className="glass-panel rounded-xl p-4 min-w-[168px]"
                    style={{
                      border: "1px solid hsl(38 90% 52% / 0.3)",
                      boxShadow: "0 0 20px hsl(38 90% 52% / 0.1)",
                    }}
                  >
                    <div className="tech-label mb-3" style={{ color: "hsl(var(--neural-cyan))" }}>{hoveredJoint.name}</div>
                    {[
                      ["ANGLE", `${hoveredJoint.angle}°`],
                      ["DOF",   `${hoveredJoint.dof}`],
                      ["AXES",  hoveredJoint.desc],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between py-1">
                        <span className="tech-label opacity-40" style={{ fontSize: "9px" }}>{k}</span>
                        <span className="text-xs font-bold text-foreground" style={{ fontFamily: "'Syne',monospace" }}>{v}</span>
                      </div>
                    ))}
                    <div className={`mt-2 text-[9px] font-bold tracking-widest px-2 py-1 rounded border text-center ${statusBadgeCls(hoveredJoint.status)}`}>
                      {hoveredJoint.status}
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-5 flex items-center gap-2 opacity-25 z-10">
                <div className="w-5 h-px" style={{ background: "hsl(var(--neural-cyan))" }} />
                <span className="tech-label" style={{ fontSize: "8px" }}>DRAG · ROTATE / SCROLL · ZOOM</span>
              </div>
              <div className="absolute bottom-4 right-5 opacity-25 z-10">
                <span className="tech-label" style={{ fontSize: "8px" }}>THREE.JS · WEBGL</span>
              </div>
            </div>
          </div>

          {/* Specs Panel */}
          <div className="flex flex-col gap-4">
            <div className="glass-panel rounded-xl p-5">
              <div className="tech-label mb-4 opacity-50">PROTOTYPE SPECS</div>
              {[
                ["SCALE",     "~50 cm"],
                ["DOF",       "20"],
                ["ACTUATORS", "DYNAMIXEL"],
                ["SENSORS",   "IMU + ENC"],
                ["CAMERA",    "RGB-D"],
                ["CONTROL",   "ROS 2"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                  style={{ borderColor: "hsl(var(--border) / 0.2)" }}
                >
                  <span className="tech-label opacity-40">{label}</span>
                  <span
                    className="text-xs font-bold"
                    style={{ fontFamily: "'Syne',monospace", color: "hsl(var(--neural-cyan))" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="glass-panel rounded-xl p-5">
              <div className="tech-label mb-4 opacity-50">JOINT STATUS</div>
              {Object.entries(STATUS_COLOR).map(([status, color]) => (
                <div key={status} className="flex items-center gap-2 py-1.5">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
                  />
                  <span className="tech-label opacity-60">{status}</span>
                  <span className="text-xs opacity-40 ml-auto" style={{ fontFamily: "'Syne',monospace" }}>
                    {Object.values(JOINT_DATA).filter(j => j.status === status).length}
                  </span>
                </div>
              ))}
            </div>

            <div className="glass-panel rounded-xl p-5">
              <div className="tech-label mb-2 opacity-40">NOTE</div>
              <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--muted-foreground))", opacity: 0.5 }}>
                Visualization represents a conceptual prototype target. Specifications are indicative and subject to revision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function buildRobot(joints: Map<string, THREE.Mesh>, isDark = true): THREE.Group {
  const robot = new THREE.Group();

  const bodyMat  = () => new THREE.MeshStandardMaterial({ color: isDark ? 0x1a1208 : 0x3a2e20, emissive: isDark ? 0x0d0800 : 0x1a1000, roughness: 0.25, metalness: 0.85 });
  const jointMat = () => new THREE.MeshStandardMaterial({ color: isDark ? 0x2a1f10 : 0x4a3820, emissive: isDark ? 0x100800 : 0x201000, roughness: 0.38, metalness: 0.72 });
  const accentMat= () => new THREE.MeshStandardMaterial({ color: 0xd97706, emissive: 0xb45309, emissiveIntensity: isDark ? 0.55 : 0.35, roughness: 0.18, metalness: 0.9 });

  const tag = (mesh: THREE.Mesh, key: string) => { mesh.userData.jointKey = key; return mesh; };

  // HEAD
  const headGrp = new THREE.Group();
  headGrp.position.set(0, 1.75, 0);
  const headBox = tag(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.26, 0.24), bodyMat()), "head");
  headBox.castShadow = true;
  joints.set("head", headBox);
  headGrp.add(headBox);
  [-0.072, 0.072].forEach(x => {
    const eye = tag(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.026, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xd97706, emissive: 0xd97706, emissiveIntensity: 2.2, roughness: 0.05, metalness: 0 })
      ), "head"
    );
    eye.position.set(x, 0.02, 0.12);
    headGrp.add(eye);
  });
  const neck = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.1, 8), jointMat()), "head");
  neck.position.set(0, -0.18, 0);
  headGrp.add(neck);
  robot.add(headGrp);

  // TORSO
  const torsoGrp = new THREE.Group();
  torsoGrp.position.set(0, 1.08, 0);
  const torsoBox = tag(new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.58, 0.28), bodyMat()), "torso");
  torsoBox.castShadow = true;
  joints.set("torso", torsoBox);
  const panel = tag(new THREE.Mesh(
    new THREE.BoxGeometry(0.26, 0.16, 0.022),
    new THREE.MeshStandardMaterial({ color: isDark ? 0x0d0800 : 0x2a2010, emissive: isDark ? 0x1a0e00 : 0x100800, roughness: 0.55, metalness: 0.6 })
  ), "torso");
  panel.position.set(0, 0.07, 0.14);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.013, 0.013), accentMat());
  stripe.position.set(0, -0.03, 0.148);
  torsoGrp.add(torsoBox, panel, stripe);
  robot.add(torsoGrp);

  const hips = tag(new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.1, 0.24), bodyMat()), "torso");
  hips.position.set(0, 0.75, 0);
  hips.castShadow = true;
  robot.add(hips);

  const addArm = (side: "l" | "r") => {
    const s = side === "l" ? -1 : 1;
    const prefix = side;

    const shoulder = tag(new THREE.Mesh(new THREE.SphereGeometry(0.076, 10, 10), jointMat()), `${prefix}Shoulder`);
    shoulder.position.set(s * 0.33, 1.36, 0);
    joints.set(`${prefix}Shoulder`, shoulder);
    robot.add(shoulder);

    const ua = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.042, 0.32, 8), bodyMat()), `${prefix}Shoulder`);
    ua.position.set(s * 0.37, 1.16, 0);
    ua.rotation.z = s * 0.17;
    ua.castShadow = true;
    robot.add(ua);

    const elbow = tag(new THREE.Mesh(new THREE.SphereGeometry(0.054, 10, 10), jointMat()), `${prefix}Elbow`);
    elbow.position.set(s * 0.43, 0.97, 0);
    joints.set(`${prefix}Elbow`, elbow);
    robot.add(elbow);

    const fa = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.032, 0.27, 8), bodyMat()), `${prefix}Elbow`);
    fa.position.set(s * 0.49, 0.79, 0);
    fa.castShadow = true;
    robot.add(fa);

    const wrist = tag(new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), accentMat()), `${prefix}Wrist`);
    wrist.position.set(s * 0.53, 0.64, 0);
    joints.set(`${prefix}Wrist`, wrist);
    robot.add(wrist);

    const hand = tag(new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.1, 0.05), bodyMat()), `${prefix}Wrist`);
    hand.position.set(s * 0.55, 0.55, 0);
    hand.castShadow = true;
    robot.add(hand);
  };
  addArm("l"); addArm("r");

  const addLeg = (side: "l" | "r") => {
    const s = side === "l" ? -1 : 1;
    const prefix = side;

    const hip = tag(new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), jointMat()), `${prefix}Hip`);
    hip.position.set(s * 0.14, 0.71, 0);
    joints.set(`${prefix}Hip`, hip);
    robot.add(hip);

    const thigh = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.063, 0.054, 0.37, 8), bodyMat()), `${prefix}Hip`);
    thigh.position.set(s * 0.15, 0.48, 0);
    thigh.castShadow = true;
    robot.add(thigh);

    const knee = tag(new THREE.Mesh(new THREE.SphereGeometry(0.058, 10, 10), jointMat()), `${prefix}Knee`);
    knee.position.set(s * 0.15, 0.27, 0);
    joints.set(`${prefix}Knee`, knee);
    robot.add(knee);

    const shin = tag(new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.038, 0.35, 8), bodyMat()), `${prefix}Knee`);
    shin.position.set(s * 0.15, 0.05, 0.01);
    shin.castShadow = true;
    robot.add(shin);

    const ankle = tag(new THREE.Mesh(new THREE.SphereGeometry(0.048, 8, 8), accentMat()), `${prefix}Ankle`);
    ankle.position.set(s * 0.15, -0.15, 0);
    joints.set(`${prefix}Ankle`, ankle);
    robot.add(ankle);

    const foot = tag(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.2), bodyMat()), `${prefix}Ankle`);
    foot.position.set(s * 0.15, -0.2, 0.04);
    foot.castShadow = true;
    robot.add(foot);
  };
  addLeg("l"); addLeg("r");

  robot.position.y = 0.08;
  return robot;
}
