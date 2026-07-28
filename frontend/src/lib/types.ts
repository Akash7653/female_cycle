export type FlowLevel = 'none' | 'light' | 'medium' | 'heavy' | 'very_heavy';
export type Phase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
export type MoodType =
  | 'happy'
  | 'loved'
  | 'neutral'
  | 'sad'
  | 'emotional'
  | 'angry'
  | 'tired'
  | 'sick';

export interface User {
  id: string;
  accountType?: 'myself' | 'loved-one';
  name: string;
  relationship?: string;
  lovedOneName?: string;
  lovedOneAge?: number;
  dateOfBirth?: string;
  email: string;
  age?: number;
  height?: number;
  weight?: number;
  cycleLength: number;
  periodLength: number;
  language: string;
  avatar?: string;
  createdAt: string;
}

export interface Cycle {
  id: string;
  startDate: string;
  endDate?: string;
  flow: FlowLevel;
  painLevel: number; // 0-10
  energyLevel: number; // 0-10
  notes?: string;
}

export interface SymptomLog {
  id: string;
  date: string;
  symptoms: string[];
}

export interface MoodLog {
  id: string;
  date: string;
  mood: MoodType;
  note?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  image?: string;
}

export interface WaterLog {
  id: string;
  date: string;
  glasses: number;
}

export interface Medicine {
  id: string;
  name: string;
  time: string;
  repeat: 'daily' | 'weekdays' | 'custom';
  completed: boolean;
  notes?: string;
}

export interface Prediction {
  nextPeriod: string;
  ovulation: string;
  fertileStart: string;
  fertileEnd: string;
  cycleLength: number;
  daysUntil: number;
  phase: Phase;
  isLate: boolean;
  irregular: boolean;
}

export interface PartnerPermissions {
  enabled: boolean;
  partnerName?: string;
  shareDaysUntil: boolean;
  shareReminders: boolean;
  shareSupport: boolean;
  shareJournal: boolean;
  shareSymptoms: boolean;
  shareMedical: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'period' | 'mood' | 'water' | 'medicine' | 'journal';
  message: string;
  date: string;
  read: boolean;
}

export interface Flower {
  id: string;
  cycleId: string;
  name: string;
  emoji: string;
  season: string;
  unlockedAt: string;
}
