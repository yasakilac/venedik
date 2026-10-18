import React, { useState, useEffect } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Ship,
  Sparkles,
  Info,
  Calendar,
  RotateCcw,
} from 'lucide-react';
import { getPassConfig, savePassConfig, PassConfig } from '../utils/storage';

export const PassTracker: React.FC = () => {
  const [config, setConfig] = useState<PassConfig>(getPassConfig());
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    totalSecondsLeft: number;
    isExpired: boolean;
    isCriticalWarning: boolean;
  }>({
    hours: 48,
    minutes: 0,
    seconds: 0,
    totalSecondsLeft: 48 * 3600,
    isExpired: false,
    isCriticalWarning: false,
  });

  useEffect(() => {
    const updateCountdown = () => {
      if (!config.isActive) return;

      const start = new Date(config.startTime).getTime();
      const end = start + config.durationHours * 3600 * 1000;
      const now = Date.now();
      const diffMs = end - now;

      if (diffMs <= 0) {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSecondsLeft: 0,
          isExpired: true,
          isCriticalWarning: false,
        });
      } else {
        const totalSecondsLeft = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSecondsLeft / 3600);
        const minutes = Math.floor((totalSecondsLeft % 3600) / 60);
        const seconds = totalSecondsLeft % 60;
        // Critical warning if less than 15 minutes left before 21:00 expiration!
        const isCriticalWarning = totalSecondsLeft <= 15 * 60;

        setTimeLeft({
          hours,
          minutes,
          seconds,
          totalSecondsLeft,
          isExpired: false,
          isCriticalWarning,
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [config]);

  const handleStartPassNow = () => {
    const nowIso = new Date().toISOString();
    const newConfig: PassConfig = {
      isActive: true,
      startTime: nowIso,
      durationHours: 48,
    };
    setConfig(newConfig);
    savePassConfig(newConfig);
  };

  const handleResetToPlannedTrip = () => {
    const tripConfig: PassConfig = {
      isActive: true,
      startTime: '2026-10-21T21:00:00',
      durationHours: 48,
    };
    setConfig(tripConfig);
    savePassConfig(tripConfig);
  };

  const totalDurationSeconds = config.durationHours * 3600;
  const progressPercent = Math.max(
    0,
    Math.min(100, ((totalDurationSeconds - timeLeft.totalSecondsLeft) / totalDurationSeconds) * 100)
  );

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
      {/* Title & Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
            <Ship className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              48 Saatlik ACTV Pass Sayacı
            </h3>
            <p className="text-xs text-slate-500">
              Başlangıç: Çarşamba 21:00 · Bitiş: Cuma 21:00 (35,00 €)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleStartPassNow}
            className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Şimdi Başlat (Test)
          </button>
          <button
            type="button"
            onClick={handleResetToPlannedTrip}
            title="Planlanan seyahat saatine döndür"
            className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Critical 20:45 Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 space-y-1">
          <span className="font-bold text-amber-900 block text-sm">
            Kritik Strateji: Saat 20:45 Uyarısı!
          </span>
          <p className="leading-relaxed">
            48 saatlik Pass saat <strong>21:00’de dolacak</strong>. Cuma akşamı saat <strong>21:00’den önce</strong> Piazzale Roma’dan Mestre otobüsüne veya tramvayına kartınızı son kez okutup binerseniz dönüşünüz <strong>0 €</strong>’ya gelir! 72 saatlik bilet yerine 48 saatlik bilet alarak <strong>kişi başı 10 € doğrudan cebinizde kalır</strong>.
          </p>
        </div>
      </div>

      {/* Countdown Display Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-xs text-sky-300 font-medium tracking-wide uppercase flex items-center justify-between">
            <span>Pass Kalan Süre</span>
            <span>48 Saatlik Geçerlilik</span>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums text-white">
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <span className="text-xs text-slate-300 font-medium">
              (Saat : Dakika : Saniye)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                timeLeft.isCriticalWarning
                  ? 'bg-rose-500'
                  : 'bg-gradient-to-r from-sky-400 to-amber-400'
              }`}
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>İlk Okutma: 21:00</span>
            <span>Bitiş: 48 Saat Sonra</span>
          </div>
        </div>
      </div>

      {/* What's Included Checklist */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          48 Saatlik ACTV Pass Kapsamı
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Tüm Vaporetto Hatları (1, 2, 4.1, 5.1 vb.)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Lagün Adaları (Murano, Burano, Torcello)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Lido & Pellestrina Vapurları</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Mestre Belediye Otobüsleri & Tramvayları</span>
          </div>
        </div>
      </div>
    </div>
  );
};
