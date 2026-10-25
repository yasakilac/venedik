export type CategoryType = 'sight' | 'coffee' | 'food' | 'transport' | 'photo' | 'shopping';

export interface TransitStopItem {
  name: string;
  isKeyTransfer?: boolean;
  timeOffsetMin?: number;
  pierOrPlatform?: string;
}

export interface TransitScheduleInfo {
  lineCode: string; // e.g. "Line 5.1", "Regionale RV", "FSBusItalia E015", "Line 12"
  vehicleType: 'train' | 'vaporetto' | 'bus' | 'tram' | 'gondola';
  departureStation: string;
  departurePierOrTrack: string; // e.g. "Peron D (Ferrovia)", "Binario 2-3"
  arrivalStation: string;
  arrivalPierOrTrack: string;
  travelDurationMin: number;
  frequency: string; // e.g. "Her 20 dakikada bir", "Her 10-15 dakikada bir"
  serviceWindow: string; // ilk / son sefer aralığı, e.g. "04:20 - 22:25 arası"
  scheduledTimes?: string[]; // yalnızca resmi kaynaktan doğrulanmış kesin saatler varsa
  verification: 'kaynakli' | 'tahmini'; // 'kaynakli': web kaynağında bulundu · 'tahmini': yerinde teyit edin
  sourceNote: string; // bilginin nereden geldiği ve nerede teyit edileceği
  officialUrl?: string;
  stopsSequence: TransitStopItem[];
  ticketType: 'actv_pass' | 'train_ticket' | 'airport_bus' | 'cash_coins';
  ticketPriceStr: string;
  criticalNotice?: string;
  offlineTip: string;
}

export interface ItineraryStop {
  id: string;
  day: 1 | 2 | 3 | 4 | 5;
  timeRange: string;
  title: string;
  subtitle: string;
  category: CategoryType;
  coordinates: [number, number]; // [lat, lng]
  locationName: string;
  address: string;
  mapsQuery: string;
  isRainFriendly: boolean;
  estimatedCost: string;
  
  // Transit schedule if transit-related
  transitInfo?: TransitScheduleInfo;

  // Rich details for popup
  photographyTips?: string;
  lensSpotlight?: string;
  geographyNote?: string;
  orderTips?: string[];
  practicalAdvice?: string;
  closingAlert?: string;
  
  // Custom user state
  isCompleted?: boolean;
  isFavorite?: boolean;
  notes?: string;
}

export interface HourlyWeather {
  hour: string;
  temp: number;
  condition: string;
  rainProbability: number;
  iconName: 'rain' | 'cloud-rain' | 'cloud' | 'sun' | 'cloud-sun';
}

export interface DayWeather {
  dayNumber: 1 | 2 | 3 | 4 | 5;
  dateStr: string;
  tempHigh: number;
  tempLow: number;
  conditionText: string;
  iconType: 'heavy-rain' | 'cloudy-rain' | 'partly-cloudy' | 'sunny';
  rainChance: number;
  humidity: number;
  windSpeed: string;
  rainStrategy: string;
  porticiAdvice: string;
  hourly: HourlyWeather[];
}

export interface DayInfo {
  dayNumber: 1 | 2 | 3 | 4 | 5;
  dateStr: string;
  dayName: string;
  title: string;
  subtitle: string;
  weatherTitle: string;
  weatherDescription: string;
  rainStrategy: string;
  transportAdvice: string;
  colorTheme: string;
  weather: DayWeather;
}

export interface TransportExpense {
  id: string;
  leg: string;
  description: string;
  cost: number;
  perPerson: boolean;
  passIncluded?: boolean;
  criticalNotice?: string;
}
