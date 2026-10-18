import React, { useState } from 'react';
import { Umbrella, Shield, Ship, CloudSun, StickyNote, Save } from 'lucide-react';
import { DAYS_INFO } from '../data/itineraryData';
import { getCustomNotes, saveStopNote } from '../utils/storage';

// Gün bazlı stratejiler ve kişisel notlar. Eski ana sayfa yazıları buraya taşındı.
export const NotesView: React.FC = () => {
  const [notes, setNotes] = useState<Record<string, string>>(getCustomNotes());
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const handleSave = (key: string) => {
    saveStopNote(key, notes[key] || '');
    setSavedKey(key);
    setTimeout(() => setSavedKey(null), 1800);
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center gap-2 px-1">
        <StickyNote className="w-5 h-5 text-amber-700" />
        <h2 className="text-lg font-bold font-serif-heading text-slate-900">Notlar</h2>
      </div>

      {DAYS_INFO.map((day) => {
        const key = `day-note-${day.dayNumber}`;
        return (
          <section key={day.dayNumber} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-sm">
            <header>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                {day.dateStr}
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {day.dayNumber}. Gün: {day.title}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">{day.subtitle}</p>
            </header>

            <div className="space-y-2 text-xs text-slate-800">
              <div className="flex items-start gap-2">
                <CloudSun className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>{day.weatherTitle}.</strong> {day.weatherDescription}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Umbrella className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Gezi stratejisi:</strong> {day.weather.rainStrategy}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>{day.weather.porticiAdvice}</p>
              </div>
              <div className="flex items-start gap-2">
                <Ship className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Ulaşım:</strong> {day.transportAdvice}
                </p>
              </div>
            </div>

            <div>
              <textarea
                value={notes[key] || ''}
                onChange={(e) => setNotes({ ...notes, [key]: e.target.value })}
                placeholder="Bu güne kendi notlarınız…"
                rows={3}
                className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 bg-slate-50"
              />
              <button
                type="button"
                onClick={() => handleSave(key)}
                className="mt-2 min-h-[40px] px-3 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                {savedKey === key ? 'Kaydedildi' : 'Kaydet'}
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
};
