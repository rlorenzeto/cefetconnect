import { Navbar } from "../../components/landing/Navbar";
import { Hero } from "../../components/landing/Hero";
import { ProblemSection } from "../../components/landing/ProblemSection";
import { FeaturesSection } from "../../components/landing/FeaturesSection";
import { BenefitsSection } from "../../components/landing/BenefitsSection";
import { StepsSection } from "../../components/landing/StepsSection";
import { CredibilitySection } from "../../components/landing/CredibilitySection";
import { CtaSection } from "../../components/landing/CtaSection";
import { Footer } from "../../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <FeaturesSection />
        <BenefitsSection />
        <StepsSection />
        <CredibilitySection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}