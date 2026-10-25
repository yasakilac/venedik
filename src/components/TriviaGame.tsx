import React, { useMemo, useState } from 'react';
import { ArrowRight, ListChecks, RotateCcw, Trophy } from 'lucide-react';
import { TriviaSet } from '../data/triviaData';
import { HistoryEntry, ReviewItem, addHistory, bestSolo, newEntryId } from '../utils/gameHistory';
import { ReviewScreen } from './GameReview';
import {
  BigButton,
  GameShell,
  OptionButton,
  PLAYER_STYLES,
  PlayerSetup,
  ScoreBoard,
  TurnBanner,
  initial,
  shuffle,
  useDualPick,
} from './game/shared';

interface RunQuestion {
  q: string;
  info: string;
  image?: string;
  opts: { t: string; ok: boolean }[];
}

const Run: React.FC<{ set: TriviaSet; names: string[]; onClose: () => void }> = ({ set, names, onClose }) => {
  const n = names.length;
  const [run, setRun] = useState(0);
  const questions: RunQuestion[] = useMemo(
    () =>
      shuffle(set.questions).map((q) => ({
        q: q.q,
        info: q.info,
        image: q.image,
        opts: shuffle(q.options.map((t, i) => ({ t, ok: i === q.answer }))),
      })),
    // run değişince yeniden karıştır
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [set, run]
  );
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState<number[]>(() => Array(n).fill(0)); // önceki sorulardan gelen puan
  const [log, setLog] = useState<ReviewItem[]>([]);
  const [entry, setEntry] = useState<HistoryEntry | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [prevBest, setPrevBest] = useState<number | null>(null);
  const dual = useDualPick(n);

  const finished = idx >= questions.length;
  const cur = questions[idx];
  const revealed = !finished && dual.done;
  // Cevaplar işaretlenince bu sorunun puanı hemen skor tablosuna yansır
  const gains = revealed ? dual.picks.map((p) => (cur.opts[p as number]?.ok ? 1 : 0)) : Array(n).fill(0);
  const shownScores = scores.map((s, p) => s + gains[p]);

  const boardRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (revealed) {
      const t = setTimeout(() => boardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
      return () => clearTimeout(t);
    }
  }, [revealed, idx]);

  const next = () => {
    const correct = cur.opts.find((o) => o.ok)!.t;
    setLog([
      ...log,
      {
        q: cur.q,
        correct,
        note: cur.info,
        lines: dual.picks.map((p, pi) => ({ p: pi, text: cur.opts[p as number].t, ok: cur.opts[p as number].ok })),
      },
    ]);
    setScores(shownScores);
    dual.reset();
    setIdx(idx + 1);
  };

  // Oyun bitince geçmişe kaydet
  React.useEffect(() => {
    if (!finished || entry) return;
    setPrevBest(n === 1 ? bestSolo(set.id) : null);
    const e: HistoryEntry = {
      id: newEntryId(),
      gameId: set.id,
      title: set.title,
      emoji: set.emoji,
      at: Date.now(),
      names,
      scores,
      total: questions.length,
      summary: [],
      items: log,
    };
    addHistory(e);
    setEntry(e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const restart = () => {
    setRun(run + 1);
    setIdx(0);
    setScores(Array(n).fill(0));
    setLog([]);
    setEntry(null);
    setReviewing(false);
    dual.reset();
  };

  if (finished && reviewing && entry) return <ReviewScreen entry={entry} onClose={() => setReviewing(false)} />;

  if (finished) {
    const best = Math.max(...scores);
    const winners = scores.map((s, i) => (s === best ? i : -1)).filter((i) => i >= 0);
    return (
      <GameShell title={set.title} onClose={onClose}>
        <div className="text-center space-y-2 pt-2">
          <div className="text-6xl">{n === 1 ? '🏅' : winners.length === 1 ? '🏆' : '🤝'}</div>
          <h3 className="text-3xl font-bold font-serif-heading text-slate-900">
            {n === 1
              ? `${scores[0]} / ${questions.length}`
              : winners.length === 1
                ? `${names[winners[0]]} kazandı!`
                : 'Berabere!'}
          </h3>
        </div>
        <div className="space-y-3">
          {names.map((name, p) => (
            <div key={p} className={`rounded-2xl border-2 p-4 flex items-center justify-between ${PLAYER_STYLES[p].card}`}>
              <span className="flex items-center gap-3 text-xl font-bold text-slate-900">
                <span className={`w-10 h-10 rounded-full flex items-center justify-center ${PLAYER_STYLES[p].badge}`}>{initial(name)}</span>
                {name}
                {winners.includes(p) && n > 1 && <Trophy className="w-6 h-6 text-amber-500" />}
              </span>
              <span className="text-3xl font-bold tabular-nums text-slate-900">
                {scores[p]}
                <span className="text-lg text-slate-500"> / {questions.length}</span>
              </span>
            </div>
          ))}
        </div>
        {n === 1 && (
          <div className="text-center text-lg font-semibold text-amber-800">
            {prevBest === null ? '🏅 İlk skorun kaydedildi' : scores[0] > prevBest ? `🎉 Yeni rekor! (önceki: ${prevBest})` : `🏅 Rekorun: ${prevBest}`}
          </div>
        )}
        {set.credit && <p className="text-[11px] text-slate-500 leading-relaxed break-words">{set.credit}</p>}
        <div className="space-y-3">
          <BigButton onClick={restart} tone="amber">
            <RotateCcw className="w-5 h-5" /> Tekrar oyna
          </BigButton>
          <BigButton onClick={() => setReviewing(true)} tone="light">
            <ListChecks className="w-5 h-5" /> Soruları ve cevapları incele
          </BigButton>
          <BigButton onClick={onClose} tone="light">
            Menüye dön
          </BigButton>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title={set.title}
      onClose={onClose}
      progress={idx / questions.length}
      right={
        <span className="text-sm font-semibold text-slate-300 tabular-nums">
          {idx + 1}/{questions.length}
        </span>
      }
      footer={
        revealed ? (
          <BigButton onClick={next}>
            {idx + 1 >= questions.length ? 'Sonuçlar' : 'Sonraki soru'} <ArrowRight className="w-5 h-5" />
          </BigButton>
        ) : undefined
      }
    >
      {n > 1 && (
        <div className="flex gap-2">
          {names.map((name, p) => (
            <span key={p} className={`flex-1 rounded-xl px-3 py-1.5 text-sm font-bold flex items-center justify-between ${PLAYER_STYLES[p].badge}`}>
              <span className="truncate">{name}</span>
              <span className="tabular-nums">{shownScores[p]}</span>
            </span>
          ))}
        </div>
      )}

      {cur.image && (
        <img
          src={`./${cur.image}`}
          alt="Tahmin edilecek mekan"
          className="w-full max-h-[38vh] object-cover rounded-3xl bg-slate-200 shadow-sm"
        />
      )}
      <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">{cur.q}</h3>

      <TurnBanner
        names={names}
        active={dual.active}
        canUndo={!revealed && dual.picks.some((p) => p !== null)}
        onUndo={dual.undo}
        doneText="Cevaplar işaretlendi"
      />

      <div className="space-y-3">
        {cur.opts.map((op, i) => (
          <OptionButton
            key={op.t}
            label={op.t}
            names={names}
            pickedBy={dual.picks.map((p, pi) => (p === i ? pi : -1)).filter((pi) => pi >= 0)}
            state={revealed ? (op.ok ? 'correct' : 'wrong') : 'idle'}
            disabled={revealed}
            onClick={() => dual.pick(i)}
          />
        ))}
      </div>

      {revealed && (
        <div ref={boardRef}>
          <ScoreBoard names={names} scores={shownScores} gains={gains} total={questions.length} answered={idx + 1} best={bestSolo(set.id)} />
        </div>
      )}

      {revealed && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 space-y-2">
          <div className="space-y-1">
            {names.map((name, p) => {
              const ok = cur.opts[dual.picks[p] as number]?.ok;
              return (
                <div key={p} className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center ${PLAYER_STYLES[p].badge}`}>{initial(name)}</span>
                  {name}: {ok ? '✅ Doğru' : '❌ Yanlış'}
                </div>
              );
            })}
          </div>
          <p className="text-base text-amber-950 leading-relaxed">💡 {cur.info}</p>
        </div>
      )}
    </GameShell>
  );
};

export const TriviaGame: React.FC<{ set: TriviaSet; onClose: () => void }> = ({ set, onClose }) => {
  const [names, setNames] = useState<string[] | null>(null);
  if (!names) {
    return (
      <PlayerSetup
        title={set.title}
        emoji={set.emoji}
        intro="Her soruyu sırayla işaretleyin: 1. kişi pembe, 2. kişi mavi. İkiniz de işaretleyince doğru cevap ve bilgi gösterilir."
        bestScore={bestSolo(set.id)}
        onStart={setNames}
        onClose={onClose}
      />
    );
  }
  return <Run set={set} names={names} onClose={onClose} />;
};
