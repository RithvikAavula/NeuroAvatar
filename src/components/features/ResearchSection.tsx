import { useState } from "react";
import { useInView } from "@/hooks/useInView";

const topics = [
  {
    title: "MOTOR IMAGERY",
    icon: "🧠",
    what: "Motor imagery refers to the mental simulation of movement without physical execution. When a person imagines moving their hand, the motor cortex generates neural patterns similar to actual movement.",
    why: "Motor imagery BCI systems do not require any physical movement, making them potentially accessible to individuals with severe motor impairments.",
    limitations: "Signal-to-noise ratio is low in non-invasive EEG. Individual variability is significant. Training and adaptation time can be substantial.",
  },
  {
    title: "EEG OSCILLATIONS",
    icon: "〜",
    what: "Motor-related EEG rhythms — particularly the mu rhythm (8–12 Hz) and beta rhythm (13–30 Hz) — show characteristic event-related desynchronization (ERD) during motor imagery.",
    why: "These oscillatory changes in specific electrode locations (C3, C4, Cz) provide spatially specific information about intended movement laterality and type.",
    limitations: "ERD patterns overlap in frequency with other cognitive activities. Muscular and ocular artifacts can obscure signals. Signal resolution is limited by volume conduction.",
  },
  {
    title: "BCI DECODING",
    icon: "◈",
    what: "Machine learning algorithms are trained to classify motor intentions from EEG features. Methods range from classical spatial filtering (CSP-LDA) to deep learning (EEGNet, Transformers).",
    why: "Reliable decoding of motor intentions at sufficient accuracy and speed is the core technical challenge enabling BCI-controlled teleoperation.",
    limitations: "Current non-invasive BCIs achieve limited decoding accuracy compared to invasive methods. Continuous kinematic decoding remains an open research problem.",
  },
  {
    title: "MOTION RETARGETING",
    icon: "⇄",
    what: "Human and robot bodies have different morphologies. Motion retargeting mathematically maps human joint movements to robot joint space while preserving movement intent.",
    why: "Without proper retargeting, movements decoded from human motor intentions may produce unnatural or infeasible robot postures.",
    limitations: "Kinematic constraints differ significantly between humans and robots. Real-time retargeting with balance constraints is computationally challenging.",
  },
  {
    title: "WHOLE-BODY CONTROL",
    icon: "⊕",
    what: "Whole-body controllers (WBC) coordinate all robot joints simultaneously to achieve desired Cartesian motions while satisfying constraints such as balance, joint limits, and contact forces.",
    why: "Without WBC, naively commanding individual joints from decoded motor intentions would cause the robot to fall or violate physical constraints.",
    limitations: "WBC algorithms require accurate robot models. Real-time performance is challenging. Handling unexpected contacts and perturbations is an active research area.",
  },
  {
    title: "SENSORY FEEDBACK",
    icon: "◎",
    what: "Closing the loop with sensory feedback from the robot to the operator (vision, touch, proprioception) could enhance the sense of embodiment and control quality.",
    why: "Bidirectional communication between human and robot avatar would enable more natural and effective teleoperation with richer situational awareness.",
    limitations: "Non-invasive sensory feedback channels are limited. Haptic feedback systems add hardware complexity. Latency must be minimized to prevent perceptual disruption.",
  },
];

export default function ResearchSection() {
  const { ref, inView } = useInView(0.1);
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="research" ref={ref} className="relative py-32 overflow-hidden" style={{ background: 'hsl(220 25% 5%)' }}>
      <div className="section-divider absolute top-0 left-0 right-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="tech-label mb-4 opacity-50">SCIENTIFIC FOUNDATION</div>
          <h2
            className="font-bold text-white"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
          >
            THE SCIENCE BEHIND
            <br />
            <span className="gradient-text-cyan">NEUROAVATAR</span>
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {topics.map((topic, i) => (
            <div
              key={topic.title}
              className={`glass-panel rounded-xl overflow-hidden transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <button
                className="w-full p-6 flex items-center justify-between gap-4 hover:bg-white/2 transition-colors duration-200 text-left"
                onClick={() => setExpanded(expanded === i ? null : i)}
                data-interactive="true"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{topic.icon}</span>
                  <div>
                    <div className="tech-label text-[hsl(var(--neural-cyan))]">{topic.title}</div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border border-[hsl(var(--neural-cyan))/40] flex items-center justify-center transition-transform duration-300 ${expanded === i ? 'rotate-45' : ''}`}>
                  <span className="text-[hsl(var(--neural-cyan))] text-lg leading-none" style={{ marginTop: '-2px' }}>+</span>
                </div>
              </button>

              {expanded === i && (
                <div className="px-6 pb-6 border-t border-[hsl(var(--border))/30]">
                  <div className="grid md:grid-cols-3 gap-6 mt-6">
                    <div>
                      <div className="tech-label mb-2 text-[hsl(var(--neural-cyan))/60]">WHAT IT IS</div>
                      <p className="text-sm leading-relaxed opacity-70">{topic.what}</p>
                    </div>
                    <div>
                      <div className="tech-label mb-2 text-[hsl(var(--neural-cyan))/60]">WHY IT MATTERS</div>
                      <p className="text-sm leading-relaxed opacity-70">{topic.why}</p>
                    </div>
                    <div>
                      <div className="tech-label mb-2 text-amber-400/60">CURRENT LIMITATIONS</div>
                      <p className="text-sm leading-relaxed opacity-70">{topic.limitations}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
