'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/hooks/useAuth';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

export default function DashboardLayout({ children }) {
  const { user, loading, logout, isAuthenticated, getName, getEmail, getRole } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const userInfo = {
    name: getName(),
    email: getEmail(),
    role: getRole(),
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-64 w-96 h-96 opacity-5"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,1), transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 opacity-5"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,1), transparent 70%)' }}
        />
      </div>

      {/* Sidebar — desktop always visible, mobile via drawer */}
      <Sidebar
        user={userInfo}
        onLogout={logout}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavbar
          user={userInfo}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}