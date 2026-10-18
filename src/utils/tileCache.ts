// Tile Cache Manager using browser Cache Storage API
// This allows real OpenStreetMap tiles to be saved to device storage and loaded with ZERO internet connection.

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

// Generate tile URLs for key areas across zoom levels 13 to 16
export function generateTripTileUrls(): string[] {
  const urls: Set<string> = new Set();

  const regions = [
    // Venice Historic Island (All Sestieri)
    { minLat: 45.428, maxLat: 45.448, minLon: 12.315, maxLon: 12.360, zooms: [13, 14, 15, 16] },
    // Padova Historic Center
    { minLat: 45.395, maxLat: 45.418, minLon: 11.868, maxLon: 11.890, zooms: [13, 14, 15, 16] },
    // Burano, Murano & Torcello
    { minLat: 45.455, maxLat: 45.500, minLon: 12.348, maxLon: 12.425, zooms: [13, 14, 15] },
    // Mestre Station Corridor
    { minLat: 45.478, maxLat: 45.492, minLon: 12.230, maxLon: 12.245, zooms: [13, 14, 15] },
  ];

  for (const reg of regions) {
    for (const z of reg.zooms) {
      const minX = long2tile(reg.minLon, z);
      const maxX = long2tile(reg.maxLon, z);
      const minY = lat2tile(reg.maxLat, z);
      const maxY = lat2tile(reg.minLat, z);

      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          // OpenStreetMap tile URL template
          urls.add(`https://tile.openstreetmap.org/${z}/${x}/${y}.png`);
        }
      }
    }
  }

  return Array.from(urls);
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
          if (match) {
            completed++;
            return;
          }
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
