import React, { useState, useEffect, useMemo } from 'react';
import {
  DAYS_INFO,
  INITIAL_STOPS,
} from './data/itineraryData';
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
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'map' | 'transit' | 'budget'>('itinerary');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persistent States
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Modals & Panels
  const [activeDetailStop, setActiveDetailStop] = useState<ItineraryStop | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);
  const [isIOSModalOpen, setIsIOSModalOpen] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  useEffect(() => {
    setCompletedIds(getCompletedStops());
    setFavoriteIds(getFavoriteStops());

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleToggleComplete = (stopId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = toggleCompletedStop(stopId);
    setCompletedIds([...updated]);
  };

  const handleToggleFavorite = (stopId: string) => {
    const updated = toggleFavoriteStop(stopId);
    setFavoriteIds([...updated]);
  };

  const currentDayInfo = DAYS_INFO.find((d) => d.dayNumber === selectedDayNumber) || DAYS_INFO[0];

  // Filtered stops for the current day
  const dayStops = useMemo(() => {
    return INITIAL_STOPS.filter((s) => s.day === selectedDayNumber);
  }, [selectedDayNumber]);

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
  const totalStopsCount = INITIAL_STOPS.length;
  const totalCompletedCount = INITIAL_STOPS.filter((s) => completedIds.includes(s.id)).length;
  const dayCompletedCount = dayStops.filter((s) => completedIds.includes(s.id)).length;
  const dayProgressPercent = Math.round((dayCompletedCount / dayStops.length) * 100) || 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 sm:pb-12 flex flex-col font-sans">
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
            {/* Day Selector Navigation Carousel */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {DAYS_INFO.map((day) => {
                const isSelected = day.dayNumber === selectedDayNumber;
                const completedInThisDay = INITIAL_STOPS.filter(
                  (s) => s.day === day.dayNumber && completedIds.includes(s.id)
                ).length;
                const totalInThisDay = INITIAL_STOPS.filter(
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
                      {day.dayName} · {day.weather.tempHigh}°
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

                  <h1 className="text-lg sm:text-2xl font-bold font-serif-heading text-slate-900 tracking-tight leading-tight">
                    {currentDayInfo.dayNumber}. Gün: {currentDayInfo.title}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {currentDayInfo.subtitle}
                  </p>
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
              <WeatherWidget weather={currentDayInfo.weather} />

              {/* Day 1 Pass Start or Day 3 20:45 Alert Strip */}
              {selectedDayNumber === 1 && (
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

              {selectedDayNumber === 3 && (
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

              {/* Segmented Filter Controls */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
                {[
                  { id: 'all', label: 'Tümü' },
                  { id: 'pending', label: 'Yapılacaklar' },
                  { id: 'completed', label: 'Ziyaret Edilenler' },
                  { id: 'transport', label: '🚢 Ulaşım' },
                  { id: 'coffee', label: '☕ Kahve & Latte' },
                  { id: 'food', label: '🍽️ Yemek & Cicchetti' },
                  { id: 'photo', label: '📷 Fotoğraf Noktaları' },
                  { id: 'sight', label: '🏛️ Gezi & Doğa' },
                  { id: 'favorites', label: '❤️ Favoriler' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedCategoryFilter(item.id)}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategoryFilter === item.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
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
                    onClickCard={() => setActiveDetailStop(stop)}
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
            stops={INITIAL_STOPS}
            selectedDay={selectedDayNumber}
            onSelectDay={setSelectedDayNumber}
            onOpenStopDetail={(stop) => setActiveDetailStop(stop)}
            completedStopIds={completedIds}
          />
        )}

        {/* ================= TAB 3: OFFLINE TRANSIT HUB ================= */}
        {activeTab === 'transit' && <TransitHubView />}

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
        onClose={() => setActiveDetailStop(null)}
        isCompleted={activeDetailStop ? completedIds.includes(activeDetailStop.id) : false}
        onToggleComplete={() => activeDetailStop && handleToggleComplete(activeDetailStop.id)}
        isFavorite={activeDetailStop ? favoriteIds.includes(activeDetailStop.id) : false}
        onToggleFavorite={() => activeDetailStop && handleToggleFavorite(activeDetailStop.id)}
        onSelectStop={(stop) => setActiveDetailStop(stop)}
        allStopsInDay={dayStops}
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
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200">
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
            onClick={() => setIsNotificationModalOpen(true)}
            className="flex flex-col items-center justify-center h-full text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Alarmlar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
