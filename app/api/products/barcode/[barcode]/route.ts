import { NextRequest, NextResponse } from 'next/server';
import { lookupProductByBarcode } from '@/lib/barcode-registry';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ barcode: string }> }
) {
  try {
    const { barcode } = await context.params;
    const decodedBarcode = decodeURIComponent(barcode || '').trim();

    if (!decodedBarcode) {
      return NextResponse.json(
        {
          found: false,
          barcode: '',
          message: 'No barcode provided',
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
    console.error('Barcode lookup error:', error);
    return NextResponse.json(
      {
        found: false,
        message: 'Internal server error while processing barcode lookup',
      },
      { status: 500 }
    );
  }
}
