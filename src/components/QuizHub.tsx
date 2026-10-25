import React, { useMemo, useState } from 'react';
import { ArrowLeft, ChevronRight, RotateCcw, FlaskConical } from 'lucide-react';
import { CATEGORY_INFO, QUIZZES, Quiz, QuizCategory, QuizOption } from '../data/quizData';

// Şimdilik yayında olan kategoriler
const ACTIVE_CATEGORIES: QuizCategory[] = ['kisilik', 'iliski'];

const STORAGE_KEY = 'veneto_quiz_results_v1';

type Saved = Record<string, { title: string; emoji: string }>;

function loadSaved(): Saved {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveResult(id: string, value: { title: string; emoji: string }) {
  try {
    const cur = loadSaved();
    cur[id] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cur));
  } catch {
    // depolama yasak: sessizce geç
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- Hesaplama ----
interface Computed {
  pct: Record<string, number>; // 0..1
  headline: { emoji: string; title: string; text: string };
  bars: boolean; // yüzde çubukları gösterilsin mi
  dimTexts?: { label: string; pct: number; text: string }[];
}

function compute(quiz: Quiz, answers: QuizOption[]): Computed {
  const keys = Object.keys(quiz.dims);
  const score: Record<string, number> = {};
  const max: Record<string, number> = {};
  keys.forEach((k) => {
    score[k] = 0;
    max[k] = 0;
  });
  quiz.questions.forEach((q, i) => {
    keys.forEach((k) => {
      max[k] += Math.max(0, ...q.o.map((op) => op.s[k] ?? 0));
      score[k] += answers[i]?.s[k] ?? 0;
    });
  });
  const pct: Record<string, number> = {};
  keys.forEach((k) => (pct[k] = max[k] ? score[k] / max[k] : 0));

  const top = [...keys].sort((a, b) => pct[b] - pct[a])[0];

  if (quiz.mode === 'pairs') {
    const pick = (a: string, b: string) => (score[a] >= score[b] ? a : b);
    const code = pick('E', 'I') + pick('S', 'N') + pick('T', 'F') + pick('J', 'P');
    const r = quiz.results![code];
    return { pct, bars: false, headline: { emoji: r.emoji, title: `${code} · ${r.title}`, text: r.text } };
  }

  if (quiz.mode === 'bars') {
    const dimTexts = keys.map((k) => {
      const d = quiz.dims[k];
      const p = pct[k];
      return { label: d.label, pct: p, text: p >= 0.6 ? d.hi! : p <= 0.4 ? d.lo! : d.mid! };
    });
    const d = quiz.dims[top];
    const strong = pct[top] >= 0.6;
    return {
      pct,
      bars: true,
      dimTexts,
      headline: strong
        ? { emoji: quiz.emoji, title: `En belirgin yönün: ${d.label}`, text: d.hi! }
        : {
            emoji: quiz.emoji,
            title: 'Dengeli bir profilin var',
            text: `Hiçbir boyut uçta değil; en yüksek puanın ${d.label} (%${Math.round(pct[top] * 100)}). Aşağıda her boyutun yorumunu görebilirsin.`,
          },
    };
  }

  let key = top;
  if (quiz.mode === 'quad') {
    key = (pct[keys[0]] >= 0.5 ? 'H' : 'L') + (pct[keys[1]] >= 0.5 ? 'H' : 'L');
  } else if (quiz.mode === 'triad') {
    key = keys.filter((k) => pct[k] >= 0.55).join('') || 'none';
  }
  const r = quiz.results![key];
  return { pct, bars: true, headline: r };
}

// ---- Bileşenler ----
const Bar: React.FC<{ label: string; pct: number }> = ({ label, pct }) => (
  <div>
    <div className="flex justify-between text-xs text-slate-700 mb-1">
      <span className="font-semibold">{label}</span>
      <span className="tabular-nums">%{Math.round(pct * 100)}</span>
    </div>
    <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
      <div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.round(pct * 100)}%` }} />
    </div>
  </div>
);

const QuizRunner: React.FC<{ quiz: Quiz; onExit: () => void; onDone: () => void }> = ({ quiz, onExit, onDone }) => {
  const [run, setRun] = useState(0);
  const questions = useMemo(
    () => quiz.questions.map((q) => ({ ...q, o: shuffle(q.o) })),
    // run değişince seçenekler yeniden karışır
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [quiz, run]
  );
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<QuizOption[]>([]);

  const finished = idx >= questions.length;
  const result = useMemo(() => (finished ? compute(quiz, answers) : null), [finished, quiz, answers]);

  React.useEffect(() => {
    if (result) {
      saveResult(quiz.id, { title: result.headline.title, emoji: result.headline.emoji });
      onDone();
    }
    // yalnızca sonuç oluşunca kaydet
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const restart = () => {
    setRun((r) => r + 1);
    setIdx(0);
    setAnswers([]);
  };

  const back = () => {
    if (idx === 0) return onExit();
    setIdx(idx - 1);
    setAnswers(answers.slice(0, -1));
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={finished ? onExit : back}
        className="min-h-[44px] flex items-center gap-1.5 text-sm font-semibold text-slate-700 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        {finished ? 'Testlere dön' : idx === 0 ? 'Testlere dön' : 'Önceki soru'}
      </button>

      {!finished && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <div>
            <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
              <span>
                {quiz.emoji} {quiz.title}
              </span>
              <span className="tabular-nums">
                {idx + 1} / {questions.length}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-amber-500 transition-all" style={{ width: `${(idx / questions.length) * 100}%` }} />
            </div>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{questions[idx].q}</h3>
          <div className="space-y-2">
            {questions[idx].o.map((op) => (
              <button
                key={op.t}
                type="button"
                onClick={() => {
                  setAnswers([...answers, op]);
                  setIdx(idx + 1);
                }}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 active:bg-amber-100 text-left text-sm text-slate-800 cursor-pointer transition-colors"
              >
                {op.t}
              </button>
            ))}
          </div>
        </div>
      )}

      {finished && result && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 sm:p-6 shadow-sm space-y-2">
            <div className="text-4xl">{result.headline.emoji}</div>
            <h3 className="text-xl font-bold font-serif-heading">{result.headline.title}</h3>
            <p className="text-sm text-slate-200 leading-relaxed">{result.headline.text}</p>
          </div>

          {result.bars && (
            <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Puanların</h4>
              {Object.keys(quiz.dims).map((k) => (
                <Bar key={k} label={quiz.dims[k].label} pct={result.pct[k]} />
              ))}
              {result.dimTexts && (
                <ul className="space-y-2 pt-1">
                  {result.dimTexts.map((d) => (
                    <li key={d.label} className="text-xs text-slate-700 leading-relaxed">
                      <strong>{d.label}:</strong> {d.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4" /> Bilimsel dayanak ve sınırları
            </div>
            <p className="leading-relaxed">{quiz.basis}</p>
            <p className="leading-relaxed">Bu test eğlence ve kendini tanıma amaçlıdır; tanı koymaz ve profesyonel değerlendirme yerine geçmez.</p>
          </div>

          <button
            type="button"
            onClick={restart}
            className="w-full min-h-[48px] rounded-2xl bg-slate-900 text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Testi yeniden çöz
          </button>
        </div>
      )}
    </div>
  );
};

export const QuizHub: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saved, setSaved] = useState<Saved>(() => loadSaved());
  const quiz = QUIZZES.find((q) => q.id === activeId) || null;

  if (quiz) {
    return (
      <QuizRunner
        key={quiz.id}
        quiz={quiz}
        onExit={() => setActiveId(null)}
        onDone={() => setSaved(loadSaved())}
      />
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-600 px-1 leading-relaxed">
        Eğlenceli senaryolarla kısa testler. Hepsi telefonunda hesaplanır, internet gerekmez. Sonuçlar eğlence amaçlıdır.
      </p>
      {ACTIVE_CATEGORIES.map((cat) => (
        <section key={cat} className="space-y-2">
          <div className="px-1">
            <h3 className="text-sm font-bold text-slate-900">
              {CATEGORY_INFO[cat].emoji} {CATEGORY_INFO[cat].label}
            </h3>
            <p className="text-[11px] text-slate-500">{CATEGORY_INFO[cat].blurb}</p>
          </div>
          {QUIZZES.filter((q) => q.category === cat).map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                setActiveId(q.id);
                window.scrollTo({ top: 0 });
              }}
              className="w-full min-h-[64px] p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-amber-300 text-left flex items-center gap-3 cursor-pointer"
            >
              <span className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">{q.emoji}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-bold text-slate-900">{q.title}</span>
                <span className="block text-[11px] text-slate-600 leading-snug">{q.blurb}</span>
                {saved[q.id] && (
                  <span className="block text-[11px] font-semibold text-emerald-700 mt-0.5 truncate">
                    Son sonuç: {saved[q.id].emoji} {saved[q.id].title}
                  </span>
                )}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </button>
          ))}
        </section>
      ))}
    </div>
  );
};
