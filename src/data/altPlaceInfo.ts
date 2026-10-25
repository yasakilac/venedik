import type { PlaceDetails } from './placeDetails';
import type { AccessInfo } from './stopMeta';

// Alternatif plan durakları için "Mekan Bilgileri" ve "Buraya nasıl gidilir?" verisi.
// Saat ve fiyatlar genel bilgidir; Ekim sonu saat değişimi ve düşük sezon nedeniyle değişebilir, gitmeden teyit edin.

export const ALT_PLACE_DETAILS: Record<string, PlaceDetails> = {
  'alt-d1-lido-coffee': {
    hours: 'Barlar genelde 06:30-20:00 arası açık; sahil yürüyüşü 24 saat',
    ticket: 'Ayakta espresso ≈ 1,20-1,50 €, kruvasan ≈ 1,50-2 €',
    duration: '≈ 1,5 saat',
    bestTime: 'Sabah ışığı; Ekim’de sahil sakin ve serindir',
    highlights: [
      'Viale Santa Maria Elisabetta: iskeleden sahile uzanan ana cadde',
      'Lungomare: Adriyatik’e bakan uzun sahil yolu ve kumsal',
      'Art Nouveau / Liberty tarzı villalar ve eski otel cepheleri',
    ],
    history:
      'Lido, Venedik lagününü Adriyatik’ten ayıran uzun kum şeridi adadır. 20. yüzyıl başında lüks deniz tatili merkezi oldu; Venedik Film Festivali her yıl burada yapılır.',
    tips: [
      'Masada oturmak yerine al banco (bar tezgâhında ayakta) içerseniz fiyat belirgin düşer.',
      'Ekim’de rüzgâr serttir; sahilde rüzgârlık gerekir.',
      'Kumsallardaki özel plaj bölümleri sezon dışında kapalıdır; kıyıdan yürümek serbesttir.',
    ],
    nearby: 'Lido S.M.E. iskelesi ≈ 5-10 dk yürüyüş; Conad City / Coop aynı caddede.',
  },
  'alt-d1-line1': {
    hours: 'Hat 1 gün boyunca sık, gece de tarifeli çalışır (güncel saat için ACTV uygulaması)',
    ticket: 'Pass dahil (tek biniş 9,50 € civarı)',
    duration: '≈ 1 saat 10 dk - 1 saat 20 dk (Lido → Piazzale Roma, tüm duraklar)',
    bestTime: 'Gün ışığı; sabah geç saat ve öğleden sonra cepheler iyi aydınlanır',
    highlights: [
      'Rialto Köprüsü ve Ca’ d’Oro’nun Gotik cephesi',
      'Santa Maria della Salute Bazilikası',
      'Accademia Köprüsü ve Büyük Kanal’ın iki yakasındaki saraylar',
    ],
    history:
      'Büyük Kanal ≈ 3,8 km uzunluğunda S biçimli ana su yoludur; Venedik soyluları saraylarını (palazzo) kanala bakacak şekilde inşa etti. Hat 1 bu kanalın tüm duraklarına uğrayan yavaş vapurdur.',
    tips: [
      'Pass’i ilk binişte turnikede mutlaka okutun.',
      'Ön veya arka açık bölümlerde yer bulmak için ilk duraktan (Lido) bininceye kadar erken olun.',
      'Yağmurda kapalı salonda oturun; camlar buğulanır, bir parça silin.',
      'Kalabalık saatte valiz ve büyük çanta taşımayın.',
    ],
    nearby: 'Rialto, Ca’ d’Oro ve Accademia iskelelerinde inmek kolaydır.',
  },
  'alt-d1-rialto': {
    hours: 'Köprü 24 saat açık; fırınlar ve tezgâhlar yaklaşık 08:00-20:00',
    ticket: 'Köprü ücretsiz; dilim pizza ≈ 2-4 €, tramezzino ≈ 2-3 €',
    duration: '≈ 1,5 saat',
    bestTime: 'Sabah erken veya akşama doğru; öğle arası çok kalabalıktır',
    highlights: [
      'Ponte di Rialto: Büyük Kanal’ın en eski ve en ünlü köprüsü',
      'Rialto Pazarı (Erberia/Pescheria) ve çevresindeki dar sokaklar',
      'Kanal kenarında Riva del Vin: manzaralı oturak yerleri',
    ],
    history:
      'Taş köprü 1591’de tamamlandı; daha önce ahşap köprüler vardı. Rialto bölgesi Orta Çağ’dan beri Venedik’in ticaret ve para merkeziydi.',
    tips: [
      'Coperto (masa ücreti) ve servis ücretinden kaçınmak için masada oturmayın.',
      'Doğrudan kanal kenarındaki turistik restoranlar pahalıdır; iki üç sokak içeride fiyatlar düşer.',
      'Cüzdan ve telefon için çanta güvenliğine dikkat edin; kalabalık noktadır.',
    ],
    nearby: 'Campo San Bartolomio, Rialto Pazarı ve San Marco yürüyerek ≈ 10-15 dk.',
  },
  'alt-d1-san-marco': {
    hours: 'Meydan 24 saat açık; Bazilika, Dükler Sarayı ve Çan Kulesi iç mekanları ücretli ve saatli',
    ticket: 'Meydan ve dış cepheler ücretsiz (iç mekanlar ücretli)',
    duration: '≈ 3,5 saat (meydan + Cannaregio yürüyüşü)',
    bestTime: 'Sabah erken veya akşam; kalabalıktan uzak',
    highlights: [
      'San Marco Bazilikası: Bizans etkili mozaikli cephe ve kubbeler',
      'Dükler Sarayı (Palazzo Ducale): Venedik Gotiği',
      'Campanile (Çan Kulesi) ve Torre dell’Orologio (Saat Kulesi)',
    ],
    history:
      'Bazilika 11. yüzyılda bugünkü biçimine kavuştu ve Venedik Cumhuriyeti’nin devlet kilisesiydi. Dükler Sarayı, doj’un (Venedik başkanının) ikametgâhı ve hükûmet merkeziydi.',
    tips: [
      'Bazilika içi için omuz ve diz kapalı giyin; iç mekan bu planda dışarıda bırakıldı.',
      'Meydanda kafelerde oturmak (özellikle orkestralı olanlar) çok pahalıdır; sadece geçin.',
      'Yükselen su (acqua alta) sezonunda meydan önce su altında kalır; lastik bot veya su geçirmez ayakkabı düşünün.',
      'Cannaregio’ya yürümek ≈ 25-30 dk sürer; vapur Hat 4.1/4.2 veya Hat 1 alternatiftir.',
    ],
    nearby: 'Ponte dei Sospiri (İç Çekiş Köprüsü), Riva degli Schiavoni, Cannaregio, Ghetto.',
  },
  'alt-d1-aperitivo': {
    hours: 'Bacaro’lar genelde 17:00-22:00; öğlen de açık olanlar çok',
    ticket: 'Spritz ≈ 3-4 €, cicchetti ≈ 1,5-3 € adet',
    duration: '≈ 2 saat',
    bestTime: 'Gün batımı öncesi (17:30 - 19:30)',
    highlights: [
      'Cicchetti: baccalà mantecato (kaymaklı morina), sarde in saor, krostini',
      'Spritz: Aperol veya Select ile yapılan Venedik usulü',
      'Campo Santa Margherita: öğrenci hayatı ve canlı akşam atmosferi',
    ],
    history:
      'Bacaro, Venedik’in küçük meyhane geleneğidir; ombra (yarım kadeh şarap) ve cicchetti atıştırmalıkları yüzyıllardır sürer. Dorsoduro, Ca’ Foscari Üniversitesi nedeniyle genç bir bölgedir.',
    tips: [
      'Tezgâhta ayakta yiyip içmek hem ucuz hem yerel usuldür.',
      'Ombra istemek için “un’ombra” deyin; kadeh genelde 1-2 € civarıdır.',
      'Birkaç farklı barda birer parça yiyerek ilerlemek (giro de ombre) en eğlenceli yöntemdir.',
    ],
    nearby: 'Accademia Köprüsü, Zattere, Ca’ Foscari ve San Pantalon kilisesi.',
  },
  'alt-d1-return-lido': {
    duration: '≈ 20-60 dk (hat ve duraklara göre)',
    ticket: 'Pass dahil',
    tips: [
      'Lido’ya hızlı hat 5.1/5.2 (halka hat) ve Hat 1 gider; güncel saat için ACTV uygulamasına bakın.',
      'Akşam sefer sıklığı azalır; son vapuru kaçırmayın.',
      'Vapurda oturamıyorsanız valiz alanından uzak durun, çıkış kapılarını kapatmayın.',
    ],
  },
  'alt-d2-to-burano': {
    duration: '≈ 1 saat - 1 saat 15 dk (aktarmalı)',
    ticket: 'Pass dahil',
    highlights: [
      'Lagünün açık sularından geçiş; kuş ve balıkçı tekneleri manzarası',
      'Aktarma yaptığınız iskele Fondamente Nove olabilir (güncel rotayı uygulamada doğrulayın)',
    ],
    tips: [
      'Aktarma ve sefer saatlerini ACTV uygulamasından hesaplayın; sabah erken çıkın.',
      'Pass’i ilk binişteki turnikeye okutmayı unutmayın.',
      'Dışarıda rüzgâr sert olur; başlık veya rüzgârlık alın.',
    ],
  },
  'alt-d2-burano': {
    hours: 'Ada açık alan 24 saat; dükkânlar ve kafeler yaklaşık 09:30-18:00',
    ticket: 'Ücretsiz',
    duration: '≈ 3 saat',
    bestTime: 'Öğle ışığı; cepheler en canlı renkleri o saatte gösterir',
    highlights: [
      'Rengârenk boyalı balıkçı evleri',
      'San Martino Kilisesi’nin eğri çan kulesi',
      'Dantel (merletto) dükkânları ve geleneksel bussolà kurabiyesi',
    ],
    history:
      'Burano, yüzyıllardır balıkçılık ve dantel işçiliğiyle bilinir. Evlerin renkli boyanmasının, sisli havada balıkçıların evlerini bulabilmesi için olduğu anlatılır; bu bir efsane olabilir.',
    tips: [
      'Hasır ve dantel hatıra eşyalarının bir kısmı Çin yapımıdır; “Burano’da elle yapıldı” belgesine bakın.',
      'Bussolà kurabiyelerini fırınlardan alın; poşetli olanlar hediye için pratiktir.',
      'Evlerin sakinleri vardır; pencerelere yaklaşmayın, ses düzeyini düşük tutun.',
      'Öğlen yemeği için ada restoranları pahalı olabilir; fırın atıştırmalıkları bütçe dostu.',
    ],
    nearby: 'Torcello Adası vapurla ≈ 5 dk; Mazzorbo köprüyle yürüyerek.',
  },
  'alt-d2-murano-transfer': {
    duration: '≈ 30-50 dk',
    ticket: 'Pass dahil',
    tips: [
      'Murano içinde Colonna, Faro, Navagero, Museo gibi birkaç iskele vardır; Faro / Museo iskelesi merkez yürüyüşü için uygundur.',
      'Sefer saatleri ve aktarmayı ACTV uygulamasından kontrol edin.',
    ],
  },
  'alt-d2-murano': {
    hours: 'Dükkânlar yaklaşık 10:00-17:30; atölye gösterileri genelde gündüz',
    ticket: 'Sokaklar ve vitrinler ücretsiz; cam müzesi ücretli (bu planda yok)',
    duration: '≈ 2,5 saat',
    bestTime: 'Öğleden sonra ışık; vitrinler iyi aydınlanır',
    highlights: [
      'Rio dei Vetrai ve Fondamenta dei Vetrai boyunca cam vitrinleri',
      'Santi Maria e Donato Bazilikası: Veneto-Bizans mimarisi ve zemin mozaiği',
      'Murano Faro (Deniz Feneri) çevresi ve kanal manzaraları',
    ],
    history:
      '1291’de yangın riski nedeniyle Venedik’in cam ustaları Murano’ya taşındı; adada cam üretimi yüzyıllardır sürer. Ustalar bir süre adadan ayrılamazdı; bu, formülleri korumaya yönelikti.',
    tips: [
      'Fabrika turlarına “ücretsiz gösteri” diyerek yönlendiren komisyoncular vardır; genelde amaç satıştır.',
      'Hatıra için “Vetro Artistico Murano” markasını ve gerçeklik etiketini arayın; ucuz imitasyonlar çok.',
      'Cam eşya alırsanız uçak bagajı için sağlam paketleme isteyin.',
    ],
    nearby: 'Burano, Torcello ve Fondamente Nove vapur bağlantıları.',
  },
  'alt-d2-return-lido': {
    duration: '≈ 45 dk - 1 saat 15 dk',
    ticket: 'Pass dahil',
    tips: [
      'Pass’in bitiş saati ilk okutma saatine bağlıdır; son geçişi onun öncesine yerleştirin.',
      'Akşama doğru sefer seyrekleşebilir; dönüş saatini erkene koyun.',
    ],
  },
  'alt-d2-lido-dinner': {
    hours: 'Marketler genelde 08:00-20:00 (Pazar kısa); sahil yolu 24 saat',
    ticket: 'Kişi başı ≈ 6-10 €',
    duration: '≈ 1,5-2 saat',
    bestTime: 'Akşamüstü gün batımı öncesi',
    highlights: [
      'Asiago, Montasio gibi Veneto peynirleri',
      'Taze ekmek, grissini ve mevsim meyvesi',
      'Sahil kenarında yürüyerek yemek keyfi',
    ],
    tips: [
      'Alkol satışında saat sınırı olabilir; su, meyve suyu ve gazlı içecekler her zaman bulunur.',
      'Sahilde yiyecekken çöpünüzü toplayın; Lido yerel halkın yaşadığı bir adadır.',
      'Plastik poşet ücretlidir; bez çanta taşıyın.',
    ],
  },
  'alt-d3-to-padova': {
    duration: '≈ 1 saat 30 dk - 2 saat (Lido → Padova)',
    ticket: 'Vapur tek yön ≈ 9,50 € (75 dk bilet, pass bitmişse); Mestre tramvay/otobüs ≈ 1,50 €; Mestre–Padova tren ≈ 4-5 €',
    highlights: [
      'Mestre’den Padova’ya trenler sık kalkar, yolculuk ≈ 15-30 dk',
      'Regionale (R) en ucuz ve yavaştır; Regionale Veloce (RV) biraz hızlıdır',
    ],
    tips: [
      'Tren biletini peronda bulunan makinelerden veya Trenitalia uygulamasından alın; Regionale biletlerinin çoğu için trende doğrulama (validazione) gerekir, biletinizi okutmayı unutmayın.',
      'Pass’in bittiğini unutmayın; Lido–Mestre için tek kullanımlık biletler gerekir.',
      'Cumartesi sabahı hat sıklığı düşebilir; erken çıkın.',
    ],
    nearby: 'Mestre istasyonu: bagaj emanet ve market seçenekleri.',
  },
  'alt-d3-bike-rent': {
    hours: 'RideMovi istasyonları genelde 24 saat (uygulama üzerinden)',
    ticket: 'Uygulamadaki güncel tarifeye bakın; kısa kullanım düşük ücretlidir',
    duration: '≈ 30 dk (kurulum ve ilk alma)',
    highlights: [
      'İstasyon önü RideMovi park noktası (uygulamada haritada görünür)',
      'Padova’da bisiklet şeritleri ve ZTL (araç kısıtlı) merkez',
    ],
    tips: [
      'RideMovi uygulamasını ve kartınızı önceden kurun; yabancı telefon hatlarında kayıt zaman alabilir.',
      'Bisikleti çok uzun süre bırakmayın; uygulamada kilit durumunu ve süreyi izleyin.',
      'Tarihi merkezde bazı sokaklar yaya bölgesidir; bisikleti yönlendirin ve yayalara öncelik verin.',
      'Yağmurda kaldırım taşları kayganlaşır; yavaş sürün.',
    ],
  },
  'alt-d3-prato': {
    hours: 'Açık alan 24 saat; Palazzo Bo iç turu yalnızca rehberli ve saatli',
    ticket: 'Prato ücretsiz; Palazzo Bo iç tur ücretli (bu planda dıştan)',
    duration: '≈ 2,5 saat',
    bestTime: 'Sabah; gün batımına yakın mavi saat',
    highlights: [
      'Isola Memmia: kanalla çevrili elips ada ve 78 heykel',
      'Basilica di Santa Giustina: meydana bakan dev bazilika',
      'Palazzo Bo: Padova Üniversitesi’nin tarihi merkezi',
    ],
    history:
      'Padova Üniversitesi 1222’de kuruldu ve dünyanın en eski ikinci üniversitelerinden biri sayılır; Galileo burada ders verdi. Prato della Valle, 18. yüzyılda Andrea Memmo tarafından düzenlendi.',
    tips: [
      'Prato’yu bisikletle çevirmek için ada çevresindeki dış halkayı kullanın.',
      'Pazartesi dışında cumartesi sabahı Prato’da pazar kurulabilir; kalabalık olursa bisikleti yürütün.',
      'Palazzo Bo avlusuna girişte kurallara uyun ve saygılı olun; öğrenci binası olarak kullanılır.',
    ],
    nearby: 'Orto Botanico, Basilica di Sant’Antonio ve Piazza delle Erbe ≈ 5-10 dk bisiklet.',
  },
  'alt-d3-lunch': {
    hours: 'Pazar tezgâhları genelde 07:30-13:30; fırınlar gün içinde',
    ticket: 'Kişi başı ≈ 4-8 €',
    duration: '≈ 1 saat',
    bestTime: 'Öğle civarı; tezgâhlar canlıdır',
    highlights: [
      'Piazza delle Erbe ve Piazza della Frutta: Orta Çağ’dan beri süren sebze-meyve pazarı',
      'Palazzo della Ragione’nin dev çatısı ve alttaki Sotto il Salone tezgâhları',
      'Caffè Pedrocchi: 1831’de açılan neoklasik “kapısız” kafe (dıştan)',
    ],
    history:
      'Palazzo della Ragione, 13. yüzyıldan kalma adalet sarayıdır ve Avrupa’nın en büyük ahşap çatılı salonlarından birine sahiptir. Pedrocchi, 19. yüzyılda entelektüel buluşma noktası olarak ünlendi.',
    tips: [
      'Pedrocchi’de masada oturmak pahalıdır; ayakta bir espresso tezgâhta daha ucuzdur.',
      'Bisikleti kilitleyin; pazar bölgesi kalabalıktır ve hırsızlık olabilir.',
      'Sotto il Salone’da şarküteri, peynir ve prosciutto tezgâhlarından küçük porsiyon alın.',
    ],
    nearby: 'Palazzo Bo, Piazza dei Signori ve Ghetto bölgesi yürüyerek 5 dk.',
  },
  'alt-d3-sant-antonio': {
    hours: 'Bazilika yaklaşık 06:20-19:00 (ibadet saatlerinde ziyaret kısıtlı olabilir)',
    ticket: 'Bazilikaya giriş ücretsiz; müze ve bazı bölümler ücretli olabilir',
    duration: '≈ 2 saat',
    bestTime: 'Öğleden sonra ışık; hafta içi daha sakin',
    highlights: [
      'Çoklu kubbeli Roma-Gotik-Bizans karışımı cephe',
      'Piazza del Santo’daki Gattamelata atlı heykeli (Donatello)',
      'Hacıların Sant’Antonio’nun mezarını ziyaret ettiği iç kısım',
    ],
    history:
      'Lizbon doğumlu Aziz Antonio 1231’de Padova’da öldü. Bazilika 13. yüzyılda yapılmaya başlandı ve günümüzde önemli bir hac merkezidir. “Il Santo” adıyla anılır.',
    tips: [
      'İçeri girmek için omuzlar ve dizler kapalı olmalı; atkı ve şal yanınızda olsun.',
      'Bazilika içinde fotoğraf ve konuşma kısıtlıdır; kurallara uyun.',
      'Yanındaki Prato della Valle ve Orto Botanico ile birlikte tek rotada gezilebilir.',
    ],
    nearby: 'Orto Botanico ve Prato della Valle ≈ 3-5 dk bisiklet.',
  },
  'alt-d4-lido-mestre': {
    duration: '≈ 1 saat 15 dk - 1 saat 45 dk',
    ticket: 'Vapur ≈ 9,50 € (75 dk bilet; Mestre tramvay/otobüsünde geçerliliğini ACTV’den teyit edin)',
    highlights: ['Hat 1 ile Büyük Kanal’a son bakış', 'Piazzale Roma’da tramvay T1 / otobüs aktarması'],
    tips: [
      'Valizi merdivenli köprülerden uzak tutmak için doğrudan vapur iskelesinden Piazzale Roma’ya inin.',
      'Biletiniz yaklaşık 75 dakikadır; aktarmayı hızlı yapın.',
      'Uçuş saatine göre toplam süreyi bol tutun (valiz, kalabalık, sefer aralığı).',
    ],
    nearby: 'Piazzale Roma tramvay durağı ve otogar yan yana.',
  },
  'alt-d4-mestre-break': {
    hours: 'Kafeler yaklaşık 07:00-20:00; Pazar günü bazı dükkânlar kapalı',
    ticket: 'Espresso ≈ 1,20-1,50 €; kruvasan ≈ 1,50-2 €',
    duration: '≈ 1-2,5 saat',
    highlights: ['Piazza Ferretto: Mestre’nin canlı ana meydanı', 'Mestre Garı yakınında market ve kafeler'],
    tips: [
      'Uçuşunuz geçse bile bu mola için üst sınır koyun; bavullu dolaşmak yorucu.',
      'Gar çevresinde bagaj emanet (deposito bagagli) seçeneklerini önceden bakın.',
      'Pazar günü bazı marketler erken kapanabilir; su ve atıştırmalığı erkenden alın.',
    ],
    nearby: 'Mestre Garı ≈ 10 dk yürüyüş.',
  },
  'alt-d4-airport': {
    hours: 'ATVO 35B Mestre’den yaklaşık 04:30-22:15 (teyit edin); ACTV 15 de çalışır',
    ticket: 'ATVO ≈ 10 € (tahmini); ACTV 15 daha ucuz ve daha yavaş',
    duration: '≈ 20 dk (ATVO) - 35 dk (ACTV 15)',
    highlights: ['Gar önünden doğrudan havalimanına otobüs', 'Tessera üzerinden terminal önüne varış'],
    tips: [
      'Uçuşunuzdan en az 2,5-3 saat önce havalimanında olacak şekilde yola çıkın.',
      'Bilet fiyatı ve seferleri atvo.it ve ACTV’den teyit edin; yazdığım fiyatlar tahmindir.',
      'Bagajla ATVO daha konforludur; ACTV 15 ucuz ama daha uzun sürer.',
    ],
    nearby: 'Havalimanı terminalinde bagaj teslim ve kontrol hızla yapılır.',
  },
  'alt-d3-return': {
    duration: '≈ 1 saat (iade + yolculuk)',
    ticket: 'Padova–Mestre tren ≈ 4-5 €; Mestre–Lido için pass yoksa tek yön bilet',
    tips: [
      'Bisikleti RideMovi uygulamasında kilitleyip kiralamayı bitirdiğinizden emin olun; aksi halde ücret işlemeye devam eder.',
      'İstasyon yakınında yeterli park noktası yoksa 5-10 dk önceden başlayın.',
      'Dönüşte tren biletini önceden alın; cumartesi akşamı trenler dolu olabilir.',
      'Venedik adasında Lido dönüşü son vapur saatlerini kontrol edin.',
    ],
  },
};

const VENICE =
  'Venedik’te araç yok; ana ulaşım yürüyüş ve vapur. Pass geçerliyken Hat 1 / 2 ve 4.1 / 4.2 serbest; köprü ve merdivenler valizle zordur.';
const PADOVA =
  'Padova merkezi yürünebilir ve bisiklet için uygundur (RideMovi). Uzun mesafelerde tramvay SIR1 ve otobüsler vardır; tek yön ≈ 1,50-2 €.';

export const ALT_ACCESS_INFO: Record<string, AccessInfo> = {
  'alt-d1-lido-coffee': {
    alt: 'Lido S.M.E. iskelesinden Viale Santa Maria Elisabetta boyunca sahile ≈ 10 dk yürüyüş.',
    route: 'Alternatif: Lido içinde otobüs B veya C hattı (tarife ve bilet fiyatı için ACTV).',
  },
  'alt-d1-line1': {
    alt: 'Hat 1 yavaş vapur; Hat 2 daha hızlıdır ancak Büyük Kanal’da durak sayısı azdır.',
    route: 'Hat 1 Lido S.M.E. başlangıç iskelesindedir; ilk durak olduğundan oturmak kolaydır.',
  },
  'alt-d1-rialto': {
    alt: VENICE,
    route: 'Hat 1 ile Rialto iskelesi; inince köprü ≈ 3 dk. Alternatif: Hat 2 (daha hızlı).',
  },
  'alt-d1-san-marco': {
    alt: VENICE,
    route: 'Rialto’dan San Marco’ya Mercerie caddesi boyunca yürüyüş ≈ 10-15 dk (kalabalıktır).',
  },
  'alt-d1-aperitivo': {
    alt: VENICE,
    route: 'San Marco’dan Dorsoduro’ya vapur (Hat 1, Accademia iskelesi) ≈ 15 dk; ya da yürüyüş ≈ 30 dk.',
  },
  'alt-d1-return-lido': {
    alt: 'San Zaccaria iskelesinden Lido’ya Hat 5.1/5.2 veya Hat 1.',
    route: 'Piazzale Roma ve Rialto’dan da Hat 1 Lido’ya gider; uzun sürer.',
  },
  'alt-d2-to-burano': {
    alt: 'Lido → San Zaccaria / Fondamente Nove → Burano. Güncel rota için ACTV uygulamasını kullanın.',
    route: 'Alternatif: Punta Sabbioni üzerinden hat 12/14 ile Burano (daha uzun olabilir; uygulamada doğrulayın).',
  },
  'alt-d2-burano': {
    alt: 'Ada içinde yürünür; araç yoktur. Mazzorbo’ya köprü ile geçilir.',
  },
  'alt-d2-murano-transfer': {
    alt: 'Burano → Fondamente Nove (Hat 12) → Murano (Hat 4.1/4.2 veya 12). Rotayı uygulamada doğrulayın.',
  },
  'alt-d2-murano': {
    alt: 'Murano içinde vapur iskeleleri (Colonna, Faro, Museo) arasında yürünebilir.',
    route: 'Faro iskelesinden Fondamenta dei Vetrai boyunca ilerleyin.',
  },
  'alt-d2-return-lido': {
    alt: 'Murano → Fondamente Nove / San Zaccaria → Lido; aktarma gerekebilir.',
  },
  'alt-d2-lido-dinner': {
    alt: 'Lido S.M.E. iskelesinden Viale Santa Maria Elisabetta üzerinde yürüyüş ≈ 5 dk.',
  },
  'alt-d3-to-padova': {
    alt: 'Lido → Piazzale Roma vapuru, ardından otobüs / tramvay T1 ile Mestre, oradan tren.',
    route: 'Alternatif: Lido → Santa Lucia vapuru, Santa Lucia → Padova doğrudan tren (≈ 30-45 dk), Mestre aktarmasız.',
  },
  'alt-d3-bike-rent': {
    alt: PADOVA,
    route: 'RideMovi park noktaları istasyon önünde ve şehir merkezinde yer alır.',
  },
  'alt-d3-prato': {
    alt: PADOVA,
    route: 'İstasyondan Corso del Popolo ve Via Roma üzerinden merkeze ≈ 3-4 km bisiklet.',
  },
  'alt-d3-lunch': { alt: PADOVA, route: 'Prato’dan Piazza delle Erbe ≈ 10 dk bisiklet.' },
  'alt-d3-sant-antonio': { alt: PADOVA, route: 'Piazza delle Erbe’den ≈ 10 dk bisiklet veya tramvay SIR1.' },
  'alt-d4-lido-mestre': {
    alt: 'Vapur Hat 1 Lido → Piazzale Roma, ardından tramvay T1 veya otobüs ile Mestre.',
    route: 'Alternatif: Lido → Santa Lucia vapuru, Santa Lucia → Mestre tren (≈ 10 dk).',
  },
  'alt-d4-mestre-break': { alt: 'Mestre Garı’ndan Piazza Ferretto’ya ≈ 10-15 dk yürüyüş veya kısa otobüs.' },
  'alt-d4-airport': {
    alt: 'ATVO 35B (≈ 20 dk) veya ACTV 15 (daha ucuz, daha yavaş); Mestre Garı önünden.',
    route: 'Alternatif: taksi (tahmini ≈ 25-35 €). Havalimanına tren yoktur.',
  },
  'alt-d3-return': {
    alt: 'Padova → Mestre trenle ≈ 15-25 dk, ardından Lido için otobüs / vapur.',
    route: 'Alternatif: Padova → Santa Lucia doğrudan tren, sonra vapur ile Lido.',
  },
};
