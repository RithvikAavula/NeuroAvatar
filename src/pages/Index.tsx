import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/features/HeroSection";
import ProblemSection from "@/components/features/ProblemSection";
import BigIdeaSection from "@/components/features/BigIdeaSection";
import NotAnAISection from "@/components/features/NotAnAISection";
import HowItWorksSection from "@/components/features/HowItWorksSection";
import DemoSection from "@/components/features/DemoSection";
import NeuralDecoderSection from "@/components/features/NeuralDecoderSection";
import TwowaySection from "@/components/features/TwowaySection";
import RoadmapSection from "@/components/features/RoadmapSection";
import ApplicationsSection from "@/components/features/ApplicationsSection";
import ResearchSection from "@/components/features/ResearchSection";
import MarketSection from "@/components/features/MarketSection";
import InvestorSection from "@/components/features/InvestorSection";
import ClosingSection from "@/components/features/ClosingSection";

gsap.registerPlugin(ScrollTrigger);

export default function Index() {
  const progressRef = useRef<HTMLDivElement>(null);

  // Scroll progress bar
  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    const update = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? scrolled / total : 0;
      bar.style.transform = `scaleX(${pct})`;
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Section entrance animations — card-lift stagger for all sections
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("main > section:not(:first-child)").forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 45 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Horizontal divider lines draw in
      gsap.utils.toArray<HTMLElement>(".section-divider").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1, opacity: 1,
            duration: 1.2,
            ease: "power2.out",
            transformOrigin: "left center",
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
          }
        );
      });

      // Section accent lines
      gsap.utils.toArray<HTMLElement>(".section-accent-line").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1, opacity: 1,
            duration: 1.0,
            ease: "expo.out",
            transformOrigin: "left center",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          }
        );
      });

      // Glass panel cards — stagger reveal
      gsap.utils.toArray<HTMLElement>(".glass-panel, .glass-panel-bright").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))', transition: 'background-color 0.4s ease, color 0.4s ease' }}>
      {/* Scroll progress bar */}
      <div ref={progressRef} id="scroll-progress" style={{ transform: 'scaleX(0)' }} />
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <BigIdeaSection />
        <NotAnAISection />
        <HowItWorksSection />
        <DemoSection />
        <NeuralDecoderSection />
        <TwowaySection />
        <RoadmapSection />
        <ApplicationsSection />
        <ResearchSection />
        <MarketSection />
        <InvestorSection />
        <ClosingSection />
      </main>

      {/* Footer */}
      <footer className="relative border-t py-10 px-6 overflow-hidden" style={{ borderColor: "hsl(var(--border) / 0.3)" }}>
        {/* Subtle gradient top edge */}
        <div className="absolute top-0 left-0 right-0 h-px section-accent-line" />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full glow-pulse" style={{ background: "hsl(var(--neural-cyan))" }} />
            <span className="tech-label opacity-40">NEUROAVATAR</span>
            <span className="tech-label opacity-20">·</span>
            <span className="tech-label opacity-30">RESEARCH PLATFORM</span>
          </div>
          <div className="tech-label opacity-20 text-center">
            All demonstrations are simulated. This website is for research and investor information purposes.
          </div>
          <div className="tech-label opacity-30">
            © 2026 NEUROAVATAR
          </div>
        </div>
      </footer>
    </div>
  );
}

