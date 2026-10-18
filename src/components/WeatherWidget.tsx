import React, { useState } from 'react';
import {
  CloudRain,
  Sun,
  CloudSun,
  Cloud,
  Droplets,
  Wind,
  Shield,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DayWeather, HourlyWeather } from '../types';

interface WeatherWidgetProps {
  weather: DayWeather;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
  const [showHourly, setShowHourly] = useState<boolean>(false);

  const getWeatherIcon = (type: DayWeather['iconType'], className = 'w-7 h-7') => {
    switch (type) {
      case 'heavy-rain':
        return <CloudRain className={`${className} text-blue-500`} />;
      case 'cloudy-rain':
        return <CloudRain className={`${className} text-sky-500`} />;
      case 'partly-cloudy':
        return <CloudSun className={`${className} text-amber-500`} />;
      case 'sunny':
        return <Sun className={`${className} text-amber-500`} />;
      default:
        return <Cloud className={`${className} text-slate-400`} />;
    }
  };

  const getHourlyIcon = (iconName: HourlyWeather['iconName']) => {
    switch (iconName) {
      case 'rain':
        return <CloudRain className="w-4 h-4 text-blue-500" />;
      case 'cloud-rain':
        return <CloudRain className="w-4 h-4 text-sky-400" />;
      case 'cloud-sun':
        return <CloudSun className="w-4 h-4 text-amber-400" />;
      case 'sun':
        return <Sun className="w-4 h-4 text-amber-500" />;
      default:
        return <Cloud className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-sm border border-slate-700 space-y-3">
      {/* Main weather header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 shrink-0">
            {getWeatherIcon(weather.iconType)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight">
                {weather.tempHigh}°
              </span>
              <span className="text-xs text-slate-400 font-mono">
                / {weather.tempLow}°
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-amber-300">
                {weather.conditionText}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                %{weather.rainChance} Yağış
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-slate-400" />
                {weather.windSpeed}
              </span>
            </div>
          </div>
        </div>

        {/* Toggle hourly button */}
        <button
          type="button"
          onClick={() => setShowHourly(!showHourly)}
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
        >
          <span>Saatlik</span>
          {showHourly ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Hourly Forecast Scroller */}
      {showHourly && (
        <div className="pt-2 border-t border-white/10">
          <div className="text-[11px] font-semibold text-slate-400 mb-2">
            Saat Saat Hava Durumu:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {weather.hourly.map((h, idx) => (
              <div
                key={idx}
                className="flex-1 min-w-[70px] p-2 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center text-center space-y-1"
              >
                <span className="text-[10px] text-slate-400 font-mono font-medium">
                  {h.hour}
                </span>
                <div>{getHourlyIcon(h.iconName)}</div>
                <span className="text-xs font-bold font-mono">{h.temp}°</span>
                <span className="text-[9px] text-sky-300 font-mono">
                  %{h.rainProbability}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
