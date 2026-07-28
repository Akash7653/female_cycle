import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar, MobileTopBar } from '@/components/Sidebar';
import { X } from 'lucide-react';

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-mesh dark:bg-ink-900">
      <div className="mx-auto flex max-w-[1400px]">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-72 shrink-0 sticky top-0 h-screen glass border-r border-white/40 dark:border-white/10">
          <Sidebar />
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm lg:hidden"
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed left-0 top-0 z-50 h-full w-72 glass border-r border-white/40 dark:border-white/10 lg:hidden"
              >
                <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-3 text-ink-700/60">
                  <X size={20} />
                </button>
                <Sidebar onNavigate={() => setMobileOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 min-w-0">
          <MobileTopBar onMenu={() => setMobileOpen(true)} />
          <main className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
