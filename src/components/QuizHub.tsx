import React, { useMemo, useState } from 'react';
import { ChevronRight, FlaskConical, RotateCcw, ArrowRight } from 'lucide-react';
import { CATEGORY_INFO, QUIZZES, Quiz, QuizCategory, QuizOption } from '../data/quizData';
import { ALL_TRIVIA, TriviaSet } from '../data/triviaData';
import { TriviaGame } from './TriviaGame';
import { CoupleGame } from './CoupleGame';
import {
  BigButton,
  GameShell,
  OptionButton,
  PLAYER_STYLES,
  PlayerSetup,
  TurnBanner,
  initial,
  shuffle,
  useDualPick,
} from './game/shared';

const ACTIVE_CATEGORIES: QuizCategory[] = ['kisilik', 'iliski', 'kokoloji'];
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

// ---- Hesaplama ----
interface Computed {
  pct: Record<string, number>; // 0..1
  headline: { emoji: string; title: string; text: string };
  bars: boolean;
  letters?: string; // yalnızca Jung tipi
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
    return { pct, bars: false, letters: code, headline: { emoji: r.emoji, title: `${code} · ${r.title}`, text: r.text } };
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
  return { pct, bars: true, headline: quiz.results![key] };
}

// İki profilin benzerliği (0..100)
function similarity(quiz: Quiz, a: Computed, b: Computed): number {
  if (quiz.mode === 'pairs' && a.letters && b.letters) {
    let same = 0;
    for (let i = 0; i < 4; i++) if (a.letters[i] === b.letters[i]) same++;
    return Math.round((same / 4) * 100);
  }
  const keys = Object.keys(quiz.dims);
  const diff = keys.reduce((s, k) => s + Math.abs(a.pct[k] - b.pct[k]), 0) / keys.length;
  return Math.round((1 - diff) * 100);
}

function similarityText(p: number): string {
  if (p >= 80) return 'Çok benzer profiller: aynı dalga boyundasınız.';
  if (p >= 60) return 'Benzer yönleriniz çok; farklılıklar tatlı bir denge kurar.';
  if (p >= 40) return 'Birbirinizi tamamlayan farklı yönleriniz var.';
  return 'Zıt kutuplar gibisiniz: birbirinizden çok şey öğrenebilirsiniz.';
}

// ---- Test akışı ----
const QuizRun: React.FC<{ quiz: Quiz; names: string[]; onClose: () => void; onDone: () => void }> = ({
  quiz,
  names,
  onClose,
  onDone,
}) => {
  const n = names.length;
  const [run, setRun] = useState(0);
  const questions = useMemo(
    () => quiz.questions.map((q) => ({ ...q, o: shuffle(q.o) })),
    // run değişince seçenekler yeniden karışır
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [quiz, run]
  );
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<QuizOption[][]>(() => Array.from({ length: n }, () => []));
  const dual = useDualPick(n);

  const finished = idx >= questions.length;
  const results = useMemo(() => (finished ? answers.map((a) => compute(quiz, a)) : null), [finished, quiz, answers]);

  React.useEffect(() => {
    if (results && n === 1) {
      saveResult(quiz.id, { title: results[0].headline.title, emoji: results[0].headline.emoji });
      onDone();
    }
    // yalnızca sonuç oluşunca kaydet
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  const advance = () => {
    const picked = dual.picks.map((p, pi) => questions[idx].o[p as number]);
    setAnswers(answers.map((a, pi) => [...a, picked[pi]]));
    dual.reset();
    setIdx(idx + 1);
  };

  const restart = () => {
    setRun(run + 1);
    setIdx(0);
    setAnswers(Array.from({ length: n }, () => []));
    dual.reset();
  };

  if (finished && results) {
    const dimKeys = Object.keys(quiz.dims);
    const showBars = results.some((r) => r.bars);
    const sim = n === 2 ? similarity(quiz, results[0], results[1]) : null;
    return (
      <GameShell title={quiz.title} onClose={onClose}>
        {results.map((r, p) => (
          <div key={p} className={`rounded-3xl border-2 p-5 space-y-2 ${PLAYER_STYLES[p].card}`}>
            {n > 1 && (
              <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${PLAYER_STYLES[p].badge}`}>
                  {initial(names[p])}
                </span>
                {names[p]}
              </div>
            )}
            <div className="text-5xl">{r.headline.emoji}</div>
            <h3 className="text-2xl font-bold font-serif-heading text-slate-900 leading-snug">{r.headline.title}</h3>
            <p className="text-lg text-slate-800 leading-relaxed">{r.headline.text}</p>
          </div>
        ))}

        {sim !== null && (
          <div className="rounded-3xl bg-slate-900 text-white p-5 text-center space-y-1">
            <div className="text-sm font-semibold text-slate-300">Profil benzerliği</div>
            <div className="text-5xl font-bold tabular-nums">%{sim}</div>
            <p className="text-base text-slate-200">{similarityText(sim)}</p>
          </div>
        )}

        {showBars && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">Puanlar</h4>
            {dimKeys.map((k) => (
              <div key={k} className="space-y-1.5">
                <div className="text-base font-semibold text-slate-900">{quiz.dims[k].label}</div>
                {results.map((r, p) => (
                  <div key={p} className="flex items-center gap-2">
                    {n > 1 && <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center shrink-0 ${PLAYER_STYLES[p].badge}`}>{initial(names[p])}</span>}
                    <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full rounded-full ${PLAYER_STYLES[p].bar}`} style={{ width: `${Math.round(r.pct[k] * 100)}%` }} />
                    </div>
                    <span className="w-12 text-right text-sm tabular-nums text-slate-700">%{Math.round(r.pct[k] * 100)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {results.map(
          (r, p) =>
            r.dimTexts && (
              <details key={p} className="bg-white rounded-3xl border border-slate-200 p-5">
                <summary className="text-base font-bold text-slate-900 cursor-pointer min-h-[40px] flex items-center">
                  {n > 1 ? `${names[p]} için ayrıntılı yorum` : 'Ayrıntılı yorum'}
                </summary>
                <ul className="space-y-3 pt-2">
                  {r.dimTexts.map((d) => (
                    <li key={d.label} className="text-base text-slate-800 leading-relaxed">
                      <strong>{d.label}:</strong> {d.text}
                    </li>
                  ))}
                </ul>
              </details>
            )
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-950 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-base">
            <FlaskConical className="w-5 h-5" /> Bilimsel dayanak ve sınırları
          </div>
          <p className="leading-relaxed">{quiz.basis}</p>
          <p className="leading-relaxed">Bu test eğlence ve kendini tanıma amaçlıdır; tanı koymaz ve profesyonel değerlendirme yerine geçmez.</p>
        </div>

        <div className="space-y-3">
          <BigButton onClick={restart} tone="amber">
            <RotateCcw className="w-5 h-5" /> Yeniden çöz
          </BigButton>
          <BigButton onClick={onClose} tone="light">
            Menüye dön
          </BigButton>
        </div>
      </GameShell>
    );
  }

  const cur = questions[idx];
  return (
    <GameShell
      title={`${quiz.emoji} ${quiz.title}`}
      onClose={onClose}
      progress={idx / questions.length}
      right={
        <span className="text-sm font-semibold text-slate-300 tabular-nums">
          {idx + 1}/{questions.length}
        </span>
      }
      footer={
        dual.done ? (
          <BigButton onClick={advance}>
            {idx + 1 >= questions.length ? 'Sonuçları gör' : 'İlerle'} <ArrowRight className="w-5 h-5" />
          </BigButton>
        ) : undefined
      }
    >
      <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug pt-1">{cur.q}</h3>
      <TurnBanner
        names={names}
        active={dual.active}
        canUndo={dual.picks.some((p) => p !== null)}
        onUndo={dual.undo}
        doneText={n > 1 ? 'İkiniz de işaretlediniz' : 'İşaretlendi'}
      />
      <div className="space-y-3">
        {cur.o.map((op, i) => (
          <OptionButton
            key={op.t}
            label={op.t}
            names={names}
            pickedBy={dual.picks.map((p, pi) => (p === i ? pi : -1)).filter((pi) => pi >= 0)}
            disabled={dual.done}
            onClick={() => dual.pick(i)}
          />
        ))}
      </div>
    </GameShell>
  );
};

const QuizGame: React.FC<{ quiz: Quiz; onClose: () => void; onDone: () => void }> = ({ quiz, onClose, onDone }) => {
  const [names, setNames] = useState<string[] | null>(null);
  if (!names) {
    return (
      <PlayerSetup
        title={quiz.title}
        emoji={quiz.emoji}
        intro="Her soruyu sırayla işaretleyin: 1. kişi pembe, 2. kişi mavi. İkiniz de işaretleyince ilerleyin. Sonunda iki sonuç yan yana görünür."
        onStart={setNames}
        onClose={onClose}
      />
    );
  }
  return <QuizRun quiz={quiz} names={names} onClose={onClose} onDone={onDone} />;
};

// ---- Menü ----
type Active = { kind: 'quiz'; id: string } | { kind: 'trivia'; id: string } | { kind: 'couple' } | null;

const Card: React.FC<{ emoji: string; title: string; blurb: string; extra?: string; onClick: () => void }> = ({
  emoji,
  title,
  blurb,
  extra,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full min-h-[76px] p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-amber-300 text-left flex items-center gap-3 cursor-pointer"
  >
    <span className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-3xl shrink-0">{emoji}</span>
    <span className="flex-1 min-w-0">
      <span className="block text-base font-bold text-slate-900">{title}</span>
      <span className="block text-xs text-slate-600 leading-snug">{blurb}</span>
      {extra && <span className="block text-xs font-semibold text-emerald-700 mt-0.5 truncate">{extra}</span>}
    </span>
    <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
  </button>
);

export const QuizHub: React.FC = () => {
  const [active, setActive] = useState<Active>(null);
  const [saved, setSaved] = useState<Saved>(() => loadSaved());
  const close = () => setActive(null);

  if (active?.kind === 'quiz') {
    const quiz = QUIZZES.find((q) => q.id === active.id)!;
    return <QuizGame key={quiz.id} quiz={quiz} onClose={close} onDone={() => setSaved(loadSaved())} />;
  }
  if (active?.kind === 'trivia') {
    const set: TriviaSet = ALL_TRIVIA.find((t) => t.id === active.id)!;
    return <TriviaGame key={set.id} set={set} onClose={close} />;
  }
  if (active?.kind === 'couple') return <CoupleGame onClose={close} />;

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600 px-1 leading-relaxed">
        Testlerin ve yarışmaların hepsi 1 veya 2 kişi oynanır, telefonda çalışır, internet gerekmez. Test sonuçları eğlence amaçlıdır.
      </p>

      <section className="space-y-2">
        <div className="px-1">
          <h3 className="text-base font-bold text-slate-900">💞 Bizim Yarışma</h3>
          <p className="text-xs text-slate-500">Çifte özel</p>
        </div>
        <Card
          emoji="🗺️"
          title="Beni Ne Kadar Tanıyorsun?"
          blurb="Gizlice cevap seç, diğeri tahmin etsin. Kaybeden ceza kartı çeker."
          onClick={() => setActive({ kind: 'couple' })}
        />
      </section>

      <section className="space-y-2">
        <div className="px-1">
          <h3 className="text-base font-bold text-slate-900">🏆 Gezi Yarışmaları</h3>
          <p className="text-xs text-slate-500">Bilgi ve görsel mekan yarışmaları</p>
        </div>
        {ALL_TRIVIA.map((t) => (
          <Card key={t.id} emoji={t.emoji} title={t.title} blurb={t.blurb} onClick={() => setActive({ kind: 'trivia', id: t.id })} />
        ))}
      </section>

      {ACTIVE_CATEGORIES.map((cat) => (
        <section key={cat} className="space-y-2">
          <div className="px-1">
            <h3 className="text-base font-bold text-slate-900">
              {CATEGORY_INFO[cat].emoji} {CATEGORY_INFO[cat].label}
            </h3>
            <p className="text-xs text-slate-500">{CATEGORY_INFO[cat].blurb}</p>
          </div>
          {QUIZZES.filter((q) => q.category === cat).map((q) => (
            <Card
              key={q.id}
              emoji={q.emoji}
              title={q.title}
              blurb={q.blurb}
              extra={saved[q.id] ? `Son sonuç: ${saved[q.id].emoji} ${saved[q.id].title}` : undefined}
              onClick={() => setActive({ kind: 'quiz', id: q.id })}
            />
          ))}
        </section>
      ))}
    </div>
  );
};
