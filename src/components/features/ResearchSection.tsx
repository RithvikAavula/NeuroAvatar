import { useState, useRef } from "react";
import { useInView } from "@/hooks/useInView";

const topics = [
  {
    title: "MOTOR IMAGERY",
    icon: "🧠",
    color: "#a78bfa",
    num: "01",
    what: "Motor imagery refers to the mental simulation of movement without physical execution. When a person imagines moving their hand, the motor cortex generates neural patterns similar to actual movement.",
    why: "Motor imagery BCI systems do not require any physical movement, making them potentially accessible to individuals with severe motor impairments.",
    limitations: "Signal-to-noise ratio is low in non-invasive EEG. Individual variability is significant. Training and adaptation time can be substantial.",
  },
  {
    title: "EEG OSCILLATIONS",
    icon: "〜",
    color: "#00cfff",
    num: "02",
    what: "Motor-related EEG rhythms — particularly the mu rhythm (8–12 Hz) and beta rhythm (13–30 Hz) — show characteristic event-related desynchronization (ERD) during motor imagery.",
    why: "These oscillatory changes in specific electrode locations (C3, C4, Cz) provide spatially specific information about intended movement laterality and type.",
    limitations: "ERD patterns overlap in frequency with other cognitive activities. Muscular and ocular artifacts can obscure signals. Signal resolution is limited by volume conduction.",
  },
  {
    title: "BCI DECODING",
    icon: "◈",
    color: "#00ffaa",
    num: "03",
    what: "Machine learning algorithms are trained to classify motor intentions from EEG features. Methods range from classical spatial filtering (CSP-LDA) to deep learning (EEGNet, Transformers).",
    why: "Reliable decoding of motor intentions at sufficient accuracy and speed is the core technical challenge enabling BCI-controlled teleoperation.",
    limitations: "Current non-invasive BCIs achieve limited decoding accuracy compared to invasive methods. Continuous kinematic decoding remains an open research problem.",
  },
  {
    title: "MOTION RETARGETING",
    icon: "⇄",
    color: "#f59e0b",
    num: "04",
    what: "Human and robot bodies have different morphologies. Motion retargeting mathematically maps human joint movements to robot joint space while preserving movement intent.",
    why: "Without proper retargeting, movements decoded from human motor intentions may produce unnatural or infeasible robot postures.",
    limitations: "Kinematic constraints differ significantly between humans and robots. Real-time retargeting with balance constraints is computationally challenging.",
  },
  {
    title: "WHOLE-BODY CONTROL",
    icon: "⊕",
    color: "#c084fc",
    num: "05",
    what: "Whole-body controllers (WBC) coordinate all robot joints simultaneously to achieve desired Cartesian motions while satisfying constraints such as balance, joint limits, and contact forces.",
    why: "Without WBC, naively commanding individual joints from decoded motor intentions would cause the robot to fall or violate physical constraints.",
    limitations: "WBC algorithms require accurate robot models. Real-time performance is challenging. Handling unexpected contacts and perturbations is an active research area.",
  },
  {
    title: "SENSORY FEEDBACK",
    icon: "◎",
    color: "#f472b6",
    num: "06",
    what: "Closing the loop with sensory feedback from the robot to the operator (vision, touch, proprioception) could enhance the sense of embodiment and control quality.",
    why: "Bidirectional communication between human and robot avatar would enable more natural and effective teleoperation with richer situational awareness.",
    limitations: "Non-invasive sensory feedback channels are limited. Haptic feedback systems add hardware complexity. Latency must be minimized to prevent perceptual disruption.",
  },
];

export default function ResearchSection() {
  const { ref, inView } = useInView(0.1);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [hovered, setHovered]   = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (i: number) => setExpanded(prev => prev === i ? null : i);

  return (
    <section id="research" ref={ref} className="relative py-32 overflow-hidden bg-background">
      <div className="section-divider absolute top-0 left-0 right-0" />

      <style>{`
        @keyframes rs-pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes rs-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes rs-scan {
          0%   { top: -30%; }
          100% { top: 130%; }
        }
        @keyframes rs-float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%     { transform: translateY(-5px) rotate(3deg); }
        }
        .rs-row {
          transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .rs-row:hover {
          transform: translateX(4px);
        }
        .rs-content {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.45s cubic-bezier(0.22,1,0.36,1);
        }
        .rs-content.open {
          grid-template-rows: 1fr;
        }
        .rs-content-inner {
          overflow: hidden;
        }
      `}</style>

      {/* ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{ position:"absolute", top:"10%", left:"5%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(167,139,250,0.06) 0%,transparent 65%)", filter:"blur(80px)" }} />
        <div style={{ position:"absolute", bottom:"10%", right:"5%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,207,255,0.06) 0%,transparent 65%)", filter:"blur(80px)" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">

        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="tech-label mb-4 opacity-50">SCIENTIFIC FOUNDATION</div>
          <h2 className="font-bold gradient-text-white" style={{ fontSize:"clamp(1.8rem,4vw,3rem)", letterSpacing:"-0.02em" }}>
            THE SCIENCE BEHIND
            <br />
            <span className="gradient-text-cyan">NEUROAVATAR</span>
          </h2>
          <p className="mt-4 text-sm opacity-50 max-w-md mx-auto leading-relaxed">
            Six core scientific pillars that underpin the NeuroAvatar system. Click any topic to explore.
          </p>
        </div>

        {/* Accordion rows */}
        <div className="flex flex-col gap-3">
          {topics.map((topic, i) => {
            const isOpen     = expanded === i;
            const isHovered  = hovered === i;
            const c          = topic.color;

            return (
              <div
                key={topic.title}
                className={`rs-row glass-panel relative overflow-hidden rounded-2xl transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{
                  transitionDelay: `${i * 70}ms`,
                  borderColor: isOpen ? `${c}55` : isHovered ? `${c}33` : undefined,
                  boxShadow: isOpen
                    ? `0 0 0 1px ${c}18, 0 20px 60px ${c}12, 0 4px 20px rgba(0,0,0,0.2)`
                    : isHovered
                    ? `0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px ${c}15`
                    : undefined,
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* left accent bar */}
                <div style={{
                  position:"absolute", top:0, left:0, bottom:0, width:3,
                  background: isOpen ? `linear-gradient(180deg,${c},${c}44)` : `${c}33`,
                  borderRadius:"2px 0 0 2px",
                  transition:"all 0.35s ease",
                }} />

                {/* shimmer on open */}
                {isOpen && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                    <div style={{
                      position:"absolute", top:0, bottom:0, width:"40%",
                      background:`linear-gradient(90deg,transparent,${c}08,transparent)`,
                      animation:"rs-shimmer 3s ease-in-out infinite",
                    }} />
                  </div>
                )}

                {/* scan line on hover */}
                {isHovered && !isOpen && (
                  <div className="absolute inset-x-0 pointer-events-none overflow-hidden" style={{ height:"100%", top:0 }}>
                    <div style={{
                      position:"absolute", left:0, right:0, height:"30%",
                      background:`linear-gradient(180deg,transparent,${c}0a,transparent)`,
                      animation:"rs-scan 1.8s ease-in-out infinite",
                    }} />
                  </div>
                )}

                {/* Header row — clickable */}
                <button
                  className="w-full text-left"
                  style={{ padding:"20px 24px 20px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}
                  onClick={() => toggle(i)}
                  data-interactive="true"
                >
                  <div style={{ display:"flex", alignItems:"center", gap:16 }}>

                    {/* icon container */}
                    <div style={{
                      width:48, height:48, borderRadius:14, flexShrink:0,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:22,
                      background: isOpen ? `${c}22` : `${c}0f`,
                      border:`1px solid ${isOpen ? c + "55" : c + "22"}`,
                      boxShadow: isOpen ? `0 0 20px ${c}55, 0 0 40px ${c}22` : "none",
                      transition:"all 0.35s ease",
                      animation: isOpen ? "rs-float 3s ease-in-out infinite" : "none",
                    }}>
                      {topic.icon}
                    </div>

                    <div>
                      {/* num label */}
                      <div style={{
                        fontFamily:"'IBM Plex Mono',monospace", fontSize:9, letterSpacing:"0.28em",
                        color:`${c}88`, marginBottom:4,
                      }}>
                        {topic.num} / 06
                      </div>
                      {/* title */}
                      <div style={{
                        fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:15,
                        letterSpacing:"0.08em",
                        color: isOpen ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                        transition:"color 0.3s ease",
                      }}>
                        {topic.title}
                      </div>
                    </div>
                  </div>

                  {/* expand toggle */}
                  <div style={{
                    width:32, height:32, borderRadius:"50%", flexShrink:0,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    background: isOpen ? `${c}22` : "hsl(var(--muted)/0.5)",
                    border:`1px solid ${isOpen ? c + "55" : "hsl(var(--border))"}`,
                    color: isOpen ? c : "hsl(var(--muted-foreground))",
                    fontSize:18, lineHeight:1,
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition:"all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                    boxShadow: isOpen ? `0 0 12px ${c}44` : "none",
                  }}>
                    +
                  </div>
                </button>

                {/* Expandable content */}
                <div className={`rs-content ${isOpen ? "open" : ""}`}>
                  <div className="rs-content-inner">
                    <div style={{
                      margin:"0 28px 24px",
                      paddingTop:20,
                      borderTop:`1px solid ${c}22`,
                    }}>
                      <div className="grid md:grid-cols-3 gap-6">

                        {/* WHAT */}
                        <div className="glass-panel" style={{
                          borderRadius:12, padding:"16px 18px",
                          borderColor:`${c}22`,
                        }}>
                          <div style={{
                            fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:900,
                            letterSpacing:"0.18em", color:c, marginBottom:12,
                            textTransform:"uppercase",
                          }}>
                            WHAT IT IS
                          </div>
                          <p style={{
                            fontFamily:"'Inter',sans-serif", fontSize:15, lineHeight:1.8,
                            color:"hsl(var(--foreground))", opacity:0.85, margin:0,
                          }}>
                            {topic.what}
                          </p>
                        </div>

                        {/* WHY */}
                        <div className="glass-panel" style={{
                          borderRadius:12, padding:"16px 18px",
                          borderColor:`${c}22`,
                        }}>
                          <div style={{
                            fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:900,
                            letterSpacing:"0.18em", color:c, marginBottom:12,
                            textTransform:"uppercase",
                          }}>
                            WHY IT MATTERS
                          </div>
                          <p style={{
                            fontFamily:"'Inter',sans-serif", fontSize:15, lineHeight:1.8,
                            color:"hsl(var(--foreground))", opacity:0.85, margin:0,
                          }}>
                            {topic.why}
                          </p>
                        </div>

                        {/* LIMITATIONS */}
                        <div className="glass-panel" style={{
                          borderRadius:12, padding:"16px 18px",
                          borderColor:"rgba(251,191,36,0.25)",
                        }}>
                          <div style={{
                            fontFamily:"'Outfit',sans-serif", fontSize:13, fontWeight:900,
                            letterSpacing:"0.18em", color:"#fbbf24", marginBottom:12,
                            textTransform:"uppercase",
                          }}>
                            CURRENT LIMITATIONS
                          </div>
                          <p style={{
                            fontFamily:"'Inter',sans-serif", fontSize:15, lineHeight:1.8,
                            color:"hsl(var(--foreground))", opacity:0.85, margin:0,
                          }}>
                            {topic.limitations}
                          </p>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                {/* pulse ring on open */}
                {isOpen && (
                  <div style={{
                    position:"absolute", top:24, left:24, width:48, height:48,
                    borderRadius:14, border:`1px solid ${c}`,
                    animation:"rs-pulse-ring 1.8s ease-out infinite",
                    pointerEvents:"none",
                  }} />
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
