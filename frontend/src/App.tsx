import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Flower2 } from 'lucide-react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { ToastProvider } from '@/context/ToastContext';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegistrationFlowPage } from '@/pages/RegistrationFlowPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { TrackPeriodPage } from '@/pages/TrackPeriodPage';
import { SymptomsPage } from '@/pages/SymptomsPage';
import { MoodPage } from '@/pages/MoodPage';
import { JournalPage } from '@/pages/JournalPage';
import { WaterPage } from '@/pages/WaterPage';
import { MedicinePage } from '@/pages/MedicinePage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { AssistantPage } from '@/pages/AssistantPage';
import { GardenPage } from '@/pages/GardenPage';
import { PartnerPage } from '@/pages/PartnerPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { EducationCenterPage } from '@/pages/EducationCenterPage';
import type { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationFlowPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
      </Route>
      <Route
        element={
          <ProtectedRoute>
            <DataProvider>
              <DashboardLayout />
            </DataProvider>
          </ProtectedRoute>
        }
      >
        <Route path="/app" element={<DashboardPage />} />
        <Route path="/app/calendar" element={<CalendarPage />} />
        <Route path="/app/track" element={<TrackPeriodPage />} />
        <Route path="/app/symptoms" element={<SymptomsPage />} />
        <Route path="/app/mood" element={<MoodPage />} />
        <Route path="/app/journal" element={<JournalPage />} />
        <Route path="/app/water" element={<WaterPage />} />
        <Route path="/app/medicine" element={<MedicinePage />} />
        <Route path="/app/analytics" element={<AnalyticsPage />} />
        <Route path="/app/assistant" element={<AssistantPage />} />
        <Route path="/app/garden" element={<GardenPage />} />
        <Route path="/app/partner" element={<PartnerPage />} />
        <Route path="/app/profile" element={<ProfilePage />} />
        <Route path="/app/settings" element={<SettingsPage />} />
        <Route path="/app/education" element={<EducationCenterPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AnimatePresence mode="wait">
            {showSplash ? (
              <motion.div
                key="splash"
                className="fixed inset-0 z-[999] flex items-center justify-center bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400 text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
              className="relative flex h-40 w-40 items-center justify-center"
              animate={{ scale: [0.92, 1.08, 0.92], y: [0, -16, 0], rotate: [0, 0, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="absolute inset-0 rounded-full bg-white/10 shadow-soft" />
              <div className="absolute inset-4 rounded-full border-2 border-white/20" />
              <div className="absolute inset-10 rounded-full border-2 border-white/10" />
              <motion.div
                className="absolute inset-0 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Flower2 size={52} className="text-white/90" />
              </motion.div>
            </motion.div>
              </motion.div>
            ) : (
              <AppRoutes />
            )}
          </AnimatePresence>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
