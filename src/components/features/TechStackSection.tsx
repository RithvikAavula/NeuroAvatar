import { useInView } from "@/hooks/useInView";

const techCategories = [
  {
    category: "BCI & NEUROSCIENCE",
    color: "cyan",
    items: [
      { name: "Python", role: "Primary BCI processing language" },
      { name: "MNE-Python", role: "EEG/MEG signal processing" },
      { name: "BrainFlow", role: "Cross-platform BCI data acquisition" },
      { name: "PyTorch", role: "Neural network model training" },
      { name: "NumPy / SciPy", role: "Signal processing primitives" },
    ],
  },
  {
    category: "AI / DECODER",
    color: "violet",
    items: [
      { name: "EEGNet", role: "Compact CNN architecture for EEG" },
      { name: "CNN", role: "Spatial-temporal feature extraction" },
      { name: "LSTM", role: "Temporal sequence modeling" },
      { name: "Transformers", role: "Attention-based EEG decoding" },
      { name: "scikit-learn", role: "Classical ML baseline methods" },
    ],
  },
  {
    category: "ROBOTICS",
    color: "cyan",
    items: [
      { name: "ROS 2", role: "Robot Operating System framework" },
      { name: "C++", role: "Real-time motion control" },
      { name: "Python", role: "High-level robot interface" },
      { name: "Inverse Kinematics", role: "Joint space computation" },
      { name: "Whole-Body Control", role: "Balance + motion coordination" },
    ],
  },
  {
    category: "SIMULATION",
    color: "violet",
    items: [
      { name: "MuJoCo", role: "Physics-based robot simulation" },
      { name: "Gazebo", role: "ROS-integrated simulation env" },
      { name: "Isaac Sim", role: "GPU-accelerated simulation" },
      { name: "PyBullet", role: "Rapid prototyping simulation" },
    ],
  },
  {
    category: "HARDWARE (TARGET)",
    color: "cyan",
    items: [
      { name: "EEG Headset", role: "Non-invasive BCI acquisition" },
      { name: "IMU Sensors", role: "Motion reference tracking" },
      { name: "RGB-D Camera", role: "Robot-mounted perception" },
      { name: "DYNAMIXEL", role: "Servo actuators for prototype" },
      { name: "Embedded Controller", role: "Real-time joint control" },
    ],
  },
  {
    category: "VISUALIZATION",
    color: "violet",
    items: [
      { name: "React / TypeScript", role: "Interface & demo platform" },
      { name: "Three.js", role: "3D visualization layer" },
      { name: "GSAP", role: "High-performance animations" },
      { name: "Python Dash", role: "BCI data monitoring" },
    ],
  },
];

export default function TechStackSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 100%, hsl(191 40% 6%), hsl(220 27% 4%))' }} />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="tech-label mb-4 opacity-50">ENGINEERING ARCHITECTURE</div>
          <h2
            className="font-bold text-white"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
          >
            TECHNOLOGY <span className="gradient-text-cyan">STACK</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techCategories.map((cat, i) => (
            <div
              key={cat.category}
              className={`glass-panel rounded-2xl p-6 hover:border-[hsl(var(--neural-cyan))/20] transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={`tech-label mb-5 ${cat.color === 'cyan' ? 'text-[hsl(var(--neural-cyan))]' : 'text-[hsl(var(--neural-violet))]'} opacity-90`}>
                {cat.category}
              </div>
              <div className="flex flex-col gap-3">
                {cat.items.map((item) => (
                  <div key={item.name} className="flex items-start gap-3 group">
                    <div className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${cat.color === 'cyan' ? 'bg-[hsl(var(--neural-cyan))/50]' : 'bg-[hsl(var(--neural-violet))/50]'}`} />
                    <div>
                      <div className="text-sm font-semibold text-white/90" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.name}</div>
                      <div className="text-xs text-white/30 mt-0.5">{item.role}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Bottom accent line */}
              <div className={`mt-5 h-px ${cat.color === 'cyan' ? 'bg-[hsl(var(--neural-cyan))/15]' : 'bg-[hsl(var(--neural-violet))/15]'}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
