import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  HeartPulse,
  Sparkles,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const bottomNav = [
  { to: '/app', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/app/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/app/track', label: 'Track', icon: HeartPulse },
  { to: '/app/assistant', label: 'AI', icon: Sparkles },
  { to: '/app/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/40 dark:border-white/10 lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {bottomNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition-all',
                isActive
                  ? 'text-primary-500'
                  : 'text-ink-700/60 dark:text-ink-50/60 hover:text-ink-700 dark:hover:text-ink-50',
              )
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'grid h-6 w-6 place-items-center rounded-lg transition-colors',
                    isActive ? 'bg-primary-100 dark:bg-primary-500/20' : '',
                  )}
                >
                  <item.icon size={18} className={isActive ? 'text-primary-500' : ''} />
                </motion.div>
                <span className="text-[10px]">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
