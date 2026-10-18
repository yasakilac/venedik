import React, { useState } from 'react';
import { OFFLINE_TRANSIT_ROUTES } from '../data/transitData';
import { TransitTimetableCard } from './TransitTimetableCard';
import {
  Ship,
  Train,
  Bus,
  Compass,
  Search,
  Layers,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const TransitHubView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'train' | 'vaporetto' | 'bus' | 'gondola'>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const routesList = Object.values(OFFLINE_TRANSIT_ROUTES);

  const filteredRoutes = routesList.filter((route) => {
    if (activeFilter !== 'all' && route.vehicleType !== activeFilter) {
      return false;
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const inLine = route.lineCode.toLowerCase().includes(q);
      const inDep = route.departureStation.toLowerCase().includes(q);
      const inArr = route.arrivalStation.toLowerCase().includes(q);
      return inLine || inDep || inArr;
    }
    return true;
  });

  return (
    <div className="space-y-5 pb-8 text-slate-800">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif-heading text-slate-900 tracking-tight">
                Çevrimdışı Seferler & Ulaşım Rehberi
              </h2>
              <p className="text-xs text-slate-500">
                İnternetsiz ortamda tren peronları, vapur iskeleleri ve kalkış saatleri
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>%100 Offline Hazır</span>
          </div>
        </div>

        {/* Search input */}
        <div className="relative pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 translate-y-0.5" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Hat veya durak ara (örn: 5.1, Regionale, Burano, Mestre, Traghetto)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tüm Hatlar ({routesList.length})
          </button>
          <button
            onClick={() => setActiveFilter('vaporetto')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeFilter === 'vaporetto'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            Vaporetto (Venedik & Adalar)
          </button>
          <button
            onClick={() => setActiveFilter('train')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeFilter === 'train'
                ? 'bg-indigo-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            Tren (Padova - Venedik)
          </button>
          <button
            onClick={() => setActiveFilter('bus')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeFilter === 'bus'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            Otobüs & Tramvay
          </button>
          <button
            onClick={() => setActiveFilter('gondola')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeFilter === 'gondola'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Traghetto (Gondol Dolmuş)
          </button>
        </div>
      </div>

      {/* List of Transit Timetables */}
      <div className="space-y-4">
        {filteredRoutes.map((route, idx) => (
          <TransitTimetableCard
            key={idx}
            transit={route}
            defaultExpanded={idx === 0 || filteredRoutes.length === 1}
          />
        ))}

        {filteredRoutes.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            Aradığınız kritere uygun hat bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
};
