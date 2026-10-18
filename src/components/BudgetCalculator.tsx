import React, { useState } from 'react';
import {
  Wallet,
  Check,
  TrendingDown,
  Info,
  Users,
  ShieldCheck,
  Receipt,
} from 'lucide-react';
import { TRANSPORT_EXPENSES } from '../data/itineraryData';
import { getPaidExpenses, togglePaidExpense } from '../utils/storage';

export const BudgetCalculator: React.FC = () => {
  const [paidIds, setPaidIds] = useState<string[]>(getPaidExpenses());
  const [passengerCount, setPassengerCount] = useState<number>(2); // Geographer couple = 2 travelers

  const handleTogglePaid = (id: string) => {
    const updated = togglePaidExpense(id);
    setPaidIds([...updated]);
  };

  const singlePersonTotal = TRANSPORT_EXPENSES.reduce((sum, item) => sum + item.cost, 0);
  const totalTripCost = singlePersonTotal * passengerCount;

  const paidAmount = TRANSPORT_EXPENSES.filter((item) => paidIds.includes(item.id)).reduce(
    (sum, item) => sum + item.cost * passengerCount,
    0
  );

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
      {/* Header and Traveler Counter */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Wallet className="w-5 h-5 text-amber-600" />
            <span>Ulaşım & Pass Matematiği</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Padova dahil 4 günlük tüm transferler ve optimize bilet planı
          </p>
        </div>

        {/* Passenger Counter */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-medium">
          <span className="text-slate-500 flex items-center gap-1 pl-1">
            <Users className="w-3.5 h-3.5" />
            Kişi Sayısı:
          </span>
          <button
            type="button"
            onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
            className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            -
          </button>
          <span className="w-6 text-center font-bold text-slate-900 tabular-nums">
            {passengerCount}
          </span>
          <button
            type="button"
            onClick={() => setPassengerCount(passengerCount + 1)}
            className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      {/* Savings Highlight Box */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3">
        <TrendingDown className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-950 space-y-1">
          <span className="font-bold text-emerald-900 block text-sm">
            48 Saatlik Pass Hamlesiyle Net Tasarruf
          </span>
          <p className="leading-relaxed">
            İlk günü Padova’da geçirip Venedik Pass’inizi gece 21:00’de başlattığınız için 72 Saatlik Pass (45 €) yerine <strong>48 Saatlik Pass (35 €)</strong> aldınız. Kişi başı <strong>10 €</strong>, {passengerCount} kişi için tam <strong>{(10 * passengerCount).toFixed(2)} € doğrudan cebinizde kaldı!</strong>
          </p>
        </div>
      </div>

      {/* Expense List Table */}
      <div className="space-y-2.5">
        <div className="text-xs font-semibold text-slate-500 px-1 uppercase tracking-wider flex justify-between">
          <span>Rota & Bilet Detayı</span>
          <span>Tutar ({passengerCount} Kişi)</span>
        </div>

        {TRANSPORT_EXPENSES.map((item) => {
          const isPaid = paidIds.includes(item.id);
          const totalForGroup = item.cost * passengerCount;

          return (
            <div
              key={item.id}
              onClick={() => handleTogglePaid(item.id)}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isPaid
                  ? 'bg-slate-50/80 border-slate-200 opacity-75'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    isPaid
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isPaid && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-sm font-semibold tracking-tight ${
                        isPaid ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {item.leg}
                    </h4>
                    {item.passIncluded && (
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100 hidden sm:inline">
                        ACTV Pass
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                  {item.criticalNotice && (
                    <p className="text-[11px] font-medium text-amber-700 mt-1">
                      ⚠️ {item.criticalNotice}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm sm:text-base font-bold text-slate-900 font-mono tabular-nums">
                  {totalForGroup.toFixed(2)} €
                </div>
                <div className="text-[11px] text-slate-400">
                  {item.cost.toFixed(2)} € / kişi
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Totals Card */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span>Kişi Başı Toplam Ulaşım:</span>
          <span className="font-mono font-semibold tabular-nums text-sm text-white">
            {singlePersonTotal.toFixed(2)} €
          </span>
        </div>

        <div className="flex items-center justify-between text-sm sm:text-base font-bold text-white pt-2 border-t border-slate-800">
          <span className="flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-amber-400" />
            <span>Toplam Grup Ulaşım Bütçesi ({passengerCount} Kişi):</span>
          </span>
          <span className="text-xl font-mono text-amber-400 tabular-nums">
            {totalTripCost.toFixed(2)} €
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>Şu Ana Kadar Alınan / Ödenen:</span>
          <span className="font-mono font-medium text-emerald-400 tabular-nums">
            {paidAmount.toFixed(2)} € ({Math.round((paidAmount / totalTripCost) * 100 || 0)}%)
          </span>
        </div>
      </div>
    </div>
  );
};
