// Yürüyüş rotaları: internet varken yaya yönlendirme servisinden sokak sokak rota çekilir,
// telefonda saklanır ve çevrimdışıyken haritada çizilir. Rota yoksa düz kesik çizgiye düşülür.
import { ItineraryStop } from '../types';
import { stopModes } from '../data/stopMeta';

const STORAGE_KEY = 'veneto_walk_routes_v1';
const ENDPOINT = 'https://routing.openstreetmap.de/routed-foot/route/v1/foot';

export interface WalkRoute {
  coords: [number, number][]; // [lat, lng]
  meters: number;
  seconds: number;
}

type Store = Record<string, WalkRoute>;

function readStore(): Store {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeStore(store: Store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // depolama dolu / yasak: sessizce geç
  }
}

export function legKey(a: [number, number], b: [number, number]): string {
  return `${a[0].toFixed(5)},${a[1].toFixed(5)}|${b[0].toFixed(5)},${b[1].toFixed(5)}`;
}

export function getCachedRoute(a: [number, number], b: [number, number]): WalkRoute | null {
  return readStore()[legKey(a, b)] ?? null;
}

// Koordinatı çıkış noktasında kalan ama suyla geçilen ayaklar
const FORCE_TRANSIT = new Set(['d2-morning-vaporetto>d2-san-marco-ducale']);

// Yaya rotası anlamlı mı? Varış vapur/tren/otobüsle ise veya uzaksa düz hat çizilir.
export function isWalkLeg(from: ItineraryStop, to: ItineraryStop): boolean {
  if (FORCE_TRANSIT.has(`${from.id}>${to.id}`)) return false;
  if (stopModes(to).some((m) => m !== 'gondola')) return false;
  const dLat = (to.coordinates[0] - from.coordinates[0]) * 111000;
  const dLng = (to.coordinates[1] - from.coordinates[1]) * 78000;
  return Math.hypot(dLat, dLng) < 4000;
}

export async function fetchWalkRoute(
  a: [number, number],
  b: [number, number]
): Promise<WalkRoute | null> {
  const cached = getCachedRoute(a, b);
  if (cached) return cached;
  if (!navigator.onLine) return null;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const url = `${ENDPOINT}/${a[1]},${a[0]};${b[1]},${b[0]}?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return null;
    const data = await res.json();
    const r = data?.routes?.[0];
    if (data?.code !== 'Ok' || !r?.geometry?.coordinates?.length) return null;
    const route: WalkRoute = {
      coords: r.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]),
      meters: Math.round(r.distance),
      seconds: Math.round(r.duration),
    };
    const store = readStore();
    store[legKey(a, b)] = route;
    writeStore(store);
    return route;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Tüm günlerin yürüyüş ayaklarını sırayla çek (nazik: tek tek).
export async function prefetchAllWalkRoutes(
  stops: ItineraryStop[],
  onProgress?: (done: number, total: number) => void
): Promise<{ ok: number; total: number }> {
  const legs: [ItineraryStop, ItineraryStop][] = [];
  for (const day of [1, 2, 3, 4]) {
    const ds = stops.filter((s) => s.day === day);
    for (let i = 0; i < ds.length - 1; i++) {
      if (isWalkLeg(ds[i], ds[i + 1])) legs.push([ds[i], ds[i + 1]]);
    }
  }
  let ok = 0;
  for (let i = 0; i < legs.length; i++) {
    const r = await fetchWalkRoute(legs[i][0].coordinates, legs[i][1].coordinates);
    if (r) ok++;
    onProgress?.(i + 1, legs.length);
  }
  return { ok, total: legs.length };
}
