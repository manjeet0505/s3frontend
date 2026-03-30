'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Moon, Sun, Bell, UserCircle, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';

const pageTitles = {
  '/dashboard': { title: 'Overview', subtitle: 'Your career intelligence at a glance' },
  '/dashboard/resume': { title: 'Resume', subtitle: 'Upload and analyze your resume' },
  '/dashboard/jobs': { title: 'Job Matches', subtitle: 'AI-matched opportunities for you' },
  '/dashboard/mentors': { title: 'Mentors', subtitle: 'Connect with industry experts' },
  '/dashboard/skills': { title: 'Skill Gap', subtitle: 'Know exactly what to learn next' },
  '/dashboard/profile': { title: 'My Profile', subtitle: 'Your career profile and session history' },
  '/mentor-dashboard/home': { title: 'Overview', subtitle: 'Your mentoring activity at a glance' },
  '/mentor-dashboard/requests': { title: 'Requests', subtitle: 'Incoming session requests from students' },
  '/mentor-dashboard/students': { title: 'My Students', subtitle: 'Students you are mentoring' },
  '/mentor-dashboard/schedule': { title: 'Schedule', subtitle: 'Manage your availability' },
  '/mentor-dashboard/profile': { title: 'Edit Profile', subtitle: 'Update your mentor profile' },
};

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-xl border border-border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

export default function TopNavbar({ user, onMenuClick }) {
  const pathname = usePathname();
  const router = useRouter();
  const page = pageTitles[pathname] || { title: 'Dashboard', subtitle: '' };

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border/60 bg-card/50 backdrop-blur-sm flex-shrink-0">
      
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="font-display text-xl font-bold text-foreground">{page.title}</h1>
          {page.subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5 hidden sm:block">{page.subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications bell */}
        <button className="relative p-2 rounded-xl border border-border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>

        <ThemeToggle />

        {/* Clickable Avatar → goes to /dashboard/profile */}
        <button
          onClick={() => router.push('/dashboard/profile')}
          className="flex items-center gap-2.5 pl-3 border-l border-border hover:opacity-80 transition-opacity group"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold group-hover:ring-2 group-hover:ring-primary/50 transition-all">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-card" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-foreground leading-none">{user?.name || 'Student'}</p>
            <p className="text-xs text-muted-foreground mt-0.5 capitalize">{user?.role || 'student'}</p>
          </div>
        </button>
      </div>
    </header>
  );
}