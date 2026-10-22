import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import { ItineraryStop } from '../types';
import {
  downloadAllTripTiles,
  isTilesCacheReady,
  getCachedTileCount,
  CacheProgress,
} from '../utils/tileCache';
import { placeUrl } from '../utils/maps';
import { getCachedRoute, fetchWalkRoute, isWalkLeg, prefetchAllWalkRoutes } from '../utils/walkRoutes';
import {
  MapPin,
  Navigation,
  Compass,
  Layers,
  DownloadCloud,
  CheckCircle2,
  Crosshair,
  RotateCcw,
  AlertTriangle,
  ChevronRight,
  Clock,
  Sparkles,
  Wifi,
  WifiOff,
} from 'lucide-react';

interface InteractiveMapProps {
  stops: ItineraryStop[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
  onOpenStopDetail: (stop: ItineraryStop) => void;
  completedStopIds: string[];
  focusStopId?: string | null;
  onFocusHandled?: () => void;
}

const REGION_BOUNDS = {
  padova: { center: [45.4064, 11.8768] as [number, number], zoom: 15, label: 'Padova' },
  venice: { center: [45.4371, 12.3326] as [number, number], zoom: 15, label: 'Venedik Merkez' },
  islands: { center: [45.4854, 12.4167] as [number, number], zoom: 14, label: 'Burano & Murano' },
  all: { center: [45.4385, 12.1800] as [number, number], zoom: 11, label: 'Tüm Rota' },
};

const DAY_COLORS: Record<number, string> = {
  1: '#d97706', // amber-600
  2: '#0284c7', // sky-600
  3: '#0d9488', // teal-600
  4: '#78716c', // stone-500
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  stops,
  selectedDay,
  onSelectDay,
  onOpenStopDetail,
  completedStopIds,
  focusStopId,
  onFocusHandled,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const [routeVersion, setRouteVersion] = useState<number>(0);
  const lastFitKeyRef = useRef<string>('');
  const userLocationMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const headingRef = useRef<number | null>(null);
  const compassActiveRef = useRef<boolean>(false);
  const firstFixRef = useRef<boolean>(true);
  const [isTracking, setIsTracking] = useState<boolean>(false);

  // Offline tile cache state
  const [isCached, setIsCached] = useState<boolean>(isTilesCacheReady());
  const [cachedCount, setCachedCount] = useState<number>(getCachedTileCount());
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<CacheProgress | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [selectedPopupStop, setSelectedPopupStop] = useState<ItineraryStop | null>(null);
  const [tileSource, setTileSource] = useState<'osm' | 'voyager'>('osm');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const filteredStops = useMemo(() => {
    return selectedDay === 0 ? stops : stops.filter((s) => s.day === selectedDay);
  }, [stops, selectedDay]);

  // Initialize Leaflet Map with Offline Cache Interceptor
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [45.4371, 12.3326],
        zoom: 13,
        minZoom: 10,
        zoomControl: false,
        attributionControl: true,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Custom Offline-First TileLayer
      // Subclass createTile to check CacheStorage first
      const OfflineCachedTileLayer = L.TileLayer.extend({
        createTile(coords: { x: number; y: number; z: number }, done: (error: Error | null, tile: HTMLElement) => void) {
          const tile = document.createElement('img');

          L.DomEvent.on(tile, 'load', L.Util.bind((this as any)._tileOnLoad, this, done, tile));
          L.DomEvent.on(tile, 'error', L.Util.bind((this as any)._tileOnError, this, done, tile));

          if ((this as any).options.crossOrigin || (this as any).options.crossOrigin === '') {
            tile.crossOrigin = (this as any).options.crossOrigin === true ? '' : (this as any).options.crossOrigin;
          }

          tile.alt = '';
          tile.setAttribute('role', 'presentation');

          const url = (this as any).getTileUrl(coords);

          // Try loading from browser cache first for offline capability
          if ('caches' in window) {
            caches.open('veneto-osm-tiles-v1').then((cache) => {
              cache.match(url).then((response) => {
                if (response) {
                  response.blob().then((blob) => {
                    tile.src = URL.createObjectURL(blob);
                  });
                } else {
                  // Not in cache, load from network and cache it
                  tile.src = url;
                  if (navigator.onLine) {
                    fetch(url, { mode: 'cors' })
                      .then((netRes) => {
                        if (netRes.ok) cache.put(url, netRes);
                      })
                      .catch(() => {});
                  }
                }
              }).catch(() => {
                tile.src = url;
              });
            }).catch(() => {
              tile.src = url;
            });
          } else {
            tile.src = url;
          }

          return tile;
        },
      });

      const currentTileUrl =
        tileSource === 'osm'
          ? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
          : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const tileLayer = new (OfflineCachedTileLayer as any)(currentTileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        maxNativeZoom: 17,
        minZoom: 10,
        crossOrigin: true,
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;

      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup
    };
  }, []);

  // Update Tile Layer if source changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const url =
      tileSource === 'osm'
        ? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    tileLayerRef.current.setUrl(url);
  }, [tileSource]);

  // Update Markers & Polylines when stops or day change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    const bounds = L.latLngBounds([]);
    const polylineCoords: [number, number][] = [];

    filteredStops.forEach((stop, index) => {
      const isCompleted = completedStopIds.includes(stop.id);
      const color = DAY_COLORS[stop.day] || '#f59e0b';
      polylineCoords.push(stop.coordinates);

      const customHtml = `
        <div style="
          background-color: ${isCompleted ? '#10b981' : color};
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 13px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          border: 2.5px solid #ffffff;
          cursor: pointer;
        ">
          ${isCompleted ? '✓' : index + 1}
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-map-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker(stop.coordinates, { icon: customIcon });

      marker.on('click', () => {
        setSelectedPopupStop(stop);
      });

      markersGroup.addLayer(marker);
      bounds.extend(stop.coordinates);
    });

    // Rota çizgileri: yürüyüş ayakları sokak sokak (indirilmişse), vapur/tren/otobüs ayakları kesik hat
    if (filteredStops.length > 1 && selectedDay !== 0) {
      const routeColor = DAY_COLORS[selectedDay] || '#f59e0b';
      const layer = L.layerGroup().addTo(map);
      routeLayerRef.current = layer;

      for (let i = 0; i < filteredStops.length - 1; i++) {
        const from = filteredStops[i];
        const to = filteredStops[i + 1];
        const straight: [number, number][] = [from.coordinates, to.coordinates];

        if (isWalkLeg(from, to)) {
          const cached = getCachedRoute(from.coordinates, to.coordinates);
          if (cached) {
            L.polyline(cached.coords, { color: routeColor, weight: 5, opacity: 0.9, lineCap: 'round', lineJoin: 'round' })
              .bindTooltip(`Yürüyüş ≈ ${Math.max(1, Math.round(cached.seconds / 60))} dk · ${cached.meters} m`, { sticky: true })
              .addTo(layer);
          } else {
            L.polyline(straight, { color: '#64748b', weight: 3, opacity: 0.7, dashArray: '4, 8' })
              .bindTooltip('Yürüyüş rotası indirilmedi (düz hat)', { sticky: true })
              .addTo(layer);
            // Çevrimiçiyken arka planda rotayı çek ve yeniden çiz
            fetchWalkRoute(from.coordinates, to.coordinates).then((r) => {
              if (r) setRouteVersion((v) => v + 1);
            });
          }
        } else {
          L.polyline(straight, { color: '#0284c7', weight: 3, opacity: 0.8, dashArray: '10, 10' })
            .bindTooltip('Vapur / tren / otobüs ayağı (kuş uçuşu çizgi)', { sticky: true })
            .addTo(layer);
        }
      }
    }

    // Yalnızca gün/durak listesi değişince sığdır (rota yüklendikçe görünümü bozma)
    const fitKey = `${selectedDay}:${filteredStops.map((st) => st.id).join(',')}`;
    if (filteredStops.length > 0 && bounds.isValid() && lastFitKeyRef.current !== fitKey) {
      lastFitKeyRef.current = fitKey;
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [filteredStops, selectedDay, completedStopIds, routeVersion]);

  // Karttaki "Çevrimdışı harita" bağlantısından gelen odaklanma
  useEffect(() => {
    if (!focusStopId || !mapInstanceRef.current) return;
    const stop = stops.find((st) => st.id === focusStopId);
    if (stop) {
      setSelectedPopupStop(stop);
      // Gün sığdırma (fitBounds) bittikten sonra durağa odaklan
      const map = mapInstanceRef.current;
      setTimeout(() => {
        map.invalidateSize();
        map.setView(stop.coordinates, 17, { animate: false });
      }, 450);
    }
    onFocusHandled?.();
  }, [focusStopId, stops, onFocusHandled]);

  // GPS Locate User Feature (Works via Satellite even with no data!)
  // --- Canlı konum + yön oku ---
  const handleLocateMe = async () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Takip açıksa kapat
    if (isTracking) {
      stopTracking();
      return;
    }

    if (!('geolocation' in navigator)) {
      setStatusMessage('Cihazınız konum özelliğini desteklemiyor.');
      return;
    }

    // iOS: pusula izni mutlaka kullanıcı dokunuşu içinde istenmeli
    const DOE = (window as any).DeviceOrientationEvent;
    if (DOE && typeof DOE.requestPermission === 'function') {
      try {
        const res = await DOE.requestPermission();
        if (res !== 'granted') {
          setStatusMessage('Pusula izni verilmedi: konum görünür ama yön oku çalışmaz.');
        }
      } catch {
        // izin penceresi açılamadı; konumla devam et
      }
    }

    setStatusMessage('GPS uydularından konum alınıyor...');
    setIsTracking(true);
    firstFixRef.current = true;

    window.addEventListener('deviceorientationabsolute', onOrientation as EventListener, true);
    window.addEventListener('deviceorientation', onOrientation as EventListener, true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy, heading } = pos.coords;
        const latlng: [number, number] = [latitude, longitude];

        // Pusula yoksa hareket halindeyken GPS yönünü kullan
        if (!compassActiveRef.current && heading != null && !Number.isNaN(heading)) {
          applyHeading(heading);
        }

        if (!userLocationMarkerRef.current) {
          const icon = L.divIcon({
            className: 'user-heading-marker',
            html:
              '<div class="user-heading-wrap">' +
              '<svg class="user-heading-cone" viewBox="0 0 64 64" width="64" height="64">' +
              '<defs><linearGradient id="hcone" x1="0" y1="1" x2="0" y2="0">' +
              '<stop offset="0" stop-color="#2563eb" stop-opacity="0.55"/>' +
              '<stop offset="1" stop-color="#2563eb" stop-opacity="0"/></linearGradient></defs>' +
              '<path d="M32 32 L14 2 A34 34 0 0 1 50 2 Z" fill="url(#hcone)"/>' +
              '<path d="M32 6 L39 20 L32 17 L25 20 Z" fill="#1d4ed8" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>' +
              '</svg>' +
              '<div class="user-heading-dot"></div></div>',
            iconSize: [64, 64],
            iconAnchor: [32, 32],
          });
          userLocationMarkerRef.current = L.marker(latlng, {
            icon,
            interactive: false,
            zIndexOffset: 2000,
          }).addTo(map);
          accuracyCircleRef.current = L.circle(latlng, {
            radius: accuracy,
            color: '#2563eb',
            weight: 1,
            fillColor: '#3b82f6',
            fillOpacity: 0.12,
            interactive: false,
          }).addTo(map);
          applyHeading(headingRef.current ?? 0, true);
        } else {
          userLocationMarkerRef.current.setLatLng(latlng);
          accuracyCircleRef.current?.setLatLng(latlng).setRadius(accuracy);
        }

        if (firstFixRef.current) {
          firstFixRef.current = false;
          map.flyTo(latlng, 16, { duration: 1.2 });
          setStatusMessage(`Konumunuz bulundu (± ${Math.round(accuracy)} m). Ok baktığınız yönü gösterir.`);
          setTimeout(() => setStatusMessage(''), 5000);
        }
      },
      (err) => {
        console.warn('Geolocation error', err);
        setStatusMessage('GPS konumu alınamadı. Safari/Ayarlar’dan konum iznini kontrol edin.');
        setTimeout(() => setStatusMessage(''), 5000);
        stopTracking();
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 2000 }
    );
  };

  const applyHeading = useCallback((deg: number, force = false) => {
    // Basit alçak geçiren filtre (360° geçişini dikkate alarak)
    const prev = headingRef.current;
    let next = ((deg % 360) + 360) % 360;
    if (prev != null && !force) {
      const diff = ((next - prev + 540) % 360) - 180;
      if (Math.abs(diff) < 2) return;
      next = (prev + diff * 0.35 + 360) % 360;
    }
    headingRef.current = next;
    const el = userLocationMarkerRef.current?.getElement()?.querySelector<HTMLElement>('.user-heading-cone');
    if (el) el.style.transform = `rotate(${next}deg)`;
  }, []);

  const onOrientation = useCallback((e: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
    let heading: number | null = null;
    if (typeof e.webkitCompassHeading === 'number') {
      heading = e.webkitCompassHeading; // iOS: manyetik kuzeye göre derece
    } else if (e.absolute && e.alpha != null) {
      heading = 360 - e.alpha; // Android: deviceorientationabsolute
    }
    if (heading == null || Number.isNaN(heading)) return;
    const first = !compassActiveRef.current;
    compassActiveRef.current = true;
    applyHeading(heading, first);
  }, [applyHeading]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    window.removeEventListener('deviceorientationabsolute', onOrientation as EventListener, true);
    window.removeEventListener('deviceorientation', onOrientation as EventListener, true);
    const map = mapInstanceRef.current;
    if (map && userLocationMarkerRef.current) map.removeLayer(userLocationMarkerRef.current);
    if (map && accuracyCircleRef.current) map.removeLayer(accuracyCircleRef.current);
    userLocationMarkerRef.current = null;
    accuracyCircleRef.current = null;
    compassActiveRef.current = false;
    headingRef.current = null;
    setIsTracking(false);
  }, [onOrientation]);

  // Ekran değişince konum takibini bırak (pil)
  useEffect(() => () => stopTracking(), [stopTracking]);

  // Download all OpenStreetMap tiles for offline use
  const handleDownloadOfflineTiles = async () => {
    setIsDownloading(true);
    setDownloadProgress({ total: 0, completed: 0, percent: 0, statusText: 'İndirme başlıyor...' });

    try {
      const result = await downloadAllTripTiles((p) => {
        setDownloadProgress({ ...p });
      });

      setIsCached(true);
      setCachedCount(result.totalCached);

      setDownloadProgress({ total: 0, completed: 0, percent: 100, statusText: 'Yürüyüş rotaları indiriliyor...' });
      const routes = await prefetchAllWalkRoutes(stops, (done, total) =>
        setDownloadProgress({ total, completed: done, percent: Math.round((done / total) * 100), statusText: `Yürüyüş rotası ${done} / ${total}` })
      );
      setRouteVersion((v) => v + 1);
      setStatusMessage(
        `Harita indirildi (${result.totalCached} karo). Yürüyüş rotaları: ${routes.ok}/${routes.total}` +
          (routes.ok < routes.total ? ' — eksikler düz kesik çizgi olarak görünür.' : '.')
      );
    } catch (e: any) {
      console.error('Tile download error', e);
      setStatusMessage('İndirme sırasında bir sorun oluştu. Lütfen bağlantınızı kontrol edin.');
    } finally {
      setIsDownloading(false);
      setTimeout(() => setStatusMessage(''), 5000);
    }
  };

  const handleFlyTo = (region: keyof typeof REGION_BOUNDS) => {
    if (!mapInstanceRef.current) return;
    const target = REGION_BOUNDS[region];
    mapInstanceRef.current.flyTo(target.center, target.zoom, { duration: 1.2 });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] sm:h-[calc(100vh-6rem)] w-full max-w-5xl mx-auto px-2 sm:px-4 py-2 select-none">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm mb-2 space-y-2.5">
        {/* Offline Download Status & Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isCached ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Çevrimdışı Harita Hazır ({cachedCount} karo kayıtlı)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Harita henüz çevrimdışı indirilmedi</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isDownloading}
              onClick={handleDownloadOfflineTiles}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                isDownloading
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <DownloadCloud className="w-3.5 h-3.5 text-amber-400" />
              <span>{isDownloading ? 'İndiriliyor...' : 'Haritayı Çevrimdışı İndir'}</span>
            </button>
          </div>
        </div>

        {/* Download Progress Bar Modal/Bar */}
        {isDownloading && downloadProgress && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Venedik & Padova Sokakları Hafızaya Kaydediliyor...</span>
              <span className="font-mono text-amber-700">%{downloadProgress.percent}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-600 h-full transition-all duration-200"
                style={{ width: `${downloadProgress.percent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 font-mono text-right">
              {downloadProgress.statusText}
            </div>
          </div>
        )}

        {statusMessage && !isDownloading && (
          <div className="p-2.5 bg-sky-50 border border-sky-200 text-sky-900 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Day Filters & Quick City Jumps */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          {/* Day pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs">
            <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Gün:
            </span>
            <button
              onClick={() => onSelectDay(0)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
                selectedDay === 0
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tümü ({stops.length})
            </button>
            {Array.from(new Set(stops.map((st) => st.day))).sort().map((d) => (
              <button
                key={d}
                onClick={() => onSelectDay(d)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  selectedDay === d
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {d}. Gün
              </button>
            ))}
          </div>

          {/* Quick city jumps */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-medium hidden sm:inline">Odak:</span>
            <button
              onClick={() => handleFlyTo('padova')}
              className="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium text-[11px] cursor-pointer"
            >
              Padova
            </button>
            <button
              onClick={() => handleFlyTo('venice')}
              className="px-2 py-0.5 rounded bg-sky-50 hover:bg-sky-100 text-sky-900 font-medium text-[11px] cursor-pointer"
            >
              Venedik
            </button>
            <button
              onClick={() => handleFlyTo('islands')}
              className="px-2 py-0.5 rounded bg-teal-50 hover:bg-teal-100 text-teal-900 font-medium text-[11px] cursor-pointer"
            >
              Burano
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative flex-1 rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* GPS Locate Me Button (Pulsing blue satellite tracking) */}
        <div className="absolute top-3 right-3 z-[1000]">
          <button
            type="button"
            onClick={handleLocateMe}
            title={isTracking ? 'Konum takibini durdur' : 'Konumumu ve yönümü göster (internet gerekmez)'}
            aria-label={isTracking ? 'Konum takibini durdur' : 'Konumumu ve yönümü göster'}
            aria-pressed={isTracking}
            className={`w-12 h-12 rounded-2xl shadow-lg border flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
              isTracking ? 'bg-blue-600 border-blue-700' : 'bg-white border-slate-200'
            }`}
          >
            <Crosshair className={`w-6 h-6 ${isTracking ? 'text-white' : 'text-blue-600'}`} />
          </button>
        </div>

        {/* Selected Stop Details Floating Mobile Card */}
        {selectedPopupStop && (
          <div className="absolute bottom-3 left-3 right-14 sm:right-auto sm:w-88 z-[1000] bg-white rounded-2xl p-4 border border-slate-300 shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                {selectedPopupStop.day}. Gün · {selectedPopupStop.timeRange}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPopupStop(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-0.5"
              >
                ✕
              </button>
            </div>

            <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {selectedPopupStop.title}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
              {selectedPopupStop.address}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenStopDetail(selectedPopupStop)}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
              >
                <span>Detaylı Rehber</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <a
                href={placeUrl(selectedPopupStop)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Haritalar"
                title="Google Haritalar"
                className="w-11 h-11 shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center shadow-sm"
              >
                <MapPin className="w-5 h-5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
