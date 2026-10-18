const STORAGE_KEY_COMPLETED = 'veneto_completed_stops_v1';
const STORAGE_KEY_FAVORITES = 'veneto_favorite_stops_v1';
const STORAGE_KEY_NOTES = 'veneto_stop_notes_v1';
const STORAGE_KEY_PASS = 'veneto_actv_pass_v1';
const STORAGE_KEY_NOTIFICATIONS = 'veneto_notification_alerts_v1';
const STORAGE_KEY_BUDGET_PAID = 'veneto_budget_paid_v1';

export interface PassConfig {
  isActive: boolean;
  startTime: string; // ISO string
  durationHours: number; // default 48
}

export function getCompletedStops(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setCompletedStops(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(ids));
  } catch (e) {
    console.error('Failed to save completed stops', e);
  }
}

export function toggleCompletedStop(id: string): string[] {
  const current = getCompletedStops();
  const next = current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id];
  setCompletedStops(next);
  return next;
}

export function getFavoriteStops(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteStop(id: string): string[] {
  const current = getFavoriteStops();
  const next = current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id];
  try {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(next));
  } catch (e) {
    console.error('Failed to save favorites', e);
  }
  return next;
}

export function getCustomNotes(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveStopNote(stopId: string, note: string): void {
  try {
    const current = getCustomNotes();
    if (!note.trim()) {
      delete current[stopId];
    } else {
      current[stopId] = note;
    }
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save note', e);
  }
}

export function getPassConfig(): PassConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PASS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  // Default to planned trip time: 21 Ekim 2026 21:00
  return {
    isActive: true,
    startTime: '2026-10-21T21:00:00',
    durationHours: 48,
  };
}

export function savePassConfig(config: PassConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_PASS, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save pass config', e);
  }
}

export function getPaidExpenses(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BUDGET_PAID);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function togglePaidExpense(expenseId: string): string[] {
  const current = getPaidExpenses();
  const next = current.includes(expenseId)
    ? current.filter((id) => id !== expenseId)
    : [...current, expenseId];
  try {
    localStorage.setItem(STORAGE_KEY_BUDGET_PAID, JSON.stringify(next));
  } catch (e) {
    console.error('Failed to save budget state', e);
  }
  return next;
}
