'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Bell } from 'lucide-react';
import { useTheme } from 'next-themes';

const pageTitles = {
  '/dashboard': { title: 'Overview', subtitle: 'Your career intelligence at a glance' },
  '/dashboard/resume': { title: 'Resume', subtitle: 'Upload and analyze your resume' },
  '/dashboard/jobs': { title: 'Job Matches', subtitle: 'AI-matched opportunities for you' },
  '/dashboard/mentors': { title: 'Mentors', subtitle: 'Connect with industry experts' },
  '/dashboard/skills': { title: 'Skill Gap', subtitle: 'Know what to learn next' },
  '/mentor-dashboard/home': { title: 'Overview', subtitle: 'Your mentoring activity at a glance' },
'/mentor-dashboard/requests': { title: 'Requests', subtitle: 'Incoming session requests from students' },
'/mentor-dashboard/students': { title: 'My Students', subtitle: 'Students you are mentoring' },
'/mentor-dashboard/schedule': { title: 'Schedule', subtitle: 'Manage your availability' },
'/mentor-dashboard/profile': { title: 'Edit Profile', subtitle: 'Update your mentor profile' },
'/dashboard/skills': { title: 'Skill Gap', subtitle: 'Know exactly what to learn next' },
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
      {theme === 'dark'
        ? <Sun className="w-4 h-4" />
        : <Moon className="w-4 h-4" />
      }
    </button>
  );
}

export default function TopNavbar({ user }) {
  const pathname = usePathname();
  const page = pageTitles[pathname] || { title: 'Dashboard', subtitle: '' };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-card/50 backdrop-blur-sm flex-shrink-0">
      {/* Page title */}
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">{page.title}</h1>
        {page.subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{page.subtitle}</p>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl border border-border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>

        <ThemeToggle />

        {/* Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground leading-none">{user?.name || 'Student'}</p>
            <p className="text-xs text-muted-foreground mt-0.5 capitalize">{user?.role || 'student'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}