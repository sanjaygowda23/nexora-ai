import { usePageMeta } from "@/components/layout/PageMeta";
import { Hero } from "@/components/marketing/home/Hero";
import { TrustedBy } from "@/components/marketing/home/TrustedBy";
import { Challenges } from "@/components/marketing/home/Challenges";
import { SolutionsBento } from "@/components/marketing/home/SolutionsBento";
import { ArchitectureSection } from "@/components/marketing/home/ArchitectureSection";
import { HowItWorks } from "@/components/marketing/home/HowItWorks";
import { ImpactCalculator } from "@/components/marketing/home/ImpactCalculator";
import { FeaturedCases } from "@/components/marketing/home/FeaturedCases";
import { IndustryShowcase } from "@/components/marketing/home/IndustryShowcase";
import { Testimonials } from "@/components/marketing/home/Testimonials";
import { FinalCTA } from "@/components/marketing/FinalCTA";

export default function Home() {
  usePageMeta("NEXORA AI", "NEXORA AI designs, deploys and operates enterprise AI agents, intelligent workflow automation and governed AI infrastructure.");
  return (
    <>
      <Hero />
      <TrustedBy />
      <Challenges />
      <SolutionsBento />
      <ArchitectureSection />
      <HowItWorks />
      <ImpactCalculator />
      <FeaturedCases />
      <IndustryShowcase />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
