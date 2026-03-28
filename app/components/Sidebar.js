'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  UserCircle
} from 'lucide-react';

const navItems = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'Resume',
    href: '/dashboard/resume',
    icon: FileText,
  },
  {
    label: 'Job Matches',
    href: '/dashboard/jobs',
    icon: Briefcase,
  },
  {
    label: 'Mentors',
    href: '/dashboard/mentors',
    icon: Users,
  },
  {
    label: 'Skill Gap',
    href: '/dashboard/skills',
    icon: TrendingUp,
  },
  { 
    label: 'Profile', 
    href: '/dashboard/profile',
     icon: UserCircle 
  },
];

export default function Sidebar({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col h-screen border-r border-border/60 bg-card/80 backdrop-blur-xl overflow-hidden flex-shrink-0"
    >
      {/* Background glow */}
      <div
        className="absolute top-0 left-0 w-full h-48 opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top left, rgba(59,130,246,0.4), transparent 70%)',
        }}
      />

      {/* Logo */}
      <div className="relative flex items-center gap-3 px-4 py-5 border-b border-border/40">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-display font-bold text-base whitespace-nowrap"
            >
              S3 Dashboard
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? 'bg-primary/15 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-xl bg-primary/10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}

              <item.icon
                className={`w-5 h-5 flex-shrink-0 relative z-10 transition-colors ${
                  active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                }`}
              />

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 rounded-lg bg-popover border border-border text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="relative px-3 py-4 border-t border-border/40 space-y-2">
        {/* User info */}
        {!collapsed && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary/40"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </motion.div>
        )}

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all group"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all z-10 shadow-md"
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3" />
          : <ChevronLeft className="w-3 h-3" />
        }
      </button>
    </motion.aside>
  );
}