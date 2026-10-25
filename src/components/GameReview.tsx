import React, { useState } from 'react';
import { ChevronRight, Trash2 } from 'lucide-react';
import { HistoryEntry, clearHistory, loadHistory } from '../utils/gameHistory';
import { BigButton, GameShell, PLAYER_STYLES, initial } from './game/shared';

const fmt = (t: number) =>
  new Date(t).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

// Soru soru inceleme: sorular, cevaplar ve puanlar (çevrimdışı)
export const ReviewScreen: React.FC<{ entry: HistoryEntry; onClose: () => void }> = ({ entry, onClose }) => (
  <GameShell title={`${entry.emoji} ${entry.title}`} onClose={onClose}>
    <div className="rounded-2xl bg-slate-900 text-white p-4 space-y-2">
      <div className="text-xs text-slate-300">{fmt(entry.at)}</div>
      {entry.scores && entry.total !== undefined && (
        <div className="space-y-1">
          {entry.names.map((n, p) => (
            <div key={p} className="flex items-center justify-between text-lg font-bold">
              <span className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-full text-xs flex items-center justify-center ${PLAYER_STYLES[p].badge}`}>{initial(n)}</span>
                {n}
              </span>
              <span className="tabular-nums">
                {entry.scores![p]} / {entry.total}
              </span>
            </div>
          ))}
        </div>
      )}
      {entry.summary.map((s, i) => (
        <p key={i} className="text-sm text-slate-200 leading-relaxed">
          {s}
        </p>
      ))}
    </div>

    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600">Sorular ve cevaplar</h4>
    <div className="space-y-3">
      {entry.items.map((it, i) => (
        <div key={i} className="rounded-2xl bg-white border border-slate-200 p-4 space-y-2">
          <div className="text-base font-bold text-slate-900 leading-snug">
            {i + 1}. {it.q}
          </div>
          {it.correct && <div className="text-sm font-semibold text-emerald-700">✅ Doğru cevap: {it.correct}</div>}
          {it.lines.map((l, k) => (
            <div key={k} className="flex items-start gap-2 text-base text-slate-800">
              <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center shrink-0 mt-0.5 ${PLAYER_STYLES[l.p].badge}`}>
                {initial(entry.names[l.p] ?? '?')}
              </span>
              <span className="flex-1">
                {l.text} {l.ok === true && '✅'} {l.ok === false && '❌'}
              </span>
            </div>
          ))}
          {it.note && <p className="text-sm text-slate-600 leading-relaxed">💡 {it.note}</p>}
        </div>
      ))}
    </div>
    <BigButton onClick={onClose} tone="light">
      Kapat
    </BigButton>
  </GameShell>
);

export const HistoryScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [list, setList] = useState(loadHistory());
  const [open, setOpen] = useState<HistoryEntry | null>(null);

  if (open) return <ReviewScreen entry={open} onClose={() => setOpen(null)} />;

  return (
    <GameShell title="📜 Geçmiş sonuçlar" onClose={onClose}>
      <p className="text-base text-slate-600 leading-relaxed">
        Oynadığınız her oyun ve testin soruları, cevapları ve puanları telefonunuzda saklanır; internetsiz de görebilirsiniz.
      </p>
      {list.length === 0 && <div className="text-center text-lg text-slate-500 py-10">Henüz kayıt yok.</div>}
      <div className="space-y-3">
        {list.map((h) => (
          <button
            key={h.id}
            type="button"
            onClick={() => setOpen(h)}
            className="w-full min-h-[72px] p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-left flex items-center gap-3 cursor-pointer"
          >
            <span className="text-3xl">{h.emoji}</span>
            <span className="flex-1 min-w-0">
              <span className="block text-base font-bold text-slate-900 truncate">{h.title}</span>
              <span className="block text-xs text-slate-500">
                {fmt(h.at)} · {h.names.length === 1 ? 'Tekli' : 'Çiftli'}
                {h.scores && h.total !== undefined ? ` · ${h.names.map((n, p) => `${initial(n)} ${h.scores![p]}/${h.total}`).join('  ')}` : ''}
              </span>
            </span>
            <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
          </button>
        ))}
      </div>
      {list.length > 0 && (
        <BigButton
          tone="light"
          onClick={() => {
            if (window.confirm('Tüm geçmiş silinsin mi?')) {
              clearHistory();
              setList([]);
            }
          }}
        >
          <Trash2 className="w-5 h-5" /> Geçmişi temizle
        </BigButton>
      )}
    </GameShell>
  );
};
