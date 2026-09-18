import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/features/HeroSection";
import ProblemSection from "@/components/features/ProblemSection";
import BigIdeaSection from "@/components/features/BigIdeaSection";
import NotAnAISection from "@/components/features/NotAnAISection";
import HowItWorksSection from "@/components/features/HowItWorksSection";
import BCISection from "@/components/features/BCISection";
import NeuralDecoderSection from "@/components/features/NeuralDecoderSection";
import LiveDemoSection from "@/components/features/LiveDemoSection";
import SecondBodySection from "@/components/features/SecondBodySection";
import TwowaySection from "@/components/features/TwowaySection";
import RoadmapSection from "@/components/features/RoadmapSection";
import TechStackSection from "@/components/features/TechStackSection";
import ApplicationsSection from "@/components/features/ApplicationsSection";
import ResearchSection from "@/components/features/ResearchSection";
import SafetySection from "@/components/features/SafetySection";
import MarketSection from "@/components/features/MarketSection";
import InvestorSection from "@/components/features/InvestorSection";
import ClosingSection from "@/components/features/ClosingSection";
import RobotViewerSection from "@/components/features/RobotViewerSection";

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <BigIdeaSection />
        <NotAnAISection />
        <HowItWorksSection />
        <RobotViewerSection />
        <BCISection />
        <NeuralDecoderSection />
        <LiveDemoSection />
        <SecondBodySection />
        <TwowaySection />
        <RoadmapSection />
        <TechStackSection />
        <ApplicationsSection />
        <ResearchSection />
        <SafetySection />
        <MarketSection />
        <InvestorSection />
        <ClosingSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))/30] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--neural-cyan))] glow-pulse" />
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
