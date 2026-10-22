import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Clock,
  ExternalLink,
  Camera,
  Compass,
  Utensils,
  Info,
  Check,
  Heart,
  ChevronLeft,
  ChevronRight,
  Share2,
  AlertTriangle,
  FileText,
  Save,
  Ship,
  Train,
  Ticket,
  Hourglass,
  Star,
  Lightbulb,
  BookOpen,
  Sparkles,
  ChevronDown,
  Footprints,
  Bus,
  Crosshair,
  Route as RouteIcon,
  Map as MapIcon,
} from 'lucide-react';
import { ItineraryStop } from '../types';
import { saveStopNote, getCustomNotes } from '../utils/storage';
import { TransitTimetableCard } from './TransitTimetableCard';
import { PLACE_DETAILS } from '../data/placeDetails';
import { placeUrl, coordUrl, directionsUrl, transitDirectionsUrl } from '../utils/maps';
import { ACCESS_INFO, estimateWalk, stopModes } from '../data/stopMeta';

interface StopDetailModalProps {
  stop: ItineraryStop | null;
  onClose: () => void;
  isCompleted: boolean;
  onToggleComplete: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelectStop: (stop: ItineraryStop) => void;
  allStopsInDay: ItineraryStop[];
  onShowOnMap: (stop: ItineraryStop) => void;
}

export const StopDetailModal: React.FC<StopDetailModalProps> = ({
  stop,
  onClose,
  isCompleted,
  onToggleComplete,
  isFavorite,
  onToggleFavorite,
  onSelectStop,
  allStopsInDay,
  onShowOnMap,
}) => {
  const [userNote, setUserNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    if (stop) {
      const notes = getCustomNotes();
      setUserNote(notes[stop.id] || '');
      setNoteSaved(false);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [stop]);

  if (!stop) return null;

  const currentIndex = allStopsInDay.findIndex((s) => s.id === stop.id);
  const prevStop = currentIndex > 0 ? allStopsInDay[currentIndex - 1] : null;
  const nextStop =
    currentIndex < allStopsInDay.length - 1 ? allStopsInDay[currentIndex + 1] : null;

  const handleSaveNote = () => {
    saveStopNote(stop.id, userNote);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const handleShare = async () => {
    const text = `${stop.title} (${stop.timeRange})\n${stop.address}\nGoogle Maps: ${placeUrl(stop)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: stop.title,
          text,
        });
      } catch {
        // user cancelled share
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Durak bilgileri panoya kopyalandı!');
    }
  };

  // Aesthetic Visual Theme based on Category & Day
  const getBannerGradient = () => {
    switch (stop.category) {
      case 'coffee':
        return 'from-amber-900 via-amber-800 to-stone-900';
      case 'food':
        return 'from-rose-950 via-red-900 to-stone-900';
      case 'photo':
        return 'from-indigo-950 via-slate-900 to-sky-950';
      case 'transport':
        return 'from-sky-950 via-blue-900 to-slate-900';
      case 'shopping':
        return 'from-purple-950 via-slate-900 to-stone-900';
      default:
        return 'from-slate-900 via-stone-900 to-emerald-950';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[88dvh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
      >
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Visual Header Banner */}
        <div className={`relative px-5 py-6 sm:px-8 sm:py-8 bg-gradient-to-br ${getBannerGradient()} text-white shrink-0 overflow-hidden`}>
          {/* Subtle architectural contour motif */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="arch-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 0 40 L 40 40 M 20 0 Q 20 20 40 20 M 0 20 Q 20 20 20 0" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#arch-pattern)" />
            </svg>
          </div>

          {/* Top action row */}
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-200/90 tracking-wide uppercase">
              <button
                type="button"
                onClick={onClose}
                aria-label="Geri"
                className="mr-1 -ml-2 min-h-[44px] pl-1 pr-3 flex items-center gap-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white normal-case text-sm font-semibold cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Geri</span>
              </button>
              <span className="whitespace-nowrap">{stop.day}. Gün</span>
              <span className="flex items-center gap-1 whitespace-nowrap normal-case">
                <Clock className="w-3.5 h-3.5" />
                {stop.timeRange}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onToggleFavorite}
                aria-label="Favorilere Ekle"
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleShare}
                aria-label="Paylaş"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Kapat"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl font-bold font-serif-heading text-white tracking-tight leading-tight">
              {stop.title}
            </h2>
            <p className="text-sm text-slate-200/90 mt-1 leading-relaxed">
              {stop.subtitle}
            </p>
          </div>

          {/* Address & Cost row */}
          <div className="relative z-10 mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-1 truncate max-w-full">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{stop.address}</span>
            </div>
            {stop.estimatedCost && (
              <>
                <span className="hidden sm:inline">·</span>
                <span className="font-medium text-amber-300">
                  {stop.estimatedCost}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-slate-800">
          {/* Eylemler: yalnızca ikonlar (anlamları Notlar > İkon sözlüğü) */}
          <div className="space-y-2.5">
            <div className="grid grid-cols-5 gap-2">
              <a
                href={placeUrl(stop)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Haritalar"
                title="Google Haritalar"
                className="h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all"
              >
                <MapPin className="w-6 h-6 text-amber-400" />
              </a>
              <button
                type="button"
                onClick={() => onShowOnMap(stop)}
                aria-label="Çevrimdışı harita"
                title="Çevrimdışı harita"
                className="h-14 rounded-xl bg-white border border-slate-300 text-slate-900 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              >
                <MapIcon className="w-6 h-6 text-amber-700" />
              </button>
              <a
                href={directionsUrl(stop)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Yürüyerek yol tarifi"
                title="Yürüyerek yol tarifi"
                className="h-14 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all"
              >
                <Footprints className="w-6 h-6 text-amber-700" />
              </a>
              <a
                href={transitDirectionsUrl(stop)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Toplu taşıma ile yol tarifi"
                title="Toplu taşıma ile yol tarifi"
                className="h-14 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all"
              >
                <Bus className="w-6 h-6 text-sky-700" />
              </a>
              <a
                href={coordUrl(stop)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Koordinatla aç"
                title="Koordinatla aç"
                className="h-14 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all"
              >
                <Crosshair className="w-6 h-6 text-slate-600" />
              </a>
            </div>

            <button
              type="button"
              onClick={onToggleComplete}
              className={`w-full min-h-[44px] rounded-xl font-medium text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  isCompleted ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-400'
                }`}
              >
                {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>{isCompleted ? 'Ziyaret edildi' : 'Ziyaret edildi olarak işaretle'}</span>
            </button>
          </div>

          {/* Buraya nasıl gidilir? */}
          <AccessSection stop={stop} prevStop={prevStop} />

          {/* Mekan Bilgileri: ikonlu özet + açılır bölümler */}
          {PLACE_DETAILS[stop.id] && (
            <PlaceInfoSection details={PLACE_DETAILS[stop.id]} />
          )}

          {/* Offline Transit Timetable & Pier/Platform details */}
          {stop.transitInfo && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-900 uppercase tracking-wider">
                <Ship className="w-4 h-4 text-sky-600" />
                <span>Çevrimdışı Sefer Saatleri & Peron/İskele Rehberi:</span>
              </div>
              <TransitTimetableCard transit={stop.transitInfo} defaultExpanded={true} />
            </div>
          )}

          {/* Urgent / Closing Alert */}
          {stop.closingAlert && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-amber-900">Zamanlama / Kapanış Uyarısı</h4>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">{stop.closingAlert}</p>
              </div>
            </div>
          )}

          {/* Photography & New Lens Spotlight */}
          {(stop.photographyTips || stop.lensSpotlight) && (
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100/80">
              <div className="flex items-center gap-2 text-indigo-900 font-semibold text-sm mb-2">
                <Camera className="w-4 h-4 text-indigo-600" />
                <span>Yeni Lens & Fotoğrafçılık Rehberi</span>
              </div>
              {stop.photographyTips && (
                <p className="text-sm text-indigo-950/90 leading-relaxed">
                  {stop.photographyTips}
                </p>
              )}
              {stop.lensSpotlight && (
                <div className="mt-3 pt-3 border-t border-indigo-100 flex items-start gap-2 text-xs text-indigo-900/80 font-medium">
                  <span className="text-indigo-600 font-bold uppercase tracking-wider shrink-0 text-[10px]">
                    Kadraj / Diyafram:
                  </span>
                  <span>{stop.lensSpotlight}</span>
                </div>
              )}
            </div>
          )}

          {/* Geographer's Perspective */}
          {stop.geographyNote && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm mb-2">
                <Compass className="w-4 h-4 text-amber-700" />
                <span>Coğrafyacı Gözüyle & Tarihsel Notlar</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {stop.geographyNote}
              </p>
            </div>
          )}

          {/* Culinary & Order Guidance */}
          {stop.orderTips && stop.orderTips.length > 0 && (
            <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-100">
              <div className="flex items-center gap-2 text-rose-900 font-semibold text-sm mb-2">
                <Utensils className="w-4 h-4 text-rose-600" />
                <span>Ne Yenir / Ne İçilir? (Gurme Sipariş Rehberi)</span>
              </div>
              <ul className="space-y-2 text-sm text-rose-950/90">
                {stop.orderTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">·</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Practical Advice */}
          {stop.practicalAdvice && (
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 text-sm">
              <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-xs mb-1">
                <Info className="w-4 h-4 text-amber-700" />
                <span>Pratik Seyahat İpucu</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                {stop.practicalAdvice}
              </p>
            </div>
          )}

          {/* Personal Note Box */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="stop-user-notes" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Bu Durak İçin Kişisel Notunuz:</span>
              </label>
              {noteSaved && (
                <span className="text-[11px] text-emerald-600 font-medium animate-in fade-in">
                  Kaydedildi!
                </span>
              )}
            </div>
            <div className="relative">
              <textarea
                id="stop-user-notes"
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder="Örn: Masayı önceden ayırt, saat 16:00'da fotoğraf çek, faturayı iste..."
                rows={2}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none text-slate-800"
              />
              <button
                type="button"
                onClick={handleSaveNote}
                className="mt-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Save className="w-3 h-3" />
                <span>Notu Kaydet</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar (Prev / Next Stop) */}
        <div className="px-5 py-3.5 sm:px-7 sm:py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            disabled={!prevStop}
            onClick={() => prevStop && onSelectStop(prevStop)}
            className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              prevStop
                ? 'text-slate-700 hover:bg-slate-200/70'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Önceki:</span>
            <span className="truncate max-w-[90px] sm:max-w-[150px]">
              {prevStop ? prevStop.title : 'İlk Durak'}
            </span>
          </button>

          <span className="text-xs text-slate-600 font-medium whitespace-nowrap shrink-0">
            {currentIndex + 1} / {allStopsInDay.length}
          </span>

          <button
            type="button"
            disabled={!nextStop}
            onClick={() => nextStop && onSelectStop(nextStop)}
            className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              nextStop
                ? 'text-slate-700 hover:bg-slate-200/70'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <span className="truncate max-w-[90px] sm:max-w-[150px]">
              {nextStop ? nextStop.title : 'Son Durak'}
            </span>
            <span className="hidden sm:inline">:Sonraki</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};


function PlaceInfoSection({ details }: { details: import('../data/placeDetails').PlaceDetails }) {
  const [open, setOpen] = useState<string | null>('highlights');
  const toggle = (k: string) => setOpen((cur) => (cur === k ? null : k));

  const facts: { key: string; label: string; value?: string; Icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'hours', label: 'Saatler', value: details.hours, Icon: Clock },
    { key: 'ticket', label: 'Fiyat', value: details.ticket, Icon: Ticket },
    { key: 'duration', label: 'Süre', value: details.duration, Icon: Hourglass },
    { key: 'best', label: 'En iyi zaman', value: details.bestTime, Icon: Star },
  ];

  const sections: { key: string; label: string; Icon: React.ComponentType<{ className?: string }>; body: React.ReactNode }[] = [];
  if (details.highlights?.length)
    sections.push({
      key: 'highlights',
      label: 'Kaçırılmaz',
      Icon: Sparkles,
      body: (
        <ul className="space-y-1.5">
          {details.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">·</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      ),
    });
  if (details.history)
    sections.push({ key: 'history', label: 'Tarihçe', Icon: BookOpen, body: <p>{details.history}</p> });
  if (details.tips?.length)
    sections.push({
      key: 'tips',
      label: 'İpuçları',
      Icon: Lightbulb,
      body: (
        <ul className="space-y-1.5">
          {details.tips.map((t, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">·</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      ),
    });
  if (details.nearby)
    sections.push({ key: 'nearby', label: 'Yakında', Icon: MapPin, body: <p>{details.nearby}</p> });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {facts
          .filter((f) => f.value)
          .map(({ key, label, value, Icon }) => (
            <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-2" title={label}>
              <Icon className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-label={label} />
              <div className="text-slate-800 leading-relaxed">{value}</div>
            </div>
          ))}
      </div>

      {sections.map(({ key, label, Icon, body }) => (
        <div key={key} className="rounded-xl border border-slate-200 overflow-hidden">
          <button
            type="button"
            aria-expanded={open === key}
            onClick={() => toggle(key)}
            className="w-full min-h-[48px] px-4 flex items-center justify-between gap-2 bg-white text-sm font-semibold text-slate-900 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-amber-700" />
              {label}
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open === key ? 'rotate-180' : ''}`} />
          </button>
          {open === key && <div className="px-4 pb-4 text-sm text-slate-700 leading-relaxed">{body}</div>}
        </div>
      ))}

      <p className="text-[11px] text-slate-500 leading-relaxed">
        Saat ve fiyatlar yaklaşık değerlerdir ve mevsime göre değişir; gitmeden resmi siteden teyit edin.
      </p>
    </div>
  );
}


function AccessSection({ stop, prevStop }: { stop: ItineraryStop; prevStop: ItineraryStop | null }) {
  const info = ACCESS_INFO[stop.id];
  const byTransit = stopModes(stop).length > 0;
  const walk = prevStop && !byTransit ? estimateWalk(prevStop, stop) : null;
  if (!info && !walk) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2.5 text-xs text-slate-800">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <RouteIcon className="w-4 h-4 text-amber-700" />
        Buraya nasıl gidilir?
      </div>
      {walk && prevStop && (
        <div className="flex items-start gap-2">
          <Footprints className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            {prevStop.locationName} → ≈ {walk.meters} m, ≈ {walk.minutes} dk (kuş uçuşundan tahmin; sokak düzenine göre değişir).
          </span>
        </div>
      )}
      {info?.alt && (
        <div className="flex items-start gap-2">
          <Bus className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
          <span>
            {info.alt}
          </span>
        </div>
      )}
      {info?.route && (
        <div className="flex items-start gap-2">
          <RouteIcon className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
          <span>
            {info.route}
          </span>
        </div>
      )}
    </div>
  );
}
