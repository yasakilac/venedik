// Canlı hava durumu (Open-Meteo, anahtarsız). İnternet varken çekilir, telefonda saklanır;
// çevrimdışıyken son kaydedilen tahmin gösterilir.
import { DayWeather, HourlyWeather } from '../types';

const STORAGE_KEY = 'veneto_live_weather_v1';
const TRIP_DATES: Record<number, string> = {
  1: '2026-10-21',
  2: '2026-10-22',
  3: '2026-10-23',
  4: '2026-10-24',
};
// Gün 1 Padova, Gün 3 lagün adaları, diğerleri Venedik
const PLACES: Record<number, [number, number]> = {
  1: [45.4064, 11.8768],
  2: [45.4371, 12.3326],
  3: [45.4854, 12.4167],
  4: [45.4371, 12.3326],
};

export interface LiveDay {
  tempHigh: number;
  tempLow: number;
  conditionText: string;
  iconType: DayWeather['iconType'];
  rainChance: number;
  humidity: number;
  windSpeed: string;
  hourly: HourlyWeather[];
}

export interface LiveWeather {
  updatedAt: string; // ISO
  days: Record<number, LiveDay>;
}

function describe(code: number): { text: string; icon: HourlyWeather['iconName'] } {
  if (code === 0) return { text: 'Açık', icon: 'sun' };
  if (code === 1) return { text: 'Çoğunlukla açık', icon: 'sun' };
  if (code === 2) return { text: 'Parçalı bulutlu', icon: 'cloud-sun' };
  if (code === 3) return { text: 'Bulutlu', icon: 'cloud' };
  if (code === 45 || code === 48) return { text: 'Sisli', icon: 'cloud' };
  if (code >= 51 && code <= 57) return { text: 'Çisenti', icon: 'cloud-rain' };
  if (code >= 61 && code <= 67) return { text: 'Yağmurlu', icon: 'rain' };
  if (code >= 71 && code <= 77) return { text: 'Karlı', icon: 'cloud' };
  if (code >= 80 && code <= 82) return { text: 'Sağanak', icon: 'rain' };
  if (code >= 95) return { text: 'Gök gürültülü fırtına', icon: 'rain' };
  return { text: 'Değişken', icon: 'cloud' };
}

function windDir(deg: number): string {
  const names = ['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB'];
  return names[Math.round(deg / 45) % 8];
}

function dayIcon(code: number, rainChance: number): DayWeather['iconType'] {
  if (rainChance >= 70 || (code >= 61 && code <= 67) || (code >= 80 && code <= 82) || code >= 95) return 'heavy-rain';
  if (rainChance >= 35 || (code >= 51 && code <= 57)) return 'cloudy-rain';
  if (code <= 1) return 'sunny';
  return 'partly-cloudy';
}

export function loadCachedWeather(): LiveWeather | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LiveWeather) : null;
  } catch {
    return null;
  }
}

async function fetchPlace(day: number): Promise<LiveDay | null> {
  const [lat, lon] = PLACES[day];
  const date = TRIP_DATES[day];
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&hourly=temperature_2m,precipitation_probability,weather_code,relative_humidity_2m` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,wind_speed_10m_max,wind_direction_10m_dominant` +
    `&timezone=Europe%2FRome&start_date=${date}&end_date=${date}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return null;
    const j = await res.json();
    const h = j?.hourly;
    const d = j?.daily;
    if (!h?.time?.length || !d?.time?.length) return null;

    const hourly: HourlyWeather[] = [];
    let humSum = 0;
    let humN = 0;
    for (let i = 0; i < h.time.length; i++) {
      const hour = String(h.time[i]).slice(11, 16);
      const hr = parseInt(hour.slice(0, 2), 10);
      if (h.relative_humidity_2m?.[i] != null) {
        humSum += h.relative_humidity_2m[i];
        humN++;
      }
      if (hr < 7 || hr > 23) continue; // gezi saatleri
      const desc = describe(h.weather_code?.[i] ?? 3);
      hourly.push({
        hour,
        temp: Math.round(h.temperature_2m[i]),
        condition: desc.text,
        rainProbability: Math.round(h.precipitation_probability?.[i] ?? 0),
        iconName: desc.icon,
      });
    }

    const code = d.weather_code?.[0] ?? 3;
    const rainChance = Math.round(d.precipitation_probability_max?.[0] ?? 0);
    return {
      tempHigh: Math.round(d.temperature_2m_max[0]),
      tempLow: Math.round(d.temperature_2m_min[0]),
      conditionText: describe(code).text,
      iconType: dayIcon(code, rainChance),
      rainChance,
      humidity: humN ? Math.round(humSum / humN) : 0,
      windSpeed: `${Math.round(d.wind_speed_10m_max?.[0] ?? 0)} km/s ${windDir(d.wind_direction_10m_dominant?.[0] ?? 0)}`,
      hourly,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Tüm günleri günceller; bir gün alınamazsa eski kayıt korunur.
export async function refreshWeather(): Promise<LiveWeather | null> {
  if (!navigator.onLine) return null;
  const prev = loadCachedWeather();
  const days: Record<number, LiveDay> = { ...(prev?.days ?? {}) };
  let any = false;
  const results = await Promise.all([1, 2, 3, 4].map((d) => fetchPlace(d)));
  results.forEach((r, i) => {
    if (r) {
      days[i + 1] = r;
      any = true;
    }
  });
  if (!any) return null;
  const live: LiveWeather = { updatedAt: new Date().toISOString(), days };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(live));
  } catch {
    // depolama dolu
  }
  return live;
}

// Statik örnek veriyi canlı veriyle birleştirir (canlı alan varsa üzerine yazar).
export function mergeWeather(base: DayWeather, live: LiveWeather | null): DayWeather {
  const d = live?.days?.[base.dayNumber];
  if (!d) return base;
  return { ...base, ...d, hourly: d.hourly.length ? d.hourly : base.hourly };
}
