import { TransitScheduleInfo } from '../types';

// ÖNEMLİ: Bu dosyada dakika dakika "uydurma" sefer saatleri yoktur.
// Sıklık / ilk-son sefer bilgileri web kaynaklarından derlenmiştir (sourceNote).
// Kesin kalkış saatleri için gitmeden önce resmi uygulamadan (Trenitalia, Venezia Unica / ACTV)
// ekran görüntüsü alın.
const ACTV_URL = 'https://actv.avmspa.it/it/content/orari-servizio-di-navigazione-0';

export const OFFLINE_TRANSIT_ROUTES: Record<string, TransitScheduleInfo> = {
  // 1. Havalimanı (VCE) ➔ Padova
  'airport-to-padova': {
    lineCode: 'Busitalia Veneto Havalimanı–Padova (direkt) · Alternatif: ATVO/ACTV 15 + Tren',
    vehicleType: 'bus',
    departureStation: 'Venedik Marco Polo Havalimanı (VCE)',
    departurePierOrTrack: 'Varış katı çıkışı, otobüs durağı (bilet büfesi varış katında)',
    arrivalStation: 'Padova Otobüs Terminali (tren garının hemen yanı)',
    arrivalPierOrTrack: 'Padova Garı ile yürüme mesafesi',
    travelDurationMin: 70,
    frequency: 'Saatte 1 sefer (genelde her saat :40’ta)',
    serviceWindow: 'Havalimanından yaklaşık 07:40 – 22:40',
    verification: 'tahmini',
    sourceNote:
      'Üniversite/konferans ulaşım sayfalarından (2018-2022): saat başı :40, 65-70 dk, ~8,50 € (araçta 10 €). Güncel saat/fiyat için Busitalia Veneto sitesini veya havalimanı bilet büfesini kontrol edin.',
    ticketType: 'airport_bus',
    ticketPriceStr: '≈ 8,50 € (araçta ≈ 10 €) · kişi başı',
    offlineTip:
      'Direkt otobüs kaçarsa: ATVO (35B) veya ACTV 15 ile Mestre Garı’na (≈ 20-30 dk, ATVO ≈ 10 €), oradan Padova trenine (≈ 15-20 dk, ≈ 5 €) binin. Toplam süre benzer kalır.',
    stopsSequence: [
      { name: 'Marco Polo Havalimanı (VCE)', timeOffsetMin: 0 },
      { name: 'Otoyol (A4) hattı', timeOffsetMin: 25 },
      { name: 'Padova Otobüs Terminali', pierOrPlatform: 'Gar yanı', isKeyTransfer: true, timeOffsetMin: 70 },
    ],
  },

  // 2. Padova ➔ Venezia Santa Lucia
  'padova-to-venice': {
    lineCode: 'Trenitalia Regionale (R) / Regionale Veloce (RV)',
    vehicleType: 'train',
    departureStation: 'Padova Garı (Stazione di Padova)',
    departurePierOrTrack: 'Peron numarası panoda yazar (Binario)',
    arrivalStation: 'Venezia Santa Lucia (hattın son durağı)',
    arrivalPierOrTrack: 'Son durak: Büyük Kanal’ın hemen karşısı',
    travelDurationMin: 27,
    frequency: 'Gün içinde çok sık (yaklaşık 10-30 dk arayla; RV ≈ 27 dk, yavaş R ≈ 45 dk)',
    serviceWindow: 'Sabahtan gece yarısına kadar sık sefer — saat için Trenitalia uygulaması',
    verification: 'kaynakli',
    sourceNote:
      'Aggregator sayfaları: Padova–Venezia S.L. RV ≈ 27 dk, yavaş regionale ≈ 45 dk; Mestre–Padova ≈ 14 dk; günde 100+ tren. Fiyat ≈ 5 € civarı. Kesin saatler için Trenitalia uygulaması / trenitalia.com.',
    ticketType: 'train_ticket',
    ticketPriceStr: '≈ 5 € (Regionale, kişi başı)',
    criticalNotice:
      'Regionale biletini bindiğiniz peronda "convalida" (doğrulama) makinesinde okutun; uygulamadan alıyorsanız bilet kodu otomatik geçerlidir. Okutmamak para cezasıdır.',
    offlineTip:
      'Frecciarossa/Italo almayın: bu kısa mesafede 4-5 dk kazandırır, birkaç kat pahalıdır. Her tren Mestre’de durur (Mestre→S. Lucia ≈ 10 dk).',
    stopsSequence: [
      { name: 'Padova Garı', timeOffsetMin: 0 },
      { name: 'Venezia Mestre (bazı trenlerde aktarma/hızlı geçiş)', isKeyTransfer: true, timeOffsetMin: 16 },
      { name: 'Ponte della Libertà (lagün köprüsü)', timeOffsetMin: 22 },
      { name: 'Venezia Santa Lucia', pierOrPlatform: 'Son durak', isKeyTransfer: true, timeOffsetMin: 27 },
    ],
  },

  // 3. Santa Lucia ➔ Lido
  'santa-lucia-to-lido': {
    lineCode: 'ACTV Vaporetto 5.1/5.2 (Lido halka hattı) veya Hat 1 (Büyük Kanal)',
    vehicleType: 'vaporetto',
    departureStation: 'Ferrovia iskelesi (Santa Lucia Garı önü)',
    departurePierOrTrack: 'İskele harflerini panodan/uygulamadan kontrol edin (Ferrovia 1-2-3…)',
    arrivalStation: 'Lido Santa Maria Elisabetta (S.M.E.)',
    arrivalPierOrTrack: 'Lido S.M.E. — Gran Viale’nin başı',
    travelDurationMin: 55,
    frequency: '5.1/5.2: ≈ 20 dk arayla · Hat 1: ≈ 10-12 dk arayla (Hat 1 yavaş, ≈ 1 sa)',
    serviceWindow: '5.2 Lido’dan ≈ 05:52 – 00:22 arası; 5.1 gündüz ≈ 06:20 – 20:20 (akşam kısıtlı)',
    verification: 'tahmini',
    sourceNote:
      'invenicetoday.com (resmî değil): 5.1/5.2 halka hattı Lido → San Marco/Zattere → P.le Roma → Ferrovia → Fondamente Nove → Lido; 5.2 20 dk arayla ≈ 05:52-00:22. Tek yön süre bu halkada ≈ 50-60 dk (önceki "35 dk ekspres" iddiası kaynaksızdı). Gece 21:00 sonrası hangi hattın çalıştığını Venezia Unica uygulamasından kontrol edin.',
    officialUrl: ACTV_URL,
    ticketType: 'actv_pass',
    ticketPriceStr: '48 saatlik ACTV bileti ≈ 35 € (kişi başı) — bu yolculukta ilk okutma',
    criticalNotice:
      'İskele turnikesinde 48 saatlik biletinizi okuttuğunuz an süre başlar (Çarşamba ≈ 21:00 → Cuma ≈ 21:00). Biletin ilk okutmasını bilerek yapın.',
    offlineTip:
      'Valizle gece yolculuğunda iskelede güncel kalkış saatlerini panodan okuyun; 5.1/5.2 aralığı akşam seyrekleşebilir, Hat 1 ise geceleri de çalışır.',
    stopsSequence: [
      { name: 'Ferrovia', timeOffsetMin: 0 },
      { name: 'Piazzale Roma', isKeyTransfer: true, timeOffsetMin: 5 },
      { name: 'Zattere', timeOffsetMin: 20 },
      { name: 'San Marco / San Zaccaria', timeOffsetMin: 35 },
      { name: 'Giardini', timeOffsetMin: 42 },
      { name: 'Sant’Elena', timeOffsetMin: 46 },
      { name: 'Lido S.M.E.', pierOrPlatform: 'Son durak', isKeyTransfer: true, timeOffsetMin: 55 },
    ],
  },

  // 4. Lido ➔ San Marco
  'lido-to-san-marco': {
    lineCode: 'ACTV Vaporetto Hat 1 (veya 5.2)',
    vehicleType: 'vaporetto',
    departureStation: 'Lido Santa Maria Elisabetta (S.M.E.)',
    departurePierOrTrack: 'İskele harfi için panoya bakın',
    arrivalStation: 'San Zaccaria / San Marco',
    arrivalPierOrTrack: 'San Zaccaria (Dükler Sarayı’na 3 dk yürüyüş)',
    travelDurationMin: 15,
    frequency: 'Hat 1: ≈ 10-12 dk arayla · 5.2: ≈ 20 dk arayla',
    serviceWindow: 'Sabah erken saatten gece yarısına kadar (Hat 1 neredeyse 24 saat)',
    verification: 'tahmini',
    sourceNote:
      'Hat 1 ve 5.1/5.2 Lido S.M.E. servisleri (Venice for Visitors / invenicetoday). Resmi saatler: ACTV.',
    officialUrl: ACTV_URL,
    ticketType: 'actv_pass',
    ticketPriceStr: '48 saatlik bilet kapsamında',
    offlineTip:
      'Sabah sisinde açık güvertede San Giorgio Maggiore silüetini çekin. Hat 1 duraklarda daha çok bekler; acele varsa 5.2 / 14 ile karşılaştırın.',
    stopsSequence: [
      { name: 'Lido S.M.E.', timeOffsetMin: 0 },
      { name: 'Giardini Biennale', timeOffsetMin: 8 },
      { name: 'Arsenale', timeOffsetMin: 11 },
      { name: 'San Zaccaria', isKeyTransfer: true, timeOffsetMin: 15 },
    ],
  },

  // 5. Büyük Kanal Hat 1
  'grand-canal-line-1': {
    lineCode: 'ACTV Vaporetto Hat 1 (Büyük Kanal, tüm duraklar)',
    vehicleType: 'vaporetto',
    departureStation: 'San Marco Vallaresso',
    departurePierOrTrack: 'Vallaresso (San Marco meydanının batı ucu)',
    arrivalStation: 'Accademia (veya Rialto / Ferrovia)',
    arrivalPierOrTrack: 'Accademia iskelesi (ahşap köprünün dibi)',
    travelDurationMin: 12,
    frequency: '≈ 10-12 dk arayla',
    serviceWindow: 'Hat 1 neredeyse 24 saat çalışır',
    verification: 'tahmini',
    sourceNote:
      'Hat 1 durak sırası (San Marco → Giglio → Salute → Accademia → … → Rialto → … → Ferrovia → P.le Roma). Süreler yaklaşık: Accademia ≈ 12 dk, Rialto ≈ 25-30 dk, Ferrovia ≈ 40-45 dk.',
    officialUrl: ACTV_URL,
    ticketType: 'actv_pass',
    ticketPriceStr: '48 saatlik bilet kapsamında',
    offlineTip:
      'Yağmurda içeride cam kenarı, dinince açık arka güvertede saray cephelerini çekin. Hat 1 çok durak yaptığı için yavaştır — keyif içindir.',
    stopsSequence: [
      { name: 'San Marco Vallaresso', timeOffsetMin: 0 },
      { name: 'Giglio', timeOffsetMin: 4 },
      { name: 'Salute', timeOffsetMin: 7 },
      { name: 'Accademia', pierOrPlatform: 'Ahşap köprü', isKeyTransfer: true, timeOffsetMin: 12 },
      { name: 'Ca’ Rezzonico → San Tomà (ara duraklar)', timeOffsetMin: 18 },
      { name: 'Rialto', isKeyTransfer: true, timeOffsetMin: 28 },
    ],
  },

  // 6. Lido ➔ Mestre
  'lido-to-mestre': {
    lineCode: 'Vaporetto (Lido→Piazzale Roma) + Tramvay T1 veya ACTV otobüs 2',
    vehicleType: 'bus',
    departureStation: 'Lido S.M.E. ➔ Piazzale Roma ➔ Mestre',
    departurePierOrTrack: 'Vaporetto ile Piazzale Roma, sonra tramvay/otobüs durağı',
    arrivalStation: 'Venezia Mestre Garı / Mestre otelleri',
    arrivalPierOrTrack: 'Tramvay T1 Mestre Stazione durağı',
    travelDurationMin: 80,
    frequency: 'Vapur ≈ 20 dk · Tramvay T1 ≈ 10 dk (Pzt-Cmt)',
    serviceWindow: 'T1 Venedik’ten ≈ 06:48 – 23:48 (pazar 15 dk arayla)',
    verification: 'kaynakli',
    sourceNote:
      'Tramvay T1: Mon-Sat 10 dk, Pazar 15 dk (timetable listing); Piazzale Roma–Mestre ≈ 15-20 dk. Lido→Piazzale Roma vapuru ≈ 50-60 dk. Toplam ≈ 75-85 dk (önceki "50 dk" yanlıştı). ACTV otobüs 2 de aynı güzergâhta çalışır.',
    officialUrl: ACTV_URL,
    ticketType: 'actv_pass',
    ticketPriceStr: '48 saatlik bilet kapsamında (vapur + tramvay + otobüs)',
    offlineTip:
      'Valizle sabah ≈ 09:00’da çıkın: toplam yolculuk ≈ 1,5 saat. Tramvay valiz için otobüsten rahat; Mestre Garı’na kadar gider.',
    stopsSequence: [
      { name: 'Lido S.M.E.', timeOffsetMin: 0 },
      { name: 'Piazzale Roma (vapur inişi)', isKeyTransfer: true, timeOffsetMin: 58 },
      { name: 'Piazzale Roma tramvay/otobüs durağı', timeOffsetMin: 63 },
      { name: 'Ponte della Libertà', timeOffsetMin: 68 },
      { name: 'Mestre Stazione', pierOrPlatform: 'İniş', isKeyTransfer: true, timeOffsetMin: 80 },
    ],
  },

  // 7. Fondamente Nove ➔ Murano, Burano, Torcello
  'lagoon-islands-line-12': {
    lineCode: 'ACTV Hat 12 (Fondamente Nove–Murano–Burano) + Hat 9 (Burano–Torcello)',
    vehicleType: 'vaporetto',
    departureStation: 'Fondamente Nove (F.te Nove)',
    departurePierOrTrack: 'F.te Nove iskelesi',
    arrivalStation: 'Burano (Hat 12) · Torcello (Hat 9 ile ≈ 5 dk)',
    arrivalPierOrTrack: 'Burano ana iskele',
    travelDurationMin: 43,
    frequency: 'Hat 12: ≈ 20-30 dk arayla · Hat 9: ≈ 30 dk arayla',
    serviceWindow: 'F.te Nove’den ≈ 04:20 – 22:25 (gündüz 20 dk, sabah/akşam 30 dk)',
    verification: 'kaynakli',
    sourceNote:
      'İtalyanca seyahat rehberi (ACTV tarifesine atıfla): F.te Nove 04:20-22:25, 20/30 dk; Hat 12 Burano ≈ 43 dk + Hat 9 ≈ 5 dk; Murano Faro ≈ 9-10 dk. Resmi: ACTV.',
    officialUrl: ACTV_URL,
    ticketType: 'actv_pass',
    ticketPriceStr: '48 saatlik bilet kapsamında',
    criticalNotice:
      'Cuma 21:00’de biletiniz biter. Dönüş vapur saatini Burano iskelesindeki panodan okuyun; güneş batarken (Ekim’de ≈ 17:45) geç kalmayın.',
    offlineTip:
      'Hat 12 üst güvertesi yok ama dış alanda lagün briccole kazıklarını çekebilirsiniz. Torcello için Burano’da Hat 9’a geçin (kısa ama sık değil — saatini önceden sorun).',
    stopsSequence: [
      { name: 'Fondamente Nove', timeOffsetMin: 0 },
      { name: 'Murano Faro', isKeyTransfer: true, timeOffsetMin: 10 },
      { name: 'Mazzorbo', timeOffsetMin: 38 },
      { name: 'Burano', pierOrPlatform: 'İniş', isKeyTransfer: true, timeOffsetMin: 43 },
      { name: 'Torcello (Hat 9)', timeOffsetMin: 48 },
    ],
  },

  // 8. Cuma 20:45 son ücretsiz biniş
  'friday-critical-2045-pass': {
    lineCode: 'Tramvay T1 · ACTV otobüs 2 · 4L',
    vehicleType: 'bus',
    departureStation: 'Piazzale Roma',
    departurePierOrTrack: 'Tramvay/otobüs durakları (Piazzale Roma’da işaretli)',
    arrivalStation: 'Mestre Stazione / Mestre Centro',
    arrivalPierOrTrack: 'Mestre Stazione',
    travelDurationMin: 18,
    frequency: 'T1 ≈ 10 dk · 4L ≈ 15 dk',
    serviceWindow: 'T1 Venedik’ten ≈ 06:48 – 23:48; sonrasında 00:33 ve 01:00 seferleri',
    verification: 'kaynakli',
    sourceNote:
      'T1: Pzt-Cmt 10 dk, gece 23:48’e kadar + 00:33/01:00; Piazzale Roma–Mestre ≈ 15-20 dk. Bilet tek yön ≈ 1,50 € (rehber kaynakları).',
    officialUrl: ACTV_URL,
    ticketType: 'actv_pass',
    ticketPriceStr: '21:00 öncesi bilet geçerli · sonrası ≈ 1,50 € tek yön',
    criticalNotice:
      '48 saatlik biletiniz Cuma ≈ 21:00’de dolar. Tramvaya 21:00’den ÖNCE binip biletinizi okutun. Geçerlilik süresi başladığı saatten itibaren 48 saattir — başlangıç saatinizi PassTracker’dan kontrol edin.',
    offlineTip:
      '21:00’i geçirirseniz tramvay durağındaki otomattan veya ACTV uygulamasından 1,50 €’luk bilet alın ve bindiğiniz anda okutun.',
    stopsSequence: [
      { name: 'Piazzale Roma', pierOrPlatform: 'Biniş & okutma', timeOffsetMin: 0 },
      { name: 'Ponte della Libertà', timeOffsetMin: 6 },
      { name: 'Mestre Stazione', pierOrPlatform: 'İniş', isKeyTransfer: true, timeOffsetMin: 18 },
    ],
  },

  // 9. Santa Sofia Traghetto
  'traghetto-santa-sofia': {
    lineCode: 'Traghetto Santa Sofia (Büyük Kanal gondol geçişi)',
    vehicleType: 'gondola',
    departureStation: 'Santa Sofia / Ca’ d’Oro (Cannaregio)',
    departurePierOrTrack: 'Sarı "Traghetto" tabelasıyla işaretli rıhtım',
    arrivalStation: 'Rialto Pescheria (San Polo)',
    arrivalPierOrTrack: 'Rialto Balık Pazarı karşı rıhtımı',
    travelDurationMin: 3,
    frequency: 'Yolcu dolunca / sürekli',
    serviceWindow: 'Yaklaşık sabah 8 – akşam 18-19 (kaynaklar 7:30-20:00 ile 8:30-18:00 arasında değişiyor)',
    verification: 'tahmini',
    sourceNote:
      'Reid’s Italy: Pzt-Cmt 7:30-20:00, Pazar 8:45-19:00; areasosta (2022): Pzt-Cmt 8:30-18:00, Pazar 9:00-18:00. 2 € turist (yerliler 0,70 €), sadece nakit. Çalışma saatleri mevsim ve hafta sonuna göre değişebilir.',
    ticketType: 'cash_coins',
    ticketPriceStr: '2 € (nakit, kişi başı)',
    criticalNotice: 'ACTV bileti geçmez, kart çekmez. Cebinizde bozuk para bulundurun.',
    offlineTip:
      'Ayakta durun, gondolcular genellikle ayakta biner. Bu gün öğlen saatlerinde olduğu için çalışma saati sorun olmaz.',
    stopsSequence: [
      { name: 'Santa Sofia rıhtımı', timeOffsetMin: 0 },
      { name: 'Büyük Kanal ortası', timeOffsetMin: 1.5 },
      { name: 'Rialto Pescheria rıhtımı', isKeyTransfer: true, timeOffsetMin: 3 },
    ],
  },

  // 10. Mestre ➔ Havalimanı
  'mestre-to-airport': {
    lineCode: 'ATVO 35B Mestre–Havalimanı (veya ACTV 15)',
    vehicleType: 'bus',
    departureStation: 'Mestre Garı önü',
    departurePierOrTrack: 'ATVO durağı / bilet gişesi (gar önünde)',
    arrivalStation: 'Marco Polo Havalimanı (VCE)',
    arrivalPierOrTrack: 'Terminal önü',
    travelDurationMin: 20,
    frequency: 'Sık seferli (yaklaşık 15-30 dk arayla — tabloyu görün)',
    serviceWindow: 'Mestre’den ≈ 04:30 – 22:15; havalimanından ≈ 06:06 – 01:20',
    verification: 'kaynakli',
    sourceNote:
      'invenicetoday (35B): Mestre 04:30-22:15, havalimanı 06:06-01:20, ≈ 20 dk, ≈ 10 € tek yön / 18 € gidiş-dönüş. ACTV 15 de Mestre Garı–Havalimanı arasında çalışır (daha ucuz, daha yavaş).',
    ticketType: 'airport_bus',
    ticketPriceStr: '≈ 10 € ATVO (tek yön) · ACTV 15 daha ucuz',
    offlineTip:
      'Bavulla ATVO daha konforlu ve doğrudandır. Uçuşunuzdan en az 2,5-3 saat önce havalimanında olacak şekilde planlayın.',
    stopsSequence: [
      { name: 'Mestre Garı önü', timeOffsetMin: 0 },
      { name: 'Mestre Tribunale / Corso del Popolo (ara duraklar)', timeOffsetMin: 5 },
      { name: 'Tessera', timeOffsetMin: 16 },
      { name: 'Marco Polo Havalimanı', pierOrPlatform: 'Terminal önü', isKeyTransfer: true, timeOffsetMin: 20 },
    ],
  },
};
