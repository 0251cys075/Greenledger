'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Circle, Loader2, ShieldCheck, Database, Search, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PipelineStep {
  id: number;
  label: string;
  description: string;
  durationMs: number;
  icon: typeof Search;
}

const PIPELINE_STEPS: PipelineStep[] = [
  { id: 1, label: 'Claim detected', description: 'Environmental entity parsed & normalized from input.', durationMs: 650, icon: Search },
  { id: 2, label: 'Product identified', description: 'Brand and category context mapped to taxonomy.', durationMs: 800, icon: FileText },
  { id: 3, label: 'Evidence retrieved', description: 'Cross-referencing corporate sustainability reports & databases.', durationMs: 1100, icon: Database },
  { id: 4, label: 'Certifications checked', description: 'Querying EU Ecolabel, FSC, GRS, and ISO 14021 registries.', durationMs: 950, icon: ShieldCheck },
  { id: 5, label: 'Applying verification rules', description: 'Deterministic engine weighting independent vs. self-reported proof.', durationMs: 750, icon: CheckCircle2 },
  { id: 6, label: 'Generating result', description: 'Finalizing transparent verdict & auditable explanation.', durationMs: 500, icon: ShieldCheck },
];

function AnalysisContent() {
  const router = useRouter();
  const params = useSearchParams();
  const resultId = params.get('id') || 'demo-1';

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [claim, setClaim] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClaim(sessionStorage.getItem('gl_claim') || '"100% Eco-Friendly"');
    }
  }, []);

  useEffect(() => {
    let cumulative = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    PIPELINE_STEPS.forEach((step) => {
      const activateAt = cumulative;
      timeouts.push(
        setTimeout(() => {
          setActiveStep(step.id);
        }, activateAt)
      );

      cumulative += step.durationMs;

      const completeAt = cumulative;
      timeouts.push(
        setTimeout(() => {
          setCompletedSteps((prev) => [...prev, step.id]);
        }, completeAt)
      );
    });

    const totalDuration = cumulative + 400;
    timeouts.push(
      setTimeout(() => {
        router.push(`/result/${resultId}`);
      }, totalDuration)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [resultId, router]);

  return (
    <div className="min-h-screen bg-[#0B241A] text-[#F3F0E8] flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#63D6A2]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 bg-[#12382A] border border-[#63D6A2]/30 rounded-full px-4 py-1.5 mb-5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#63D6A2] animate-pulse" />
            <span className="text-xs font-mono font-semibold text-[#63D6A2] uppercase tracking-wider">
              Verification Engine Active
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F3F0E8] mb-3">
            Cross-Referencing Evidence
          </h1>
          {claim && (
            <p className="text-[#F3F0E8]/70 text-sm max-w-md mx-auto truncate font-light">
              Claim: <span className="font-medium text-[#63D6A2]">&ldquo;{claim}&rdquo;</span>
            </p>
          )}
        </div>

        {/* Pipeline container */}
        <div className="bg-[#12382A]/90 border border-[#63D6A2]/25 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="space-y-1">
            {PIPELINE_STEPS.map((step, idx) => {
              const isDone = completedSteps.includes(step.id);
              const isActive = activeStep === step.id && !isDone;
              const isPending = !isDone && !isActive;

              return (
                <div key={step.id}>
                  <div
                    className={cn(
                      'flex items-start gap-4 py-3.5 px-4 rounded-xl transition-all duration-300',
                      isDone
                        ? 'bg-[#0B241A]/70 border border-[#63D6A2]/20'
                        : isActive
                        ? 'bg-[#0B241A] border border-[#63D6A2]/50 shadow-md ring-1 ring-[#63D6A2]/30'
                        : 'opacity-40'
                    )}
                  >
                    {/* Node status indicator */}
                    <div className="flex-shrink-0 mt-0.5">
                      {isDone ? (
                        <div className="w-5 h-5 rounded-full bg-[#63D6A2] text-[#0B241A] flex items-center justify-center font-bold text-xs animate-fade-in">
                          ✓
                        </div>
                      ) : isActive ? (
                        <div className="w-5 h-5 rounded-full border-2 border-[#63D6A2] flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-[#63D6A2] animate-ping" />
                        </div>
                      ) : (
                        <Circle size={20} className="text-[#F3F0E8]/30" />
                      )}
                    </div>

                    {/* Step details */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-sm font-semibold transition-colors',
                          isDone
                            ? 'text-[#63D6A2]'
                            : isActive
                            ? 'text-[#F3F0E8]'
                            : 'text-[#F3F0E8]/50'
                        )}
                      >
                        {step.label}
                      </p>
                      {(isActive || isDone) && (
                        <p className="text-xs text-[#F3F0E8]/70 mt-0.5 animate-fade-in font-light">
                          {step.description}
                        </p>
                      )}
                    </div>

                    {/* Index */}
                    <span className="text-[11px] font-mono text-[#63D6A2]/70 flex-shrink-0">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Vertical connector */}
                  {idx < PIPELINE_STEPS.length - 1 && (
                    <div
                      className={cn(
                        'ml-6 h-2.5 w-0.5 transition-colors duration-300',
                        isDone ? 'bg-[#63D6A2]/60' : 'bg-white/10'
                      )}
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between text-xs font-mono text-[#F3F0E8]/70 mb-2">
              <span>Engine Progression</span>
              <span className="text-[#63D6A2]">
                {Math.round((completedSteps.length / PIPELINE_STEPS.length) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-[#0B241A] rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#12382A] via-[#4fa376] to-[#63D6A2] rounded-full transition-all duration-500"
                style={{ width: `${(completedSteps.length / PIPELINE_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <p className="text-center text-xs font-mono text-[#F3F0E8]/50 mt-5">
          Deterministic verification in progress · Multiple databases being queried
        </p>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B241A] flex items-center justify-center">
          <Loader2 size={32} className="text-[#63D6A2] animate-spin" />
        </div>
      }
    >
      <AnalysisContent />
    </Suspense>
  );
}
