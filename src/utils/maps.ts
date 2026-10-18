import { ItineraryStop } from '../types';

// Google Haritalar bağlantıları. iPhone'da Google Maps uygulaması kuruluysa uygulama açılır;
// uygulamada indirilmiş çevrimdışı bölge varsa konum internetsiz de görünür.
const BASE = 'https://www.google.com/maps';

// İsim + adres araması: işletme/yer kartını açar.
export function placeUrl(stop: ItineraryStop): string {
  const query = stop.mapsQuery || `${stop.title} ${stop.address}`;
  return `${BASE}/search/?api=1&query=${encodeURIComponent(query)}`;
}

// Koordinatla doğrudan nokta (isim araması bulamazsa yedek).
export function coordUrl(stop: ItineraryStop): string {
  const [lat, lng] = stop.coordinates;
  return `${BASE}/search/?api=1&query=${lat},${lng}`;
}

// Mevcut konumdan yürüyerek yol tarifi.
export function directionsUrl(stop: ItineraryStop): string {
  const [lat, lng] = stop.coordinates;
  return `${BASE}/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
}
