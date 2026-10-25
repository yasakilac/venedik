import React, { useState } from 'react';
import {
  Umbrella,
  Shield,
  Ship,
  StickyNote,
  Save,
  Clock,
  Ticket,
  Hourglass,
  Star,
  Lightbulb,
  Train,
  Bus,
  Sailboat,
  MapPin,
  Map as MapIcon,
  Footprints,
  Crosshair,
  Info,
  Coffee,
  Utensils,
  Camera,
  Landmark,
  Sparkles,
  Check,
  Heart,
  Route as RouteIcon,
} from 'lucide-react';
import { DAYS_INFO } from '../data/itineraryData';
import { getCustomNotes, saveStopNote } from '../utils/storage';
import { QuizHub } from './QuizHub';

const ICON_LEGEND: { Icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { Icon: Clock, label: 'Saat / çalışma saatleri' },
  { Icon: Ticket, label: 'Fiyat / bilet' },
  { Icon: Hourglass, label: 'Önerilen süre' },
  { Icon: Umbrella, label: 'Yağmura uygun' },
  { Icon: Star, label: 'En iyi zaman' },
  { Icon: Lightbulb, label: 'İpucu' },
  { Icon: Info, label: 'Hızlı bilgi (dokununca açılır)' },
  { Icon: Train, label: 'Tren' },
  { Icon: Ship, label: 'Vapur' },
  { Icon: Bus, label: 'Otobüs / tramvay · toplu taşıma' },
  { Icon: Sailboat, label: 'Traghetto (gondol geçişi)' },
  { Icon: MapPin, label: 'Google Haritalar’da aç' },
  { Icon: MapIcon, label: 'Çevrimdışı harita (uygulama içi)' },
  { Icon: Footprints, label: 'Yürüyerek yol tarifi / yürüyüş' },
  { Icon: Crosshair, label: 'Koordinatla aç · konumumu göster' },
  { Icon: RouteIcon, label: 'Alternatif rota' },
  { Icon: Coffee, label: 'Kahve' },
  { Icon: Utensils, label: 'Yemek' },
  { Icon: Camera, label: 'Fotoğraf noktası' },
  { Icon: Landmark, label: 'Gezi / tarih' },
  { Icon: Sparkles, label: 'Alışveriş' },
  { Icon: Check, label: 'Ziyaret edildi' },
  { Icon: Heart, label: 'Favori' },
];

// Gün bazlı stratejiler ve kişisel notlar. Eski ana sayfa yazıları buraya taşındı.
export const NotesView: React.FC = () => {
  const [notes, setNotes] = useState<Record<string, string>>(getCustomNotes());
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [section, setSection] = useState<'notes' | 'tests'>('notes');

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

      <div className="grid grid-cols-2 gap-2" role="tablist" aria-label="Notlar menüsü">
        {([['notes', 'Notlar & Rehber'], ['tests', '🎮 Testler & Yarışmalar']] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={section === id}
            onClick={() => setSection(id)}
            className={`min-h-[44px] rounded-2xl text-sm font-semibold border cursor-pointer transition-colors ${
              section === id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {section === 'tests' && <QuizHub />}
      {section === 'notes' && (
        <>

      <details className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <summary className="text-sm font-bold text-slate-900 cursor-pointer min-h-[32px] flex items-center">
          İkon sözlüğü
        </summary>
        <div className="h-3" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
          {ICON_LEGEND.map(({ Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5 text-xs text-slate-700">
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </details>

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
        </>
      )}
    </div>
  );
};
