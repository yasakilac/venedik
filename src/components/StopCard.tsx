import React from 'react';
import {
  Check,
  Coffee,
  Utensils,
  Camera,
  Landmark,
  Ship,
  ExternalLink,
  ChevronRight,
  Clock,
  Sparkles,
  MapPin,
  ChevronDown,
  Ticket,
  Hourglass,
  Umbrella,
  Lightbulb,
  Star,
} from 'lucide-react';
import { ItineraryStop } from '../types';
import { PLACE_DETAILS } from '../data/placeDetails';

interface StopCardProps {
  stop: ItineraryStop;
  isCompleted: boolean;
  onToggleComplete: (e: React.MouseEvent) => void;
  onClickCard: () => void;
}

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  coffee: { label: 'Kahve & Latte', icon: Coffee, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  food: { label: 'Yemek & Cicchetti', icon: Utensils, color: 'text-rose-700 bg-rose-50 border-rose-200' },
  photo: { label: 'Fotoğraf Noktası', icon: Camera, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  sight: { label: 'Tarih & Doğa', icon: Landmark, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  transport: { label: 'Ulaşım & Vapur', icon: Ship, color: 'text-sky-700 bg-sky-50 border-sky-200' },
  shopping: { label: 'Ekipman & Alışveriş', icon: Sparkles, color: 'text-purple-700 bg-purple-50 border-purple-200' },
};

export const StopCard: React.FC<StopCardProps> = ({
  stop,
  isCompleted,
  onToggleComplete,
  onClickCard,
}) => {
  const config = CATEGORY_CONFIG[stop.category] || CATEGORY_CONFIG.sight;
  const CategoryIcon = config.icon;
  const details = PLACE_DETAILS[stop.id];
  const [expanded, setExpanded] = React.useState(false);

  const handleMapsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      stop.mapsQuery || stop.title
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={onClickCard}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
        isCompleted
          ? 'border-slate-200 bg-slate-50/70 opacity-80'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
        {/* Checkbox Touch Target >= 44x44 px */}
        <button
          type="button"
          onClick={onToggleComplete}
          aria-label={isCompleted ? 'Ziyaret edilmedi olarak işaretle' : 'Ziyaret edildi olarak işaretle'}
          className="mt-0.5 min-w-[44px] min-h-[44px] -ml-2 -mt-2 flex items-center justify-center shrink-0 cursor-pointer focus:outline-none"
        >
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              isCompleted
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-300 group-hover:border-slate-400 bg-white'
            }`}
          >
            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </button>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Metadata Row (Unboxed typography - Zero-Pill) */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mb-1">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {stop.timeRange}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-600 font-medium">{config.label}</span>
            {stop.estimatedCost && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-600">{stop.estimatedCost}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3
            className={`text-base sm:text-lg font-semibold tracking-tight leading-snug transition-colors ${
              isCompleted
                ? 'line-through text-slate-500'
                : 'text-slate-900 group-hover:text-amber-800'
            }`}
          >
            {stop.title}
          </h3>

          {/* Subtitle / Teaser */}
          <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {stop.subtitle}
          </p>

          {/* Transit line badge if transit stop */}
          {stop.transitInfo && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100 max-w-full">
              <Ship className="w-3 h-3 text-sky-600" />
              <span>{stop.transitInfo.lineCode.split('(')[0].trim()}</span>
              <span className="text-sky-500 font-normal shrink-0 whitespace-nowrap">· {stop.transitInfo.travelDurationMin} dk</span>
            </div>
          )}

          {/* İkonlu hızlı bilgi şeridi (tıklayınca açılır) */}
          {details && (
            <div className="mt-3">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border ${config.color}`}>
                  <CategoryIcon className="w-3.5 h-3.5" />
                  {config.label}
                </span>
                {details.hours && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-700">
                    <Clock className="w-3.5 h-3.5" /> Saatler
                  </span>
                )}
                {details.ticket && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-700">
                    <Ticket className="w-3.5 h-3.5" /> Fiyat
                  </span>
                )}
                {details.duration && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-700">
                    <Hourglass className="w-3.5 h-3.5" /> {details.duration.split('·')[0].trim()}
                  </span>
                )}
                {stop.isRainFriendly && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-sky-50 text-sky-800">
                    <Umbrella className="w-3.5 h-3.5" /> Yağmura uygun
                  </span>
                )}
              </div>
              <button
                type="button"
                aria-expanded={expanded}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded((v) => !v);
                }}
                className="mt-2 inline-flex items-center gap-1 min-h-[36px] text-xs font-semibold text-amber-800 hover:text-amber-950"
              >
                <span>{expanded ? 'Bilgiyi gizle' : 'Hızlı bilgi'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>

              {expanded && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 p-3 rounded-xl bg-amber-50/60 border border-amber-100 space-y-2 text-xs text-slate-800"
                >
                  {details.hours && (
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>{details.hours}</span>
                    </div>
                  )}
                  {details.ticket && (
                    <div className="flex items-start gap-2">
                      <Ticket className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>{details.ticket}</span>
                    </div>
                  )}
                  {details.bestTime && (
                    <div className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>{details.bestTime}</span>
                    </div>
                  )}
                  {details.tips && details.tips[0] && (
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>{details.tips[0]}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={onClickCard}
                    className="mt-1 inline-flex items-center gap-1 min-h-[36px] font-semibold text-slate-900 underline"
                  >
                    Tüm ayrıntılar <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Location & Quick Action Row */}
          <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 flex items-center gap-1 truncate max-w-[200px] sm:max-w-[280px]">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{stop.locationName}</span>
            </span>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleMapsClick}
                title="Google Haritalar'da Aç"
                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors flex items-center gap-1 text-[11px] font-medium"
              >
                <span>Harita</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <div className="text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
