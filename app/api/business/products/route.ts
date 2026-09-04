// ============================================================
// GET/POST /api/business/products
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/business-store';

export async function GET() {
  try {
    const products = getProducts();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_name, brand, company_name, category, description, barcode, website_url } = body;

    if (!product_name?.trim() || !brand?.trim() || !category?.trim()) {
      return NextResponse.json(
        { error: 'product_name, brand, and category are required' },
        { status: 400 }
      );
    }

    const product = addProduct({
      product_name: product_name.trim(),
      brand: brand.trim(),
      company_name: (company_name || brand).trim(),
      category: category.trim(),
      description: (description || '').trim(),
      barcode: barcode?.trim() || undefined,
      website_url: website_url?.trim() || undefined,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
