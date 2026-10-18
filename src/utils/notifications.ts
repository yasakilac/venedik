export interface ScheduledAlert {
  id: string;
  timeStr: string;
  title: string;
  body: string;
  icon?: string;
  isTriggered?: boolean;
}

export const PRESET_ALERTS: ScheduledAlert[] = [
  {
    id: 'pass-48h-warning',
    timeStr: '23 Ekim 20:45',
    title: '⚠️ 48h ACTV Pass Bitiş Uyarısı!',
    body: 'Saat 21:00’de biletiniz bitiyor! Piazzale Roma’dan Mestre otobüsüne kartınızı son kez okutup ücretsiz dönün.',
  },
  {
    id: 'orto-botanico-close',
    timeStr: '21 Ekim 17:00',
    title: '🌿 Orto Botanico Kapanış Yaklaşıyor',
    body: 'Padova kapalı tropikal sera (Biodiversity Garden) 17:30 - 18:00 civarı kapanıyor, fotoğraf için son anlar!',
  },
  {
    id: 'pass-start',
    timeStr: '21 Ekim 21:00',
    title: '🎟️ 48 Saatlik ACTV Pass’i Başlatın',
    body: 'Santa Lucia iskelesinde Lido vapuruna binerken kartınızı ilk kez okutun. 48 saatlik sayaç başladı!',
  },
  {
    id: 'traghetto-coins',
    timeStr: '24 Ekim 12:15',
    title: '🛶 Traghetto Bozuk Para Hatırlatması',
    body: 'Santa Sofia iskelesinden karşıya geçerken kişi başı tam 2 € bozuk para hazır olsun.',
  },
];

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.error('Notification permission error', e);
    return 'denied';
  }
}

export function sendBrowserNotification(title: string, body: string): boolean {
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: 'veneto-explorer',
      });
      return true;
    } catch (e) {
      console.warn('Browser notification failed, will use in-app banner', e);
      return false;
    }
  }
  return false;
}
