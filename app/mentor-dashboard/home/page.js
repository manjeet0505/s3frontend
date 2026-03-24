'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import {
  Users, Calendar, CheckCircle2, Clock,
  Loader2, Star, Inbox, ArrowRight,
  Zap, TrendingUp, Award, MessageCircle
} from 'lucide-react';
import { useAuth } from '@/app/lib/hooks/useAuth';
import { mentorApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

// ── Animated mesh background ─────────────────────────
function MeshBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Deep base */}
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(109,40,217,0.18) 0%, transparent 60%)' }}
      />
      {/* Animated orbs */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(79,70,229,0.06) 50%, transparent 70%)',
          top: -200, right: -150,
        }}
        animate={{ scale: [1, 1.15, 1], rotate: [0, 25, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
          bottom: -100, left: -100,
        }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />
      <motion.div
        className="absolute rounded-full blur-2xl"
        style={{
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%)',
          top: '40%', left: '30%',
        }}
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Noise grain */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />
      {/* Diagonal light streak */}
      <div className="absolute pointer-events-none"
        style={{
          top: '-10%', left: '-10%',
          width: '120%', height: '60%',
          background: 'linear-gradient(135deg, transparent 40%, rgba(139,92,246,0.04) 50%, transparent 60%)',
          transform: 'rotate(-8deg)',
        }}
      />
    </div>
  );
}

// ── Tilt card wrapper ─────────────────────────────────
function TiltCard({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [4, -4]);
  const rotateY = useTransform(x, [-50, 50], [-4, 4]);

  const handleMouse = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Stat card ─────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, bg, border, delay, glow }) {
  return (
    <TiltCard delay={delay} className="cursor-default">
      <div className={`relative p-5 rounded-2xl border ${border} bg-card/50 backdrop-blur-sm overflow-hidden group`}
        style={{ boxShadow: `0 0 40px ${glow}` }}
      >
        {/* Inner glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at 30% 30%, ${glow.replace('0.08', '0.12')}, transparent 60%)` }}
        />
        {/* Top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${color.replace('text-', '').includes('violet') ? 'rgba(139,92,246,0.6)' : color.includes('yellow') ? 'rgba(234,179,8,0.6)' : color.includes('emerald') ? 'rgba(16,185,129,0.6)' : 'rgba(59,130,246,0.6)'}, transparent)` }}
        />
        <div className="relative flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
            <motion.p
              className={`text-3xl font-black ${color} mt-0.5`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.2, type: 'spring', bounce: 0.4 }}
            >
              {value}
            </motion.p>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

// ── Floating particles ────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size, height: p.size,
            left: `${p.x}%`, top: `${p.y}%`,
            background: `rgba(${p.id % 3 === 0 ? '139,92,246' : p.id % 3 === 1 ? '59,130,246' : '236,72,153'}, 0.4)`,
          }}
          animate={{
            y: [0, -60, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ── Session pill ──────────────────────────────────────
function SessionPill({ session, color, dotColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/30 hover:border-border/60 transition-all group"
    >
      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-lg`}>
        {session.student_name?.[0]?.toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{session.student_name}</p>
        <p className="text-xs text-muted-foreground">{session.day} · {session.time_slot}</p>
      </div>
      <div className={`w-2 h-2 rounded-full ${dotColor} flex-shrink-0`} />
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────
export default function MentorOverviewPage() {
  const { getUserId, getName } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  const userId = getUserId();
  const name = getName();

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      mentorApi.getProfile(userId),
      mentorApi.getIncomingSessions(userId),
    ]).then(([pRes, sRes]) => {
      setProfile(pRes.data);
      setSessions(sRes.data?.sessions || []);
    }).catch(err => {
      if (err?.response?.status === 404) router.push('/mentor-dashboard/setup');
    }).finally(() => setLoading(false));
  }, [userId]);

  const pending = sessions.filter(s => s.status === 'pending');
  const accepted = sessions.filter(s => s.status === 'accepted');
  const declined = sessions.filter(s => s.status === 'declined');

  const greeting = time.getHours() < 12 ? 'Good morning' : time.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-8 h-8 text-violet-400" />
          </motion.div>
          <p className="text-sm text-muted-foreground">Summoning your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MeshBackground />
      <Particles />

      <div className="relative max-w-6xl mx-auto space-y-8">

        {/* ── Hero header ── */}
        <div className="relative">
          {/* Time badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400 font-medium mb-4"
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-violet-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="font-black text-4xl lg:text-5xl tracking-tight">
              <span className="text-muted-foreground text-2xl font-medium block mb-1">{greeting},</span>
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 40%, #60a5fa 100%)' }}
              >
                {name}
              </span>
            </h1>
            {pending.length > 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground mt-2 text-base"
              >
                You have{' '}
                <span className="text-yellow-400 font-bold">{pending.length} pending request{pending.length > 1 ? 's' : ''}</span>
                {' '}waiting for your response
              </motion.p>
            ) : (
              <p className="text-muted-foreground mt-2 text-base">
                Your mentoring dashboard is up to date ✨
              </p>
            )}
          </motion.div>
        </div>

        {/* ── Profile hero card ── */}
        {profile && (
          <TiltCard delay={0.15}>
            <div className="relative p-7 rounded-3xl border border-violet-500/20 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(79,70,229,0.05) 50%, rgba(59,130,246,0.05) 100%)',
                boxShadow: '0 0 60px rgba(139,92,246,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              {/* Decorative arc */}
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-violet-500/10"
                style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)' }}
              />
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-violet-500/15" />

              <div className="relative flex items-center gap-6">
                {/* Avatar with ring */}
                <div className="relative flex-shrink-0">
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.6), rgba(59,130,246,0.6))' }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-violet-500/30 m-0.5">
                    {name?.[0]?.toUpperCase()}
                  </div>
                  {/* Online dot */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-background shadow-lg shadow-emerald-400/50" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-black text-2xl text-foreground">{name}</h2>
                      <p className="text-violet-400 font-semibold mt-0.5">
                        {profile.current_role}
                        <span className="text-muted-foreground font-normal"> at </span>
                        {profile.current_company}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2 max-w-lg">{profile.bio}</p>
                    </div>
                    <div className="hidden lg:flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="px-4 py-1.5 rounded-full text-xs font-bold"
                        style={{
                          background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(79,70,229,0.2))',
                          border: '1px solid rgba(139,92,246,0.3)',
                          color: '#a78bfa',
                        }}
                      >
                        {profile.domain}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">{profile.years_experience} years experience</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  {profile.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {profile.skills.slice(0, 6).map((s, i) => (
                        <motion.span
                          key={s}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                          className="text-xs px-3 py-1 rounded-lg font-medium"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.7)',
                          }}
                        >
                          {s}
                        </motion.span>
                      ))}
                      {profile.skills.length > 6 && (
                        <span className="text-xs px-3 py-1 rounded-lg text-muted-foreground"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                          +{profile.skills.length - 6} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TiltCard>
        )}

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Inbox} label="Total Requests" value={sessions.length}
            color="text-violet-400" bg="bg-violet-500/10" border="border-violet-500/20"
            glow="rgba(139,92,246,0.08)" delay={0.2}
          />
          <StatCard icon={Clock} label="Pending" value={pending.length}
            color="text-yellow-400" bg="bg-yellow-500/10" border="border-yellow-500/20"
            glow="rgba(234,179,8,0.08)" delay={0.25}
          />
          <StatCard icon={CheckCircle2} label="Accepted" value={accepted.length}
            color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20"
            glow="rgba(16,185,129,0.08)" delay={0.3}
          />
          <StatCard icon={Star} label="Expertise" value={profile?.expertise?.length || 0}
            color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20"
            glow="rgba(59,130,246,0.08)" delay={0.35}
          />
        </div>

        {/* ── Two column panels ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Pending requests panel */}
          <TiltCard delay={0.4}>
            <div className="relative p-6 rounded-2xl border border-yellow-500/15 bg-card/50 backdrop-blur-sm overflow-hidden h-full"
              style={{ boxShadow: '0 0 30px rgba(234,179,8,0.05)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(234,179,8,0.5), transparent)' }}
              />
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(234,179,8,0.06), transparent 70%)' }}
              />

              <div className="relative flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                    <Inbox className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Pending Requests</h3>
                    <p className="text-xs text-muted-foreground">{pending.length} awaiting response</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, x: 2 }}
                  onClick={() => router.push('/mentor-dashboard/requests')}
                  className="flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </motion.button>
              </div>

              {pending.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/8 border border-yellow-500/15 flex items-center justify-center mb-3">
                    <Zap className="w-5 h-5 text-yellow-400/50" />
                  </div>
                  <p className="text-sm text-muted-foreground">No pending requests</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Students will appear here</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pending.slice(0, 4).map((s, i) => (
                    <SessionPill key={i} session={s}
                      color="from-yellow-500 to-orange-500"
                      dotColor="bg-yellow-400"
                    />
                  ))}
                </div>
              )}
            </div>
          </TiltCard>

          {/* Upcoming sessions panel */}
          <TiltCard delay={0.45}>
            <div className="relative p-6 rounded-2xl border border-emerald-500/15 bg-card/50 backdrop-blur-sm overflow-hidden h-full"
              style={{ boxShadow: '0 0 30px rgba(16,185,129,0.05)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent)' }}
              />
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06), transparent 70%)' }}
              />

              <div className="relative flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Upcoming Sessions</h3>
                    <p className="text-xs text-muted-foreground">{accepted.length} confirmed</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, x: 2 }}
                  onClick={() => router.push('/mentor-dashboard/schedule')}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </motion.button>
              </div>

              {accepted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/8 border border-emerald-500/15 flex items-center justify-center mb-3">
                    <Calendar className="w-5 h-5 text-emerald-400/50" />
                  </div>
                  <p className="text-sm text-muted-foreground">No upcoming sessions</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Accepted requests show here</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {accepted.slice(0, 4).map((s, i) => (
                    <SessionPill key={i} session={s}
                      color="from-emerald-500 to-teal-500"
                      dotColor="bg-emerald-400"
                    />
                  ))}
                </div>
              )}
            </div>
          </TiltCard>
        </div>

        {/* ── Bottom activity strip ── */}
        <TiltCard delay={0.5}>
          <div className="relative p-6 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(59,130,246,0.4), transparent)' }}
            />
            <div className="flex items-center justify-between">
              {[
                { icon: TrendingUp, label: 'Response Rate', value: sessions.length > 0 ? `${Math.round(((accepted.length + declined.length) / sessions.length) * 100)}%` : '—', color: 'text-violet-400' },
                { icon: Users, label: 'Students Helped', value: accepted.length, color: 'text-blue-400' },
                { icon: MessageCircle, label: 'Expertise Tags', value: profile?.expertise?.length || 0, color: 'text-pink-400' },
                { icon: Award, label: 'Years Active', value: profile?.years_experience || 0, color: 'text-yellow-400' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.06 }}
                  className="flex flex-col items-center gap-1.5 flex-1"
                >
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-muted-foreground text-center">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </TiltCard>

      </div>
    </>
  );
}