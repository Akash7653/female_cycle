import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Moon,
  SunMedium,
  HeartPulse,
  Smile,
  Droplet,
  BookOpen,
  Pill,
  BarChart3,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Star,
  ChevronDown,
  Flower2,
  LogOut,
} from 'lucide-react';
import { TESTIMONIALS, FAQS } from '@/lib/constants';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

const features = [
  { icon: HeartPulse, title: 'Cycle Tracking', desc: 'Log flow, pain, and energy. Predictions update with every entry.', color: 'from-primary-400 to-primary-500' },
  { icon: Smile, title: 'Mood Tracking', desc: 'Beautiful emoji cards capture how you feel each day.', color: 'from-secondary-400 to-secondary-500' },
  { icon: Droplet, title: 'Symptoms', desc: '15+ symptoms tracked with gentle, tap-to-log ease.', color: 'from-accent-400 to-accent-500' },
  { icon: Droplet, title: 'Water Tracker', desc: 'A glowing progress ring keeps hydration joyful.', color: 'from-accent-300 to-accent-400' },
  { icon: BookOpen, title: 'Journal', desc: 'A private timeline for thoughts, notes, and images.', color: 'from-primary-300 to-secondary-400' },
  { icon: Pill, title: 'Medicine Reminder', desc: 'Never miss a dose with kind, timely nudges.', color: 'from-success-500 to-success-600' },
  { icon: BarChart3, title: 'Analytics', desc: 'See trends across cycles, moods, and symptoms.', color: 'from-secondary-400 to-accent-400' },
  { icon: Sparkles, title: 'AI Insights', desc: 'A gentle wellness assistant offers caring suggestions.', color: 'from-primary-400 to-secondary-400' },
  { icon: ShieldCheck, title: 'Privacy First', desc: 'Your data is yours. Export or delete it anytime.', color: 'from-accent-400 to-secondary-400' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900 overflow-x-hidden">
      <NavBar />
      <Hero />
      <Benefits />
      <HowItWorks />
      <Features />
      <GardenTeaser />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

function NavBar() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/40 dark:border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-400 text-white shadow-soft">
            <Moon size={20} />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-sm sm:text-base leading-none">SkyLove</p>
            <p className="text-xs text-ink-700/60 dark:text-ink-50/60">Cycle</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm font-medium text-ink-700 dark:text-ink-50/70 hover:text-primary-500 transition">Features</a>
          <a href="#garden" className="text-sm font-medium text-ink-700 dark:text-ink-50/70 hover:text-primary-500 transition">Garden</a>
          <a href="#faq" className="text-sm font-medium text-ink-700 dark:text-ink-50/70 hover:text-primary-500 transition">FAQ</a>
          <Link to="/app" className="text-sm font-medium text-ink-700 dark:text-ink-50/70 hover:text-primary-500 transition">Dashboard</Link>
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={toggle} type="button" className="btn-ghost hidden items-center gap-2 text-sm md:inline-flex">
            {isDark ? <SunMedium size={16} /> : <Moon size={16} />}
            {isDark ? 'Light' : 'Dark'}
          </button>
          {user && (
            <Link to="/app/profile" className="hidden grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-white/80 text-sm shadow-soft overflow-hidden dark:bg-ink-900/80 md:grid">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name ?? 'Profile'} className="h-full w-full object-cover" />
              ) : (
                <span className="text-ink-900 dark:text-ink-50">{user.name?.[0]?.toUpperCase() ?? 'S'}</span>
              )}
            </Link>
          )}
          {user && (
            <button
              onClick={() => logout()}
              className="btn-ghost hidden items-center gap-2 text-sm md:inline-flex"
              type="button"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Login</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started</Link>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/70 text-ink-900 shadow-soft transition hover:bg-white dark:bg-ink-900/80 dark:text-ink-50 md:hidden"
            aria-label="Open navigation"
            type="button"
          >
            <div className="space-y-1">
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
            </div>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="border-t border-white/20 bg-white/90 dark:bg-ink-900/90 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6">
            <div className="flex items-center gap-3 pb-3 border-b border-white/20 dark:border-white/10">
              {user && (
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-white/80 text-sm shadow-soft overflow-hidden dark:bg-ink-900/80">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name ?? 'Profile'} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-ink-900 dark:text-ink-50">{user.name?.[0]?.toUpperCase() ?? 'S'}</span>
                  )}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-sm sm:text-base text-ink-900 dark:text-ink-50">{user?.name || 'Welcome'}</p>
                <p className="text-xs text-ink-700/60 dark:text-ink-50/60">{user?.email || 'Sign in to access your dashboard'}</p>
              </div>
            </div>
            
            <button onClick={toggle} type="button" className="flex items-center gap-3 px-3 py-3 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-sm font-medium text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-500/20 transition">
              {isDark ? <SunMedium size={18} /> : <Moon size={18} />}
              {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
            
            <div className="space-y-1">
              <a onClick={() => setMenuOpen(false)} href="#features" className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-sm text-ink-700 dark:text-ink-50/80 sm:text-base hover:bg-primary-50 dark:hover:bg-white/5 hover:text-primary-500 transition">Features</a>
              <a onClick={() => setMenuOpen(false)} href="#garden" className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-sm text-ink-700 dark:text-ink-50/80 sm:text-base hover:bg-primary-50 dark:hover:bg-white/5 hover:text-primary-500 transition">Garden</a>
              <a onClick={() => setMenuOpen(false)} href="#faq" className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-sm text-ink-700 dark:text-ink-50/80 sm:text-base hover:bg-primary-50 dark:hover:bg-white/5 hover:text-primary-500 transition">FAQ</a>
              <Link onClick={() => setMenuOpen(false)} to="/app" className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-sm text-ink-700 dark:text-ink-50/80 sm:text-base hover:bg-primary-50 dark:hover:bg-white/5 hover:text-primary-500 transition">Dashboard</Link>
            </div>
            
            <div className="flex flex-col gap-3 pt-3 border-t border-white/20 dark:border-white/10">
              {user ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center gap-2 btn-ghost text-sm w-full text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10"
                  type="button"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <>
                  <Link onClick={() => setMenuOpen(false)} to="/login" className="btn-ghost text-sm w-full justify-center">Login</Link>
                  <Link onClick={() => setMenuOpen(false)} to="/register" className="btn-primary text-sm w-full justify-center">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:py-32">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <span className="chip bg-primary-100 text-primary-600 dark:bg-primary-400/20 dark:text-primary-300 mb-4 inline-block">
              <Sparkles size={14} /> Every Cycle, Wrapped in Love
            </span>
            <h1 className="font-display text-3xl font-bold leading-tight text-ink-900 dark:text-ink-50 sm:text-4xl lg:text-6xl">
              Track Every Cycle <br />
              <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
                with Love.
              </span>
            </h1>
            <p className="mt-4 text-base text-ink-700 dark:text-ink-50/70 sm:text-lg lg:max-w-lg">
              Understand your body with beautiful insights, personalized tracking, reminders, and wellness support — all in one private, elegant place.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-flow-col sm:auto-cols-max sm:grid-cols-[minmax(0,auto)_minmax(0,1fr)] lg:justify-start">
              <Link to="/register" className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto">
                Get Started <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-ghost inline-flex items-center justify-center w-full sm:w-auto">Login</Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Avg. cycle accuracy', value: '92%', accent: 'from-primary-400 to-secondary-400' },
                { label: 'Daily reminders', value: '6', accent: 'from-secondary-400 to-accent-400' },
                { label: 'Guided insights', value: '24/7', accent: 'from-accent-400 to-primary-400' },
              ].map((item) => (
                <div key={item.label} className="glass-card overflow-hidden p-4">
                  <div className={`mb-2 h-2 rounded-full bg-gradient-to-r ${item.accent}`} />
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-700 dark:text-ink-50/70">{item.label}</p>
                  <p className="mt-2 text-2xl font-display font-bold text-ink-900 dark:text-ink-50">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative flex justify-center order-first lg:order-last"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -16, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative grid h-56 w-56 place-items-center rounded-full bg-gradient-to-br from-primary-300 via-secondary-300 to-accent-300 shadow-glow sm:h-72 sm:w-72 lg:h-96 lg:w-96"
              >
                <div className="sm:hidden">
                  <Moon size={80} className="text-white/90" strokeWidth={1.2} />
                </div>
                <div className="hidden sm:block">
                  <Moon size={120} className="text-white/90" strokeWidth={1.2} />
                </div>
                <div className="absolute -right-2 top-8 rounded-2xl bg-white/80 px-3 py-2 shadow-glass backdrop-blur-xl dark:bg-ink-800/80 sm:-right-4 sm:top-10 sm:px-4 sm:py-3">
                  <p className="text-[10px] text-ink-700/60 dark:text-ink-50/60 sm:text-xs">Next period</p>
                  <p className="font-display text-sm font-semibold text-sm sm:text-base text-primary-500 sm:text-lg">in 6 days</p>
                </div>
                <div className="absolute -left-2 bottom-8 rounded-2xl bg-white/80 px-3 py-2 shadow-glass backdrop-blur-xl dark:bg-ink-800/80 sm:-left-6 sm:bottom-12 sm:px-4 sm:py-3">
                  <p className="text-[10px] text-ink-700/60 dark:text-ink-50/60 sm:text-xs">Phase</p>
                  <p className="font-display text-sm font-semibold text-sm sm:text-base text-secondary-500 sm:text-lg">Luteal 🍂</p>
                </div>
              </motion.div>
              <div className="absolute inset-0 -z-10 rounded-full border border-dashed border-primary-200/40 opacity-70" />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex justify-center sm:mt-16"
        >
          <ChevronDown className="animate-bounce text-primary-300" />
        </motion.div>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        {[
          {
            title: 'Smarter predictions',
            desc: 'Log cycles, moods and symptoms so your next period arrives with confidence.',
            icon: HeartPulse,
          },
          {
            title: 'Daily rhythm support',
            desc: 'Turn quick check-ins into meaningful patterns that help you plan ahead.',
            icon: Smile,
          },
          {
            title: 'Gentle reminders',
            desc: 'Hydration, mood, and journal nudges keep your wellness routine soft and steady.',
            icon: Droplet,
          },
        ].map((item) => (
          <div key={item.title} className="glass-card p-5 sm:p-6">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-400 text-white shadow-soft mb-4 sm:h-12 sm:w-12 sm:rounded-3xl">
              <item.icon size={18} />
            </div>
            <h3 className="font-display text-lg font-semibold text-sm sm:text-base sm:text-xl">{item.title}</h3>
            <p className="mt-2 text-sm text-ink-700 dark:text-ink-50/70 sm:mt-3">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: HeartPulse, title: 'Track your days', desc: 'Log period flow, symptoms, mood and water intake in seconds.' },
    { icon: Smile, title: 'See your patterns', desc: 'Watch your cycle blooms and moods form a clearer rhythm.' },
    { icon: Droplet, title: 'Stay supported', desc: 'Gentle reminders help you hydrate, rest, and reflect.' },
    { icon: BookOpen, title: 'Celebrate progress', desc: 'Collect your wellness journey in a private memory garden.' },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="section-eyebrow">How it works</p>
        <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl lg:text-4xl">Simple steps to feel more in tune with your body.</h2>
        <p className="mt-3 text-sm text-ink-700 dark:text-ink-50/70 sm:mt-4 sm:text-base">Designed for busy women who want thoughtful care that fits naturally into daily life.</p>
      </div>
      <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <div key={step.title} className="glass-card p-5 text-left sm:p-6">
            <div className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-primary-100 text-primary-700 shadow-soft sm:mb-4 sm:h-12 sm:w-12 sm:rounded-3xl">
              <step.icon size={18} />
            </div>
            <h3 className="font-display text-base font-semibold text-sm sm:text-base sm:text-lg">{step.title}</h3>
            <p className="mt-2 text-sm text-ink-700 dark:text-ink-50/70 sm:mt-3">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="section-eyebrow">Features</p>
        <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl lg:text-4xl">Everything you need, beautifully made</h2>
        <p className="mt-3 text-sm text-ink-700 dark:text-ink-50/70 sm:mt-4 sm:text-base">Nine thoughtful tools, one calm space — designed to feel like care, not a chore.</p>
      </div>
      <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            whileHover={{ y: -6 }}
            className="glass-card group p-5 sm:p-6"
          >
            <div className={`mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${f.color} text-white shadow-soft sm:mb-4 sm:h-12 sm:w-12`}>
              <f.icon size={18} />
            </div>
            <h3 className="font-display text-base font-semibold text-sm sm:text-base sm:text-lg">{f.title}</h3>
            <p className="mt-2 text-sm text-ink-700 dark:text-ink-50/70 sm:mt-3">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function GardenTeaser() {
  return (
    <section id="garden" className="relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 via-secondary-100/40 to-accent-100/40 dark:from-primary-400/10 dark:via-secondary-400/10 dark:to-accent-400/10" />
      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <span className="section-eyebrow">Special Feature</span>
        <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl lg:text-4xl">The Memory Garden 🌸</h2>
        <p className="mx-auto mt-4 max-w-xl text-ink-700 dark:text-ink-50/70">
          Each completed cycle grows a unique flower. Over months, your garden blooms — a living, gentle record of your wellness journey across the seasons.
        </p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-10 flex flex-wrap justify-center gap-4 text-5xl"
        >
          {['🌸', '🌻', '🌼', '🌺', '🌷', '🌹'].map((e, i) => (
            <motion.span
              key={e}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
              className="grid h-20 w-20 place-items-center rounded-4xl glass shadow-glass"
            >
              {e}
            </motion.span>
          ))}
        </motion.div>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/60 dark:bg-white/10 px-4 py-2 text-sm font-medium">
          <Flower2 size={16} className="text-primary-400" /> Unlock seasonal flowers & milestone messages
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="section-eyebrow">Testimonials</p>
        <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl lg:text-4xl">Loved, gently</h2>
      </div>
      <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-5 sm:p-6"
          >
            <div className="mb-3 flex gap-1">
              {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-warning-500 text-warning-500" />)}
            </div>
            <p className="text-sm text-ink-700 dark:text-ink-50/80 sm:text-base">“{t.text}”</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-200 font-semibold text-sm sm:text-base text-primary-700">{t.name[0]}</div>
              <div>
                <p className="font-semibold text-sm sm:text-base">{t.name}</p>
                <p className="text-xs text-ink-700/60 dark:text-ink-50/60">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
      <div className="text-center">
        <p className="section-eyebrow">FAQ</p>
        <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl lg:text-4xl">Questions, answered</h2>
      </div>
      <div className="mt-10 space-y-3">
        {FAQS.map((f, i) => (
          <div key={i} className="glass-card overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="font-medium">{f.q}</span>
              <ChevronDown size={18} className={`text-primary-400 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            <motion.div
              initial={false}
              animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
              className="overflow-hidden"
            >
              <p className="px-5 pb-4 text-sm text-ink-700 dark:text-ink-50/70">{f.a}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="relative overflow-hidden rounded-5xl bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 p-10 text-center text-white shadow-glow sm:p-16">
        <div className="absolute inset-0 bg-hero-glow opacity-40" />
        <div className="relative">
          <h2 className="font-display text-2xl font-bold sm:text-3xl lg:text-4xl">Begin your wellness journey</h2>
          <p className="mx-auto mt-3 max-w-md text-white/90">Private, beautiful, and built around you. Your cycle deserves care.</p>
          <Link to="/register" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-display font-semibold text-sm sm:text-base text-primary-500 shadow-soft hover:scale-105 transition">
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/40 dark:border-white/10 bg-white/40 dark:bg-ink-800/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-400 to-secondary-400 text-white">
              <Moon size={18} />
            </div>
            <div>
              <p className="font-display font-semibold text-sm sm:text-base">SkyLove Cycle</p>
              <p className="text-xs text-ink-700/60 dark:text-ink-50/60">Every Cycle, Wrapped in Love.</p>
            </div>
          </div>
          <p className="text-xs text-ink-700/60 dark:text-ink-50/60">© {new Date().getFullYear()} SkyLove Cycle. Made with care.</p>
        </div>
      </div>
    </footer>
  );
}
