import React from 'react';
import {
  Check,
  Coffee,
  Utensils,
  Camera,
  Landmark,
  Ship,
  Train,
  Bus,
  Sailboat,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Clock,
  Sparkles,
  MapPin,
  Map as MapIcon,
  Ticket,
  Hourglass,
  Umbrella,
  Lightbulb,
  Star,
  ArrowRight,
  Info,
} from 'lucide-react';
import { ItineraryStop } from '../types';
import { PLACE_DETAILS } from '../data/placeDetails';
import { ROUTE_LABELS, stopModes, TravelMode } from '../data/stopMeta';
import { placeUrl } from '../utils/maps';

interface StopCardProps {
  stop: ItineraryStop;
  isCompleted: boolean;
  onToggleComplete: (e: React.MouseEvent) => void;
  onClickCard: () => void;
  onShowOnMap: () => void;
}

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  coffee: { label: 'Kahve', icon: Coffee, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  food: { label: 'Yemek', icon: Utensils, color: 'text-rose-700 bg-rose-50 border-rose-200' },
  photo: { label: 'Fotoğraf', icon: Camera, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  sight: { label: 'Gezi', icon: Landmark, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  transport: { label: 'Ulaşım', icon: Ship, color: 'text-sky-700 bg-sky-50 border-sky-200' },
  shopping: { label: 'Alışveriş', icon: Sparkles, color: 'text-purple-700 bg-purple-50 border-purple-200' },
};

const MODE_ICON: Record<TravelMode, { Icon: React.ComponentType<{ className?: string }>; label: string }> = {
  train: { Icon: Train, label: 'Tren' },
  vaporetto: { Icon: Ship, label: 'Vapur' },
  bus: { Icon: Bus, label: 'Otobüs / tramvay' },
  gondola: { Icon: Sailboat, label: 'Traghetto' },
};

export const StopCard: React.FC<StopCardProps> = ({
  stop,
  isCompleted,
  onToggleComplete,
  onClickCard,
  onShowOnMap,
}) => {
  const config = CATEGORY_CONFIG[stop.category] || CATEGORY_CONFIG.sight;
  const CategoryIcon = config.icon;
  const details = PLACE_DETAILS[stop.id];
  const route = ROUTE_LABELS[stop.id];
  const modes = stopModes(stop);
  const [expanded, setExpanded] = React.useState(false);

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

        <div className="flex-1 min-w-0">
          {/* Üst satır: yalnızca saat · araç simgeleri · fiyat */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
            <span className="flex items-center gap-1 font-semibold text-slate-800 tabular-nums">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {stop.timeRange}
            </span>
            {modes.length > 0 && (
              <span className="flex items-center gap-1 text-sky-700" aria-label={modes.map((m) => MODE_ICON[m].label).join(' + ')}>
                {modes.map((m) => {
                  const { Icon, label } = MODE_ICON[m];
                  return <Icon key={m} className="w-4 h-4" aria-label={label} />;
                })}
              </span>
            )}
            {stop.estimatedCost && <span className="font-medium text-slate-700">{stop.estimatedCost}</span>}
          </div>

          {/* Başlık: ulaşımda "nereden → nereye", diğerlerinde mekan adı */}
          <h3
            className={`mt-1 text-base sm:text-lg font-semibold tracking-tight leading-snug transition-colors ${
              isCompleted ? 'line-through text-slate-500' : 'text-slate-900 group-hover:text-amber-800'
            }`}
          >
            {route ? (
              <span className="inline-flex flex-wrap items-center gap-x-1.5">
                <span>{route.from}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{route.to}</span>
              </span>
            ) : (
              stop.title
            )}
          </h3>

          {/* İkonlu etiketler (tıklayınca açılan hızlı bilgi) */}
          {details && (
            <div className="mt-2.5">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span title={config.label} aria-label={config.label} className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border ${config.color}`}>
                  <CategoryIcon className="w-4 h-4" />
                </span>
                {details.hours && (
                  <span title="Çalışma saatleri" aria-label="Çalışma saatleri" className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700">
                    <Clock className="w-4 h-4" />
                  </span>
                )}
                {details.ticket && (
                  <span title="Fiyat" aria-label="Fiyat" className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700">
                    <Ticket className="w-4 h-4" />
                  </span>
                )}
                {details.duration && (
                  <span title="Önerilen süre" className="inline-flex items-center gap-1 px-2 h-8 rounded-lg bg-slate-100 text-slate-700">
                    <Hourglass className="w-4 h-4" /> {details.duration.split('·')[0].trim()}
                  </span>
                )}
                {stop.isRainFriendly && (
                  <span title="Yağmura uygun" aria-label="Yağmura uygun" className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-sky-50 text-sky-800">
                    <Umbrella className="w-4 h-4" />
                  </span>
                )}
              </div>
              <button
                type="button"
                aria-expanded={expanded}
                aria-label={expanded ? 'Bilgiyi gizle' : 'Hızlı bilgi'}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded((v) => !v);
                }}
                className="mt-1.5 inline-flex items-center gap-0.5 min-h-[40px] min-w-[44px] px-2 rounded-lg text-amber-800 hover:bg-amber-50"
              >
                <Info className="w-5 h-5" />
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

          {/* Harita bağlantıları: yalnızca ikon (anlamları Notlar > İkon sözlüğü) */}
          <div className="mt-2 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <a
              href={placeUrl(stop)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Google Haritalar"
              title="Google Haritalar"
              className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center"
            >
              <MapPin className="w-5 h-5" />
            </a>
            <button
              type="button"
              aria-label="Çevrimdışı harita"
              title="Çevrimdışı harita"
              onClick={(e) => {
                e.stopPropagation();
                onShowOnMap();
              }}
              className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
            >
              <MapIcon className="w-5 h-5" />
            </button>
            <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};
