export interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  event_type: string;
  color: string;
  is_all_day: boolean;
  recurrence_rule: string | null;
  parent_event_id: string | null;
  reminder_minutes: number;
}

export interface Participant {
  id: string;
  event_id: string;
  email: string;
  name: string | null;
  status: 'pending' | 'accepted' | 'declined' | 'tentative';
}

export interface AvailabilitySetting {
  id: string;
  user_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export type ViewMode = 'month' | 'week' | 'day' | 'agenda';

export const EventColors = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Yellow', value: '#f59e0b' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
];

export const RecurrenceOptions = [
  { label: 'Does not repeat', value: '' },
  { label: 'Daily', value: 'FREQ=DAILY' },
  { label: 'Weekly', value: 'FREQ=WEEKLY' },
  { label: 'Monthly', value: 'FREQ=MONTHLY' },
  { label: 'Yearly', value: 'FREQ=YEARLY' },
];

export const ReminderOptions = [
  { label: 'No reminder', value: 0 },
  { label: '5 minutes before', value: 5 },
  { label: '15 minutes before', value: 15 },
  { label: '30 minutes before', value: 30 },
  { label: '1 hour before', value: 60 },
  { label: '1 day before', value: 1440 },
];
