import React, { useState } from 'react';
import { X, Undo2, User, Users } from 'lucide-react';

// Tailwind sınıfları tam yazılmalı (dinamik birleştirme derlenmez)
export const PLAYER_STYLES = [
  {
    dot: 'bg-pink-500',
    badge: 'bg-pink-500 text-white',
    soft: 'bg-pink-100 border-pink-500 text-pink-950',
    bar: 'bg-pink-500',
    text: 'text-pink-600',
    card: 'border-pink-400 bg-pink-50',
    label: 'pembe',
  },
  {
    dot: 'bg-blue-500',
    badge: 'bg-blue-500 text-white',
    soft: 'bg-blue-100 border-blue-500 text-blue-950',
    bar: 'bg-blue-500',
    text: 'text-blue-600',
    card: 'border-blue-400 bg-blue-50',
    label: 'mavi',
  },
] as const;

const NAMES_KEY = 'veneto_players_v1';

export function loadNames(): [string, string] {
  try {
    const v = JSON.parse(localStorage.getItem(NAMES_KEY) || '[]');
    return [String(v[0] ?? ''), String(v[1] ?? '')];
  } catch {
    return ['', ''];
  }
}

function saveNames(n: [string, string]) {
  try {
    localStorage.setItem(NAMES_KEY, JSON.stringify(n));
  } catch {
    // depolama yasak: sessizce geç
  }
}

export const initial = (name: string) => (name.trim()[0] || '?').toLocaleUpperCase('tr-TR');

// Tam ekrana yakın oyun kabuğu (iPhone çentik / ana ekran çubuğu güvenli alanlarıyla)
export const GameShell: React.FC<{
  title: string;
  onClose: () => void;
  progress?: number; // 0..1
  right?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, onClose, progress, right, footer, children }) => (
  <div className="fixed inset-0 z-[60] bg-slate-50 flex flex-col">
    <div className="pt-safe bg-slate-900 text-white shrink-0">
      <div className="h-14 px-4 flex items-center justify-between gap-3 max-w-2xl mx-auto w-full">
        <h2 className="text-base font-bold truncate">{title}</h2>
        <div className="flex items-center gap-2 shrink-0">
          {right}
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      {progress !== undefined && (
        <div className="h-1.5 bg-slate-700">
          <div className="h-full bg-amber-400 transition-all" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      )}
    </div>
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full px-4 py-5 space-y-5">{children}</div>
    </div>
    {footer && (
      <div className="pb-safe bg-white border-t border-slate-200 shrink-0">
        <div className="max-w-2xl mx-auto w-full px-4 py-3">{footer}</div>
      </div>
    )}
  </div>
);

export const BigButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  tone?: 'dark' | 'amber' | 'light';
}> = ({ onClick, disabled, children, tone = 'dark' }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`w-full min-h-[60px] rounded-2xl text-lg font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
      tone === 'dark'
        ? 'bg-slate-900 text-white'
        : tone === 'amber'
          ? 'bg-amber-500 text-slate-950'
          : 'bg-slate-100 text-slate-800 border border-slate-200'
    }`}
  >
    {children}
  </button>
);

// Mod seçimi + isim girişi: 1. kişi pembe, 2. kişi mavi
const MODE_KEY = 'veneto_mode_v1';

export const PlayerSetup: React.FC<{
  title: string;
  emoji: string;
  intro: string;
  allowSolo?: boolean;
  bestScore?: number | null; // tekli modda gösterilecek rekor
  onStart: (names: string[]) => void;
  onClose: () => void;
}> = ({ title, emoji, intro, allowSolo = true, bestScore, onStart, onClose }) => {
  const saved = loadNames();
  const [a, setA] = useState(saved[0]);
  const [b, setB] = useState(saved[1]);
  const [mode, setMode] = useState<'solo' | 'duo'>(() => {
    if (!allowSolo) return 'duo';
    try {
      return localStorage.getItem(MODE_KEY) === 'solo' ? 'solo' : 'duo';
    } catch {
      return 'duo';
    }
  });

  const choose = (m: 'solo' | 'duo') => {
    setMode(m);
    try {
      localStorage.setItem(MODE_KEY, m);
    } catch {
      // yoksay
    }
  };

  const start = () => {
    const n1 = a.trim() || '1. Kişi';
    const n2 = b.trim() || '2. Kişi';
    saveNames([a.trim(), b.trim()]);
    onStart(mode === 'solo' ? [n1] : [n1, n2]);
  };

  const fields: [string, (v: string) => void, number][] = mode === 'solo' ? [[a, setA, 0]] : [[a, setA, 0], [b, setB, 1]];

  return (
    <GameShell title={title} onClose={onClose}>
      <div className="text-center space-y-2 pt-2">
        <div className="text-6xl">{emoji}</div>
        <h3 className="text-2xl font-bold font-serif-heading text-slate-900">{title}</h3>
        <p className="text-base text-slate-600 leading-relaxed">{intro}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {([
          ['solo', '👤', 'Tekli mod', 'Tek başına, rekorunu kır'],
          ['duo', '👥', 'Çiftli mod', 'Pembe ve mavi sırayla'],
        ] as const).map(([id, em, label, hint]) => {
          const disabled = id === 'solo' && !allowSolo;
          return (
            <button
              key={id}
              type="button"
              disabled={disabled}
              onClick={() => choose(id)}
              className={`min-h-[96px] rounded-2xl border-2 p-3 text-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                mode === id ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="text-3xl">{em}</div>
              <div className="text-base font-bold text-slate-900">{label}</div>
              <div className="text-[11px] text-slate-500 leading-tight">{disabled ? 'Bu oyun iki kişilik' : hint}</div>
            </button>
          );
        })}
      </div>

      {mode === 'solo' && bestScore !== undefined && bestScore !== null && (
        <div className="text-center text-base font-semibold text-amber-800">🏅 Rekorun: {bestScore}</div>
      )}

      <div className="space-y-3">
        {fields.map(([val, set, i]) => (
          <label key={i} className="block">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
              <span className={`w-3.5 h-3.5 rounded-full ${PLAYER_STYLES[i].dot}`} />
              {mode === 'solo' ? 'İsmin' : `${i + 1}. kişi (${PLAYER_STYLES[i].label})`}
            </span>
            <input
              value={val}
              onChange={(e) => set(e.target.value)}
              placeholder="İsim"
              maxLength={14}
              className={`w-full min-h-[60px] px-4 text-xl rounded-2xl border-2 bg-white focus:outline-none ${
                i === 0 ? 'border-pink-300 focus:border-pink-500' : 'border-blue-300 focus:border-blue-500'
              }`}
            />
          </label>
        ))}
      </div>

      <BigButton onClick={start} tone="amber">
        {mode === 'solo' ? <User className="w-6 h-6" /> : <Users className="w-6 h-6" />} Başla
      </BigButton>
    </GameShell>
  );
};

// ---- İki kişilik sırayla işaretleme ----
export function useDualPick(n: number) {
  const [picks, setPicks] = useState<(number | null)[]>(() => Array(n).fill(null));
  const active = picks.findIndex((p) => p === null); // -1: herkes işaretledi
  return {
    picks,
    active,
    done: active === -1,
    pick: (idx: number) => {
      if (active === -1) return;
      setPicks(picks.map((p, i) => (i === active ? idx : p)));
    },
    undo: () => {
      const last = [...picks].reverse().findIndex((p) => p !== null);
      if (last === -1) return;
      const at = picks.length - 1 - last;
      setPicks(picks.map((p, i) => (i === at ? null : p)));
    },
    reset: () => setPicks(Array(n).fill(null)),
  };
}

// Kimin sırası olduğunu büyükçe gösteren çubuk
export const TurnBanner: React.FC<{
  names: string[];
  active: number;
  onUndo?: () => void;
  canUndo?: boolean;
  doneText?: string;
}> = ({ names, active, onUndo, canUndo, doneText }) => (
  <div
    className={`rounded-2xl border-2 px-4 min-h-[56px] flex items-center justify-between gap-3 ${
      active === -1 ? 'bg-emerald-50 border-emerald-400' : PLAYER_STYLES[active].card
    }`}
  >
    {active === -1 ? (
      <span className="text-lg font-bold text-emerald-800">{doneText ?? 'Hepiniz işaretlediniz'}</span>
    ) : (
      <span className="flex items-center gap-2 text-lg font-bold text-slate-900">
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${PLAYER_STYLES[active].badge}`}>
          {initial(names[active])}
        </span>
        Sıra: {names[active]}
      </span>
    )}
    {canUndo && onUndo && (
      <button
        type="button"
        onClick={onUndo}
        className="min-h-[44px] px-3 rounded-xl bg-white/70 text-sm font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
      >
        <Undo2 className="w-4 h-4" /> Geri al
      </button>
    )}
  </div>
);

// Seçenek düğmesi: kim işaretlediyse onun rengiyle yanar
export const OptionButton: React.FC<{
  label: string;
  pickedBy: number[]; // oyuncu indeksleri
  names: string[];
  state?: 'idle' | 'correct' | 'wrong';
  disabled?: boolean;
  onClick: () => void;
}> = ({ label, pickedBy, names, state = 'idle', disabled, onClick }) => {
  let cls = 'bg-white border-slate-200 text-slate-900';
  if (pickedBy.length === 1) cls = PLAYER_STYLES[pickedBy[0]].soft;
  if (pickedBy.length > 1) cls = 'bg-gradient-to-r from-pink-100 to-blue-100 border-purple-500 text-slate-900';
  if (state === 'correct') cls += ' ring-4 ring-emerald-400';
  if (state === 'wrong') cls += ' opacity-50';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full min-h-[68px] px-4 py-3 rounded-2xl border-2 text-left text-lg leading-snug font-medium flex items-center justify-between gap-3 transition-colors ${
        disabled ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'
      } ${cls}`}
    >
      <span className="flex-1">{label}</span>
      <span className="flex items-center gap-1 shrink-0">
        {state === 'correct' && <span className="text-2xl">✅</span>}
        {pickedBy.map((p) => (
          <span key={p} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${PLAYER_STYLES[p].badge}`}>
            {initial(names[p])}
          </span>
        ))}
      </span>
    </button>
  );
};

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


// Sayıyı yumuşakça yukarı sayar
export function useCountUp(target: number, ms = 600, initial?: number): number {
  const [val, setVal] = useState(initial ?? target);
  const from = React.useRef(initial ?? target);
  React.useEffect(() => {
    const start = performance.now();
    const base = from.current;
    if (base === target) return;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / ms);
      const v = Math.round(base + (target - base) * k);
      setVal(v);
      if (k < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return val;
}

const ScoreRow: React.FC<{ name: string; p: number; score: number; total: number; gain: number; leader: boolean }> = ({
  name,
  p,
  score,
  total,
  gain,
  leader,
}) => {
  const shown = useCountUp(score, 700, score - gain);
  // Çubuk önceki değerden yeni değere doğru uzar
  const pctOf = (v: number) => (total ? Math.round((v / total) * 100) : 0);
  const [width, setWidth] = useState(pctOf(score - gain));
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(pctOf(score)));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, total]);
  return (
    <div className="flex items-center gap-3">
      <span className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-bold shrink-0 ${PLAYER_STYLES[p].badge}`}>
        {initial(name)}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-base font-bold text-slate-900">
          <span className="truncate">
            {name} {leader && '👑'}
          </span>
          <span className="flex items-center gap-2 tabular-nums">
            {gain > 0 && <span className="anim-gain text-emerald-600 text-lg">+{gain}</span>}
            <span className="text-xl">{shown}</span>
          </span>
        </div>
        <div className="h-3 rounded-full bg-slate-200 overflow-hidden mt-1">
          <div
            className={`h-full rounded-full ${PLAYER_STYLES[p].bar} transition-all duration-700 ease-out`}
            style={{ width: `${width}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Her sorudan sonra çıkan animasyonlu skor tablosu
export const ScoreBoard: React.FC<{
  names: string[];
  scores: number[];
  gains: number[];
  total: number;
  answered: number;
  best?: number | null;
}> = ({ names, scores, gains, total, answered, best }) => {
  const max = Math.max(...scores);
  const leaders = scores.filter((s) => s === max).length;
  return (
    <div className="anim-board rounded-3xl bg-white border-2 border-slate-200 p-4 space-y-3 shadow-sm">
      <div className="flex items-center justify-between text-sm font-bold uppercase tracking-wider text-slate-600">
        <span>Skor tablosu</span>
        <span className="tabular-nums">
          {answered}/{total} soru
        </span>
      </div>
      {names.map((name, p) => (
        <ScoreRow
          key={p}
          name={name}
          p={p}
          score={scores[p]}
          total={total}
          gain={gains[p]}
          leader={names.length > 1 && max > 0 && leaders === 1 && scores[p] === max}
        />
      ))}
      {names.length === 1 && best !== undefined && best !== null && (
        <div className="text-sm text-slate-600">🏅 Rekor: {best}</div>
      )}
    </div>
  );
};
