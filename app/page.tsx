import Hero from '@/components/home/Hero';
import {
  ValueStrip,
  ProblemSection,
  HowItWorksSection,
  EvidenceSection,
  SampleClaimSection,
  MetricsSection,
  ExploreLedgerSection,
  ESGSection,
  CommunityLedgerSection,
  CTASection,
} from '@/components/home/HomeSections';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueStrip />
      <ProblemSection />
      <HowItWorksSection />
      <EvidenceSection />
      <SampleClaimSection />
      <MetricsSection />
      <ExploreLedgerSection />
      <ESGSection />
      <CommunityLedgerSection />
      <CTASection />
    </>
  );
}
