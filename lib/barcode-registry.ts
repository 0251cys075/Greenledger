// ============================================================
// GreenLedger — Barcode & Product Identification Registry
// Maps 1D Barcodes (EAN-13, EAN-8, UPC-A, Code 128) and 2D QR codes
// to product metadata and auditable GreenLedger verification records.
// ============================================================

import type { VerificationStatus } from './types';

export interface BarcodeLookupResult {
  found: boolean;
  barcode: string;
  detectedFormat: string;
  isDemo?: boolean;
  product?: {
    name: string;
    brand: string;
    category: string;
    claim_text: string;
    packaging_type?: string;
  };
  greenledgerRecord?: {
    id: string;
    verificationStatus: VerificationStatus;
    evidenceStrength: 'STRONG' | 'MODERATE' | 'WEAK';
  };
  error?: string;
  isExternalUrl?: boolean;
  externalUrl?: string;
}

interface RegistryEntry {
  barcode: string;
  format: string;
  isDemo: boolean;
  product: {
    name: string;
    brand: string;
    category: string;
    claim_text: string;
    packaging_type: string;
  };
  greenledgerRecord: {
    id: string;
    verificationStatus: VerificationStatus;
    evidenceStrength: 'STRONG' | 'MODERATE' | 'WEAK';
  };
}

// Certified & registered products in the GreenLedger verification database
const PRODUCT_BARCODE_DATABASE: RegistryEntry[] = [
  {
    barcode: '8901234567890',
    format: 'EAN-13',
    isDemo: false,
    product: {
      name: 'EcoPack Mailer Box',
      brand: 'GreenPack Industries',
      category: 'Packaging',
      claim_text: 'Product packaging contains 80% recycled paper',
      packaging_type: 'FSC-Certified Corrugated Board',
    },
    greenledgerRecord: {
      id: 'demo-3',
      verificationStatus: 'VERIFIED',
      evidenceStrength: 'STRONG',
    },
  },
  {
    barcode: 'DEMO-8901234567890',
    format: 'EAN-13',
    isDemo: true,
    product: {
      name: 'EcoPack Mailer Box',
      brand: 'GreenPack Industries',
      category: 'Packaging',
      claim_text: 'Product packaging contains 80% recycled paper',
      packaging_type: 'FSC-Certified Corrugated Board',
    },
    greenledgerRecord: {
      id: 'demo-3',
      verificationStatus: 'VERIFIED',
      evidenceStrength: 'STRONG',
    },
  },
  {
    barcode: '5012345678900',
    format: 'EAN-13',
    isDemo: false,
    product: {
      name: 'Recycled Bubble Wrap',
      brand: 'PackRight Solutions',
      category: 'Packaging',
      claim_text: 'Made with 70% recycled material',
      packaging_type: 'Flexible LDPE Cushioning',
    },
    greenledgerRecord: {
      id: 'demo-2',
      verificationStatus: 'INSUFFICIENT_EVIDENCE',
      evidenceStrength: 'MODERATE',
    },
  },
  {
    barcode: 'DEMO-5012345678900',
    format: 'EAN-13',
    isDemo: true,
    product: {
      name: 'Recycled Bubble Wrap',
      brand: 'PackRight Solutions',
      category: 'Packaging',
      claim_text: 'Made with 70% recycled material',
      packaging_type: 'Flexible LDPE Cushioning',
    },
    greenledgerRecord: {
      id: 'demo-2',
      verificationStatus: 'INSUFFICIENT_EVIDENCE',
      evidenceStrength: 'MODERATE',
    },
  },
  {
    barcode: '012345678905',
    format: 'UPC-A',
    isDemo: false,
    product: {
      name: 'All-Purpose Eco Cleaner',
      brand: 'CleanSurface Ltd.',
      category: 'Household Products',
      claim_text: '100% Eco-Friendly Formula',
      packaging_type: 'Rigid HDPE Bottle',
    },
    greenledgerRecord: {
      id: 'demo-1',
      verificationStatus: 'POTENTIAL_GREENWASHING',
      evidenceStrength: 'WEAK',
    },
  },
  {
    barcode: 'DEMO-012345678905',
    format: 'UPC-A',
    isDemo: true,
    product: {
      name: 'All-Purpose Eco Cleaner',
      brand: 'CleanSurface Ltd.',
      category: 'Household Products',
      claim_text: '100% Eco-Friendly Formula',
      packaging_type: 'Rigid HDPE Bottle',
    },
    greenledgerRecord: {
      id: 'demo-1',
      verificationStatus: 'POTENTIAL_GREENWASHING',
      evidenceStrength: 'WEAK',
    },
  },
  {
    barcode: '8412345678902',
    format: 'EAN-13',
    isDemo: false,
    product: {
      name: 'Bamboo Coffee Capsule',
      brand: 'SolarBrew Co.',
      category: 'Food & Beverage',
      claim_text: '30% lower carbon emissions vs conventional capsules',
      packaging_type: 'Bio-Polymer Capsule',
    },
    greenledgerRecord: {
      id: 'demo-3',
      verificationStatus: 'VERIFIED',
      evidenceStrength: 'STRONG',
    },
  },
  {
    barcode: '9780201379624',
    format: 'EAN-13',
    isDemo: false,
    product: {
      name: 'Organic Cotton T-Shirt',
      brand: 'TextileForward',
      category: 'Apparel',
      claim_text: 'Certified organic cotton — GOTS certified',
      packaging_type: 'Kraft Paper Band',
    },
    greenledgerRecord: {
      id: 'demo-3',
      verificationStatus: 'VERIFIED',
      evidenceStrength: 'STRONG',
    },
  },
];

/**
 * Detect barcode format based on code length, prefix, or payload structure.
 */
export function inferBarcodeFormat(rawCode: string): string {
  const code = rawCode.trim();

  if (/^(https?:\/\/|[a-z0-9-]+\.[a-z]{2,})/i.test(code)) {
    return 'QR_CODE';
  }

  // Demo prefixes
  const normalized = code.toUpperCase().startsWith('DEMO-') ? code.substring(5) : code;

  if (/^\d{13}$/.test(normalized)) return 'EAN-13';
  if (/^\d{8}$/.test(normalized)) return 'EAN-8';
  if (/^\d{12}$/.test(normalized)) return 'UPC-A';
  if (/^\d{6,8}$/.test(normalized)) return 'UPC-E';
  if (/^[A-Z0-9\-\.\ \$\/\+\%]{4,30}$/i.test(normalized)) return 'CODE-128';

  return 'UNKNOWN_FORMAT';
}

/**
 * Parses a QR code payload.
 * If it points to GreenLedger (e.g. greenledger.io/v/DEMO-3 or /result/demo-1),
 * extracts the record ID.
 */
export function parseQrPayload(payload: string): {
  isGreenledger: boolean;
  recordId: string | null;
  isExternalUrl: boolean;
} {
  const trimmed = payload.trim();

  // Pattern matching greenledger URLs or IDs
  const glPattern = /(?:greenledger\.io\/(?:v|result)\/|^DEMO-|^GL-|^demo-)([a-z0-9-]+)/i;
  const match = trimmed.match(glPattern);

  if (match && match[1]) {
    const rawId = match[1].toLowerCase();
    // Normalize id (e.g. "3" -> "demo-3", "demo-3" -> "demo-3")
    const id = rawId.startsWith('demo-') ? rawId : `demo-${rawId.replace(/^demo-?/, '')}`;
    return { isGreenledger: true, recordId: id, isExternalUrl: false };
  }

  // Check if it is an external URL
  if (/^https?:\/\//i.test(trimmed)) {
    return { isGreenledger: false, recordId: null, isExternalUrl: true };
  }

  // Check direct record ID
  const lower = trimmed.toLowerCase();
  if (['demo-1', 'demo-2', 'demo-3'].includes(lower)) {
    return { isGreenledger: true, recordId: lower, isExternalUrl: false };
  }

  return { isGreenledger: false, recordId: null, isExternalUrl: false };
}

/**
 * Backend Product & Barcode Lookup Function
 */
export function lookupProductByBarcode(inputCode: string): BarcodeLookupResult {
  const cleanInput = (inputCode || '').trim();

  if (!cleanInput) {
    return {
      found: false,
      barcode: '',
      detectedFormat: 'UNKNOWN',
      error: 'No product barcode or code provided.',
    };
  }

  const detectedFormat = inferBarcodeFormat(cleanInput);

  // 1. Check if input is a QR code payload or URL
  if (detectedFormat === 'QR_CODE' || cleanInput.includes('/') || cleanInput.toLowerCase().includes('demo-')) {
    const qrInfo = parseQrPayload(cleanInput);

    if (qrInfo.isGreenledger && qrInfo.recordId) {
      // Find matching entry from database by record ID
      const matched = PRODUCT_BARCODE_DATABASE.find(
        (entry) => entry.greenledgerRecord.id === qrInfo.recordId
      );

      if (matched) {
        return {
          found: true,
          barcode: cleanInput,
          detectedFormat: 'QR_CODE',
          isDemo: matched.isDemo || cleanInput.toUpperCase().includes('DEMO'),
          product: matched.product,
          greenledgerRecord: matched.greenledgerRecord,
        };
      }
    }

    if (qrInfo.isExternalUrl) {
      return {
        found: false,
        barcode: cleanInput,
        detectedFormat: 'QR_CODE',
        isExternalUrl: true,
        externalUrl: cleanInput,
        error: 'External QR link detected. This URL does not match a verified GreenLedger product traceability record.',
      };
    }
  }

  // 2. Direct Barcode lookup (exact match or normalized match)
  const normalizedSearch = cleanInput.toUpperCase();
  const directMatch = PRODUCT_BARCODE_DATABASE.find((item) => {
    return (
      item.barcode.toUpperCase() === normalizedSearch ||
      item.barcode.replace(/[^0-9]/g, '') === cleanInput.replace(/[^0-9]/g, '')
    );
  });

  if (directMatch) {
    return {
      found: true,
      barcode: cleanInput,
      detectedFormat: directMatch.format,
      isDemo: directMatch.isDemo || cleanInput.toUpperCase().startsWith('DEMO-'),
      product: directMatch.product,
      greenledgerRecord: directMatch.greenledgerRecord,
    };
  }

  // 3. Not found in GreenLedger database
  return {
    found: false,
    barcode: cleanInput,
    detectedFormat,
    error: 'Product not found in GreenLedger',
  };
}

export const DEMO_SCAN_PRODUCTS = [
  {
    id: 'demo-pack-ean',
    name: 'EcoPack Mailer Box',
    code: 'DEMO-8901234567890',
    type: 'EAN-13 Barcode',
    brand: 'GreenPack Industries',
    verdict: 'VERIFIED',
    badge: 'bg-[#3E7D4F]/15 text-[#315C45] border-[#3E7D4F]/40',
  },
  {
    id: 'demo-bubble-ean',
    name: 'Recycled Bubble Wrap',
    code: 'DEMO-5012345678900',
    type: 'EAN-13 Barcode',
    brand: 'PackRight Solutions',
    verdict: 'INSUFFICIENT EVIDENCE',
    badge: 'bg-[#C9A227]/15 text-[#8A6A1E] border-[#C9A227]/40',
  },
  {
    id: 'demo-cleaner-upc',
    name: 'All-Purpose Eco Cleaner',
    code: 'DEMO-012345678905',
    type: 'UPC-A Barcode',
    brand: 'CleanSurface Ltd.',
    verdict: 'POTENTIAL GREENWASHING',
    badge: 'bg-[#C1443E]/15 text-[#9E3B33] border-[#C1443E]/40',
  },
  {
    id: 'demo-trace-qr',
    name: 'GreenLedger Traceability QR',
    code: 'greenledger.io/v/DEMO-3',
    type: 'QR Code Payload',
    brand: 'GreenPack Industries',
    verdict: 'VERIFIED',
    badge: 'bg-[#3E7D4F]/15 text-[#315C45] border-[#3E7D4F]/40',
  },
];
