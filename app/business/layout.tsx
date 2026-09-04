// ============================================================
// Business Portal Layout — Sidebar Shell
// ============================================================
// This layout wraps all /business/* routes with a sidebar.
// The root app layout (Navbar + Footer) still wraps this.
// ============================================================
import type { Metadata } from 'next';
import BusinessSidebar from './BusinessSidebar';

export const metadata: Metadata = {
  title: 'Business Portal — GreenLedger',
  description: 'Manage your environmental claims, evidence, and verification records with GreenLedger.',
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F5F0] flex">
      <BusinessSidebar />
      <main className="flex-1 min-w-0 pt-[72px]">
        {children}
      </main>
    </div>
  );
}
