import { Situation } from './types';

export const SITUATIONS: Situation[] = [
  { id: 'late_wake', label: 'Woke up late', emoji: '⏰' },
  { id: 'missed_bus', label: 'Missed the bus', emoji: '🚌' },
  { id: 'forgot_assignment', label: 'Forgot assignment', emoji: '📚' },
  { id: 'sick', label: 'Sick', emoji: '🤒' },
  { id: 'traffic', label: 'Traffic', emoji: '🚗' },
  { id: 'family_emergency', label: 'Family emergency', emoji: '🏠' },
  { id: 'overslept_study', label: 'All-nighter sleep', emoji: '📖' },
  { id: 'other', label: 'Other', emoji: '✨' },
];
