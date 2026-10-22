import React, { useState } from 'react';
import {
  Share,
  PlusSquare,
  Smartphone,
  X,
  CheckCircle2,
  AlertTriangle,
  DownloadCloud,
  ShieldCheck,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { isTilesCacheReady, getCachedTileCount } from '../utils/tileCache';

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerMapDownload: () => void;
}

export const IOSInstallModal: React.FC<IOSInstallModalProps> = ({
  isOpen,
  onClose,
  onTriggerMapDownload,
}) => {
  const isMapCached = isTilesCacheReady();
  const cachedCount = getCachedTileCount();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 text-slate-800"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                iPhone / iOS’a İndir & Kur
              </h3>
              <p className="text-xs text-slate-300">
                Safari üzerinden internetsiz çalışan yerel uygulama olarak kaydetme
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm">
          {/* Status Box: Offline Map Pre-flight */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Çevrimdışı Hazırlık Durumu</span>
              {isMapCached ? (
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px] font-bold">
                  ✓ Hazır
                </span>
              ) : (
                <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[11px] font-bold">
                  İndirme Bekliyor
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isMapCached
                ? `Harita ve tüm sefer saatleri cihazınızın hafızasında kayıtlı (${cachedCount} sokak karosu). İtalya’da internetiniz kapalıyken bile sokak sokak çalışır.`
                : 'Uçağa binmeden önce harita karolarını tek tıkla indirin; böylece Venedik ve Padova’da hücresel veriniz kapalıyken bile sokakları görebilirsiniz.'}
            </p>

            {!isMapCached && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onTriggerMapDownload();
                }}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer mt-1"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>Haritayı Şimdi Çevrimdışı İndir</span>
              </button>
            )}
          </div>

          {/* 3 Steps Guide for iPhone Home Screen */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              iPhone Ana Ekranına 3 Adımda Ekleme:
            </h4>

            {/* Step 1 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-sm">
                1
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <span>Safari'de Paylaş Butonuna Basın</span>
                  <Share className="w-4 h-4 text-blue-600" />
                </h5>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  iPhone Safari tarayıcınızın en altındaki çubukta yer alan <strong>"Paylaş"</strong> (kare içinden yukarı ok simgesi) ikonuna dokunun.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-sm">
                2
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <span>"Ana Ekrana Ekle"yi Seçin</span>
                  <PlusSquare className="w-4 h-4 text-blue-600" />
                </h5>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Açılan menüyü aşağı kaydırıp <strong>"Ana Ekrana Ekle" (Add to Home Screen)</strong> seçeneğine dokunun.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-sm">
                3
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm">
                  Sağ Üstteki "Ekle"ye Dokunun
                </h5>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Sağ üst köşedeki <strong>"Ekle" (Add)</strong> butonuna basın. Uygulama artık iPhone ana ekranınızda altın pusula simgeli yerel bir uygulama gibi yer alır!
                </p>
              </div>
            </div>
          </div>

          {/* Advantages box */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1.5">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Ana Ekrana Ekleyince Ne Değişir?</span>
            </div>
            <ul className="space-y-1 text-emerald-900/90 list-disc list-inside">
              <li>Safari arama çubuğu ve butonları gizlenir, tam ekran yerel uygulama gibi çalışır.</li>
              <li>İtalya'da hattınız çekmese veya uçak modunda olsanız bile anında açılır.</li>
              <li>Uydu GPS konumunuz internetsiz harita üzerinde çalışmaya devam eder.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pb-safe p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            iPhone X ve üzeri, iOS 16+ Safari ile uyumludur.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-medium text-xs rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};
