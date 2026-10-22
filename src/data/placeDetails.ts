// Mekan kartlarındaki "hızlı bilgi" ve detay ekranındaki "Mekan Bilgileri" verisi.
// Saat ve fiyatlar genel bilgi niteliğindedir ve mevsime göre değişir (özellikle Ekim sonu
// saat değişimi ve düşük sezon). Gitmeden önce resmi siteden teyit edin.

export interface PlaceDetails {
  hours?: string; // yaklaşık çalışma saatleri
  ticket?: string; // giriş / tipik harcama
  duration?: string; // önerilen süre
  bestTime?: string; // en iyi zaman / ışık
  highlights?: string[]; // kaçırılmaması gerekenler
  history?: string; // kısa tarihçe / arka plan
  tips?: string[]; // pratik ipuçları
  nearby?: string; // yakında ne var
}

import { ALT_PLACE_DETAILS } from './altPlaceInfo';

export const PLACE_DETAILS: Record<string, PlaceDetails> = {
  ...ALT_PLACE_DETAILS,
  'd1-airport-transfer': {
    duration: '≈ 70 dk (direkt) · ≈ 60-75 dk (Mestre aktarmalı)',
    ticket: '≈ 8,50-10 € kişi başı',
    highlights: ['Varış katında bilet büfesi', 'Padova otobüs terminali garın hemen yanında'],
    tips: [
      'Bagajınız büyükse Padova Garı’ndaki emanet noktasını kullanın.',
      'Direkt otobüs saat başı gider, kaçırırsanız ATVO/ACTV 15 + tren seçeneği hemen devreye girer.',
    ],
  },
  'd1-lens-shop': {
    duration: '≈ 45-60 dk',
    tips: [
      'Mağazanın çalışma saatlerini önceden arayın; İtalya’da öğle arası (≈ 12:30-15:30) kapanma yaygındır.',
      'Lensi ilk kez takarken yağmurdan korunaklı bir yer (kemerli kaldırım, kafe) seçin.',
      'Fatura ve garanti belgesini saklayın; AB dışına çıkarken KDV iadesi (tax free) için pasaport gerekir.',
    ],
  },
  'd1-orto-botanico': {
    hours: 'Ekim’de yaklaşık 09:00-18:00 (son giriş kapanıştan önce); Pazartesi/kış saatleri değişebilir',
    ticket: '≈ 10 € (genel giriş)',
    duration: '≈ 1,5 saat',
    bestTime: 'Yağmurda cam sera; açık havada sabah ışığı',
    highlights: [
      'Goethe Palmiyesi (1585’ten beri; Goethe 1786’da burada bitki evrimi üzerine düşündü)',
      'Biodiversity Garden: iklim kuşaklarını gezdiren modern cam sera',
      'Hortus Sphaericus: dairesel orijinal 1545 planı',
    ],
    history:
      '1545’te Venedik Cumhuriyeti tıbbi bitki eğitimi için kurdu; yerinde ve işlevini sürdüren en eski akademik botanik bahçesi olarak UNESCO Dünya Mirası’dır (1997).',
    tips: ['Yağmurlu günde ilk durak seçin: sera kapalı ve sıcaktır.', 'Kapanışa yakın girerseniz acele edersiniz; en geç ≈ 16:45’te girin.'],
    nearby: 'Basilica di Sant’Antonio ve Prato della Valle 5 dk yürüyüş.',
  },
  'd1-prato-valle': {
    hours: 'Açık alan, 24 saat',
    ticket: 'Ücretsiz',
    duration: '≈ 30-45 dk',
    bestTime: 'Gün batımı ve mavi saat; ıslak zeminde yansımalar',
    highlights: [
      'Isola Memmia: kanalla çevrili elips ada',
      'İki halka halinde heykeller (ünlü bilim insanları ve yönetici figürler)',
      'Santa Giustina Bazilikası ve Sant’Antonio’ya yakınlık',
    ],
    history:
      'Eski Roma tiyatrosu/bataklık alanı 1775’ten itibaren Andrea Memmo’nun planıyla kurutulup elips meydana dönüştürüldü; Avrupa’nın en büyük meydanlarından biridir.',
    tips: ['Pazar günleri çevrede pazar kurulabilir; fotoğraf için erken gelin.', 'Su kenarında zemin kaygan olabilir.'],
  },
  'd1-palazzo-ragione': {
    hours: 'Salone yaklaşık 09:00-19:00 (Pazartesi kapalı olabilir) — teyit edin',
    ticket: '≈ 6-8 € (Salone) · çevre meydanlar ücretsiz',
    duration: '≈ 45-60 dk',
    bestTime: 'Akşamüstü; çevredeki pazar sabah öğleye kadar canlı',
    highlights: [
      'Salone: ≈ 80 m uzunlukta, ters çevrilmiş gemi gövdesi şeklinde tavan',
      'Astrolojik fresk döngüsü ve 15. yy. dev ahşap at',
      'Piazza delle Erbe / Frutta pazar meydanları ve kemerli sokaklar',
    ],
    history:
      '1218-1219’da belediye mahkemesi ve meclis salonu olarak yapıldı; Padova’nın en eski ve ikonik kamu binalarından biridir.',
    tips: ['Kemerler (portici) Padova’yı yağmurda ıslanmadan gezmenizi sağlar.', 'Galileo’nun ders verdiği Palazzo Bo yalnızca rehberli tur ve rezervasyonla gezilir.'],
    nearby: 'Palazzo Bo (Üniversite, Anatomi Tiyatrosu), Duomo, Caffè Pedrocchi 3-5 dk.',
  },
  'd1-caffe-pedrocchi': {
    hours: 'Genelde sabahtan akşama (≈ 08:00-22:00); kat/bölüm saatleri farklı olabilir',
    ticket: '≈ 3,5-5 € (kahve) · masada servis daha pahalıdır',
    duration: '≈ 30 dk',
    bestTime: 'Sabah veya akşamüstü; yağmurda güzel bir sığınak',
    highlights: [
      '"Caffè Pedrocchi": espresso üzerine nane kreması ve kakao',
      'Neoklasik salonlar: Yeşil Oda, Mısır, Etrüsk, Roma odaları',
      'Üst katta Risorgimento Müzesi',
    ],
    history:
      '1831’de Antonio Pedrocchi tarafından açıldı; uzun yıllar kapısız (gece-gündüz açık) kalmasıyla "kapısız kafe" lakabını aldı. 8 Şubat 1848 öğrenci ayaklanmasının merkezlerinden biridir.',
    tips: ['Barda ayakta içmek masadan çok daha ucuzdur.', 'Fotoğraf için iç salonlardan geçmenin keyfini çıkarın.'],
  },
  'd1-dinner-padova': {
    hours: 'Akşam yemeği genelde ≈ 19:00/19:30’dan itibaren; mutfak ≈ 14:30-19:00 arası kapalı olabilir',
    ticket: '≈ 11-16 € kişi başı (menü/yemek seçimine göre)',
    duration: '≈ 60-75 dk',
    highlights: ['Bigoli (kalın spagetti) ve Veneto soslarıyla', 'Üniversite şehri olduğundan fiyatlar makul', 'Padova usulü bollito'],
    tips: ['Özellikle hafta sonu rezervasyon yapın veya erken gidin.', 'Su ve kuver (coperto) hesaba eklenebilir.'],
  },
  'd1-train-pass-start': {
    duration: '≈ 30 dk tren + yürüyüş',
    ticket: 'Tren ≈ 5 € · 48 saatlik bilet ≈ 35 €',
    highlights: ['Venedik’e lagün köprüsünden giriş', 'Santa Lucia çıkışında Büyük Kanal manzarası'],
    tips: [
      'Bileti iskele turnikesinde okutunca 48 saat başlar; süreyi PassTracker’dan takip edin.',
      'Gece Lido’ya geçişte hangi hattın çalıştığını iskele panosundan okuyun.',
    ],
  },
  'd2-morning-vaporetto': {
    duration: '≈ 15-20 dk',
    ticket: '48 saatlik bilet dahil',
    bestTime: 'Sabah erken, sis ve yumuşak ışık',
    highlights: ['San Giorgio Maggiore silüeti', 'Arsenale ve Giardini manzarası'],
    tips: ['Dışarıda ayakta durup çekim yapmak için iskeleye yakın tarafa geçin.', 'Valizsiz hafif gelin; sabah saatinde vapurlar kalabalık olabilir.'],
  },
  'd2-san-marco-ducale': {
    hours: 'Dükler Sarayı: yaklaşık 09:00-19:00 (Kasım’dan itibaren 17:00’ye düşebilir) · Bazilika: yaklaşık 09:30-17:00',
    ticket: 'Dükler Sarayı ≈ 30 € · Bazilika giriş ≈ ücretsiz/online rezervasyon ≈ 3 € · Pala d’Oro ≈ 5 €',
    duration: '≈ 2,5-3 saat',
    bestTime: 'Açılışta (kuyruk az) · yağmurda iç mekân',
    highlights: [
      'Bazilika: altın mozaiklerle kaplı kubbeler, Pala d’Oro',
      'Dükler Sarayı: Büyük Meclis Salonu, Sospiri Köprüsü, hapishane geçişi',
      'Kampanil (çan kulesi) tepesinden lagün manzarası',
    ],
    history:
      'Venedik Cumhuriyeti’nin dini ve siyasi kalbi. Bazilika 11. yy. Bizans etkili plan; saray gotik cepheli ve cumhuriyetin hükümet merkezidir.',
    tips: [
      'Bilet ve saat dilimini önceden online alın; büyük çanta ve tripod içeri alınmaz.',
      'Acqua alta (su baskını) uyarısı varsa meydan kısmen su altında kalabilir; lastik/galoş taşıyın.',
    ],
    nearby: 'Sospiri Köprüsü, Riva degli Schiavoni, Museo Correr.',
  },
  'd2-torrefazione-cannaregio': {
    hours: 'Genelde sabah-öğleden sonra (≈ 08:00-18:00) — gitmeden doğrulayın',
    ticket: '≈ 2,5-4,5 €',
    duration: '≈ 30-45 dk',
    highlights: ['Yerinde kavrulan kahve (1930’lardan)', 'Taze kruvasan ve pasticceria', 'Ormesini Fondamenta kanal kenarı'],
    tips: ['Bardan ayakta içmek masadan ucuzdur.', 'Kahve çekirdeği satın alıp eve götürebilirsiniz.'],
    nearby: 'Ghetto Nuovo, Madonna dell’Orto kilisesi.',
  },
  'd2-grand-canal-cruise': {
    duration: '≈ 45 dk (San Marco ↔ Ferrovia)',
    ticket: '48 saatlik bilet dahil',
    bestTime: 'Gün batımına yakın veya yağmurda cam kenarı',
    highlights: ['Rialto Köprüsü', 'Ca’ d’Oro, Ca’ Rezzonico saray cepheleri', 'Salute Bazilikası'],
    tips: ['Ön tarafta ayakta kalın; kalabalıkta güvertede değerli eşyalarınıza dikkat edin.'],
  },
  'd2-dorsoduro-dogana': {
    hours: 'Punta della Dogana sanat merkezi ve müze kısmen ücretli; dış mekân serbest',
    ticket: 'Dış mekân ücretsiz · müzeler ayrı biletli',
    duration: '≈ 2-3 saat',
    bestTime: 'Öğleden sonra ve gün batımı',
    highlights: [
      'Dogana burnu: Canal Grande ve Giudecca Kanalı’nın buluştuğu nokta',
      'Salute Bazilikası (Baroque, 1631 veba vaadi)',
      'Accademia Köprüsü ve Zattere gezinti yolu',
    ],
    history:
      'Dogana da Mar eski gümrük binasıdır; 17. yy. tepesindeki altın küre ve Fortuna heykeli ikon sayılır.',
    tips: ['Zattere’de Gelato (örn. Nico) yürüyüş eşliğinde güzel bir mola.'],
  },
  'd2-dinner-cicchetti': {
    hours: 'Akşam bar saatleri ≈ 17:30-22:00 (bazı yerler Pazar kapalı)',
    ticket: '≈ 10-18 € kişi başı (cicchetti ≈ 2-4 €, şarap ≈ 2-4 €)',
    duration: '≈ 90 dk',
    highlights: ['Squero di San Trovaso: görünür gondol atölyesi', 'Bakalyaro mantecato, sarde in saor', 'Ombra (küçük bardak şarap)'],
    tips: ['Cicchetti ayakta yenir; masaya oturunca ücret artar.', 'Önce ayakta bir tur yapıp birkaç çeşit deneyin.'],
  },
  'd3-baggage-mestre': {
    duration: '≈ 1,5 saat (Lido → Piazzale Roma ≈ 1 sa, tramvay ≈ 15-20 dk)',
    ticket: '48 saatlik bilet dahil',
    tips: [
      'Tramvay T1 Piazzale Roma’dan Mestre’ye gider; valizle en rahat seçenektir.',
      'Otel erken giriş yapmıyorsa bagajı bırakıp çıkın.',
    ],
  },
  'd3-murano': {
    hours: 'Müze (Museo del Vetro) yaklaşık 10:00-17:00 (kış saatleri) · fırın gösterileri iş yerine göre değişir',
    ticket: 'Müze ≈ 12 € · dış gezi ücretsiz',
    duration: '≈ 1,5 saat',
    bestTime: 'Öğle sonrası; gösteri atölyeleri sabah/öğleden sonra aktif',
    highlights: ['Cam üfleme gösterileri', 'Santi Maria e Donato Bazilikası (12. yy., mozaik zemin)', 'Colonna ve Faro iskeleleri arası kanal yürüyüşü'],
    history: '1291’de yangın riski nedeniyle Venedik cam ocaklarını Murano’ya taşıdı; adanın cam geleneği bugüne ulaştı.',
    tips: [
      'Sokakta "ücretsiz atölye turu" teklif edenler satış amaçlıdır.',
      'Gerçek Murano camı için üretici damgası/mühür sorun.',
    ],
  },
  'd3-burano': {
    hours: 'Dantel Müzesi yaklaşık 10:00-17:00 (Pazartesi kapalı olabilir)',
    ticket: 'Dantel Müzesi ≈ 7 € · dış gezi ücretsiz',
    duration: '≈ 1,5-2 saat',
    bestTime: 'Güneşli öğle sonrası; renkler en canlı olduğunda',
    highlights: ['Rengârenk balıkçı evleri', 'Eğik çan kulesi (San Martino)', 'Buranelli (Bussolà) kurabiye'],
    history: 'Balıkçıların evlerini sisli lagünde kolay seçilsin diye boyadığı rivayeti yaygındır; bugün renk seçimi belediye iznine bağlıdır.',
    tips: ['Dantel satan dükkanların çoğu ithaldir; el yapımı için müzeyi veya "merletto a mano" levhasını arayın.', 'Via Baldassarre Galuppi ana caddedir; kenar kanallar sakindir.'],
  },
  'd3-torcello': {
    hours: 'Santa Maria Assunta yaklaşık 10:30-17:00 (kış saatleri) — teyit edin',
    ticket: 'Katedral ≈ 5 € · kombine ≈ 12 € civarı',
    duration: '≈ 1 saat',
    bestTime: 'Öğleden sonra; ada çok sakindir',
    highlights: ['Santa Maria Assunta’daki Bizans mozaikleri (Son Yargı)', 'Attila’nın Tahtı denen taş koltuk', 'Ponte del Diavolo (parmaklıksız köprü)'],
    history: 'Lagünün ilk yerleşimlerinden biri; 7. yy. kurulup bir dönem on binlerce kişiye ulaştı. Bataklık ve sıtma nedeniyle terk edildi.',
    tips: ['Burano’dan Hat 9 ile ≈ 5 dk; saatini iskelede kontrol edin.', 'Geri dönüş vapuru için son seferi mutlaka not alın.'],
  },
  'd3-arsenale-ocean-space': {
    hours: 'Program ve sergiye göre değişir; genelde öğleden sonra açık',
    ticket: 'Genellikle ücretsiz / bağış (programa göre)',
    duration: '≈ 1-1,5 saat',
    highlights: ['San Lorenzo Kilisesi’nde okyanus odaklı çağdaş sanat/bilim programı', 'Arsenale surları ve bastionları'],
    history: 'Arsenale, Venedik Cumhuriyeti’nin gemi tersanesiydi; 15. yy.’da günde bir gemi üretebilen "montaj hattı" ile ünlüydü.',
    tips: ['Giriş saatlerini oceanspace.org’tan kontrol edin; kapalı olabilir.', 'Sergi kapalıysa Arsenale kapısı ve Riva dei Sette Martiri yürüyüşü.'],
  },
  'd3-caffe-del-doge': {
    hours: 'Genelde sabah-erken akşam (≈ 07:30-18:00)',
    ticket: '≈ 3-5 €',
    duration: '≈ 30 dk',
    highlights: ['Dünya çekirdeklerinden filtre/espresso', 'Latte art', 'Rialto’ya birkaç adım'],
    tips: ['Ayakta bar fiyatı masadan ucuz.', 'Rialto Pazarı’na komşu — kalabalıkta sıra uzayabilir.'],
  },
  'd3-dinner-zucca-vedova': {
    hours: 'Alla Vedova ve La Zucca: öğle ve akşam servisi; mutfak arası ve kapalı günler için önceden arayın',
    ticket: 'La Zucca ≈ 15-22 € · Alla Vedova polpette ≈ 1,5-2 € adet',
    duration: '≈ 60-90 dk',
    highlights: ['La Zucca: balkabağı flan ve sebzeli Veneto mutfağı', 'Alla Vedova: polpette ve mekan tarihi'],
    tips: ['Rezervasyon şart (özellikle La Zucca).', 'Cuma akşamı saat 20:45 pass alarmına dikkat — yemeği buna göre bitirin.'],
  },
  'd3-critical-pass-alert': {
    duration: '≈ 15-20 dk (Piazzale Roma → Mestre)',
    ticket: '21:00 öncesi biletle ücretsiz · sonrası ≈ 1,50 €',
    tips: [
      '48 saatlik biletinizin bitiş saatini PassTracker’dan görün.',
      'Tramvay T1 gece 23:48’e kadar sık gider; 21:00’i geçerseniz tek yön bilet alın.',
    ],
  },
  'd4-mestre-venice': {
    duration: '≈ 15-20 dk (tramvay T1) veya tren ≈ 10 dk',
    ticket: '≈ 1,50 € (tramvay/otobüs)',
    tips: ['Tren Mestre → Santa Lucia ≈ 10 dk ve sık; tramvay Piazzale Roma’ya bırakır.', 'Hafta sonu bilet makinelerinde kuyruk olabilir.'],
  },
  'd4-jewish-ghetto': {
    hours: 'Museo Ebraico ve sinagog turları Cumartesi (Şabat) KAPALI · dış gezi serbest',
    ticket: 'Müze + sinagog turu ≈ 12-14 € (Cumartesi dışında)',
    duration: '≈ 1,5 saat',
    highlights: ['Ghetto Nuovo meydanı (1516)', 'Çok katlı konutlar (kısıtlı alan nedeniyle yukarı büyüdü)', 'Holokost anıtı ve Calle del Ghetto Vecchio'],
    history: '1516’da dünyanın ilk "ghetto"su olarak ayrıldı; kelimenin kökeni bu bölgedeki eski dökümhaneden (getto) gelir.',
    tips: [
      'Bugün Cumartesi olduğu için müze/sinagoglar kapalı olabilir; dışarıdan sokak ve meydanı gezin.',
      'Kosher fırın ve kafelerin çoğu Cumartesi kapalıdır.',
    ],
  },
  'd4-pescheria-market': {
    hours: 'Balık pazarı Salı-Cumartesi sabah; öğleye doğru toparlanır — Pazartesi/Pazar kapalı',
    ticket: 'Gezinti ücretsiz',
    duration: '≈ 45 dk',
    bestTime: 'Sabah erken (≈ 08:00-11:00); 12:00’ye doğru satıcılar kapanır',
    highlights: ['Lagün ve Adriyatik balıkları, deniz mahsulleri', 'Rialto Mercato sebze-meyve tezgâhları', 'Gotik Pescheria kemerli yapısı'],
    tips: ['Plan 11:15’e denk geliyor; pazar erken kapanabilir — mümkünse 10:00’a çekin.', 'Islak zeminde kaygan olabilir; rahat ayakkabı giyin.'],
  },
  'd4-traghetto-crossing': {
    hours: 'Yaklaşık 08:00-18:30; haftaya/mevsime göre değişir',
    ticket: '2 € nakit, kişi başı',
    duration: '≈ 3-5 dk',
    highlights: ['Ayakta Büyük Kanal geçişi', 'Ca’ d’Oro cephesi manzarası'],
    tips: ['ACTV bileti geçmez; bozuk para hazır olsun.', 'Yolcular genelde ayakta geçer; dengenizi koruyun.'],
  },
  'd4-farini-tonolo': {
    hours: 'Tonolo: Pazartesi kapalı olabilir; hafta içi/cumartesi sabah-öğleden sonra · Farini ≈ gün boyu',
    ticket: '≈ 3-7 €',
    duration: '≈ 45-60 dk',
    highlights: ['Tonolo: Fritole, cannolo, Pasticceria Tonolo’nun efsanevi krema dolguluları', 'Farini: ekşi mayalı pizza dilimleri'],
    tips: ['Tonolo’da sıra uzar; akşamdan sipariş ya da sabah erken gelin.', 'Ayakta yemek herkesin yaptığı normal bir şeydir.'],
  },
  'd4-bacareto-da-lele': {
    hours: 'Sabah-öğleden sonra (≈ 06:00-20:30) — Pazar kapalı olabilir',
    ticket: '≈ 4-7 € (tramezzini + şarap)',
    duration: '≈ 30-45 dk',
    highlights: ['Tramezzini ve panini', 'Ombra (küçük bardak şarap)', 'Gara karşısında, hızlı yemek için ideal'],
    tips: ['Küçük bir mekân, çoğu müşteri ayakta içer.', 'Bagajla gelirseniz kapıda yer bulmak zor olabilir.'],
  },
  'd4-airport-departure': {
    duration: '≈ 20 dk otobüs · uçuş öncesi toplam 2,5-3 saat pay',
    ticket: 'ATVO ≈ 10 € · ACTV 15 daha ucuz',
    tips: [
      'Mestre Garı’ndan ATVO her 15-30 dk gider; son seferler akşam ≈ 22:15’e kadar.',
      'Terminalde check-in ve güvenlik kuyruğu için uçuştan 2,5-3 saat önce orada olun.',
    ],
  },
};
