import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Droplet,
  HeartPulse,
  Smile,
  BookOpen,
  Pill,
  BarChart3,
  Sparkles,
  Flower2,
  Users,
  Settings,
  LogOut,
  Moon,
  SunMedium,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

const nav = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/app/track', label: 'Track Period', icon: HeartPulse },
  { to: '/app/symptoms', label: 'Symptoms', icon: Droplet },
  { to: '/app/mood', label: 'Mood', icon: Smile },
  { to: '/app/journal', label: 'Journal', icon: BookOpen },
  { to: '/app/water', label: 'Water', icon: Droplet },
  { to: '/app/medicine', label: 'Medicine', icon: Pill },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/app/assistant', label: 'AI Assistant', icon: Sparkles },
  { to: '/app/education', label: 'Education', icon: BookOpen },
  { to: '/app/garden', label: 'Memory Garden', icon: Flower2 },
  { to: '/app/partner', label: 'Partner Mode', icon: Users },
  { to: '/app/profile', label: 'Profile', icon: Settings },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  return (
    <aside className="flex h-full w-full flex-col gap-2 p-4">
      <div className="flex items-center justify-between gap-2 px-2 py-3">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-400 text-white shadow-soft">
            <Moon size={20} />
          </div>
          <div>
            <p className="font-display text-lg font-semibold leading-none">SkyLove</p>
            <p className="text-xs text-ink-700/60 dark:text-ink-50/60">Cycle</p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggle}
          className="btn-ghost rounded-full px-3 py-2 text-xs font-semibold"
        >
          {isDark ? <SunMedium size={14} className="mr-1" /> : <Moon size={14} className="mr-1" />}
          {isDark ? 'Light' : 'Dark'}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary-400 text-white shadow-soft'
                  : 'text-ink-700 dark:text-ink-50/70 hover:bg-primary-100 dark:hover:bg-white/10',
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} className={cn(isActive ? 'text-white' : 'text-primary-400 group-hover:scale-110 transition-transform')} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-2xl bg-white/40 dark:bg-white/5 p-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-primary-200 text-primary-700 font-semibold">
            {user?.name?.[0]?.toUpperCase() ?? 'S'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user?.name ?? 'Friend'}</p>
            <p className="truncate text-xs text-ink-700/60 dark:text-ink-50/60">{user?.email}</p>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="hidden lg:grid h-8 w-8 place-items-center rounded-full text-ink-700/60 hover:bg-error-500/10 hover:text-error-500 transition"
            aria-label="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export function MobileTopBar({ onMenu }: { onMenu: () => void }) {
  const { theme, toggle } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  return (
    <header className="glass sticky top-0 z-30 flex items-center justify-between px-4 py-3 lg:hidden bg-white/90 dark:bg-ink-900/90 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-400 to-secondary-400 text-white">
          <Moon size={18} />
        </div>
        <span className="font-display font-semibold">SkyLove</span>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={toggle} className="btn-ghost px-3 py-2 text-sm">
          {isDark ? <SunMedium size={16} /> : <Moon size={16} />}
        </button>
        <button 
          onClick={() => { logout(); navigate('/'); }}
          className="btn-ghost px-3 py-2 text-sm text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10"
          aria-label="Log out"
        >
          <LogOut size={16} />
        </button>
        <button onClick={onMenu} className="btn-ghost px-3 py-2 text-sm">Menu</button>
      </div>
    </header>
  );
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
