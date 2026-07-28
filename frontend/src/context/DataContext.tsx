import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type {
  Cycle,
  JournalEntry,
  Medicine,
  MoodLog,
  NotificationItem,
  SymptomLog,
  WaterLog,
  Flower,
} from '@/lib/types';
import { predict } from '@/lib/cycle';
import { todayISO, uid } from '@/lib/utils';
import { WATER_GOAL_DEFAULT } from '@/lib/constants';

interface DataContextValue {
  cycles: Cycle[];
  symptoms: SymptomLog[];
  moods: MoodLog[];
  journals: JournalEntry[];
  water: WaterLog[];
  medicines: Medicine[];
  notifications: NotificationItem[];
  flowers: Flower[];
  prediction: ReturnType<typeof predict>;
  waterToday: WaterLog | undefined;
  moodToday: MoodLog | undefined;
  addCycle: (c: Omit<Cycle, 'id'>) => void;
  updateCycle: (id: string, patch: Partial<Cycle>) => void;
  deleteCycle: (id: string) => void;
  setSymptomsForDate: (date: string, symptoms: string[]) => void;
  setMoodForDate: (date: string, mood: MoodLog['mood'], note?: string) => void;
  addJournal: (j: Omit<JournalEntry, 'id'>) => void;
  deleteJournal: (id: string) => void;
  addWater: (glasses: number) => void;
  setWater: (date: string, glasses: number) => void;
  addMedicine: (m: Omit<Medicine, 'id' | 'completed'>) => void;
  toggleMedicine: (id: string) => void;
  deleteMedicine: (id: string) => void;
  markNotificationRead: (id: string) => void;
  refresh: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomLog[]>([]);
  const [moods, setMoods] = useState<MoodLog[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [water, setWaterState] = useState<WaterLog[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const prediction = useMemo(
    () => predict(cycles, user?.cycleLength ?? 28, user?.periodLength ?? 5),
    [cycles, user?.cycleLength, user?.periodLength],
  );

  const today = todayISO();
  const waterToday = water.find((w) => w.date === today);
  const moodToday = moods.find((m) => m.date === today);

  const normalizeItem = (item: any) => ({ ...item, id: item.id ?? item._id });
  const normalizeList = (items: any[]) => items.map(normalizeItem);

  const loadData = useCallback(async () => {
    setLoading(true);
    if (!user) {
      setCycles([]);
      setSymptoms([]);
      setMoods([]);
      setJournals([]);
      setWaterState([]);
      setMedicines([]);
      setNotifications([]);
      setFlowers([]);
      setLoading(false);
      return;
    }

    try {
      const [cyclesRes, symptomsRes, moodsRes, journalsRes, waterRes, medicinesRes, notificationsRes, flowersRes] = await Promise.all([
        api.get('/cycles'),
        api.get('/symptoms'),
        api.get('/moods'),
        api.get('/journals'),
        api.get('/water'),
        api.get('/medicines'),
        api.get('/notifications'),
        api.get('/flowers'),
      ]);

      setCycles(normalizeList(cyclesRes.data.cycles || []));
      setSymptoms(normalizeList(symptomsRes.data.symptoms || []));
      setMoods(normalizeList(moodsRes.data.moods || []));
      setJournals(normalizeList(journalsRes.data.journals || []));
      setWaterState(normalizeList(waterRes.data.water || []));
      setMedicines(normalizeList(medicinesRes.data.medicines || []));
      setNotifications(normalizeList(notificationsRes.data.notifications || []));
      setFlowers(normalizeList(flowersRes.data.flowers || []));
    } catch (err) {
      console.error('Failed to load user data', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Generate gentle notifications based on prediction
  useEffect(() => {
    const existing = notifications;
    const items: NotificationItem[] = [];
    if (prediction.daysUntil <= 2 && prediction.daysUntil >= 0) {
      items.push({
        id: uid('ntf'),
        type: 'period',
        message: `Your period may begin in ${prediction.daysUntil} day${prediction.daysUntil === 1 ? '' : 's'}.`,
        date: today,
        read: false,
      });
    }
    if (!moodToday) {
      items.push({ id: uid('ntf'), type: 'mood', message: "Log today's mood.", date: today, read: false });
    }
    if (!waterToday || waterToday.glasses < WATER_GOAL_DEFAULT) {
      items.push({ id: uid('ntf'), type: 'water', message: 'Drink more water today.', date: today, read: false });
    }
    medicines.filter((m) => !m.completed).forEach((m) => {
      items.push({ id: uid('ntf'), type: 'medicine', message: `Take your medicine: ${m.name} at ${m.time}.`, date: today, read: false });
    });
    if (!journals.some((j) => j.date === today)) {
      items.push({ id: uid('ntf'), type: 'journal', message: 'Write a line in your journal today.', date: today, read: false });
    }
    // Merge new ones not already present by message+date
    const merged = [...existing];
    for (const it of items) {
      if (!merged.some((m) => m.message === it.message && m.date === it.date)) {
        merged.unshift(it);
      }
    }
    setNotifications(merged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prediction.daysUntil, moodToday, waterToday, medicines, journals]);

  const addCycle = useCallback(async (c: Omit<Cycle, 'id'>) => {
    const { data } = await api.post('/cycles', c);
    const cycle = normalizeItem(data.cycle);
    setCycles((prev) => [...prev, cycle]);
    return cycle;
  }, []);

  const updateCycle = useCallback(async (id: string, patch: Partial<Cycle>) => {
    const { data } = await api.put(`/cycles/${id}`, patch);
    const cycle = normalizeItem(data.cycle);
    setCycles((prev) => prev.map((c) => (c.id === id ? cycle : c)));
    return cycle;
  }, []);

  const deleteCycle = useCallback(async (id: string) => {
    await api.delete(`/cycles/${id}`);
    setCycles((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const setSymptomsForDate = useCallback(async (date: string, syms: string[]) => {
    const { data } = await api.post('/symptoms', { date, symptoms: syms });
    const nextItem = normalizeItem(data.symptom);
    setSymptoms((prev) => {
      const without = prev.filter((s) => s.date !== date);
      return [...without, nextItem];
    });
    return nextItem;
  }, []);

  const setMoodForDate = useCallback(async (date: string, mood: MoodLog['mood'], note?: string) => {
    const { data } = await api.post('/moods', { date, mood, note });
    const nextItem = normalizeItem(data.mood);
    setMoods((prev) => {
      const without = prev.filter((m) => m.date !== date);
      return [...without, nextItem];
    });
    return nextItem;
  }, []);

  const addJournal = useCallback(async (j: Omit<JournalEntry, 'id'>) => {
    const { data } = await api.post('/journals', j);
    const next = normalizeItem(data.journal);
    setJournals((prev) => [next, ...prev]);
    return next;
  }, []);

  const deleteJournal = useCallback(async (id: string) => {
    await api.delete(`/journals/${id}`);
    setJournals((prev) => prev.filter((j) => j.id !== id));
  }, []);

  const addWater = useCallback(async (glasses: number) => {
    const { data } = await api.post('/water', { date: today, glasses });
    const next = normalizeItem(data.water);
    setWaterState((prev) => {
      const without = prev.filter((w) => w.date !== today);
      return [...without, next];
    });
    return next;
  }, [today]);

  const setWater = useCallback(async (date: string, glasses: number) => {
    const { data } = await api.post('/water', { date, glasses });
    const next = normalizeItem(data.water);
    setWaterState((prev) => {
      const without = prev.filter((w) => w.date !== date);
      return [...without, next];
    });
    return next;
  }, []);

  const addMedicine = useCallback(async (m: Omit<Medicine, 'id' | 'completed'>) => {
    const { data } = await api.post('/medicines', m);
    const next = normalizeItem(data.medicine);
    setMedicines((prev) => [...prev, next]);
    return next;
  }, []);

  const toggleMedicine = useCallback(async (id: string) => {
    const { data } = await api.patch(`/medicines/${id}/toggle`);
    const next = normalizeItem(data.medicine);
    setMedicines((prev) => prev.map((m) => (m.id === id ? next : m)));
    return next;
  }, []);

  const deleteMedicine = useCallback(async (id: string) => {
    await api.delete(`/medicines/${id}`);
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const markNotificationRead = useCallback(async (id: string) => {
    const { data } = await api.patch(`/notifications/${id}/read`);
    const next = normalizeItem(data.notification);
    setNotifications((prev) => prev.map((n) => (n.id === id ? next : n)));
    return next;
  }, []);

  const refresh = useCallback(() => {
    void loadData();
  }, [loadData]);

  const value = useMemo<DataContextValue>(
    () => ({
      cycles, symptoms, moods, journals, water, medicines, notifications, flowers,
      prediction, waterToday, moodToday,
      addCycle, updateCycle, deleteCycle,
      setSymptomsForDate, setMoodForDate,
      addJournal, deleteJournal,
      addWater, setWater,
      addMedicine, toggleMedicine, deleteMedicine,
      markNotificationRead, refresh,
    }),
    [cycles, symptoms, moods, journals, water, medicines, notifications, flowers, prediction, waterToday, moodToday,
      addCycle, updateCycle, deleteCycle, setSymptomsForDate, setMoodForDate, addJournal, deleteJournal, addWater, setWater, addMedicine, toggleMedicine, deleteMedicine, markNotificationRead, refresh],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
