'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/hooks/useAuth';
import MentorSidebar from '../components/MentorSidebar';
import TopNavbar from '../components/TopNavbar';

export default function MentorDashboardLayout({ children }) {
  const { user, loading, logout, isAuthenticated, isMentor, getName, getEmail, getRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/');
    if (!loading && isAuthenticated && !isMentor()) router.push('/dashboard');
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
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-64 w-96 h-96 opacity-5"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,1), transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 opacity-5"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,1), transparent 70%)' }}
        />
      </div>
      <MentorSidebar user={userInfo} onLogout={logout} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavbar user={userInfo} />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {children}
        </main>
      </div>
    </div>
  );
}