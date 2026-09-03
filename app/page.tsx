import Hero from '@/components/home/Hero';
import {
  ProblemSection,
  HowItWorksSection,
  EvidenceSection,
  SampleVerificationCard,
  MetricsSection,
  ExploreLedgerSection,
  ESGSection,
  CommunityLedgerSection,
  CTABanner,
} from '@/components/home/HomeSections';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <HowItWorksSection />
      <EvidenceSection />
      <SampleVerificationCard />
      <MetricsSection />
      <ExploreLedgerSection />
      <ESGSection />
      <CommunityLedgerSection />
      <CTABanner />
    </>
  );
}
