'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  'Beverages & Containers',
  'Packaging',
  'Household Products',
  'Food & Beverage',
  'Personal Care',
  'Clothing & Textiles',
  'Electronics',
  'Cleaning Products',
  'Building Materials',
  'Other',
];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    product_name: '',
    brand: '',
    company_name: 'EcoPure Industries',
    category: '',
    description: '',
    barcode: '',
    website_url: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.product_name.trim()) errs.product_name = 'Product name is required';
    if (!form.brand.trim()) errs.brand = 'Brand is required';
    if (!form.category) errs.category = 'Please select a category';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/business/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to create product');
      }
      setSuccess(true);
      setTimeout(() => router.push('/business/products'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  }

  const inputCls = (field: string) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm text-[#1C1C1C] bg-white outline-none transition-all ${
      fieldErrors[field]
        ? 'border-[#C1443E] focus:border-[#C1443E] focus:ring-2 focus:ring-[#C1443E]/20'
        : 'border-[#D6D3C8] focus:border-[#1B3A2B] focus:ring-2 focus:ring-[#1B3A2B]/10'
    }`;

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[#3E7D4F]/15 border border-[#3E7D4F]/40 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={28} className="text-[#3E7D4F]" />
        </div>
        <h2 className="text-xl font-bold text-[#1C1C1C] mb-2">Product Added</h2>
        <p className="text-sm text-[#718875]">Redirecting to your products…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <Link href="/business/products" className="inline-flex items-center gap-1.5 text-sm text-[#718875] hover:text-[#1C1C1C] mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Products
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#315C45]/10 border border-[#315C45]/15 flex items-center justify-center">
          <Package size={18} className="text-[#315C45]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#1C1C1C]">Add Product</h1>
          <p className="text-xs text-[#718875]">Register a product to attach environmental claims</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card-cream p-6 space-y-5">
        {/* Product Name */}
        <div>
          <label className="block text-xs font-semibold text-[#1C1C1C] uppercase tracking-wider mb-1.5">
            Product Name <span className="text-[#C1443E]">*</span>
          </label>
          <input
            className={inputCls('product_name')}
            placeholder="e.g. EcoBottle Pro"
            value={form.product_name}
            onChange={(e) => setForm((f) => ({ ...f, product_name: e.target.value }))}
          />
          {fieldErrors.product_name && <p className="text-xs text-[#C1443E] mt-1">{fieldErrors.product_name}</p>}
        </div>

        {/* Brand + Company */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C1C1C] uppercase tracking-wider mb-1.5">
              Brand <span className="text-[#C1443E]">*</span>
            </label>
            <input
              className={inputCls('brand')}
              placeholder="e.g. EcoPure"
              value={form.brand}
              onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
            />
            {fieldErrors.brand && <p className="text-xs text-[#C1443E] mt-1">{fieldErrors.brand}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1C1C1C] uppercase tracking-wider mb-1.5">
              Company
            </label>
            <input
              className={inputCls('company_name')}
              placeholder="e.g. EcoPure Industries"
              value={form.company_name}
              onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-[#1C1C1C] uppercase tracking-wider mb-1.5">
            Category <span className="text-[#C1443E]">*</span>
          </label>
          <select
            className={inputCls('category')}
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          >
            <option value="">Select category…</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {fieldErrors.category && <p className="text-xs text-[#C1443E] mt-1">{fieldErrors.category}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-[#1C1C1C] uppercase tracking-wider mb-1.5">
            Product Description
          </label>
          <textarea
            rows={3}
            className="claim-textarea text-sm"
            placeholder="Brief description of the product…"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>

        {/* Barcode + URL */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C1C1C] uppercase tracking-wider mb-1.5">
              Barcode / Product Code
            </label>
            <input
              className={inputCls('barcode')}
              placeholder="Optional"
              value={form.barcode}
              onChange={(e) => setForm((f) => ({ ...f, barcode: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1C1C1C] uppercase tracking-wider mb-1.5">
              Website URL
            </label>
            <input
              type="url"
              className={inputCls('website_url')}
              placeholder="https://…"
              value={form.website_url}
              onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[#C1443E]/10 border border-[#C1443E]/30 text-sm text-[#C1443E]">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/business/products" className="btn-secondary">Cancel</Link>
          <button type="submit" className="btn-mint" disabled={loading}>
            {loading ? 'Adding…' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
