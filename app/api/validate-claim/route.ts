import { NextRequest, NextResponse } from 'next/server';
import { analyzeMultilingualClaim } from '@/lib/multilingual-nlp';
import { extractClaim } from '@/lib/verification-engine';
import { isValidLanguage, SupportedLanguage } from '@/lib/locales/registry';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawClaim = (body.claim || body.claimText || '').trim();
    const languageHint: SupportedLanguage | undefined =
      body.language && isValidLanguage(body.language) ? body.language : undefined;

    const analysis = analyzeMultilingualClaim(rawClaim, languageHint);

    if (!analysis.isEnvironmentalClaim) {
      return NextResponse.json(
        {
          valid: false,
          isEnvironmentalClaim: false,
          language: analysis.language,
          errorType: analysis.errorType || 'NON_ENVIRONMENTAL_CLAIM',
          message: analysis.message || 'GreenLedger verifies environmental and sustainability claims only.',
          suggestion: analysis.suggestion,
        },
        { status: 200 }
      );
    }

    const structuredClaim = extractClaim(analysis.normalizedClaim);

    return NextResponse.json({
      valid: true,
      isEnvironmentalClaim: true,
      language: analysis.language,
      originalClaim: analysis.originalClaim,
      normalizedClaim: analysis.normalizedClaim,
      claimCategory: analysis.claimType,
      confidence: analysis.detectedConfidence,
      claim: structuredClaim,
      attributes: analysis.attributes,
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
    const langParam = searchParams.get('lang') || undefined;
    const languageHint: SupportedLanguage | undefined =
      langParam && isValidLanguage(langParam) ? (langParam as SupportedLanguage) : undefined;

    const analysis = analyzeMultilingualClaim(rawClaim, languageHint);

    if (!analysis.isEnvironmentalClaim) {
      return NextResponse.json(
        {
          valid: false,
          isEnvironmentalClaim: false,
          language: analysis.language,
          errorType: analysis.errorType || 'NON_ENVIRONMENTAL_CLAIM',
          message: analysis.message || 'GreenLedger verifies environmental and sustainability claims only.',
          suggestion: analysis.suggestion,
        },
        { status: 200 }
      );
    }

    const structuredClaim = extractClaim(analysis.normalizedClaim);

    return NextResponse.json({
      valid: true,
      isEnvironmentalClaim: true,
      language: analysis.language,
      originalClaim: analysis.originalClaim,
      normalizedClaim: analysis.normalizedClaim,
      claimCategory: analysis.claimType,
      confidence: analysis.detectedConfidence,
      claim: structuredClaim,
      attributes: analysis.attributes,
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
