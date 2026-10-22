import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Send,
  Volume2,
} from 'lucide-react';
import {
  requestNotificationPermission,
  sendBrowserNotification,
  PRESET_ALERTS,
  ScheduledAlert,
} from '../utils/notifications';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [permissionStatus, setPermissionStatus] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );
  const [toastMessage, setToastMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermissionStatus(res);
    if (res === 'granted') {
      sendBrowserNotification(
        '🔔 Venedik & Padova Bildirimleri Aktif!',
        'Kritik duraklar ve 20:45 Pass biniş saatinde cihazınıza bildirim gönderilecek.'
      );
      setToastMessage('Bildirim izinleri başarıyla açıldı!');
      setTimeout(() => setToastMessage(''), 4000);
    } else if (res === 'denied') {
      setToastMessage('Tarayıcı ayarlarından bildirim izni vermeniz gerekebilir.');
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  const handleSendTestNotification = (alert: ScheduledAlert) => {
    const sent = sendBrowserNotification(alert.title, alert.body);
    if (sent) {
      setToastMessage(`"${alert.title}" cihazınıza iletildi.`);
    } else {
      setToastMessage(`Uygulama İçi Uyarı: ${alert.title} - ${alert.body}`);
    }
    setTimeout(() => setToastMessage(''), 4500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90dvh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Seyahat Bildirimleri & Alarmlar
              </h3>
              <p className="text-xs text-slate-300">
                Kritik durak, kapanış saati ve Pass biniş hatırlatıcıları
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
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Permission State Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <span>Cihaz Bildirim Durumu:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    permissionStatus === 'granted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {permissionStatus === 'granted' ? 'Açık / İzin Verildi' : 'Kapalı / Bekliyor'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Telefonunuz kilitliyken bile saati geldiğinde anlık bildirim alın.
              </p>
            </div>

            {permissionStatus !== 'granted' && (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
              >
                İzin Ver & Etkinleştir
              </button>
            )}
          </div>

          {toastMessage && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* List of preset alarms */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Otomatik Seyahat Alarmları
            </h4>

            {PRESET_ALERTS.map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.timeStr}
                    </span>
                  </div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                    {alert.title}
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {alert.body}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSendTestNotification(alert)}
                  title="Bildirimi şimdi test et"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          Uygulama arka planda veya çevrimdışı olsa dahi planlanan alarmlar tetiklenir.
        </div>
      </div>
    </div>
  );
};
