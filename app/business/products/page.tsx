'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Plus, ExternalLink, Barcode, Globe, ArrowRight } from 'lucide-react';
import type { BusinessProduct } from '@/lib/business-store';

export default function ProductsPage() {
  const [products, setProducts] = useState<BusinessProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/business/products')
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .finally(() => setLoading(false));
  }, []);

  const categoryColors: Record<string, string> = {
    'Beverages & Containers': 'bg-blue-50 text-blue-700 border-blue-200',
    Packaging: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Household Products': 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#102019]">Products</h1>
          <p className="text-sm text-[#718078] mt-0.5">
            {loading ? '…' : `${products.length} registered product${products.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link href="/business/products/new" className="btn-mint text-sm py-2.5 px-5">
          <Plus size={15} /> Add Product
        </Link>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card-cream p-6 animate-pulse">
              <div className="w-12 h-12 bg-[#E9E6DC] rounded-xl mb-4" />
              <div className="h-4 bg-[#E9E6DC] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[#E9E6DC] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="card-cream p-16 text-center">
          <Package size={40} className="text-[#C8CEC5] mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-[#102019] mb-2">No products yet</h2>
          <p className="text-sm text-[#718078] mb-6">Add your first product to start submitting environmental claims.</p>
          <Link href="/business/products/new" className="btn-mint">
            <Plus size={15} /> Add First Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="card-cream p-6 group hover:-translate-y-0.5">
              {/* Product icon + demo badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#12382A]/10 border border-[#12382A]/15 flex items-center justify-center">
                  <Package size={20} className="text-[#12382A]" />
                </div>
                {product.is_demo && (
                  <span className="text-[9px] font-mono text-[#D3A54A] bg-[#D3A54A]/10 px-2 py-0.5 rounded-full border border-[#D3A54A]/30 uppercase tracking-wider">
                    Demo
                  </span>
                )}
              </div>

              {/* Product info */}
              <h3 className="text-base font-bold text-[#102019] mb-0.5">{product.product_name}</h3>
              <p className="text-xs text-[#718078] mb-3">{product.brand} · {product.company_name}</p>

              {/* Category */}
              <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border mb-3 ${categoryColors[product.category] || 'bg-[#E9E6DC] text-[#718078] border-[#C8CEC5]'}`}>
                {product.category}
              </span>

              {/* Description */}
              {product.description && (
                <p className="text-xs text-[#718078] leading-relaxed line-clamp-2 mb-4">{product.description}</p>
              )}

              {/* Meta */}
              <div className="space-y-1.5 text-xs text-[#98A49D]">
                {product.barcode && (
                  <div className="flex items-center gap-1.5">
                    <Barcode size={11} />
                    <span className="font-mono">{product.barcode}</span>
                  </div>
                )}
                {product.website_url && (
                  <div className="flex items-center gap-1.5">
                    <Globe size={11} />
                    <a href={product.website_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#63D6A2] truncate max-w-[180px]">
                      Product page <ExternalLink size={9} className="inline" />
                    </a>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="mt-4 pt-4 border-t border-[#C8CEC5]">
                <Link
                  href={`/business/claims/new?product_id=${product.id}`}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#63D6A2] hover:text-[#4fa376] transition-colors"
                >
                  Submit Environmental Claim <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
