// Tile Cache Manager using browser Cache Storage API
// This allows real OpenStreetMap tiles to be saved to device storage and loaded with ZERO internet connection.

import { INITIAL_STOPS } from '../data/itineraryData';

const CACHE_NAME = 'veneto-osm-tiles-v1';
const CACHE_STATUS_KEY = 'veneto_tiles_cache_status';

export interface CacheProgress {
  total: number;
  completed: number;
  percent: number;
  statusText: string;
}

// Key areas to cache for the trip:
// 1. Venice Center: [45.425 to 45.450 N, 12.310 to 12.365 E]
// 2. Padova Center: [45.395 to 45.420 N, 11.865 to 11.895 E]
// 3. Murano & Burano: [45.450 to 45.500 N, 12.345 to 12.430 E]
// 4. Mestre: [45.475 to 45.495 N, 12.225 to 12.255 E]

function long2tile(lon: number, zoom: number): number {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}

function lat2tile(lat: number, zoom: number): number {
  return Math.floor(
    ((1 -
      Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) /
        Math.PI) /
      2) *
      Math.pow(2, zoom)
  );
}

export function isTilesCacheReady(): boolean {
  try {
    return localStorage.getItem(CACHE_STATUS_KEY) === 'ready';
  } catch {
    return false;
  }
}

export function getCachedTileCount(): number {
  try {
    const raw = localStorage.getItem('veneto_tiles_count');
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

// Rota boyunca tüm duraklar + Venedik lagünü + Lido + Mestre koridoru için karo adresleri üretir.
export function generateTripTileUrls(): string[] {
  const keys: Set<string> = new Set();
  const add = (z: number, x: number, y: number) => keys.add(`${z}/${x}/${y}`);

  // 1) Her durağın çevresi: yakına yüksek, uzağa düşük çözünürlük
  const rings: [number, number][] = [
    [17, 1],
    [16, 2],
    [15, 2],
    [14, 1],
    [13, 1],
    [12, 1],
  ];
  for (const stop of INITIAL_STOPS) {
    const [lat, lng] = stop.coordinates;
    for (const [z, r] of rings) {
      const cx = long2tile(lng, z);
      const cy = lat2tile(lat, z);
      for (let dx = -r; dx <= r; dx++) for (let dy = -r; dy <= r; dy++) add(z, cx + dx, cy + dy);
    }
  }

  // 2) Bölgesel kutular (genel gezinti için)
  const regions = [
    { minLat: 45.425, maxLat: 45.450, minLon: 12.310, maxLon: 12.365, zooms: [13, 14, 15, 16] }, // Venedik adası
    { minLat: 45.392, maxLat: 45.420, minLon: 11.865, maxLon: 11.893, zooms: [13, 14, 15, 16] }, // Padova merkezi
    { minLat: 45.400, maxLat: 45.432, minLon: 12.340, maxLon: 12.405, zooms: [13, 14, 15] }, // Lido
    { minLat: 45.450, maxLat: 45.500, minLon: 12.345, maxLon: 12.425, zooms: [13, 14] }, // Murano-Burano-Torcello
    { minLat: 45.470, maxLat: 45.495, minLon: 12.225, maxLon: 12.325, zooms: [13, 14] }, // Mestre-Venedik koridoru
    { minLat: 45.300, maxLat: 45.600, minLon: 11.800, maxLon: 12.550, zooms: [10, 11] }, // Veneto genel
  ];
  for (const reg of regions) {
    for (const z of reg.zooms) {
      const minX = long2tile(reg.minLon, z);
      const maxX = long2tile(reg.maxLon, z);
      const minY = lat2tile(reg.maxLat, z);
      const maxY = lat2tile(reg.minLat, z);
      for (let x = minX; x <= maxX; x++) for (let y = minY; y <= maxY; y++) add(z, x, y);
    }
  }

  return Array.from(keys).map((k) => `https://tile.openstreetmap.org/${k}.png`);
}

export async function downloadAllTripTiles(
  onProgress: (p: CacheProgress) => void
): Promise<{ success: boolean; totalCached: number }> {
  const tileUrls = generateTripTileUrls();
  const total = tileUrls.length;
  let completed = 0;

  if (!('caches' in window)) {
    throw new Error('Tarayıcınız Cache Storage API desteklemiyor.');
  }

  const cache = await caches.open(CACHE_NAME);

  // Batch download in chunks to prevent network choking
  const CHUNK_SIZE = 6;
  for (let i = 0; i < tileUrls.length; i += CHUNK_SIZE) {
    const chunk = tileUrls.slice(i, i + CHUNK_SIZE);

    await Promise.allSettled(
      chunk.map(async (url) => {
        try {
          const match = await cache.match(url);
          if (match) return;
          const response = await fetch(url, { mode: 'cors' });
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch (e) {
          // Continue on minor error
        } finally {
          completed++;
        }
      })
    );

    const percent = Math.min(100, Math.round((completed / total) * 100));
    onProgress({
      total,
      completed,
      percent,
      statusText: `${completed} / ${total} sokak karosu indirildi (%${percent})`,
    });
  }

  localStorage.setItem(CACHE_STATUS_KEY, 'ready');
  localStorage.setItem('veneto_tiles_count', completed.toString());
  localStorage.setItem('veneto_tiles_last_update', new Date().toISOString());

  return { success: true, totalCached: completed };
}

// Fetch single tile from CacheStorage or network with automatic caching
export async function fetchTileWithOfflineCache(url: string): Promise<string> {
  if (!('caches' in window)) {
    return url;
  }

  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(url);
    if (cachedResponse) {
      const blob = await cachedResponse.blob();
      return URL.createObjectURL(blob);
    }

    // If online, fetch and save to cache
    if (navigator.onLine) {
      const response = await fetch(url, { mode: 'cors' });
      if (response.ok) {
        cache.put(url, response.clone());
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
    }
  } catch (e) {
    // Return original url as fallback
  }

  return url;
}
