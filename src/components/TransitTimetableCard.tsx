import React, { useState } from 'react';
import {
  Ship,
  Train,
  Bus,
  Clock,
  MapPin,
  ArrowRight,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Tag,
} from 'lucide-react';
import { TransitScheduleInfo } from '../types';

interface TransitTimetableCardProps {
  transit: TransitScheduleInfo;
  defaultExpanded?: boolean;
}

export const TransitTimetableCard: React.FC<TransitTimetableCardProps> = ({
  transit,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  const getVehicleIcon = () => {
    switch (transit.vehicleType) {
      case 'train':
        return <Train className="w-5 h-5 text-indigo-700" />;
      case 'vaporetto':
        return <Ship className="w-5 h-5 text-sky-700" />;
      case 'gondola':
        return <Ship className="w-5 h-5 text-amber-700" />;
      default:
        return <Bus className="w-5 h-5 text-emerald-700" />;
    }
  };

  const getVehicleBadge = () => {
    switch (transit.vehicleType) {
      case 'train':
        return 'Bölgesel Tren';
      case 'vaporetto':
        return 'Vaporetto (Su Otobüsü)';
      case 'gondola':
        return 'Traghetto (Gondol Dolmuş)';
      default:
        return 'Otobüs / Tramvay';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all text-slate-800">
      {/* Header bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-white flex items-start justify-between gap-3 cursor-pointer select-none border-b border-slate-100"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
            {getVehicleIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                {getVehicleBadge()}
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                {transit.ticketPriceStr}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
              {transit.lineCode}
            </h4>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {transit.travelDurationMin} dk yolculuk
              </span>
              <span>·</span>
              <span>{transit.frequency}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label={isExpanded ? 'Detayları gizle' : 'Detayları göster'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Departure & Arrival Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Kalkış Noktası & Peron / İskele:
              </span>
              <div className="font-semibold text-slate-900 text-sm">
                {transit.departureStation}
              </div>
              <div className="font-mono font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block">
                📍 {transit.departurePierOrTrack}
              </div>
            </div>

            <div className="space-y-1 pt-2 sm:pt-0 sm:border-l sm:border-slate-200 sm:pl-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Varış Noktası:
              </span>
              <div className="font-semibold text-slate-900 text-sm">
                {transit.arrivalStation}
              </div>
              <div className="text-slate-600">
                {transit.arrivalPierOrTrack}
              </div>
            </div>
          </div>

          {/* Critical Notice if present */}
          {transit.criticalNotice && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">
                {transit.criticalNotice}
              </div>
            </div>
          )}

          {/* Sefer aralığı & doğrulama durumu */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>İlk / Son Sefer</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium">
              {transit.serviceWindow}
            </div>
            {transit.scheduledTimes && transit.scheduledTimes.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {transit.scheduledTimes.map((time, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-mono font-semibold tabular-nums border border-slate-200"
                  >
                    {time}
                  </span>
                ))}
              </div>
            )}
            <div
              className={`p-3 rounded-xl border text-[11px] leading-relaxed ${
                transit.verification === 'kaynakli'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <strong>
                {transit.verification === 'kaynakli'
                  ? 'Web kaynağından derlendi'
                  : 'Yaklaşık bilgi — yerinde teyit edin'}
                :
              </strong>{' '}
              {transit.sourceNote}
              {transit.officialUrl && (
                <>
                  {' '}
                  <a
                    href={transit.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold"
                  >
                    Resmi tarife ↗
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Duraklar ve Güzergah Çizgisi (Stops Sequence Timeline) */}
          {transit.stopsSequence && transit.stopsSequence.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Durak Sırası & Güzergah:
              </div>
              <div className="relative pl-5 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-300">
                {transit.stopsSequence.map((stop, sIdx) => (
                  <div key={sIdx} className="relative flex items-center justify-between text-xs">
                    {/* Bullet marker */}
                    <div
                      className={`absolute -left-5 w-2.5 h-2.5 rounded-full border-2 bg-white ${
                        stop.isKeyTransfer
                          ? 'border-amber-600 bg-amber-500'
                          : 'border-slate-400'
                      }`}
                    />
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${stop.isKeyTransfer ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>
                        {stop.name}
                      </span>
                      {stop.pierOrPlatform && (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          {stop.pierOrPlatform}
                        </span>
                      )}
                    </div>
                    {stop.timeOffsetMin !== undefined && (
                      <span className="text-[11px] text-slate-600 font-mono tabular-nums">
                        +{stop.timeOffsetMin} dk
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Offline Practical Tip */}
          {transit.offlineTip && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2">
              <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Çevrimdışı İpucu:</strong> {transit.offlineTip}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
