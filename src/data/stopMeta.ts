import { ItineraryStop } from '../types';

export type TravelMode = 'train' | 'vaporetto' | 'bus' | 'gondola';

// Kartta "A → B" olarak gösterilecek ulaşım durakları ve araç simgeleri.
export const ROUTE_LABELS: Record<string, { from: string; to: string; modes: TravelMode[] }> = {
  'd1-airport-transfer': { from: 'Havalimanı', to: 'Padova', modes: ['bus'] },
  'd1-train-pass-start': { from: 'Padova', to: 'Venedik Santa Lucia', modes: ['train'] },
  'd2-morning-vaporetto': { from: 'Lido', to: 'San Marco', modes: ['vaporetto'] },
  'd2-grand-canal-cruise': { from: 'San Marco', to: 'Accademia', modes: ['vaporetto'] },
  'd3-baggage-mestre': { from: 'Lido', to: 'Mestre', modes: ['vaporetto', 'bus'] },
  'd3-critical-pass-alert': { from: 'Piazzale Roma', to: 'Mestre', modes: ['bus'] },
  'd4-mestre-venice': { from: 'Mestre', to: 'Venedik', modes: ['bus'] },
  'd4-traghetto-crossing': { from: 'Santa Sofia', to: 'Rialto', modes: ['gondola'] },
  'd4-airport-departure': { from: 'Mestre', to: 'Havalimanı', modes: ['bus'] },
  'alt-d1-line1': { from: 'Lido', to: 'Piazzale Roma', modes: ['vaporetto'] },
  'alt-d1-return-lido': { from: 'Venedik', to: 'Lido', modes: ['vaporetto'] },
  'alt-d2-to-burano': { from: 'Lido', to: 'Burano', modes: ['vaporetto'] },
  'alt-d2-murano-transfer': { from: 'Burano', to: 'Murano', modes: ['vaporetto'] },
  'alt-d2-return-lido': { from: 'Murano', to: 'Lido', modes: ['vaporetto'] },
  'alt-d3-to-padova': { from: 'Lido', to: 'Padova', modes: ['vaporetto', 'bus', 'train'] },
  'alt-d3-return': { from: 'Padova', to: 'Mestre', modes: ['train'] },
  'alt-d4-lido-mestre': { from: 'Lido', to: 'Mestre', modes: ['vaporetto', 'bus'] },
  'alt-d4-airport': { from: 'Mestre', to: 'Havalimanı', modes: ['bus'] },
};

// Başlığı yer adı olarak kalan ama vapurla ulaşılan duraklar (yalnızca simge)
export const EXTRA_MODES: Record<string, TravelMode[]> = {
  'd3-murano': ['vaporetto'],
  'd3-burano': ['vaporetto'],
  'd3-torcello': ['vaporetto'],
};

export function stopModes(stop: ItineraryStop): TravelMode[] {
  return ROUTE_LABELS[stop.id]?.modes ?? EXTRA_MODES[stop.id] ?? [];
}

// ---- Buraya nasıl gidilir? ----
export interface AccessInfo {
  alt?: string; // yürüyüşe alternatif ulaşım
  route?: string; // alternatif güzergâh notu
}

const PADOVA =
  'Padova merkezi yürünebilir. Uzak noktalar için şehir tramvayı (SIR1) ve otobüsler var; tek yön bilet ≈ 1,50-2 €. Yağmurda kemerli (portici) kaldırımları izleyin. Taksi ≈ 8-12 € (tahmini).';
const VENICE =
  'Venedik’te araç yok: ana ulaşım yürüyüş. Alternatif: Hat 1 / 2 vaporetto (48 saatlik bilet geçerliyken ücretsiz) ve 2 € nakit traghetto ile Büyük Kanal geçişi. Köprü ve merdivenler valizle zordur.';

import { ALT_ACCESS_INFO } from './altPlaceInfo';

export const ACCESS_INFO: Record<string, AccessInfo> = {
  ...ALT_ACCESS_INFO,
  'd1-lens-shop': { alt: PADOVA },
  'd1-orto-botanico': { alt: PADOVA, route: 'Prato della Valle üzerinden yürümek Via Orto Botanico’ya en kolay yoldur.' },
  'd1-prato-valle': { alt: PADOVA },
  'd1-palazzo-ragione': { alt: PADOVA, route: 'Kemerli (portici) yolları izleyerek yağmurdan korunabilirsiniz.' },
  'd1-caffe-pedrocchi': { alt: PADOVA },
  'd1-dinner-padova': { alt: PADOVA },
  'd1-train-pass-start': {
    alt: 'Trenle Padova → Venezia Santa Lucia ≈ 27 dk (RV) veya ≈ 45 dk (yavaş R).',
    route: 'Alternatif: Padova → Mestre treni (≈ 15 dk) + Mestre → Santa Lucia (≈ 10 dk). Valizsiz bir Mestre aktarması yapmak zorunda kalırsanız tabela/peron değişimine dikkat edin.',
  },
  'd2-morning-vaporetto': {
    alt: 'Vapur: Hat 1 (yavaş, ≈ 15-20 dk) veya 5.2. Lido’dan başka yol yok; yürüyerek geçilemez.',
    route: 'Hat 1 sık seferli ve gece de çalışır; 5.1/5.2 halka hat olduğundan daha uzun sürebilir.',
  },
  'd2-san-marco-ducale': { alt: VENICE, route: 'San Zaccaria iskelesinden Dükler Sarayı’na ≈ 3-5 dk yürüyüş.' },
  'd2-torrefazione-cannaregio': { alt: VENICE, route: 'Vapurla Hat 1 ile Ferrovia/Guglie, oradan yürüyüş.' },
  'd2-grand-canal-cruise': { alt: 'Vaporetto Hat 1 (yavaş) veya Hat 2 (hızlı). Alternatif: yürüyerek San Marco → Accademia ≈ 25-30 dk.' },
  'd2-dorsoduro-dogana': { alt: VENICE, route: 'Accademia Köprüsü → Zattere kıyısı → Dogana; köprü merdivenlidir.' },
  'd2-dinner-cicchetti': { alt: VENICE },
  'd3-baggage-mestre': {
    alt: 'Vapur Lido → Piazzale Roma (≈ 1 saat), sonra tramvay T1 veya otobüs ile Mestre (≈ 15-20 dk).',
    route: 'Alternatif: Hat 1 ile Santa Lucia, oradan tren Mestre (≈ 10 dk, ≈ 1-2 €).',
  },
  'd3-murano': { alt: 'Adaya yalnızca vapurla gidilir: Fondamente Nove’den Hat 12 (≈ 10 dk) veya 4.1/4.2 (Murano içi).' },
  'd3-burano': { alt: 'Murano’dan Hat 12 ile Burano (≈ 30 dk). Burano içinde yürünür.' },
  'd3-torcello': { alt: 'Burano’dan Hat 9 vapuru (≈ 5 dk). Ada içinde tek ana patika boyunca yürünür.' },
  'd3-arsenale-ocean-space': { alt: VENICE, route: 'Arsenale iskelesinden yürüyüş; Hat 1 ve 4.1/4.2 da yaklaşır.' },
  'd3-caffe-del-doge': { alt: VENICE },
  'd3-dinner-zucca-vedova': { alt: VENICE },
  'd3-critical-pass-alert': {
    alt: 'Tramvay T1 (≈ 10 dk arayla) veya otobüs 2 / 4L ile Mestre.',
    route: 'Alternatif: Santa Lucia’dan tren ile Mestre (≈ 10 dk).',
  },
  'd4-mestre-venice': {
    alt: 'Tramvay T1 veya otobüs ile Piazzale Roma; tren Mestre → Santa Lucia (≈ 10 dk).',
  },
  'd4-jewish-ghetto': { alt: VENICE },
  'd4-pescheria-market': { alt: VENICE },
  'd4-traghetto-crossing': { alt: 'Büyük Kanal’ı geçmek için en yakın köprüye yürümek ≈ 10-15 dk fazladan sürer; traghetto ≈ 3 dk.' },
  'd4-farini-tonolo': { alt: VENICE },
  'd4-bacareto-da-lele': { alt: VENICE },
  'd4-airport-departure': {
    alt: 'ATVO 35B (≈ 20 dk) veya ACTV 15 (daha ucuz, daha yavaş).',
    route: 'Alternatif: taksi ≈ 25-35 € (tahmini). Havalimanına tren yoktur.',
  },
};

// ---- Yaklaşık yürüyüş hesabı (kuş uçuşu × 1,3, 5 km/sa) ----
function haversine(a: [number, number], b: [number, number]): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const s =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export interface WalkEstimate {
  meters: number;
  minutes: number;
}

export function estimateWalk(from: ItineraryStop, to: ItineraryStop): WalkEstimate {
  const meters = Math.round((haversine(from.coordinates, to.coordinates) * 1.3) / 10) * 10;
  return { meters, minutes: Math.max(1, Math.round(meters / 83)) };
}
