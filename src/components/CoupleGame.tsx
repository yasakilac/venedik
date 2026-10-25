import React, { useMemo, useState } from 'react';
import { ArrowRight, EyeOff, ListChecks, RotateCcw } from 'lucide-react';
import { HistoryEntry, ReviewItem, addHistory, newEntryId } from '../utils/gameHistory';
import { ReviewScreen } from './GameReview';
import { BigButton, GameShell, OptionButton, PLAYER_STYLES, PlayerSetup, initial, shuffle } from './game/shared';

interface CQ {
  q: string;
  o: string[];
}

// Bizim tarzımıza: kahve, fotoğraf, harita, bütçe ve seyahat huyları
const QUESTIONS: CQ[] = [
  { q: 'Venedik’te sabah ilk işi ne olur?', o: ['Kahve ve fırın', 'Kanal kenarında yürüyüş', 'Biraz daha uyumak', 'Haritaya bakıp günü planlamak'] },
  { q: 'Elinde kamera varsa en çok neyi çeker?', o: ['Mimari detaylar', 'İnsanlar ve portreler', 'Su yansımaları', 'Yemekler'] },
  { q: 'Beklenmedik 50 € bulsa ne yapar?', o: ['Güzel bir akşam yemeği', 'Hatıra eşyası', 'Kitap, harita ya da fotoğraf malzemesi', 'Biriktirir'] },
  { q: 'Sokaklarda kaybolduğunda ilk tepkisi?', o: ['Telefona sarılır', 'Birine yol sorar', 'Keşfin tadını çıkarır', 'Durup beni arar'] },
  { q: 'En çok hangi İtalyan lezzetini ister?', o: ['Pizza', 'Makarna', 'Gelato', 'Tiramisu'] },
  { q: 'Aperitivo saatinde ne içer?', o: ['Spritz', 'Şarap', 'Su ve cicchetti', 'Kahve'] },
  { q: 'Gün batımını nerede izlemek ister?', o: ['Vapurda', 'Kanal kıyısında', 'Adada, sahilde', 'Yüksek bir noktadan'] },
  { q: 'Tatilde genelde saat kaçta uyanır?', o: ['7’den önce', '8-9 arası', '10 civarı', 'Öğleye doğru'] },
  { q: 'Hatıra olarak hangisini alır?', o: ['Magnet', 'Cam bir obje', 'Baskı fotoğraf', 'Hiçbir şey'] },
  { q: 'Yağmur çıkarsa ne yapar?', o: ['İç mekân müzeleri', 'Kafede oturur', 'Islanarak yürümeye devam eder', 'Otelde dinlenir'] },
  { q: 'Bu geziden en çok neyi hatırlamak ister?', o: ['Manzaraları', 'Lezzetleri', 'Birlikte geçen anları', 'Fotoğrafları'] },
  { q: 'Seyahatte kendini hangi karakter olarak görür?', o: ['Plancı', 'Kaşif', 'Fotoğrafçı', 'Gurme'] },
];

const FORFEITS = [
  'Kaybeden bir sonraki gelatoyu ısmarlar 🍦',
  'Kaybeden yarın sabahki kahveleri alır ☕',
  'Kaybeden, kazananın seçtiği pozla bir fotoğraf verir 📸',
  'Kaybeden bir akşam yemeği yerini seçme hakkını kazanana bırakır 🍝',
  'Kaybeden bir saat boyunca kazananın çantasını taşır 🎒',
  'Kaybeden kazanan için yerel bir cicchetti seçer 🥂',
];

type Phase = 'ask' | 'pass' | 'guess' | 'reveal';

const Run: React.FC<{ names: string[]; onClose: () => void }> = ({ names, onClose }) => {
  const [run, setRun] = useState(0);
  const qs = useMemo(
    () => shuffle(QUESTIONS).map((q) => ({ q: q.q, o: shuffle(q.o) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [run]
  );
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('ask');
  const [answer, setAnswer] = useState<number | null>(null);
  const [guess, setGuess] = useState<number | null>(null);
  const [points, setPoints] = useState<number[]>([0, 0]);
  const [log, setLog] = useState<ReviewItem[]>([]);
  const [entry, setEntry] = useState<HistoryEntry | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const forfeit = useMemo(() => FORFEITS[Math.floor(Math.random() * FORFEITS.length)], [run]);

  const finished = idx >= qs.length;
  const q0 = qs[Math.min(idx, qs.length - 1)];
  const asker = idx % 2;
  const guesser = 1 - asker;

  const next = () => {
    const hit = answer !== null && guess === answer;
    if (hit) {
      setPoints(points.map((p, i) => (i === guesser ? p + 1 : p)));
    }
    setLog([
      ...log,
      {
        q: q0.q,
        lines: [
          { p: asker, text: `Gerçek cevap: ${q0.o[answer as number]}` },
          { p: guesser, text: `Tahmin: ${q0.o[guess as number]}`, ok: hit },
        ],
      },
    ]);
    setAnswer(null);
    setGuess(null);
    setPhase('ask');
    setIdx(idx + 1);
  };

  const restart = () => {
    setRun(run + 1);
    setIdx(0);
    setPhase('ask');
    setAnswer(null);
    setGuess(null);
    setPoints([0, 0]);
    setLog([]);
    setEntry(null);
    setReviewing(false);
  };

  React.useEffect(() => {
    if (!finished || entry) return;
    const total = points[0] + points[1];
    const e: HistoryEntry = {
      id: newEntryId(),
      gameId: 'couple',
      title: 'Beni Ne Kadar Tanıyorsun?',
      emoji: '💞',
      at: Date.now(),
      names,
      scores: points,
      total: qs.length / 2,
      summary: [`Uyum: %${Math.round((total / qs.length) * 100)}`],
      items: log,
    };
    addHistory(e);
    setEntry(e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  if (finished && reviewing && entry) return <ReviewScreen entry={entry} onClose={() => setReviewing(false)} />;

  if (finished) {
    const total = points[0] + points[1];
    const percent = Math.round((total / qs.length) * 100);
    const tie = points[0] === points[1];
    const winner = points[0] > points[1] ? 0 : 1;
    const comment =
      percent >= 80 ? 'Birbirinizi ezbere biliyorsunuz 💞' : percent >= 55 ? 'Çok iyi tanışıyorsunuz, yolculuk daha da yakınlaştıracak ✨' : percent >= 30 ? 'Keşfedecek çok şey var, ne güzel 🧭' : 'Bu seyahat tam size göre: birbirinizi baştan keşfedin 🗺️';
    return (
      <GameShell title="Beni Ne Kadar Tanıyorsun?" onClose={onClose}>
        <div className="text-center space-y-2 pt-2">
          <div className="text-6xl">{tie ? '🤝' : '🏆'}</div>
          <h3 className="text-3xl font-bold font-serif-heading text-slate-900">
            {tie ? 'İkiniz de aynı kalpte!' : `${names[winner]} kazandı!`}
          </h3>
          <p className="text-lg text-slate-600">Uyum: %{percent}</p>
          <p className="text-base text-slate-700">{comment}</p>
        </div>
        <div className="space-y-3">
          {names.map((name, p) => (
            <div key={p} className={`rounded-2xl border-2 p-4 flex items-center justify-between ${PLAYER_STYLES[p].card}`}>
              <span className="flex items-center gap-3 text-xl font-bold text-slate-900">
                <span className={`w-10 h-10 rounded-full flex items-center justify-center ${PLAYER_STYLES[p].badge}`}>{initial(name)}</span>
                {name}
              </span>
              <span className="text-3xl font-bold tabular-nums text-slate-900">
                {points[p]}
                <span className="text-lg text-slate-500"> / {qs.length / 2}</span>
              </span>
            </div>
          ))}
        </div>
        {!tie && (
          <div className="rounded-2xl bg-amber-50 border-2 border-amber-300 p-4 text-lg font-semibold text-amber-950">
            🎁 Ceza kartı: {forfeit}
          </div>
        )}
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

  const q = qs[idx];
  const A = names[asker];
  const G = names[guesser];

  return (
    <GameShell
      title="Beni Ne Kadar Tanıyorsun?"
      onClose={onClose}
      progress={idx / qs.length}
      right={
        <span className="text-sm font-semibold text-slate-300 tabular-nums">
          {points[0]} - {points[1]}
        </span>
      }
      footer={
        phase === 'pass' ? (
          <BigButton onClick={() => setPhase('guess')} tone="amber">
            {G} hazır
          </BigButton>
        ) : phase === 'reveal' ? (
          <BigButton onClick={next}>
            {idx + 1 >= qs.length ? 'Sonuçlar' : 'Sonraki soru'} <ArrowRight className="w-5 h-5" />
          </BigButton>
        ) : undefined
      }
    >
      <div className="flex gap-2">
        {names.map((name, p) => (
          <span key={p} className={`flex-1 rounded-xl px-3 py-1.5 text-sm font-bold flex items-center justify-between ${PLAYER_STYLES[p].badge}`}>
            <span className="truncate">{name}</span>
            <span className="tabular-nums">{points[p]}</span>
          </span>
        ))}
      </div>

      {phase === 'pass' ? (
        <div className="text-center space-y-4 py-10">
          <div className="text-7xl">🙈</div>
          <h3 className="text-3xl font-bold text-slate-900 leading-snug">Telefonu ver: {G}</h3>
          <p className="text-lg text-slate-600">{A} cevabını seçti. Tahmin sırası: {G}</p>
        </div>
      ) : (
        <>
          <div className={`rounded-2xl border-2 px-4 py-3 text-lg font-bold flex items-center gap-2 ${PLAYER_STYLES[phase === 'ask' ? asker : guesser].card}`}>
            {phase === 'ask' && (
              <>
                <EyeOff className="w-5 h-5 shrink-0" /> {A}: kendi gerçek cevabını seç ({G} bakmasın)
              </>
            )}
            {phase === 'guess' && <>🤔 {G}: {A} ne seçti?</>}
            {phase === 'reveal' && <>{guess === answer ? `🎉 ${G} bildi!` : `❌ ${G} bilemedi`}</>}
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">{q.q}</h3>
          <div className="space-y-3">
            {q.o.map((t, i) => {
              const pickedBy: number[] = [];
              if (phase === 'reveal') {
                if (answer === i) pickedBy.push(asker);
                if (guess === i && !pickedBy.includes(guesser)) pickedBy.push(guesser);
              }
              return (
                <OptionButton
                  key={t}
                  label={t}
                  names={names}
                  pickedBy={pickedBy}
                  state={phase === 'reveal' && answer === i ? 'correct' : 'idle'}
                  disabled={phase === 'reveal'}
                  onClick={() => {
                    if (phase === 'ask') {
                      setAnswer(i);
                      setPhase('pass');
                    } else if (phase === 'guess') {
                      setGuess(i);
                      setPhase('reveal');
                    }
                  }}
                />
              );
            })}
          </div>
          {phase === 'reveal' && (
            <p className="text-base text-slate-600">
              ✅ = {A} için gerçek cevap. {guess === answer ? `${G} +1 puan.` : 'Puan yok.'}
            </p>
          )}
        </>
      )}
    </GameShell>
  );
};

export const CoupleGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [names, setNames] = useState<string[] | null>(null);
  if (!names) {
    return (
      <PlayerSetup
        title="Beni Ne Kadar Tanıyorsun?"
        emoji="💞"
        intro="Sırayla biriniz gerçek cevabını gizlice seçer, diğeri ne seçtiğini tahmin eder. Bildikçe puan kazanılır, kaybeden ceza kartı çeker."
        allowSolo={false}
        onStart={setNames}
        onClose={onClose}
      />
    );
  }
  return <Run names={names} onClose={onClose} />;
};
