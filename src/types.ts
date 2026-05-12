export type SituationType = 
  | 'late_wake'
  | 'missed_bus'
  | 'forgot_assignment'
  | 'sick'
  | 'traffic'
  | 'family_emergency'
  | 'overslept_study'
  | 'other';

export interface ExcuseResponse {
  formal: string;
  casual: string;
  convincing: string;
  believability: number;
}

export interface Situation {
  id: SituationType;
  label: string;
  emoji: string;
}
