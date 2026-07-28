import type {
  Cycle,
  JournalEntry,
  Medicine,
  MoodLog,
  NotificationItem,
  PartnerPermissions,
  SymptomLog,
  User,
  WaterLog,
  Flower,
} from './types';
import { uid } from './utils';

const KEYS = {
  user: 'skylove.user',
  cycles: 'skylove.cycles',
  symptoms: 'skylove.symptoms',
  moods: 'skylove.moods',
  journals: 'skylove.journals',
  water: 'skylove.water',
  medicines: 'skylove.medicines',
  notifications: 'skylove.notifications',
  partner: 'skylove.partner',
  flowers: 'skylove.flowers',
  token: 'skylove.token',
  theme: 'skylove.theme',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota */
  }
}

export const storage = {
  // User
  getUser: (): User | null => read<User | null>(KEYS.user, null),
  setUser: (u: User) => write(KEYS.user, u),
  clearUser: () => localStorage.removeItem(KEYS.user),

  getToken: (): string | null => read<string | null>(KEYS.token, null),
  setToken: (t: string) => write(KEYS.token, t),
  clearToken: () => localStorage.removeItem(KEYS.token),

  // Cycles
  getCycles: (): Cycle[] => read<Cycle[]>(KEYS.cycles, []),
  setCycles: (c: Cycle[]) => write(KEYS.cycles, c),

  // Symptoms
  getSymptoms: (): SymptomLog[] => read<SymptomLog[]>(KEYS.symptoms, []),
  setSymptoms: (s: SymptomLog[]) => write(KEYS.symptoms, s),

  // Moods
  getMoods: (): MoodLog[] => read<MoodLog[]>(KEYS.moods, []),
  setMoods: (m: MoodLog[]) => write(KEYS.moods, m),

  // Journals
  getJournals: (): JournalEntry[] => read<JournalEntry[]>(KEYS.journals, []),
  setJournals: (j: JournalEntry[]) => write(KEYS.journals, j),

  // Water
  getWater: (): WaterLog[] => read<WaterLog[]>(KEYS.water, []),
  setWater: (w: WaterLog[]) => write(KEYS.water, w),

  // Medicines
  getMedicines: (): Medicine[] => read<Medicine[]>(KEYS.medicines, []),
  setMedicines: (m: Medicine[]) => write(KEYS.medicines, m),

  // Notifications
  getNotifications: (): NotificationItem[] => read<NotificationItem[]>(KEYS.notifications, []),
  setNotifications: (n: NotificationItem[]) => write(KEYS.notifications, n),

  // Partner
  getPartner: (): PartnerPermissions => read<PartnerPermissions>(KEYS.partner, {
    enabled: false,
    shareDaysUntil: true,
    shareReminders: true,
    shareSupport: true,
    shareJournal: false,
    shareSymptoms: false,
    shareMedical: false,
  }),
  setPartner: (p: PartnerPermissions) => write(KEYS.partner, p),

  // Flowers
  getFlowers: (): Flower[] => read<Flower[]>(KEYS.flowers, []),
  setFlowers: (f: Flower[]) => write(KEYS.flowers, f),

  // Theme
  getTheme: (): 'light' | 'dark' => read<'light' | 'dark'>(KEYS.theme, 'light'),
  setTheme: (t: 'light' | 'dark') => write(KEYS.theme, t),

  // Helpers
  genId: uid,
};
