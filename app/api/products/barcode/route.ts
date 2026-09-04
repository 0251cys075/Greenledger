import { NextRequest, NextResponse } from 'next/server';
import { lookupProductByBarcode } from '@/lib/barcode-registry';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const barcode = searchParams.get('barcode') || searchParams.get('code') || '';
    const decodedBarcode = barcode.trim();

    if (!decodedBarcode) {
      return NextResponse.json(
        {
          found: false,
          barcode: '',
          message: 'No barcode query parameter provided',
        },
        { status: 400 }
      );
    }

    const result = lookupProductByBarcode(decodedBarcode);

    if (!result.found) {
      return NextResponse.json({
        found: false,
        barcode: decodedBarcode,
        detectedFormat: result.detectedFormat,
        isExternalUrl: result.isExternalUrl || false,
        externalUrl: result.externalUrl || null,
        message: result.error || 'Product not found in GreenLedger',
      });
    }

    return NextResponse.json({
      found: true,
      barcode: decodedBarcode,
      detectedFormat: result.detectedFormat,
      isDemo: result.isDemo || false,
      product: result.product,
      greenledgerRecord: result.greenledgerRecord,
    });
  } catch (error) {
    console.error('Barcode query error:', error);
    return NextResponse.json(
      {
        found: false,
        message: 'Internal server error while processing barcode lookup',
      },
      { status: 500 }
    );
  }
}
