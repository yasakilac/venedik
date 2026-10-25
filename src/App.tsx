import React, { useState, useEffect, useMemo } from 'react';
import {
  DAYS_INFO,
  INITIAL_STOPS,
} from './data/itineraryData';
import { ALT_DAYS_INFO, ALT_STOPS } from './data/altPlanData';
import { ItineraryStop } from './types';
import {
  getCompletedStops,
  toggleCompletedStop,
  getFavoriteStops,
  toggleFavoriteStop,
} from './utils/storage';
import { Header } from './components/Header';
import { StopCard } from './components/StopCard';
import { StopDetailModal } from './components/StopDetailModal';
import { InteractiveMap } from './components/InteractiveMap';
import { BudgetCalculator } from './components/BudgetCalculator';
import { PassTracker } from './components/PassTracker';
import { NotificationModal } from './components/NotificationModal';
import { WeatherWidget } from './components/WeatherWidget';
import { TransitHubView } from './components/TransitHubView';
import { IOSInstallModal } from './components/IOSInstallModal';
import { NotesView } from './components/NotesView';
import { LiveWeather, loadCachedWeather, refreshWeather, mergeWeather } from './utils/weather';
import {
  CloudRain,
  Sun,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  ListTodo,
  Wallet,
  Bell,
  Ship,
  Sparkles,
  WifiOff,
  StickyNote,
  Download,
} from 'lucide-react';

function PlanSwitcher({ plan, onSelect }: { plan: 'main' | 'alt'; onSelect: (p: 'main' | 'alt') => void }) {
  const options: { id: 'main' | 'alt'; label: string; hint: string }[] = [
    { id: 'main', label: 'Ana Plan', hint: '4 gün · Padova & Venedik' },
    { id: 'alt', label: 'Alternatif Plan', hint: '4 gün · Lido, adalar, Padova, havalimanı' },
  ];
  return (
    <div className="grid grid-cols-2 gap-2" role="tablist" aria-label="Plan seçimi">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={plan === o.id}
          onClick={() => onSelect(o.id)}
          className={`min-h-[44px] px-3 py-2 rounded-2xl text-left border transition-colors cursor-pointer ${
            plan === o.id
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-xs sm:text-sm font-bold">{o.label}</div>
          <div className={`text-[10px] truncate ${plan === o.id ? 'text-amber-100' : 'text-slate-500'}`}>{o.hint}</div>
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'map' | 'transit' | 'budget' | 'notes'>('itinerary');
  const [plan, setPlan] = useState<'main' | 'alt'>(() => {
    try {
      return localStorage.getItem('veneto_active_plan_v1') === 'alt' ? 'alt' : 'main';
    } catch {
      return 'main';
    }
  });
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persistent States
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Modals & Panels
  const [activeDetailStop, setActiveDetailStop] = useState<ItineraryStop | null>(null);
  const [focusStopId, setFocusStopId] = useState<string | null>(null);
  const [liveWeather, setLiveWeather] = useState<LiveWeather | null>(() => loadCachedWeather());
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);
  const [isIOSModalOpen, setIsIOSModalOpen] = useState<boolean>(false);
  const isStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches;
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  useEffect(() => {
    setCompletedIds(getCompletedStops());
    setFavoriteIds(getFavoriteStops());

    const updateWeather = () => {
      refreshWeather().then((w) => {
        if (w) setLiveWeather(w);
      });
    };
    updateWeather();
    const weatherTimer = setInterval(updateWeather, 20 * 60 * 1000);

    const handleOnline = () => {
      setIsOffline(false);
      updateWeather();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(weatherTimer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Tarayıcı/telefon "geri" hareketi detay ekranını kapatır (sayfa ve kaydırma konumu korunur)
  const openDetail = (stop: ItineraryStop) => {
    if (!window.history.state?.venetoDetail) {
      window.history.pushState({ venetoDetail: true }, '');
    }
    setActiveDetailStop(stop);
  };

  const closeDetail = () => {
    if (window.history.state?.venetoDetail) {
      window.history.back();
    } else {
      setActiveDetailStop(null);
    }
  };

  useEffect(() => {
    const onPop = () => setActiveDetailStop(null);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const showOnMap = (stop: ItineraryStop) => {
    setActiveDetailStop(null);
    if (window.history.state?.venetoDetail) window.history.back();
    setSelectedDayNumber(stop.day);
    setFocusStopId(stop.id);
    setActiveTab('map');
    window.scrollTo({ top: 0 });
  };

  const handleToggleComplete = (stopId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = toggleCompletedStop(stopId);
    setCompletedIds([...updated]);
  };

  const handleToggleFavorite = (stopId: string) => {
    const updated = toggleFavoriteStop(stopId);
    setFavoriteIds([...updated]);
  };

  const daysInfo = plan === 'alt' ? ALT_DAYS_INFO : DAYS_INFO;
  const allStops = plan === 'alt' ? ALT_STOPS : INITIAL_STOPS;

  const handleSelectPlan = (next: 'main' | 'alt') => {
    setPlan(next);
    setSelectedDayNumber(1);
    setSelectedCategoryFilter('all');
    setSearchQuery('');
    try {
      localStorage.setItem('veneto_active_plan_v1', next);
    } catch {
      // depolama yasak: sessizce geç
    }
  };

  const currentDayInfo = daysInfo.find((d) => d.dayNumber === selectedDayNumber) || daysInfo[0];

  // Filtered stops for the current day
  const dayStops = useMemo(() => {
    return allStops.filter((s) => s.day === selectedDayNumber);
  }, [allStops, selectedDayNumber]);

  const filteredDayStops = useMemo(() => {
    return dayStops.filter((stop) => {
      // Category / Status Filter
      if (selectedCategoryFilter === 'pending' && completedIds.includes(stop.id)) return false;
      if (selectedCategoryFilter === 'completed' && !completedIds.includes(stop.id)) return false;
      if (selectedCategoryFilter === 'favorites' && !favoriteIds.includes(stop.id)) return false;
      if (
        selectedCategoryFilter !== 'all' &&
        selectedCategoryFilter !== 'pending' &&
        selectedCategoryFilter !== 'completed' &&
        selectedCategoryFilter !== 'favorites'
      ) {
        if (stop.category !== selectedCategoryFilter) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = stop.title.toLowerCase().includes(q);
        const inSubtitle = stop.subtitle.toLowerCase().includes(q);
        const inLocation = stop.locationName.toLowerCase().includes(q);
        const inAddress = stop.address.toLowerCase().includes(q);
        return inTitle || inSubtitle || inLocation || inAddress;
      }

      return true;
    });
  }, [dayStops, selectedCategoryFilter, searchQuery, completedIds, favoriteIds]);

  // Overall Trip Completion Stats
  const totalStopsCount = allStops.length;
  const totalCompletedCount = allStops.filter((s) => completedIds.includes(s.id)).length;
  const dayCompletedCount = dayStops.filter((s) => completedIds.includes(s.id)).length;
  const dayProgressPercent = Math.round((dayCompletedCount / dayStops.length) * 100) || 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-nav-safe sm:pb-12 flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOffline={isOffline}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        hasUnreadAlerts={true}
        onOpenIOSInstall={() => setIsIOSModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-3 sm:px-6 pt-3 sm:pt-6">
        {/* ================= TAB 1: ITINERARY CHECKLIST ================= */}
        {activeTab === 'itinerary' && (
          <div className="space-y-4 sm:space-y-6">
            {/* iPhone'a indir (kurulu uygulamada gizlenir) */}
            {!isStandalone && (
              <button
                type="button"
                onClick={() => setIsIOSModalOpen(true)}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-3 shadow-sm cursor-pointer text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Download className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>
                    <span className="block text-sm font-bold">Telefona İndir</span>
                    <span className="block text-[11px] text-slate-300">İnternetsiz çalışır · iPhone X ve üzeri</span>
                  </span>
                </span>
                <span className="text-xs font-semibold text-amber-300 shrink-0">Kur →</span>
              </button>
            )}

            {/* Plan Switcher */}
            <PlanSwitcher plan={plan} onSelect={handleSelectPlan} />

            {/* Day Selector Navigation Carousel */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {daysInfo.map((day) => {
                const isSelected = day.dayNumber === selectedDayNumber;
                const completedInThisDay = allStops.filter(
                  (s) => s.day === day.dayNumber && completedIds.includes(s.id)
                ).length;
                const totalInThisDay = allStops.filter(
                  (s) => s.day === day.dayNumber
                ).length;

                return (
                  <button
                    key={day.dayNumber}
                    onClick={() => setSelectedDayNumber(day.dayNumber)}
                    className={`flex-1 min-w-[125px] sm:min-w-[160px] p-2.5 sm:p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-medium opacity-80 mb-0.5">
                      <span>{day.dateStr.split(' ')[0]} {day.dateStr.split(' ')[1]}</span>
                      <span className="tabular-nums">
                        {completedInThisDay}/{totalInThisDay}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold truncate">
                      {day.dayNumber}. Gün: {day.title.split(' ')[0]}
                    </div>
                    <div
                      className={`text-[10px] truncate mt-0.5 ${
                        isSelected ? 'text-amber-300' : 'text-slate-500'
                      }`}
                    >
                      {day.dayName} · {mergeWeather(day.weather, liveWeather).tempHigh}°
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Current Day Header & Weather Strategy Banner with ICONS */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm overflow-hidden relative space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{currentDayInfo.dateStr}</span>
                    <span>·</span>
                    <span>{dayStops.length} Durak</span>
                  </div>
                </div>

                {/* Day Progress Counter */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-2.5 sm:p-0 bg-slate-50 sm:bg-transparent rounded-2xl border sm:border-0 border-slate-100 shrink-0">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 font-medium block">
                      Günün İlerlemesi
                    </span>
                    <span className="text-base sm:text-xl font-bold text-slate-900 font-mono tabular-nums">
                      {dayCompletedCount} / {dayStops.length}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-600 sm:mt-0.5">
                    %{dayProgressPercent} Tamamlandı
                  </div>
                </div>
              </div>

              {/* Dedicated Weather Card with Icons & Hourly Scroller */}
              <WeatherWidget
                weather={mergeWeather(currentDayInfo.weather, liveWeather)}
                updatedAt={liveWeather?.days?.[currentDayInfo.weather.dayNumber] ? liveWeather.updatedAt : null}
                isOffline={isOffline}
              />

              {/* Day 1 Pass Start or Day 3 20:45 Alert Strip */}
              {plan === 'main' && selectedDayNumber === 1 && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 flex items-center justify-between gap-2">
                  <span className="font-medium">
                    🎟️ <strong>Saat 21:00 Hatırlatması:</strong> Venedik Santa Lucia iskelesinde 48h Pass’i ilk kez okutarak başlatın!
                  </span>
                  <button
                    onClick={() => setActiveTab('budget')}
                    className="text-amber-800 hover:text-amber-950 font-bold underline shrink-0 cursor-pointer text-[11px]"
                  >
                    Detaylar →
                  </button>
                </div>
              )}

              {plan === 'main' && selectedDayNumber === 3 && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center justify-between gap-2">
                  <span className="font-medium">
                    ⚠️ <strong>KRİTİK ALARM (20:45):</strong> 48h Pass 21:00’de bitiyor! Piazzale Roma’dan Mestre otobüsüne 21:00 öncesi binin.
                  </span>
                  <button
                    onClick={() => setIsNotificationModalOpen(true)}
                    className="text-rose-800 hover:text-rose-950 font-bold underline shrink-0 cursor-pointer text-[11px]"
                  >
                    Alarmı Aç →
                  </button>
                </div>
              )}
            </div>

            {/* Filter Chips & Search Bar */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Mekan veya lezzet ara (örn: Pedrocchi, Burano, Tonolo)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm text-slate-800 placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Temizle
                    </button>
                  )}
                </div>

                {/* Quick Offline Transit Schedule Button */}
                <button
                  type="button"
                  onClick={() => setActiveTab('transit')}
                  className="px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-900 font-medium text-xs rounded-xl border border-sky-200 flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
                >
                  <Ship className="w-3.5 h-3.5 text-sky-700" />
                  <span>Sefer Saatleri (Offline)</span>
                </button>
              </div>
            </div>

            {/* Checklist Cards List */}
            <div className="space-y-3">
              {filteredDayStops.length > 0 ? (
                filteredDayStops.map((stop) => (
                  <StopCard
                    key={stop.id}
                    stop={stop}
                    isCompleted={completedIds.includes(stop.id)}
                    onToggleComplete={(e) => handleToggleComplete(stop.id, e)}
                    onClickCard={() => openDetail(stop)}
                    onShowOnMap={() => showOnMap(stop)}
                  />
                ))
              ) : (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                  <p className="text-sm font-semibold text-slate-700">
                    Arama kriterinize uygun durak bulunamadı.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategoryFilter('all');
                      setSearchQuery('');
                    }}
                    className="mt-2 px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Filtreleri Sıfırla
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: MAP VIEW (DOWNLOADABLE OPENSTREETMAP LEAFLET) ================= */}
        {activeTab === 'map' && (
          <InteractiveMap
            stops={allStops}
            selectedDay={selectedDayNumber}
            onSelectDay={setSelectedDayNumber}
            onOpenStopDetail={(stop) => openDetail(stop)}
            completedStopIds={completedIds}
            focusStopId={focusStopId}
            onFocusHandled={() => setFocusStopId(null)}
          />
        )}

        {/* ================= TAB 3: OFFLINE TRANSIT HUB ================= */}
        {activeTab === 'transit' && <TransitHubView />}

        {activeTab === 'notes' && <NotesView />}

        {/* ================= TAB 4: BUDGET & PASS TRACKER ================= */}
        {activeTab === 'budget' && (
          <div className="space-y-5">
            {/* 48-Hour ACTV Pass Tracker Widget */}
            <PassTracker />

            {/* Comprehensive Transportation Math Table */}
            <BudgetCalculator />
          </div>
        )}
      </main>

      {/* Detail Popup Modal (Slide-up mobile drawer) */}
      <StopDetailModal
        stop={activeDetailStop}
        onClose={closeDetail}
        isCompleted={activeDetailStop ? completedIds.includes(activeDetailStop.id) : false}
        onToggleComplete={() => activeDetailStop && handleToggleComplete(activeDetailStop.id)}
        isFavorite={activeDetailStop ? favoriteIds.includes(activeDetailStop.id) : false}
        onToggleFavorite={() => activeDetailStop && handleToggleFavorite(activeDetailStop.id)}
        onSelectStop={(stop) => setActiveDetailStop(stop)}
        allStopsInDay={dayStops}
        onShowOnMap={showOnMap}
      />

      {/* Notification Settings Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      {/* iOS iPhone Installation Modal */}
      <IOSInstallModal
        isOpen={isIOSModalOpen}
        onClose={() => setIsIOSModalOpen(false)}
        onTriggerMapDownload={() => {
          setActiveTab('map');
        }}
      />

      {/* Mobile Fixed Bottom Navigation Bar (Pattern 1 - 15% sticky cap) */}
      <div className="pb-safe sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200">
        <div className="grid grid-cols-5 items-center h-16 px-1">
          <button
            type="button"
            onClick={() => setActiveTab('itinerary')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              activeTab === 'itinerary' ? 'text-amber-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <ListTodo className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Liste</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              activeTab === 'map' ? 'text-amber-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Harita</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('transit')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              activeTab === 'transit' ? 'text-amber-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <Ship className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Seferler</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('budget')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              activeTab === 'budget' ? 'text-amber-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Bütçe</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              activeTab === 'notes' ? 'text-amber-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <StickyNote className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Notlar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
