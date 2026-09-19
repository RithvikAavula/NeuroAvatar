import { useState } from "react";
import { useInView } from "@/hooks/useInView";

const CYAN   = "hsl(var(--neural-cyan))";
const VIOLET = "hsl(var(--neural-violet))";

const businessLayers = [
  { label: "NEUROAVATAR HARDWARE",  desc: "BCI headset + humanoid platform",       color: "#00cfff", icon: "⬡" },
  { label: "BCI SOFTWARE PLATFORM", desc: "Signal processing + decoder stack",      color: "#c084fc", icon: "◈" },
  { label: "ROBOT CONTROL SOFTWARE",desc: "Whole-body controller + retargeting",    color: "#00ffaa", icon: "⊕" },
  { label: "DEVELOPER SDK",         desc: "Third-party integration APIs",           color: "#f59e0b", icon: "⟡" },
  { label: "TELEPRESENCE PLATFORM", desc: "End-to-end avatar experience",           color: "#f472b6", icon: "◎" },
];

const markets = [
  { label: "TAM", sublabel: "Total Addressable Market", note: "Insert verified figure", color: "#00cfff" },
  { label: "SAM", sublabel: "Serviceable Market",       note: "Insert verified figure", color: "#c084fc" },
  { label: "SOM", sublabel: "Obtainable Market",        note: "Insert verified figure", color: "#00ffaa" },
];

const customers = [
  { text: "Research institutions & universities",        icon: "🎓" },
  { text: "Neuroscience & BCI research labs",            icon: "🧠" },
  { text: "Healthcare technology companies",             icon: "⚕️" },
  { text: "Assistive technology organizations",          icon: "♿" },
  { text: "Industrial teleoperation companies",          icon: "🏭" },
  { text: "Aerospace / hazardous-environment operators", icon: "🚀" },
  { text: "Robotics platform developers",                icon: "🤖" },
  { text: "Defense & public safety agencies",            icon: "🛡️" },
];

const matrix = [
  { category: "Traditional Robotics",   control: "Autonomous / Programmed", intention: "None",               embodiment: "Machine",          continuous: "N/A",          highlight: false },
  { category: "Voice-Controlled",        control: "Voice commands",           intention: "High-level verbal",  embodiment: "Machine",          continuous: "Limited",      highlight: false },
  { category: "AI Autonomous Agents",    control: "Goal-based AI",            intention: "Task specification", embodiment: "Machine",          continuous: "N/A",          highlight: false },
  { category: "Joystick Teleoperation",  control: "Manual joystick",          intention: "Indirect input",     embodiment: "Operator-driven",  continuous: "Partial",      highlight: false },
  { category: "NeuroAvatar (Target)",    control: "Motor intention",          intention: "Direct neural",      embodiment: "Physical extension",continuous: "Research goal",highlight: true  },
];

const COLS = ["APPROACH", "CONTROL INPUT", "MOTOR INTENTION", "EMBODIMENT", "CONTINUOUS CONTROL"];

export default function MarketSection() {
  const { ref, inView } = useInView(0.1);
  const [hoveredLayer,    setHoveredLayer]    = useState<number | null>(null);
  const [hoveredMarket,   setHoveredMarket]   = useState<number | null>(null);
  const [hoveredCustomer, setHoveredCustomer] = useState<number | null>(null);
  const [hoveredRow,      setHoveredRow]      = useState<number | null>(null);

  return (
    <section id="market" ref={ref} className="relative py-32 overflow-hidden bg-background">
      <div className="section-divider absolute top-0 left-0 right-0" />

      <style>{`
        @keyframes ms-shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes ms-pulse   { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:.3;transform:scale(1.3)} }
        @keyframes ms-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes ms-scan    { 0%{top:-30%} 100%{top:130%} }
        @keyframes ms-ring    { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.8);opacity:0} }
        .ms-layer { transition: all 0.3s cubic-bezier(0.22,1,0.36,1); }
        .ms-layer:hover { transform: translateX(6px) scale(1.01); }
        .ms-mcard { transition: all 0.3s cubic-bezier(0.22,1,0.36,1); }
        .ms-mcard:hover { transform: translateY(-6px) scale(1.03); }
        .ms-cust  { transition: all 0.25s ease; }
        .ms-cust:hover { transform: translateX(6px); }
        .ms-row   { transition: all 0.2s ease; }
      `}</style>

      {/* ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{ position:"absolute", top:"5%",  left:"2%",  width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,207,255,0.05) 0%,transparent 65%)", filter:"blur(80px)" }} />
        <div style={{ position:"absolute", bottom:"5%", right:"2%", width:450, height:450, borderRadius:"50%", background:"radial-gradient(circle,rgba(192,132,252,0.05) 0%,transparent 65%)", filter:"blur(80px)" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="tech-label mb-4 opacity-50">MARKET OPPORTUNITY</div>
          <h2 className="font-bold gradient-text-white" style={{ fontSize:"clamp(1.8rem,5vw,3.5rem)", letterSpacing:"-0.02em" }}>
            THE PLATFORM <span className="gradient-text-cyan">MODEL</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">

          {/* ── Revenue Architecture ── */}
          <div className={`transition-all duration-1000 delay-200 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
            <div className="tech-label mb-6 opacity-60" style={{ fontSize:12 }}>REVENUE ARCHITECTURE</div>
            <div className="flex flex-col gap-2">
              {businessLayers.map((layer, i) => {
                const isHov = hoveredLayer === i;
                return (
                  <div
                    key={layer.label}
                    className="ms-layer glass-panel rounded-xl relative overflow-hidden cursor-default"
                    style={{
                      padding:"16px 20px",
                      borderColor: isHov ? `${layer.color}66` : undefined,
                      boxShadow: isHov ? `0 0 0 1px ${layer.color}22, 0 8px 32px ${layer.color}18` : undefined,
                    }}
                    onMouseEnter={() => setHoveredLayer(i)}
                    onMouseLeave={() => setHoveredLayer(null)}
                  >
                    {/* shimmer */}
                    {isHov && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                        <div style={{ position:"absolute", top:0, bottom:0, width:"40%", background:`linear-gradient(90deg,transparent,${layer.color}0a,transparent)`, animation:"ms-shimmer 2s ease-in-out infinite" }} />
                      </div>
                    )}
                    {/* left bar */}
                    <div style={{ position:"absolute", top:0, left:0, bottom:0, width:3, background:`linear-gradient(180deg,${layer.color},${layer.color}44)`, borderRadius:"2px 0 0 2px", opacity: isHov ? 1 : 0.4, transition:"opacity 0.3s" }} />

                    <div style={{ display:"flex", alignItems:"center", gap:14, paddingLeft:8 }}>
                      <div style={{
                        width:38, height:38, borderRadius:10, flexShrink:0,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:18, background:`${layer.color}18`,
                        border:`1px solid ${layer.color}${isHov ? "55" : "22"}`,
                        boxShadow: isHov ? `0 0 16px ${layer.color}44` : "none",
                        transition:"all 0.3s ease",
                        animation: isHov ? "ms-float 2.5s ease-in-out infinite" : "none",
                      }}>
                        {layer.icon}
                      </div>
                      <div>
                        <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:13, letterSpacing:"0.1em", color: isHov ? layer.color : "hsl(var(--foreground))", transition:"color 0.3s" }}>
                          {layer.label}
                        </div>
                        <div style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:"hsl(var(--muted-foreground))", marginTop:2 }}>
                          {layer.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── TAM/SAM/SOM + Customers ── */}
          <div className={`transition-all duration-1000 delay-400 ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
            <div className="tech-label mb-6 opacity-60" style={{ fontSize:12 }}>MARKET SIZE (PLACEHOLDER)</div>
            <div className="grid grid-cols-3 gap-3 mb-10">
              {markets.map((m, i) => {
                const isHov = hoveredMarket === i;
                return (
                  <div
                    key={m.label}
                    className="ms-mcard glass-panel rounded-xl text-center relative overflow-hidden cursor-default"
                    style={{
                      padding:"20px 12px",
                      borderColor: isHov ? `${m.color}66` : undefined,
                      boxShadow: isHov ? `0 0 0 1px ${m.color}22, 0 16px 48px ${m.color}22` : undefined,
                    }}
                    onMouseEnter={() => setHoveredMarket(i)}
                    onMouseLeave={() => setHoveredMarket(null)}
                  >
                    {/* top bar */}
                    <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,transparent,${m.color},transparent)`, opacity: isHov ? 1 : 0.4, transition:"opacity 0.3s" }} />
                    {/* pulse ring */}
                    {isHov && <div style={{ position:"absolute", top:"50%", left:"50%", width:60, height:60, borderRadius:"50%", border:`1px solid ${m.color}`, transform:"translate(-50%,-50%)", animation:"ms-ring 1.6s ease-out infinite", pointerEvents:"none" }} />}

                    <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:28, color: m.color, lineHeight:1, marginBottom:6, textShadow: isHov ? `0 0 20px ${m.color}88` : "none", transition:"text-shadow 0.3s" }}>
                      {m.label}
                    </div>
                    <div style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"hsl(var(--muted-foreground))", marginBottom:10, lineHeight:1.4 }}>
                      {m.sublabel}
                    </div>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:"#fbbf24", border:"1px solid rgba(251,191,36,0.25)", borderRadius:20, padding:"3px 8px", display:"inline-block" }}>
                      {m.note}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="tech-label mb-4 opacity-60" style={{ fontSize:12 }}>TARGET CUSTOMER SEGMENTS</div>
            <div className="grid grid-cols-2 gap-3">
              {customers.map((c, i) => {
                const isHov = hoveredCustomer === i;
                const colors = ["#00cfff","#a78bfa","#00ffaa","#f59e0b","#f472b6","#60a5fa","#00cfff","#c084fc"];
                const col = colors[i];
                return (
                  <div
                    key={c.text}
                    className="ms-cust glass-panel rounded-xl relative overflow-hidden cursor-default"
                    style={{
                      padding:"14px 16px",
                      borderColor: isHov ? `${col}66` : undefined,
                      boxShadow: isHov ? `0 0 0 1px ${col}18, 0 8px 32px ${col}18` : undefined,
                      transitionDelay:`${i*30}ms`,
                    }}
                    onMouseEnter={() => setHoveredCustomer(i)}
                    onMouseLeave={() => setHoveredCustomer(null)}
                  >
                    {/* top accent bar */}
                    <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${col},transparent)`, opacity: isHov ? 1 : 0.3, transition:"opacity 0.3s" }} />
                    {/* shimmer */}
                    {isHov && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                        <div style={{ position:"absolute", top:0, bottom:0, width:"40%", background:`linear-gradient(90deg,transparent,${col}0a,transparent)`, animation:"ms-shimmer 2s ease-in-out infinite" }} />
                      </div>
                    )}
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{
                        width:38, height:38, borderRadius:10, flexShrink:0,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:18,
                        background: isHov ? `${col}22` : `${col}0f`,
                        border:`1px solid ${isHov ? col+"55" : col+"22"}`,
                        boxShadow: isHov ? `0 0 16px ${col}55` : "none",
                        transition:"all 0.3s ease",
                        animation: isHov ? "ms-float 2.5s ease-in-out infinite" : "none",
                      }}>
                        {c.icon}
                      </div>
                      <span style={{
                        fontFamily:"'Inter',sans-serif", fontSize:13, lineHeight:1.4,
                        fontWeight: isHov ? 700 : 500,
                        color: isHov ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                        transition:"all 0.25s",
                      }}>
                        {c.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Competitive Matrix ── */}
        <div className={`transition-all duration-1000 delay-600 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="tech-label mb-8" style={{ fontSize:14, fontWeight:800, letterSpacing:"0.2em", opacity:0.9 }}>COMPETITIVE POSITIONING</div>

          {/* column header pills */}
          <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr 1fr 1fr 1fr", gap:8, marginBottom:10, padding:"0 4px" }}>
            {COLS.map((h, ci) => (
              <div key={h} style={{
                fontFamily:"'Outfit',sans-serif", fontSize:12, fontWeight:900,
                letterSpacing:"0.12em", color:"hsl(var(--foreground))",
                padding:"10px 14px", borderRadius:20,
                background:"linear-gradient(135deg,hsl(var(--neural-cyan)/0.25),hsl(var(--neural-violet)/0.15))",
                border:"1px solid hsl(var(--neural-cyan)/0.35)",
                textAlign: ci === 0 ? "left" : "center",
                boxShadow:"0 2px 12px hsl(var(--neural-cyan)/0.1)",
              }}>{h}</div>
            ))}
          </div>

          {/* rows as cards */}
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {matrix.map((row, i) => {
              const isHov = hoveredRow === i;
              const isNA  = row.highlight;
              const rowColors = ["#64748b","#64748b","#64748b","#64748b","#00cfff"];
              const c = rowColors[i];
              return (
                <div
                  key={row.category}
                  className="ms-row glass-panel rounded-xl relative overflow-hidden cursor-default"
                  style={{
                    display:"grid", gridTemplateColumns:"1.4fr 1fr 1fr 1fr 1fr",
                    gap:8, padding:"18px 16px",
                    borderColor: isNA ? (isHov ? "#00cfff88" : "#00cfff55") : isHov ? "hsl(var(--border)/0.8)" : undefined,
                    boxShadow: isNA
                      ? isHov ? "0 0 0 1px #00cfff22,0 12px 48px #00cfff22" : "0 0 0 1px #00cfff18"
                      : isHov ? "0 4px 24px rgba(0,0,0,0.15)" : undefined,
                    background: isNA
                      ? isHov ? "linear-gradient(135deg,rgba(0,207,255,0.12),rgba(0,207,255,0.04))" : "linear-gradient(135deg,rgba(0,207,255,0.07),rgba(0,207,255,0.02))"
                      : isHov ? "hsl(var(--surface-3)/0.7)" : undefined,
                    transitionDelay:`${i*40}ms`,
                  }}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* shimmer on NA row */}
                  {isNA && isHov && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                      <div style={{ position:"absolute", top:0, bottom:0, width:"35%", background:"linear-gradient(90deg,transparent,rgba(0,207,255,0.08),transparent)", animation:"ms-shimmer 2.2s ease-in-out infinite" }} />
                    </div>
                  )}
                  {/* left accent */}
                  <div style={{ position:"absolute", top:0, left:0, bottom:0, width:4,
                    background: isNA ? "linear-gradient(180deg,#00cfff,#00cfff44)" : isHov ? "linear-gradient(180deg,hsl(var(--border)),transparent)" : "transparent",
                    borderRadius:"2px 0 0 2px", transition:"all 0.3s" }} />

                  {/* APPROACH cell */}
                  <div style={{ display:"flex", alignItems:"center", gap:10, paddingLeft:10 }}>
                    {isNA
                      ? <div style={{ width:8, height:8, borderRadius:"50%", background:"#00cfff", boxShadow:"0 0 12px #00cfff", flexShrink:0, animation:"ms-pulse 2s ease-in-out infinite" }} />
                      : <div style={{ width:6, height:6, borderRadius:"50%", background:"hsl(var(--muted-foreground))", flexShrink:0, opacity: isHov ? 0.7 : 0.3, transition:"opacity 0.2s" }} />
                    }
                    <span style={{
                      fontFamily:"'Outfit',sans-serif",
                      fontWeight: isNA ? 900 : isHov ? 700 : 600,
                      fontSize: isNA ? 15 : 14,
                      color: isNA ? "#00cfff" : isHov ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                      transition:"all 0.2s",
                      textShadow: isNA && isHov ? "0 0 20px #00cfff88" : "none",
                    }}>
                      {row.category}
                    </span>
                  </div>

                  {/* value cells */}
                  {[row.control, row.intention, row.embodiment, row.continuous].map((val, ci) => (
                    <div key={ci} style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{
                        fontFamily:"'Inter',sans-serif",
                        fontSize: isNA ? 13 : 13,
                        fontWeight: isNA ? 600 : isHov ? 500 : 400,
                        color: isNA ? "hsl(var(--foreground))" : isHov ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                        opacity: isNA ? 1 : isHov ? 1 : 0.55,
                        padding:"5px 12px", borderRadius:20,
                        background: isNA
                          ? "hsl(var(--neural-cyan)/0.12)"
                          : isHov ? "hsl(var(--surface-3)/0.8)" : "transparent",
                        border: isNA
                          ? "1px solid hsl(var(--neural-cyan)/0.3)"
                          : isHov ? "1px solid hsl(var(--border)/0.5)" : "1px solid transparent",
                        transition:"all 0.2s ease",
                        display:"inline-block", textAlign:"center",
                        lineHeight:1.4,
                      }}>
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <p style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:"hsl(var(--muted-foreground))", opacity:0.4, marginTop:14, textAlign:"center" }}>
            Competitive comparison based on publicly known characteristics. Does not constitute verified benchmarking data.
          </p>
        </div>

      </div>
    </section>
  );
}
