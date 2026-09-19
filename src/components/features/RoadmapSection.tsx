import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@/hooks/useTheme";
import Folder from "./Folder";

gsap.registerPlugin(ScrollTrigger);

const phases = [
  { num: "01", title: "BCI Signal Acquisition",        desc: "Establish reliable non-invasive EEG recording pipeline. Hardware selection, electrode placement, signal quality benchmarking.", status: "ACTIVE" },
  { num: "02", title: "Motor-Intention Classification", desc: "Train and validate ML models to reliably classify motor imagery states from EEG signals with acceptable accuracy.",             status: "ACTIVE" },
  { num: "03", title: "Simulated Humanoid Control",     desc: "Drive a physics-based humanoid simulation using decoded motor intentions. Validate the full end-to-end pipeline.",              status: "UPCOMING" },
  { num: "04", title: "Small Physical Prototype",       desc: "Develop a ~40–60 cm physical humanoid robot platform. Implement basic BCI-driven movement on real hardware.",                  status: "UPCOMING" },
  { num: "05", title: "Continuous Movement Control",    desc: "Move beyond discrete state classification toward continuous kinematic control streams. Improve latency and responsiveness.",    status: "PLANNED" },
  { num: "06", title: "Whole-Body Teleoperation",       desc: "Achieve coordinated whole-body control: locomotion, arm movement, and balance — all driven from neural intention.",             status: "PLANNED" },
  { num: "07", title: "Visual Telepresence",            desc: "Integrate robot-mounted cameras for first-person visual feedback. Build a coherent sense of remote embodiment.",               status: "PLANNED" },
  { num: "08", title: "Advanced Sensory Feedback",      desc: "Explore non-invasive sensory return channels — haptic, vibrotactile, visual augmentation — to close the sensory loop.",       status: "RESEARCH" },
  { num: "09", title: "Assistive Applications",         desc: "Pilot programs with research partners exploring potential assistive and rehabilitation applications.",                          status: "RESEARCH" },
  { num: "10", title: "Scalable NeuroAvatar Platform",  desc: "Develop the full NeuroAvatar platform: hardware, software stack, SDK, and developer ecosystem for the future.",               status: "VISION" },
];

const S: Record<string, { col: string; grad: string; bg: string; border: string }> = {
  ACTIVE:   { col: "#00ffaa", grad: "linear-gradient(135deg,#00ffaa,#00cc88)", bg: "linear-gradient(145deg,rgba(0,255,170,0.18) 0%,rgba(0,60,40,0.55) 100%)", border: "#00ffaa" },
  UPCOMING: { col: "#00cfff", grad: "linear-gradient(135deg,#00cfff,#0099dd)", bg: "linear-gradient(145deg,rgba(0,207,255,0.18) 0%,rgba(0,40,100,0.55) 100%)", border: "#00cfff" },
  PLANNED:  { col: "#c084fc", grad: "linear-gradient(135deg,#c084fc,#9333ea)", bg: "linear-gradient(145deg,rgba(192,132,252,0.18) 0%,rgba(60,10,130,0.55) 100%)", border: "#c084fc" },
  RESEARCH: { col: "#fbbf24", grad: "linear-gradient(135deg,#fbbf24,#d97706)", bg: "linear-gradient(145deg,rgba(251,191,36,0.18) 0%,rgba(100,45,0,0.55) 100%)", border: "#fbbf24" },
  VISION:   { col: "#f472b6", grad: "linear-gradient(135deg,#f472b6,#db2777)", bg: "linear-gradient(145deg,rgba(244,114,182,0.18) 0%,rgba(100,10,60,0.55) 100%)", border: "#f472b6" },
};

export default function RoadmapSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const titleRef  = useRef<HTMLDivElement>(null);
  const gridRef   = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [open, setOpen]         = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  /* title reveal */
  useEffect(() => {
    const el = titleRef.current; if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(Array.from(el.children),
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" } }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  /* stagger cards in */
  useEffect(() => {
    if (!open || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll<HTMLElement>(".rm-card");
    gsap.fromTo(cards,
      { opacity: 0, y: 40, scale: 0.88 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.4)", stagger: 0.055, delay: 0.05 }
    );
  }, [open]);

  /* open detail */
  const openDetail = (i: number) => { setSelected(i); };

  useEffect(() => {
    if (selected === null || !detailRef.current) return;
    gsap.fromTo(detailRef.current,
      { opacity: 0, scale: 0.88, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "back.out(1.7)" }
    );
  }, [selected]);

  const closeDetail = () => {
    if (detailRef.current)
      gsap.to(detailRef.current, { opacity: 0, scale: 0.92, y: 24, duration: 0.22, ease: "power2.in",
        onComplete: () => setSelected(null) });
    else setSelected(null);
  };

  const phase = selected !== null ? phases[selected] : null;
  const ds    = phase ? S[phase.status] : null;

  return (
    <section id="roadmap" className="relative py-24 bg-background overflow-visible transition-colors duration-500">
      <div className="section-divider absolute top-0 left-0 right-0" />

      <style>{`
        @keyframes rm-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes rm-shimmer { 0%{left:-70%} 100%{left:140%} }
        @keyframes rm-glow    { 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:.4;transform:scale(1.25)} }
        @keyframes rm-spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        .rm-card {
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s ease, border-color 0.3s ease;
          will-change: transform;
        }
        .rm-card:hover {
          transform: translateY(-8px) scale(1.04) !important;
          z-index: 2;
        }
        .rm-open-btn {
          transition: all 0.3s ease;
        }
        .rm-open-btn:hover {
          transform: scale(1.05);
        }
      `}</style>

      {/* ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{ position:"absolute", top:"5%",  left:"3%",  width:600, height:600, borderRadius:"50%", background: isDark ? "radial-gradient(circle,rgba(0,207,255,0.05) 0%,transparent 65%)" : "radial-gradient(circle,rgba(2,132,199,0.05) 0%,transparent 65%)", filter:"blur(80px)" }} />
        <div style={{ position:"absolute", bottom:"5%", right:"3%", width:500, height:500, borderRadius:"50%", background: isDark ? "radial-gradient(circle,rgba(192,132,252,0.05) 0%,transparent 65%)" : "radial-gradient(circle,rgba(124,58,237,0.05) 0%,transparent 65%)", filter:"blur(80px)" }} />
        <div style={{ position:"absolute", top:"40%", left:"40%", width:400, height:400, borderRadius:"50%", background: isDark ? "radial-gradient(circle,rgba(0,255,170,0.04) 0%,transparent 65%)" : "radial-gradient(circle,rgba(16,185,129,0.04) 0%,transparent 65%)", filter:"blur(70px)" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* ── Header ── */}
        <div ref={titleRef} className="text-center mb-14">
          <div style={{ opacity:0, fontFamily:"'IBM Plex Mono',monospace", fontSize:11, letterSpacing:"0.35em", color: isDark ? "#00cfff" : "#0284c7", marginBottom:14 }}>
            DEVELOPMENT TRAJECTORY
          </div>
          <h2 style={{ opacity:0, fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:"clamp(2rem,4.5vw,3.4rem)", letterSpacing:"-0.03em", lineHeight:1.1, color: "hsl(var(--foreground))" }}>
            Research{" "}
            <span style={{ background:"linear-gradient(90deg,#00cfff,#c084fc,#00ffaa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Roadmap
            </span>
          </h2>
          <p style={{ opacity:0, marginTop:14, fontFamily:"'Inter',sans-serif", fontSize:15, color: "hsl(var(--muted-foreground))", lineHeight:1.7 }}>
            Click the folder to reveal all 10 development phases. Click any card for full details.
          </p>
        </div>

        {/* ── Side-by-side: folder left, cards right ── */}
        <div style={{ display:"flex", alignItems:"flex-start", gap:40, position:"relative", zIndex:1 }}>

          {/* LEFT — folder column */}
          <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
            {/* decorative rings + folder */}
            <div style={{ position:"relative", width:320, height:320, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1px solid rgba(0,207,255,0.15)", animation: open ? "none" : "rm-spin-slow 12s linear infinite" }} />
              <div style={{ position:"absolute", inset:20, borderRadius:"50%", border:"1px dashed rgba(0,255,170,0.12)", animation: open ? "none" : "rm-spin-slow 8s linear infinite reverse" }} />
              <div style={{ position:"absolute", inset:40, borderRadius:"50%", border:"1px solid rgba(192,132,252,0.08)", animation: open ? "none" : "rm-spin-slow 16s linear infinite" }} />
              <div
                onClick={() => setOpen(o => !o)}
                style={{ animation: open ? "none" : "rm-float 3.5s ease-in-out infinite", cursor:"pointer", marginTop:14 }}
              >
                <Folder
                  color="#00cfff"
                  size={3}
                  items={[
                    <div key="a" style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#00ffaa44,#00cfff44)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:6, fontWeight:900, color:"#00ffaa", letterSpacing:"0.12em" }}>10 PHASES</span>
                    </div>,
                    <div key="b" style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#c084fc44,#00cfff44)", borderRadius:8 }} />,
                    <div key="c" style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#fbbf2444,#c084fc44)", borderRadius:8 }} />,
                  ]}
                />
              </div>
            </div>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, letterSpacing:"0.24em", color:"rgba(0,207,255,0.55)", textAlign:"center" }}>
              {open ? "CLICK TO CLOSE" : "CLICK TO OPEN"}
            </div>
          </div>

          {/* RIGHT — cards grid */}
          {open && (
            <div style={{ flex:1, minWidth:0 }}>
              <div
                ref={gridRef}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                style={{ position:"relative", zIndex:10 }}
              >
                {phases.map((p, i) => {
                  const s = S[p.status];
                  return (
                    <div
                      key={p.num}
                      className="rm-card glass-panel rounded-xl p-5 group"
                      onClick={() => openDetail(i)}
                      style={{ cursor:"pointer" }}
                    >
                      {/* number as icon */}
                      <div style={{
                        fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:24,
                        color:s.col, marginBottom:16,
                      }}>
                        {p.num}
                      </div>

                      {/* title */}
                      <h3 className="text-sm font-bold text-foreground mb-2" style={{ fontFamily:"'Outfit',sans-serif", letterSpacing:"0.05em" }}>
                        {p.title}
                      </h3>

                      {/* desc */}
                      <p className="text-xs leading-relaxed opacity-55 mb-4">
                        {p.desc}
                      </p>

                      {/* status tag */}
                      <div
                        className="text-[9px] font-bold tracking-widest px-2 py-1 rounded border inline-block"
                        style={{
                          fontFamily:"'Outfit',sans-serif",
                          color:s.col,
                          borderColor:`${s.col}55`,
                        }}
                      >
                        {p.status}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop:16, fontFamily:"'IBM Plex Mono',monospace", fontSize:10, letterSpacing:"0.24em", color:"rgba(148,163,184,0.35)" }}>
                CLICK ANY CARD TO VIEW FULL DETAILS
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Detail overlay (Portaled to body to guarantee dead-center positioning) ── */}
      {selected !== null && phase && ds && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          style={{
            background: isDark ? "rgba(2,6,18,0.92)" : "rgba(15,23,42,0.65)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
          }}
          onClick={closeDetail}
        >
          <div
            ref={detailRef}
            onClick={e => e.stopPropagation()}
            style={{
              margin: "auto",
              width: "min(620px,94vw)",
              borderRadius: 24,
              background: isDark
                ? "linear-gradient(160deg, rgba(14,20,40,0.98) 0%, rgba(8,12,26,0.99) 100%)"
                : "linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(246,242,232,0.99) 100%)",
              border: `1.5px solid ${ds.col}${isDark ? "40" : "60"}`,
              boxShadow: isDark
                ? `0 0 0 1px ${ds.col}15, 0 40px 100px rgba(0,0,0,0.85), 0 0 80px ${ds.col}20`
                : `0 0 0 1px ${ds.col}20, 0 25px 60px rgba(0,0,0,0.18), 0 0 40px ${ds.col}15`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* top gradient bar */}
            <div style={{ height: 4, background: ds.grad, borderRadius: "24px 24px 0 0" }} />

            {/* large watermark number */}
            <div style={{
              position: "absolute", bottom: -20, right: 24,
              fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 160, lineHeight: 1,
              color: ds.col, opacity: isDark ? 0.04 : 0.06, userSelect: "none", pointerEvents: "none",
              letterSpacing: "-0.05em",
            }}>{phase.num}</div>

            {/* top-left corner glow */}
            <div style={{ position: "absolute", top: 0, left: 0, width: 280, height: 280, background: `radial-gradient(circle at 0% 0%, ${ds.col}${isDark ? "18" : "12"}, transparent 60%)`, pointerEvents: "none" }} />
            {/* bottom-right corner glow */}
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 200, height: 200, background: `radial-gradient(circle at 100% 100%, ${ds.col}${isDark ? "0e" : "08"}, transparent 60%)`, pointerEvents: "none" }} />

            <div style={{ padding: "36px 40px 40px", position: "relative", zIndex: 1 }}>

              {/* close btn */}
              <button
                onClick={closeDetail}
                aria-label="Close modal"
                style={{
                  position: "absolute", top: 20, right: 20,
                  width: 36, height: 36, borderRadius: "50%",
                  background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}`,
                  color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                  fontSize: 22, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  lineHeight: 1, transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
                  e.currentTarget.style.color = isDark ? "#ffffff" : "#000000";
                  e.currentTarget.style.transform = "scale(1.08)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
                  e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >×</button>

              {/* phase label + status pill row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", color: ds.col }}>
                  PHASE {phase.num}
                </div>
                <div style={{ width: 1, height: 14, background: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }} />
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, fontWeight: 800, letterSpacing: "0.2em",
                  color: ds.col, background: `${ds.col}18`, border: `1px solid ${ds.col}55`,
                  padding: "5px 12px", borderRadius: 20,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: ds.col, display: "inline-block", boxShadow: `0 0 10px ${ds.col}` }} />
                  {phase.status}
                </div>
              </div>

              {/* title */}
              <h3 style={{
                fontFamily: "'Outfit',sans-serif", fontWeight: 900,
                fontSize: "clamp(1.5rem,3.2vw,2.1rem)", lineHeight: 1.2,
                color: isDark ? "#ffffff" : "hsl(222 45% 8%)", margin: "0 0 12px", letterSpacing: "-0.025em",
              }}>
                {phase.title}
              </h3>

              {/* colored underline accent */}
              <div style={{ width: 56, height: 3.5, background: ds.grad, borderRadius: 4, marginBottom: 24 }} />

              {/* description */}
              <p style={{
                fontFamily: "'Inter',sans-serif", fontSize: 15.5, lineHeight: 1.9,
                color: isDark ? "rgba(235,242,255,0.92)" : "hsl(215 35% 20%)", margin: 0, fontWeight: 400,
              }}>
                {phase.desc}
              </p>

            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
