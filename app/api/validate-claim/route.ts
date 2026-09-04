import { NextRequest, NextResponse } from 'next/server';
import { classifyEnvironmentalClaim } from '@/lib/claim-classifier';
import { extractClaim } from '@/lib/verification-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawClaim = (body.claim || body.claimText || '').trim();

    const classification = classifyEnvironmentalClaim(rawClaim);

    if (!classification.isEnvironmentalClaim) {
      return NextResponse.json(
        {
          valid: false,
          isEnvironmentalClaim: false,
          errorType: classification.errorType || 'NON_ENVIRONMENTAL_CLAIM',
          message: classification.message || 'GreenLedger verifies environmental and sustainability claims only.',
          suggestion:
            classification.suggestion ||
            'Try a claim about recycled content, recyclability, carbon emissions, renewable materials, sustainable packaging, certifications, or similar environmental attributes.',
          reason: classification.reason,
        },
        { status: 200 }
      );
    }

    const structuredClaim = extractClaim(rawClaim);

    return NextResponse.json({
      valid: true,
      isEnvironmentalClaim: true,
      claimCategory: classification.claimCategory,
      confidence: classification.confidence,
      claim: structuredClaim,
      nextStep: 'VERIFY',
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      {
        valid: false,
        errorType: 'SERVER_ERROR',
        message: 'An error occurred during claim relevance classification.',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawClaim = (searchParams.get('claim') || searchParams.get('q') || '').trim();

    const classification = classifyEnvironmentalClaim(rawClaim);

    if (!classification.isEnvironmentalClaim) {
      return NextResponse.json(
        {
          valid: false,
          isEnvironmentalClaim: false,
          errorType: classification.errorType || 'NON_ENVIRONMENTAL_CLAIM',
          message: classification.message || 'GreenLedger verifies environmental and sustainability claims only.',
          suggestion:
            classification.suggestion ||
            'Try a claim about recycled content, recyclability, carbon emissions, renewable materials, sustainable packaging, certifications, or similar environmental attributes.',
          reason: classification.reason,
        },
        { status: 200 }
      );
    }

    const structuredClaim = extractClaim(rawClaim);

    return NextResponse.json({
      valid: true,
      isEnvironmentalClaim: true,
      claimCategory: classification.claimCategory,
      confidence: classification.confidence,
      claim: structuredClaim,
      nextStep: 'VERIFY',
    });
  } catch (error) {
    console.error('Validation query error:', error);
    return NextResponse.json(
      {
        valid: false,
        errorType: 'SERVER_ERROR',
        message: 'An error occurred during claim relevance classification.',
      },
      { status: 500 }
    );
  }
}
