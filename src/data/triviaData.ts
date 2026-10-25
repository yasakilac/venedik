// Gezi bilgi yarışmaları ve görselli "Mekanı Tanı" oyunu. Hepsi cihazda çalışır, internet gerekmez.

export interface TriviaQuestion {
  q: string;
  options: string[];
  answer: number; // doğru seçeneğin indeksi (options içinde)
  info: string; // cevaptan sonra gösterilen bilgi
  image?: string; // public/ altındaki göreli yol
}

export interface TriviaSet {
  id: string;
  emoji: string;
  title: string;
  blurb: string;
  questions: TriviaQuestion[];
  credit?: string;
}

const T = (q: string, options: string[], answer: number, info: string): TriviaQuestion => ({ q, options, answer, info });

export const TRIVIA_SETS: TriviaSet[] = [
  {
    id: 'tr-venedik',
    emoji: '🛶',
    title: 'Venedik Bilgi Yarışması',
    blurb: 'Kanallar, köprüler, adalar ve tarih. 10 soru.',
    questions: [
      T('Venedik yaklaşık kaç küçük adanın üzerine kuruludur?', ['18', '118', '318', '518'], 1, 'Venedik, kanallarla ayrılan ve köprülerle birleşen yaklaşık 118 küçük adadan oluşur.'),
      T('Büyük Kanal (Canal Grande) yaklaşık kaç kilometre uzunluğundadır?', ['1,2 km', '3,8 km', '8 km', '12 km'], 1, 'S biçimli Büyük Kanal yaklaşık 3,8 km uzunluğundadır ve kenarlarında yüzlerce tarihi saray vardır.'),
      T('Rialto Köprüsü’nün bugünkü taş hali hangi yıllarda tamamlandı?', ['1291', '1491', '1591', '1791'], 2, 'Taş Rialto Köprüsü 1591’de tamamlandı; daha önce ahşap köprüler vardı.'),
      T('Cam işçiliğiyle ünlü ada hangisidir?', ['Burano', 'Murano', 'Torcello', 'Lido'], 1, '1291’de yangın riski nedeniyle cam atölyeleri Murano’ya taşındı.'),
      T('Rengârenk evleri ve dantelleriyle bilinen ada hangisidir?', ['Burano', 'Murano', 'Giudecca', 'Lido'], 0, 'Burano, balıkçı evlerinin renkli cepheleri ve dantel geleneğiyle ünlüdür.'),
      T('İç Çekiş Köprüsü (Ponte dei Sospiri) hangi iki yapıyı birbirine bağlar?', ['Dükler Sarayı ve hapishane', 'San Marco ve Rialto', 'İki kilise', 'Saat Kulesi ve Çan Kulesi'], 0, 'Kapalı köprü, Dükler Sarayı’ndaki sorgu odalarını eski hapishane binasına bağlar.'),
      T('Venedik Cumhuriyeti’nin seçilmiş devlet başkanına ne denirdi?', ['Sultan', 'Doge', 'Konsül', 'Prens'], 1, 'Doge, ömür boyu seçilen Venedik Cumhuriyeti başkanıydı.'),
      T('Venedik’te yüksek gelgit nedeniyle ortaya çıkan su baskınına ne ad verilir?', ['Acqua alta', 'Mare piena', 'Tempesta', 'Laguna'], 0, '“Acqua alta” (yüksek su) özellikle sonbahar ve kış aylarında görülür.'),
      T('Venedik Film Festivali hangi adada yapılır?', ['Burano', 'Murano', 'Lido', 'Giudecca'], 2, 'Dünyanın en eski film festivali Lido adasında yapılır ve ilki 1932’de düzenlendi.'),
      T('San Marco Bazilikası hangi azizin kalıntılarına ev sahipliği yapar?', ['Aziz Markos', 'Aziz Antonio', 'Aziz Petrus', 'Aziz Nikolaos'], 0, 'Aziz Markos’un kalıntıları 9. yüzyılda İskenderiye’den Venedik’e getirildi; kentin simgesi kanatlı aslandır.'),
    ],
  },
  {
    id: 'tr-padova',
    emoji: '🏛️',
    title: 'Padova & Veneto Yarışması',
    blurb: 'Üniversite, botanik bahçesi, meydanlar ve bölge. 10 soru.',
    questions: [
      T('Padova Üniversitesi hangi yıl kuruldu?', ['1088', '1222', '1500', '1700'], 1, 'Padova Üniversitesi 1222’de kuruldu ve dünyanın en eski üniversitelerinden biridir.'),
      T('Hangi ünlü bilim insanı Padova Üniversitesi’nde ders verdi?', ['Galileo Galilei', 'Isaac Newton', 'Albert Einstein', 'Marie Curie'], 0, 'Galileo 1592-1610 arasında Padova’da matematik dersi verdi.'),
      T('Padova’daki Orto Botanico hangi yıl kuruldu ve neyle ünlüdür?', ['1545, en eski akademik botanik bahçelerinden', '1745, ilk hayvanat bahçesi', '1945, modern park', '1345, saray bahçesi'], 0, '1545’te tıbbi bitkiler için kurulan bahçe UNESCO Dünya Mirası’dır.'),
      T('Prato della Valle’nin ortasındaki kanalla çevrili ada hangi adı taşır?', ['Isola Memmia', 'Isola Bella', 'Isola Verde', 'Isola Santa'], 0, 'Meydanı düzenleyen Andrea Memmo’nun adını taşıyan ada, heykellerle çevrilidir.'),
      T('Padova’nın koruyucu azizi ve ünlü bazilikanın adı kimdir?', ['Aziz Antonio', 'Aziz Franciscus', 'Aziz Markos', 'Aziz Jorj'], 0, 'Aziz Antonio’ya adanmış bazilika, kısaca “Il Santo” diye anılır.'),
      T('Caffè Pedrocchi’nin ünlü lakabı nedir?', ['Kapısız kafe', 'Bin sütunlu kafe', 'Gece kafesi', 'Yeşil kafe'], 0, '1831’de açılan kafe uzun süre gece gündüz açık kaldığı için “kapısız kafe” denir.'),
      T('Giotto’nun ünlü freskleri Padova’da hangi şapelde bulunur?', ['Scrovegni Şapeli', 'Sistine Şapeli', 'Pazzi Şapeli', 'Medici Şapeli'], 0, 'Scrovegni (Arena) Şapeli, İtalyan resminin dönüm noktalarından biridir.'),
      T('Veneto bölgesinin başkenti hangisidir?', ['Padova', 'Verona', 'Venedik', 'Treviso'], 2, 'Veneto’nun başkenti Venedik’tir; Padova, Verona ve Treviso bölgenin diğer önemli kentleridir.'),
      T('Veneto’nun ünlü köpüklü şarabı hangisidir?', ['Prosecco', 'Chianti', 'Barolo', 'Lambrusco'], 0, 'Prosecco, Veneto ve komşu Friuli bölgesine özgü köpüklü şaraptır.'),
      T('Shakespeare’in “Romeo ve Juliet” oyununun geçtiği Veneto kenti hangisidir?', ['Verona', 'Vicenza', 'Belluno', 'Rovigo'], 0, 'Oyun Verona’da geçer; kentte “Juliet’in Evi” adlı turistik bir balkon bulunur.'),
    ],
  },
  {
    id: 'tr-pratik',
    emoji: '🎒',
    title: 'Gezgin Pratik Bilgiler',
    blurb: 'İtalya’da ulaşım, yemek ve gündelik hayat. 10 soru.',
    questions: [
      T('İtalyan restoranlarında “coperto” nedir?', ['Masa/kuver ücreti', 'Bahşiş', 'Rezervasyon ücreti', 'Ekmek hediyesi'], 0, 'Coperto, masa kuver ücretidir; genelde kişi başı birkaç euro eklenir.'),
      T('Bir barda “al banco” içmek ne demektir?', ['Tezgâhta ayakta içmek', 'Dışarıda oturarak içmek', 'Paket içmek', 'Çok içmek'], 0, 'Tezgâhta ayakta içmek masada oturmaktan genelde daha ucuzdur.'),
      T('Venedik’te Büyük Kanal’ı 2 € gibi küçük bir ücretle geçiren gondol tipi kayığa ne denir?', ['Traghetto', 'Vaporetto', 'Sandolo', 'Alilaguna'], 0, 'Traghetto, birkaç noktada Büyük Kanal’ı karşıdan karşıya geçiren sade gondoldur.'),
      T('Venedik’in toplu taşıma vapurlarına ne ad verilir?', ['Vaporetto', 'Gondola', 'Motoscafo', 'Traghetto'], 0, 'ACTV vaporettoları ana toplu taşıma aracıdır.'),
      T('Kâğıt Regionale tren biletleriyle ilgili hangisi doğrudur?', ['Binmeden önce damgalatmak gerekir', 'Kondüktörden alınır', 'Ücretsizdir', 'Yalnızca gişede geçerlidir'], 0, 'Kâğıt biletler binmeden önce doğrulama (validazione) makinesinde damgalanmalıdır.'),
      T('Spritz hangi İtalyan bölgesinin aperitifidir?', ['Veneto', 'Sicilya', 'Toskana', 'Piemonte'], 0, 'Spritz, Veneto ve Venedik kökenli bir aperitif kokteylidir.'),
      T('Venedik’in tarihi merkezinde araba kullanılır mı?', ['Hayır, araç trafiği yoktur', 'Evet, her yerde', 'Yalnızca gece', 'Yalnızca taksiyle'], 0, 'Tarihi ada kanal ve dar sokaklarla örülüdür; ana ulaşım yürüyüş ve su yoludur.'),
      T('“Cicchetti” nedir?', ['Venedik barlarındaki küçük atıştırmalıklar', 'Gondol şarkıları', 'Bir cam türü', 'Bir tür köprü'], 0, 'Cicchetti, bacaro denilen barlarda yenen küçük porsiyonluk lezzetlerdir.'),
      T('İtalya’da sabah selamı hangisidir?', ['Buongiorno', 'Buonanotte', 'Arrivederci', 'Prego'], 0, '“Buongiorno” gün içinde, “buonasera” akşam selamıdır.'),
      T('Venedik’teki Lido adası neyi ayırır?', ['Lagünü Adriyatik Denizi’nden', 'Venedik’i Padova’dan', 'Murano’yu Burano’dan', 'Büyük Kanal’ı lagünden'], 0, 'Lido, uzun bir kum şeridi ada olarak lagünü açık denizden ayırır.'),
    ],
  },
];

// ---- Görselli "Mekanı Tanı" ----
interface Place {
  id: string; // public/places/<id>.jpg
  name: string;
  info: string;
  file: string; // Wikimedia Commons dosya adı
}

const PLACES: Place[] = [
  { id: 'rialto', name: 'Rialto Köprüsü', info: 'Büyük Kanal’ı geçen dört köprüden en eskisi; taş hali 1591’de tamamlandı.', file: 'Rialto_2025_4.jpg' },
  { id: 'sanmarco', name: 'San Marco Bazilikası', info: 'Venedik’in devlet kilisesiydi; Bizans etkili mozaikli cephesiyle bilinir.', file: 'Venezia_Basilica_di_San_Marco_Fassade_2.jpg' },
  { id: 'dukler', name: 'Dükler Sarayı ve Çan Kulesi', info: 'San Marco Meydanı’nın kıyıya bakan yüzünde, Venedik Gotiği örneği Dükler Sarayı ve Campanile.', file: '(Venice)_Doge\'s_Palace_and_campanile_of_St._Mark\'s_Basilica_facing_the_sea.jpg' },
  { id: 'sighs', name: 'İç Çekiş Köprüsü', info: 'Dükler Sarayı’nı eski hapishaneye bağlayan kapalı beyaz köprü.', file: 'Antonio_Contin_-_Ponte_dei_sospiri_(Venice).jpg' },
  { id: 'burano', name: 'Burano', info: 'Rengârenk balıkçı evleri ve eğri çan kulesiyle ünlü lagün adası.', file: 'Burano_Venice_17.jpg' },
  { id: 'salute', name: 'Santa Maria della Salute', info: '1630 veba salgınının ardından “şükran” olarak yapılan barok kilise.', file: 'Santa_Maria_della_Salute_from_Hotel_Monaco.jpg' },
  { id: 'prato', name: 'Prato della Valle', info: 'Padova’da kanallı elips biçimli, Avrupa’nın en büyük meydanlarından biri.', file: 'Prato_della_Valle_in_Padua.JPG' },
  { id: 'santonio', name: 'Sant’Antonio Bazilikası', info: 'Padova’nın simgesi; “Il Santo” diye anılır, çok kubbeli yapısıyla bilinir.', file: 'Basilica_of_St._Anthony_in_Padua.jpg' },
  { id: 'pedrocchi', name: 'Caffè Pedrocchi', info: '1831’de açılan neoklasik kafe; “kapısız kafe” lakaplıdır.', file: 'Caffè_Pedrocchi.JPG' },
  { id: 'botanico', name: 'Padova Orto Botanico', info: '1545’te kurulan, dünyanın en eski akademik botanik bahçelerinden biri (UNESCO).', file: 'Orto_botanico_padova.JPG' },
];

export const PLACE_QUIZ: TriviaSet = {
  id: 'tr-mekan',
  emoji: '📸',
  title: 'Mekanı Tanı (Görselli)',
  blurb: 'Fotoğrafa bak, neresi olduğunu bul. 10 soru.',
  credit:
    'Fotoğraflar Wikimedia Commons’tan alınmıştır; yazar ve lisans bilgileri her dosyanın Commons sayfasında yer alır (commons.wikimedia.org/wiki/File:<dosya adı>). Dosyalar: ' +
    PLACES.map((p) => p.file).join(', '),
  questions: PLACES.map((p, i) => {
    // yanlış şıklar: diğer mekanlardan, düzenli ama her seferinde farklı karıştırılır (oynarken)
    const others = PLACES.filter((x) => x.id !== p.id);
    const wrong = [others[(i + 1) % others.length], others[(i + 4) % others.length], others[(i + 7) % others.length]];
    const options = [p.name, ...wrong.map((w) => w.name)];
    return {
      q: 'Bu fotoğraf neresi?',
      options,
      answer: 0,
      info: p.info,
      image: `places/${p.id}.jpg`,
    };
  }),
};

export const ALL_TRIVIA: TriviaSet[] = [...TRIVIA_SETS, PLACE_QUIZ];
