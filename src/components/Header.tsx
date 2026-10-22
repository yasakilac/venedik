import React from 'react';
import { Compass, MapPin, Bell, Wallet, Wifi, WifiOff, Ship } from 'lucide-react';

interface HeaderProps {
  activeTab: 'itinerary' | 'map' | 'transit' | 'budget' | 'notes';
  onSelectTab: (tab: 'itinerary' | 'map' | 'transit' | 'budget' | 'notes') => void;
  isOffline: boolean;
  onOpenNotifications: () => void;
  hasUnreadAlerts: boolean;
  onOpenIOSInstall: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  isOffline,
  onOpenNotifications,
  hasUnreadAlerts,
  onOpenIOSInstall,
}) => {
  return (
    <header className="pt-safe sticky top-0 z-30 bg-slate-900 text-slate-100 border-b border-slate-800 shadow-md backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <button
            onClick={() => onSelectTab('itinerary')}
            className="text-left cursor-pointer focus:outline-none"
          >
            <span className="text-base font-bold tracking-tight text-white block">
              Veneto Explorer
            </span>
          </button>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden sm:flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => onSelectTab('itinerary')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'itinerary'
                ? 'bg-slate-800 text-amber-400 font-semibold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Plan & Liste
          </button>
          <button
            onClick={() => onSelectTab('map')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              activeTab === 'map'
                ? 'bg-slate-800 text-amber-400 font-semibold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Harita (Offline)
          </button>
          <button
            onClick={() => onSelectTab('transit')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              activeTab === 'transit'
                ? 'bg-slate-800 text-amber-400 font-semibold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            Seferler
          </button>
          <button
            onClick={() => onSelectTab('budget')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer ${
              activeTab === 'budget'
                ? 'bg-slate-800 text-amber-400 font-semibold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            Bütçe & Pass
          </button>
          <button
            onClick={() => onSelectTab('notes')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-slate-800 text-amber-400 font-semibold shadow-inner'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Notlar
          </button>
        </nav>

        {/* Zone 3: Primary notification & offline status & iOS install action */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenIOSInstall}
            title="iPhone / iOS Ana Ekranına İndir"
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline">iPhone’a İndir</span>
            <span className="sm:hidden">İndir</span>
          </button>

          <button
            onClick={onOpenNotifications}
            aria-label="Seyahat Bildirimleri"
            className="relative w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {hasUnreadAlerts && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-900" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
