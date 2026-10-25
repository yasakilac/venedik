// Oyun ve test geçmişi: soru, cevap ve puanlar telefonda saklanır, internetsiz de incelenir.
export interface ReviewLine {
  p: number; // oyuncu indeksi (0 pembe, 1 mavi)
  text: string;
  ok?: boolean;
}

export interface ReviewItem {
  q: string;
  lines: ReviewLine[];
  correct?: string; // bilgi yarışmalarında doğru cevap
  note?: string;
}

export interface HistoryEntry {
  id: string;
  gameId: string;
  title: string;
  emoji: string;
  at: number;
  names: string[];
  scores?: number[]; // puanlı oyunlarda
  total?: number;
  summary: string[]; // örn. sonuç başlıkları
  items: ReviewItem[];
}

const KEY = 'veneto_game_history_v1';
const MAX = 30;

export function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function addHistory(entry: HistoryEntry): void {
  try {
    const next = [entry, ...loadHistory()].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // depolama dolu / yasak: sessizce geç
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // yoksay
  }
}

// Tek kişilik rekor (aynı oyunun önceki en iyi skoru)
export function bestSolo(gameId: string): number | null {
  const scores = loadHistory()
    .filter((h) => h.gameId === gameId && h.names.length === 1 && h.scores)
    .map((h) => h.scores![0]);
  return scores.length ? Math.max(...scores) : null;
}

export const newEntryId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
