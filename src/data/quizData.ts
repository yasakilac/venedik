// Eğlenceli, bilimsel çerçeveden esinlenen testler. Hepsi cihazda hesaplanır, internet gerekmez.
// Bunlar kısa eğlence testleridir; klinik tanı veya profesyonel değerlendirme yerine geçmez.

export type QuizCategory = 'kisilik' | 'iliski' | 'kokoloji';

export interface QuizOption {
  t: string;
  s: Record<string, number>; // boyut -> puan
}

export interface QuizQuestion {
  q: string;
  o: QuizOption[];
}

export interface DimInfo {
  label: string;
  hi?: string; // yüksek puanda yorum (bars modu)
  mid?: string;
  lo?: string; // düşük puanda yorum (bars modu)
}

export interface QuizResult {
  emoji: string;
  title: string;
  text: string;
}

export interface Quiz {
  id: string;
  category: QuizCategory;
  emoji: string;
  title: string;
  blurb: string;
  basis: string; // bilimsel dayanak
  mode: 'bars' | 'top' | 'pairs' | 'quad' | 'triad';
  dims: Record<string, DimInfo>;
  questions: QuizQuestion[];
  results?: Record<string, QuizResult>;
}

// Kısa yazım yardımcıları
const o = (t: string, s: Record<string, number>): QuizOption => ({ t, s });
const Q = (q: string, ...opts: QuizOption[]): QuizQuestion => ({ q, o: opts });
// Dereceli (0-3) soru: seçenekler yüksekten düşüğe sıralı verilir
const G = (dim: string, q: string, a: string, b: string, c: string, d: string): QuizQuestion =>
  Q(q, o(a, { [dim]: 3 }), o(b, { [dim]: 2 }), o(c, { [dim]: 1 }), o(d, { [dim]: 0 }));

export const CATEGORY_INFO: Record<QuizCategory, { label: string; emoji: string; blurb: string }> = {
  kisilik: { label: 'Kişilik Bulma', emoji: '🧠', blurb: 'Kişilik psikolojisinden esinlenen 3 test' },
  iliski: { label: 'İlişki Testleri', emoji: '💞', blurb: 'Bağlanma, aşk ve çatışma üzerine 3 test' },
  kokoloji: { label: 'Kokoloji', emoji: '🌀', blurb: 'İlk aklına geleni seç: hayal kurma oyunları' },
};

export const QUIZZES: Quiz[] = [
  // ================= KİŞİLİK =================
  {
    id: 'bigfive',
    category: 'kisilik',
    emoji: '🌊',
    title: 'Büyük Beşli: Gezgin Profilin',
    blurb: 'Vapurda, restoranda, kayıp sokaklarda… 5 temel kişilik boyutunda neredesin?',
    basis:
      'Beş Faktör Modeli (Costa & McCrae, 1992; Goldberg, 1990) kişilik psikolojisinde en çok desteklenen modeldir. Soru yapısı, 10 maddelik kısa ölçeklerden (TIPI; Gosling, Rentfrow & Swann, 2003) esinlenmiştir; kısa olduğu için hassasiyeti sınırlıdır.',
    mode: 'bars',
    dims: {
      o: {
        label: 'Açıklık',
        hi: 'Yeni deneyimlere, fikirlere ve belirsizliğe meraklısın; rota dışına çıkmak seni besler.',
        mid: 'Merak ile alışkanlık arasında dengelisin; yeniyi seçerek denersin.',
        lo: 'Bilinen ve denenmiş olanı seversin; öngörülebilirlik sana huzur verir.',
      },
      c: {
        label: 'Sorumluluk',
        hi: 'Planlı, düzenli ve hedef odaklısın; işler senin elinde yolunda gider.',
        mid: 'Gerektiğinde planlı, gerektiğinde esnek bir yapın var.',
        lo: 'Spontan ve esneksin; plan yerine akışı seversin (ama son dakika stresine dikkat).',
      },
      e: {
        label: 'Dışadönüklük',
        hi: 'İnsanlardan enerji alırsın; sohbet, kalabalık ve hareket senin yakıtın.',
        mid: 'Ortadönüklüksün: hem sosyal hem yalnız kalabilirsin.',
        lo: 'İçedönük tarafın baskın; sakin ortamlarda ve az sayıda kişiyle şarj olursun.',
      },
      a: {
        label: 'Uyumluluk',
        hi: 'Sıcak, işbirlikçi ve affedicisin; insanlar yanında rahat eder.',
        mid: 'Hem nazik hem sınır koyabilen dengeli bir yapın var.',
        lo: 'Açık sözlü ve rekabetçisin; çıkarını savunmaktan çekinmezsin.',
      },
      n: {
        label: 'Duygusal Dalgalanma',
        hi: 'Stres ve belirsizliğe duyarlısın; mükemmeliyetçilik ve endişe zaman zaman ağır basabilir.',
        mid: 'Duygusal tepkilerin ortalama düzeyde; çoğu şeyi yönetirsin.',
        lo: 'Sakin ve dayanıklısın; zor durumlarda soğukkanlılığını korursun.',
      },
    },
    questions: [
      G('o', 'Venedik’te telefonunun şarjı bitti, harita yok. Ne yaparsın?', 'Bilerek kaybolup sokakları keşfederim', 'Bir kafeye girip yön sorarım', 'En yakın şarj noktasını ararım', 'Bildiğim ana caddeye dönüp aynı rotayı izlerim'),
      G('o', 'Menüde adını bilmediğin bir yerel yemek var.', 'Hemen onu denerim', 'Garsona anlattırıp karar veririm', 'Güvenli bir şeyle karışık sipariş ederim', 'Her zamanki klasik makarnayı seçerim'),
      G('c', 'Gezi planını nasıl yaparsın?', 'Saat saat tablo yaparım', 'Ana duraklar belli, gerisi esnek', 'Sabah ne hissedersem', 'Plan mı? Akışına bırakırım'),
      G('c', 'Valizini ne zaman ve nasıl toplarsın?', 'Bir gün önce, listeyle, kategori kategori', 'Akşamdan, kısa bir listeyle', 'Çıkmadan bir saat önce', 'Taksi kapıdayken'),
      G('e', 'Vapurda yanındaki yabancı sohbet başlattı.', 'Hemen koyulaşır, sohbet uzar', 'Gülümseyip keyifle konuşurum', 'Kısa cevaplar veririm', 'Kulaklığı takarım'),
      G('e', 'Cuma akşamı için ideal plan hangisi?', 'Kalabalık bir bacaro turu', 'Dört beş arkadaşla yemek', 'Bir kişiyle sakin bir akşam', 'Evde tek başıma film'),
      G('a', 'Arkadaşın haritayı yanlış okudu, 30 dakika kaybettiniz.', 'Gülüp geçerim, güzel hikâye oldu', 'Hafifçe takılırım ama sorun yok', 'Bir daha harita bende kalsın derim', 'Sinirlenir, söylenirim'),
      G('a', 'Hesaplaşırken kendi payından 2 € fazla ödediğini fark ettin.', 'Önemli değil, hiç açmam', 'Nazikçe hatırlatırım', 'Hesabı tek tek tartışırım', 'Kuruşuna kadar geri isterim'),
      G('n', 'Son vapuru kaçırdın.', 'Sakin kalır, alternatif ararım', 'Biraz gerilir ama çözerim', 'Stres olur, kalbim çarpar', 'Panik olur, akşam mahvolur'),
      G('n', 'Gece yatarken gün içindeki küçük hataların aklına geliyor mu?', 'Hiç gelmez', 'Nadiren', 'Sık sık', 'Saatlerce dönüp dururlar'),
    ],
  },
  {
    id: 'jung',
    category: 'kisilik',
    emoji: '🎭',
    title: 'Jung Tipin: 16 Karakter',
    blurb: 'Enerjini nereden alıyorsun, nasıl karar veriyorsun? Dört harfli tipini bul.',
    basis:
      'C. G. Jung’un “Psikolojik Tipler” (1921) kuramındaki içedönük/dışadönük ve algılama/yargılama işlevlerinden esinlenir (Myers–Briggs sistemi bunun üzerine kuruludur). Not: MBTI’nin test-tekrar test güvenilirliği ve kategorik yapısı akademik olarak eleştirilir (Pittenger, 1993); sonuç eğlenceli bir kendini tanıma aracıdır.',
    mode: 'pairs',
    dims: {
      E: { label: 'Dışadönük (E)' },
      I: { label: 'İçedönük (I)' },
      S: { label: 'Duyusal (S)' },
      N: { label: 'Sezgisel (N)' },
      T: { label: 'Düşünen (T)' },
      F: { label: 'Hisseden (F)' },
      J: { label: 'Planlı (J)' },
      P: { label: 'Esnek (P)' },
    },
    questions: [
      Q('Uzun bir günün sonunda enerjin nasıl dolar?', o('Arkadaşlarla buluşarak', { E: 1 }), o('Tek başıma sessizce', { I: 1 })),
      Q('Tanımadığın bir grup yemeğine davet edildin.', o('Heyecanla giderim, yeni insanlar tanırım', { E: 1 }), o('Kimler geliyor diye düşünür, kısa kalırım', { I: 1 })),
      Q('Bir tabloya bakıyorsun. Önce neye takılırsın?', o('Renkler, fırça darbeleri, somut ayrıntılar', { S: 1 }), o('Ne anlatmak istediği, sembolleri, hikâyesi', { N: 1 })),
      Q('Yeni bir şey öğrenirken tercihin?', o('Adım adım, örneklerle', { S: 1 }), o('Önce büyük resim ve fikir, detay sonra', { N: 1 })),
      Q('Arkadaşın kötü bir iş teklifini kabul etmek üzere.', o('Artı ve eksileri dürüstçe sayarım', { T: 1 }), o('Duygularını incitmeden dolaylı yaklaşırım', { F: 1 })),
      Q('Tartışmada hangisi senin için daha önemli?', o('Doğru olan kazansın', { T: 1 }), o('Uyum bozulmasın', { F: 1 })),
      Q('Tatilin ilk sabahı…', o('Program hazır, saat saat ilerlerim', { J: 1 }), o('Uyanınca canım ne isterse', { P: 1 })),
      Q('Bir iş için teslim tarihi verildi.', o('Erkenden bitirir, rahatlarım', { J: 1 }), o('Son dakika enerjisiyle yaparım', { P: 1 })),
    ],
    results: {
      ISTJ: { emoji: '🏛️', title: 'Güvenilir Mimar', text: 'Düzenli, sorumluluk sahibi ve sözünün eri. Ayrıntıları ve kuralları önemsersin; “söz verdim, yaparım” senin cümlen.' },
      ISFJ: { emoji: '🕯️', title: 'Sıcak Koruyucu', text: 'Sessizce herkesin ihtiyacını görürsün. Sadık, özenli ve iyi bir hatırlayıcısın; doğum günlerini asla unutmazsın.' },
      INFJ: { emoji: '🔭', title: 'Sessiz Vizyoner', text: 'Derin, sezgisel ve idealist. İnsanların neden öyle davrandığını sezer, anlamlı bir şey için çalışmak istersin.' },
      INTJ: { emoji: '♟️', title: 'Stratejist', text: 'Uzun vadeli düşünür, sistemleri kurar ve geliştirirsin. Bağımsız, analitik ve yüksek standartlısın.' },
      ISTP: { emoji: '🛠️', title: 'Usta Tamirci', text: 'Soğukkanlı ve pratik. Bir şeyin nasıl çalıştığını ellerinle çözmeyi, krizde sakin kalmayı seversin.' },
      ISFP: { emoji: '🎨', title: 'Nazik Sanatçı', text: 'Sakin, estetik duyusu güçlü ve özgür ruhlu. Anı yaşar, değerlerine sessizce sadık kalırsın.' },
      INFP: { emoji: '🪶', title: 'Hayalperest Şair', text: 'Değerleri ve hayalleri olan, empatik biri. Anlam arar, hikâyelere ve güzelliğe kolayca kapılırsın.' },
      INTP: { emoji: '🧪', title: 'Meraklı Mühendis', text: 'Fikirlerin ve kavramların insanı. “Neden böyle?” sorusu seni uyutmaz; mantıklı ve özgün düşünürsün.' },
      ESTP: { emoji: '🏄', title: 'Cesur Girişimci', text: 'Enerjik, hızlı ve gözlemci. Eylemin içinde olmayı, riski ve anın heyecanını seversin.' },
      ESFP: { emoji: '🎉', title: 'Hayatın Neşesi', text: 'Sıcak, eğlenceli ve cana yakın. Ortamı canlandırır, insanları güldürür, anı doyasıya yaşarsın.' },
      ENFP: { emoji: '🎆', title: 'Kıvılcım Kaşif', text: 'Coşkulu, yaratıcı ve insan odaklı. Yeni fikirlere ve insanlara hevesle atılırsın; sıkıcı rutinden hoşlanmazsın.' },
      ENTP: { emoji: '💡', title: 'Münazaracı Mucit', text: 'Hazır cevaplı, meraklı ve tartışmaya açık. Kalıpları sorgular, alternatifler üretirsin.' },
      ESTJ: { emoji: '📋', title: 'Organizatör', text: 'Düzen kuran, karar veren ve işi yürüten kişi. Net kurallar ve sonuç odaklı çalışmayı seversin.' },
      ESFJ: { emoji: '🍷', title: 'Cana Yakın Ev Sahibi', text: 'Sosyal, ilgili ve uyum odaklı. Herkesin iyi hissetmesi için çabalar, topluluğu bir arada tutarsın.' },
      ENFJ: { emoji: '🌟', title: 'İlham Veren Lider', text: 'Karizmatik ve empatik. İnsanların potansiyelini görür, onları harekete geçirirsin.' },
      ENTJ: { emoji: '🧭', title: 'Doğuştan Komutan', text: 'Kararlı, stratejik ve liderliğe yatkın. Hedef koyar, plan yapar ve ekibi oraya taşırsın.' },
    },
  },
  {
    id: 'temperament',
    category: 'kisilik',
    emoji: '🧭',
    title: 'Seyahat Mizacın (Cloninger)',
    blurb: 'Yeniliğe açlık, risk duyarlılığı, onay ihtiyacı ve inat: mizaç profilin.',
    basis:
      'Cloninger’in Mizaç ve Karakter Envanteri (Cloninger, Svrakic & Przybeck, 1993): yenilik arayışı, zarardan kaçınma, ödül bağımlılığı ve azim boyutları. Biyolojik temelli mizaç yaklaşımıdır; burada her boyut 2 soruyla ölçüldüğü için kaba bir fotoğraftır.',
    mode: 'bars',
    dims: {
      ns: {
        label: 'Yenilik Arayışı',
        hi: 'Yeni, farklı ve heyecanlı olana çekilirsin; rutin seni çabuk sıkar.',
        mid: 'Hem yeniliği hem düzeni dengeli tutarsın.',
        lo: 'Tanıdık ve sakin olanı seçersin; sürprizden çok istikrar.',
      },
      ha: {
        label: 'Zarardan Kaçınma',
        hi: 'Riskleri önceden görür, temkinli davranırsın; bu seni korur ama yorabilir.',
        mid: 'Gerektiğinde temkinli, gerektiğinde cesursun.',
        lo: 'Rahat ve cesursun; belirsizlik seni pek germez.',
      },
      rd: {
        label: 'Ödül Bağımlılığı',
        hi: 'Takdir, yakınlık ve sosyal onay seni çok motive eder; ilişkilere duyarlısın.',
        mid: 'Onay güzel ama olmazsa da olur dengesindesin.',
        lo: 'Bağımsız ve mesafelisin; başkalarının onayı kararlarını az etkiler.',
      },
      ps: {
        label: 'Azim',
        hi: 'Zorluk karşısında vazgeçmezsin; hedefine inatla yürürsün.',
        mid: 'Önemli konularda sebat eder, diğerlerinde esnersin.',
        lo: 'Hızlı değişen ilgilerin var; sabırsız ama esnek olabilirsin.',
      },
    },
    questions: [
      G('ns', 'Tatilde haritada görünmeyen dar bir sokak var.', 'Hemen girerim', 'Biraz bakar, sonra girerim', 'Yalnızca yanımda biri varsa', 'Girmem, bildik yoldan devam ederim'),
      G('ns', 'Dalış, paraşüt, kaya tırmanışı… Yeni bir macera önerildi.', 'Yarın kaydolurum', 'Düşünüp sonunda yaparım', 'Önce izlerim, belki', 'Bana göre değil'),
      G('ha', 'Gece geç saatte ıssız bir sokakta yürüyorsun.', 'Hızlandırır, her yeri tarar, kendimi güvende hissetmem', 'Tedirgin olurum', 'Hafif dikkatli olurum', 'Hiç umursamam'),
      G('ha', 'Yeni bir şehre taşınma teklifi geldi.', 'Her riski haftalarca düşünürüm', 'Artı ve eksileri uzun uzun tartarım', 'Kısa bir değerlendirme yaparım', 'Heyecanla kabul ederim'),
      G('rd', 'Biri seni herkesin içinde takdir etti.', 'Çok mutlu olur, motivasyonum katlanır', 'Güzel hissederim', 'Hoş ama çok önemsemem', 'Pek bir şey hissetmem'),
      G('rd', 'Yakın birinin kötü gününü ne kadar çabuk fark edersin?', 'Hemen, kelime söylemeden bile', 'Genelde fark ederim', 'Söylenirse anlarım', 'Pek anlamam'),
      G('ps', 'Zor bir bulmaca üç saattir çözülmüyor.', 'Çözene kadar bırakmam', 'Ara verip dönerim', 'Biraz daha uğraşır, bırakırım', 'Hemen bırakıp başka bir şeye geçerim'),
      G('ps', 'Uzun vadeli bir hedefin (spor, dil, tasarruf) var.', 'Aylarca aksatmadan sürdürürüm', 'Çoğunlukla sürdürürüm', 'Başlarım ama dalgalanır', 'Birkaç gün sonra sıkılırım'),
    ],
  },

  // ================= İLİŞKİ =================
  {
    id: 'attachment',
    category: 'iliski',
    emoji: '🔗',
    title: 'Bağlanma Stilin',
    blurb: 'Yakınlık ve mesafe karşısında nasıl davranıyorsun? Güvenli, kaygılı ya da kaçıngan mı?',
    basis:
      'Bowlby (1969) ve Ainsworth (1978) bağlanma kuramı; yetişkinlerde Hazan & Shaver (1987) ve “Yakın İlişkilerde Yaşantılar” ölçeği (Brennan, Clark & Shaver, 1998). Stil iki boyutla bulunur: bağlanma kaygısı ve kaçınması. Bağlanma stili sabit değildir, ilişkiyle değişebilir.',
    mode: 'quad',
    dims: {
      anx: { label: 'Bağlanma Kaygısı' },
      avo: { label: 'Yakınlıktan Kaçınma' },
    },
    questions: [
      G('anx', 'Sevgilinin mesajına 6 saattir cevap yok.', 'Meşguldür, sorun yok', 'Biraz merak ederim', 'Sürekli telefona bakarım', 'İlgisini kaybetti diye düşünürüm'),
      G('anx', 'Partnerin arkadaşlarıyla gece dışarı çıkıyor.', 'Güzel vakit geçirmesini isterim', 'Biraz özlerim', 'Kimlerle, ne zaman döner diye düşünürüm', 'Huzursuz olur, uyuyamam'),
      G('anx', 'İlişkinde sevildiğinden ne sıklıkla şüphe edersin?', 'Neredeyse hiç', 'Ara sıra', 'Sık sık', 'Hemen her zaman'),
      G('anx', 'Partnerin “bu hafta sonu kendime vakit lazım” dedi.', 'Anlarım, ben de planlarım', 'Hafif bir burukluk olur', 'Beni mi istemiyor diye endişelenirim', 'Terk edileceğimden korkarım'),
      G('avo', 'Partnerin duygularını uzun uzun paylaşmak istiyor.', 'Dinler, ben de açılırım', 'Dinlerim ama biraz zorlanırım', 'Konuyu değiştirmeye çalışırım', 'Bunalır, uzaklaşırım'),
      G('avo', 'Birlikte yaşamak ya da ortak hesap fikri…', 'Heyecanlandırır', 'Olur, zamanla', 'Bir parça rahatsız eder', 'Özgürlüğümü elimden alır gibi gelir'),
      G('avo', 'Zor bir dönemde partnerinden yardım istemek…', 'Doğal ve kolay', 'Gerekirse isterim', 'Zorlanırım', 'Her şeyi kendi başıma çözmeyi tercih ederim'),
      G('avo', 'İlişki yakınlaştıkça…', 'Daha rahat ve mutlu olurum', 'Çoğunlukla iyi hissederim', 'Ara sıra kaçma isteği duyarım', 'Boğulur, geri çekilirim'),
    ],
    results: {
      LL: { emoji: '🌳', title: 'Güvenli Bağlanma', text: 'Yakınlıktan ve bağımsızlıktan rahatsın. İhtiyaçlarını açıkça söyler, partnerine güvenir ve çatışmayı ilişkiyi bitirmeden çözebilirsin. Araştırmalar bunun genelde en sağlıklı ilişkilerle bağlantılı olduğunu gösterir.' },
      HL: { emoji: '🌊', title: 'Kaygılı Bağlanma', text: 'Yakınlığı çok değerli bulur, ama terk edilme ve değersizlik endişesi yaşayabilirsin. İşaretleri çok dikkatli okur, güvence ararsın. Açık iletişim ve kendi iç huzurunu güçlendirmek işine yarar.' },
      LH: { emoji: '🏔️', title: 'Kaçıngan Bağlanma', text: 'Bağımsızlığına çok değer verir, aşırı yakınlıkta geri çekilirsin. Duygularını kendi içinde çözmeyi seçersin. Partnerine duygusal alan açmak ve ihtiyaç duymanın güçsüzlük olmadığını görmek gelişimin olabilir.' },
      HH: { emoji: '🌀', title: 'Korkulu-Kaçıngan Bağlanma', text: 'Hem yakınlık istersin hem de yaralanmaktan korkarsın; “gel-git” hissi yaşayabilirsin. Bu çok insani bir tablo; güvenli bir ilişki ve gerekirse bir uzmanla çalışmak bunu yumuşatır.' },
    },
  },
  {
    id: 'sternberg',
    category: 'iliski',
    emoji: '🔺',
    title: 'Aşk Üçgenin (Sternberg)',
    blurb: 'Yakınlık, tutku ve bağlılık: senin aşkın hangi türde?',
    basis:
      'Sternberg’in Aşkın Üçgen Kuramı (1986): aşk üç bileşenden oluşur: yakınlık (intimacy), tutku (passion) ve bağlılık (commitment). Hangi bileşenlerin güçlü olduğuna göre sekiz aşk türü tanımlanır. Sonuç, şu anki veya genel ilişki tutumunu yansıtır.',
    mode: 'triad',
    dims: {
      i: { label: 'Yakınlık' },
      p: { label: 'Tutku' },
      c: { label: 'Bağlılık' },
    },
    questions: [
      G('i', 'Partnerinle paylaşım…', 'Her şeyi ona anlatabilirim, beni anlar', 'Çoğu şeyi anlatırım', 'Bazı konularda çekinirim', 'Pek paylaşmam'),
      G('i', 'Zor bir günde ona ne kadar yaslanırsın?', 'İlk aradığım odur', 'Yardımcı olur', 'Bazen', 'Kendi başıma hallederim'),
      G('i', 'Birlikte sessiz oturmak…', 'Dünyanın en rahat hissi', 'Genelde rahatım', 'Bazen sıkıcı', 'Garip gelir'),
      G('p', 'Partnerini gördüğünde…', 'Kalbim hâlâ hızlanıyor', 'Güzel bir heyecan hissederim', 'Sakin bir sevinç', 'Heyecan çok azaldı'),
      G('p', 'Fiziksel yakınlık…', 'İlişkimizin çok önemli bir parçası', 'Önemli', 'Fena değil, ama ön planda değil', 'Pek önemli değil'),
      G('p', 'Onunla ilgili hayal kurarken…', 'Sık sık aklıma düşüyor, gülümsüyorum', 'Arada hayal kurarım', 'Nadiren', 'Neredeyse hiç'),
      G('c', 'Gelecek planların…', 'Onunla uzun vadeli planlarım net', 'Genelde birlikte düşünüyorum', 'Belirsiz', 'Planlamak istemiyorum'),
      G('c', 'İlişki zorlaştığında…', 'Çözmek için sonuna kadar uğraşırım', 'Çabalarım', 'Zorlanır, düşünürüm', 'Kolay vazgeçerim'),
      G('c', 'Bu ilişkiyi sürdürme kararım…', 'Bilinçli ve kararlı', 'Çoğunlukla emin', 'Duruma göre değişir', 'Kararsızım'),
    ],
    results: {
      none: { emoji: '🌫️', title: 'Hafif Bir Bağ', text: 'Üç bileşen de şu an düşük görünüyor. Bu hayattan bir kesit olabilir: yeni, belirsiz ya da beklemede bir ilişki. İlişkiye ne istediğini sormak iyi bir başlangıç.' },
      i: { emoji: '☕', title: 'Sevme (Dostça Yakınlık)', text: 'Güçlü yakınlık, düşük tutku ve bağlılık. Derin bir dostluk gibi; sıcak ve güvenli ama romantik kıvılcım ya da uzun vadeli taahhüt eksik olabilir.' },
      p: { emoji: '🔥', title: 'Tutkulu Tutulma (Infatuation)', text: 'Yüksek çekim, düşük yakınlık ve bağlılık. Heyecan ve kelebekler çok güçlü; ilişki hızlı başlar, ama derinleşmezse çabuk sönebilir.' },
      c: { emoji: '📜', title: 'Boş Aşk', text: 'Bağlılık var, ama yakınlık ve tutku az. Alışkanlık ve sorumluluk ilişkiyi ayakta tutuyor; ortak bir yeniden bağ kurma çabası fark yaratabilir.' },
      ip: { emoji: '🌹', title: 'Romantik Aşk', text: 'Yakınlık ve tutku güçlü, bağlılık henüz net değil. Hem duygusal hem fiziksel bağ yüksek; “biz ne olacağız?” konuşması sıradaki adım olabilir.' },
      ic: { emoji: '🤝', title: 'Arkadaşça (Yoldaş) Aşk', text: 'Güçlü yakınlık ve bağlılık, tutku daha sakin. Uzun ilişkilerde sık görülen, güvenli ve huzurlu bir tür; kıvılcımı canlı tutmak için ortak yeni deneyimler iyi gelir.' },
      pc: { emoji: '🎢', title: 'Boş Heyecan (Fatuous)', text: 'Tutku ve bağlılık yüksek, yakınlık düşük. Hızlı kararlar ve büyük sözler var ama duygusal derinlik geride kalmış olabilir; birbirinizi daha iyi tanımak önemli.' },
      ipc: { emoji: '💎', title: 'Tam (Mükemmel) Aşk', text: 'Yakınlık, tutku ve bağlılık birlikte güçlü. Sternberg’e göre ulaşılması kolay, korunması daha zor olan tür; birlikte çaba göstermeye devam etmek gerekir.' },
    },
  },
  {
    id: 'conflict',
    category: 'iliski',
    emoji: '⚡',
    title: 'Çatışma Stilin (Thomas–Kilmann)',
    blurb: 'Tartışırken savaşçı mısın, arabulucu mu, kaçan mı? Senaryolarla öğren.',
    basis:
      'Thomas–Kilmann Çatışma Modu Aracı (1974): iki eksende (kendi çıkarını savunma × karşı tarafın çıkarını gözetme) beş stil: rekabetçi, işbirlikçi, uzlaşmacı, kaçınan, uyumlu. Hiçbir stil “en iyi” değildir; duruma uygunluk önemlidir.',
    mode: 'top',
    dims: {
      rek: { label: 'Rekabetçi' },
      isb: { label: 'İşbirlikçi' },
      uzl: { label: 'Uzlaşmacı' },
      kac: { label: 'Kaçınan' },
      uyu: { label: 'Uyumlu' },
    },
    questions: [
      Q('Tatil rotasında partnerinle anlaşamıyorsun: sen deniz, o dağ istiyor.', o('Ben haklıyım, deniz derim', { rek: 1 }), o('İkimizin de istediğini sağlayacak üçüncü bir seçenek ararım', { isb: 1 }), o('Yarısı deniz, yarısı dağ olsun', { uzl: 1 }), o('Konuyu sonra konuşuruz', { kac: 1 }), o('Sen nereye istersen', { uyu: 1 })),
      Q('Arkadaşın sana verdiği sözü tutmadı.', o('Açıkça yüzüne söylerim, hesap sorarım', { rek: 1 }), o('Neden olduğunu birlikte konuşur, çözüm ararız', { isb: 1 }), o('Biraz ben anlayış gösteririm, o da gösterir', { uzl: 1 }), o('Ses çıkarmam, geçerim', { kac: 1 }), o('Haklı bir sebebi vardır, üstelemem', { uyu: 1 })),
      Q('Evde bulaşık nöbeti kavgası çıktı.', o('Adil olan benim sistemimdir', { rek: 1 }), o('Birlikte yeni bir düzen kurarız', { isb: 1 }), o('Gün aşırı değişelim', { uzl: 1 }), o('Odadan çıkarım', { kac: 1 }), o('Ben yıkarım, mesele kapansın', { uyu: 1 })),
      Q('İş arkadaşın fikrini beğenmediğini söyledi.', o('Savunur, onu ikna etmeye çalışırım', { rek: 1 }), o('Neden beğenmediğini öğrenir, fikri birlikte geliştiririm', { isb: 1 }), o('Fikrimin bir kısmını değiştiririm', { uzl: 1 }), o('Konuyu kapatırım', { kac: 1 }), o('Onun dediği olsun', { uyu: 1 })),
      Q('Restoran seçimi: herkes farklı bir şey istiyor.', o('Ben seçerim, iyisini biliyorum', { rek: 1 }), o('Herkesin önceliğini dinleyip ortak bir yer buluruz', { isb: 1 }), o('Sırayla seçelim', { uzl: 1 }), o('Fark etmez, karışmam', { kac: 1 }), o('Hangisi olursa', { uyu: 1 })),
      Q('Partnerin harcamalarınız konusunda seninle aynı fikirde değil.', o('Bütçeyi ben yönetmeliyim', { rek: 1 }), o('Hedeflerimizi konuşup ortak plan yaparız', { isb: 1 }), o('Ortada bir bütçe belirleriz', { uzl: 1 }), o('Konuyu açmam', { kac: 1 }), o('Onun dediğine uyarım', { uyu: 1 })),
      Q('Küçük bir yanlış anlaşılma büyüdü.', o('Haklı olduğumu kanıtlarım', { rek: 1 }), o('Her şeyi masaya yatırıp kökten çözmek isterim', { isb: 1 }), o('İkimiz de biraz geri adım atarız', { uzl: 1 }), o('Biraz uzak durur, soğumasını beklerim', { kac: 1 }), o('Özür dileyip kapatırım', { uyu: 1 })),
    ],
    results: {
      rek: { emoji: '🦁', title: 'Rekabetçi', text: 'Net, güçlü ve kararlısın. Acil durumlarda ve gerçekten önemli konularda çok etkilisin. Dikkat: sürekli kazanmaya çalışmak ilişkide karşı tarafın kendini duyulmamış hissetmesine yol açabilir.' },
      isb: { emoji: '🤝', title: 'İşbirlikçi', text: 'Çatışmayı ortak sorun olarak görür, iki tarafın da kazandığı çözümler ararsın. Çoğu ilişki için en güçlü stil; zaman ve enerji gerektirdiğini unutma.' },
      uzl: { emoji: '⚖️', title: 'Uzlaşmacı', text: 'Pratik ve adil bulursun; herkes biraz taviz verir. Zaman azken harika; ama bazen daha yaratıcı bir çözüm masada kalabilir.' },
      kac: { emoji: '🦉', title: 'Kaçınan', text: 'Çatışmadan uzak durur, soğumasını beklersin. Küçük meselelerde işe yarar; ama önemli konular birikirse sonradan patlayabilir. Zamanlamalı ve net şekilde konuşmayı denemek faydalı.' },
      uyu: { emoji: '🕊️', title: 'Uyumlu', text: 'Huzur ve ilişkiyi önde tutar, kendi isteğini geri çekersin. Cömert ve yumuşaksın; ancak kendi ihtiyaçlarının sürekli geride kalmaması önemli.' },
    },
  },


  // ================= KOKOLOJİ =================
  // Kokoloji: Isamu Saito ve Tadahiko Nagao’nun “ilk aklına geleni seç” tarzındaki hayal kurma oyunları kitabından
  // esinlenen biçim. Aşağıdaki sorular özgündür; kitaptaki oyunlar kopyalanmamıştır.
  {
    id: 'kok-orman',
    category: 'kokoloji',
    emoji: '🌲',
    title: 'Kokoloji: Orman Yolculuğu',
    blurb: 'Hayal et: bir ormandasın. Düşünmeden, ilk aklına geleni seç.',
    basis:
      'Projektif varsayım (Frank, 1939): belirsiz bir durumu hayal ederken verdiğimiz tepkiler kendi eğilimlerimizi yansıtır (Rorschach ve cümle tamamlama testlerinin mantığı). Bilimsel geçerliliği tartışmalıdır (Lilienfeld, Wood & Garb, 2000); sonuçları kesin bir ölçüm değil, kendine bakmak için bir ayna olarak oku.',
    mode: 'top',
    dims: {
      ozgur: { label: 'Özgür Ruh' },
      guven: { label: 'Güvenlik Arayan' },
      merak: { label: 'Meraklı Zihin' },
      bag: { label: 'Bağ Kuran' },
    },
    questions: [
      Q('Bir ormanın girişindesin. Önündeki yol nasıl?', o('Işıklı ve geniş bir yol', { guven: 1 }), o('Dolambaçlı, gizemli bir patika', { merak: 1 }), o('Yol yok, kendi yolumu açarım', { ozgur: 1 }), o('Uzaktan insan sesleri geliyor', { bag: 1 })),
      Q('Yürürken bir hayvan karşına çıktı. İlk hangisi aklına geldi?', o('Kartal', { ozgur: 1 }), o('Kaplumbağa', { guven: 1 }), o('Baykuş', { merak: 1 }), o('Köpek', { bag: 1 })),
      Q('Bir nehre geldin.', o('Köprüden geçerim', { guven: 1 }), o('Yüzerek geçerim', { ozgur: 1 }), o('Kıyıda durup akışı izlerim', { merak: 1 }), o('Karşıda biri el sallıyor, ona doğru giderim', { bag: 1 })),
      Q('Ormanın ortasında bir ev var.', o('Kapıyı çalarım', { bag: 1 }), o('Pencereden içeriye bakarım', { merak: 1 }), o('Girer, kendi evim gibi yerleşirim', { guven: 1 }), o('Selam verip yoluma devam ederim', { ozgur: 1 })),
      Q('Elinde bir şey taşıyorsun. O ne?', o('Pusula', { merak: 1 }), o('Fener', { guven: 1 }), o('Hiçbir şey, hafifim', { ozgur: 1 }), o('Birinin eli', { bag: 1 })),
      Q('Hava kararıyor.', o('Ateş yakıp güvenli bir yer hazırlarım', { guven: 1 }), o('Yıldızlara bakarım, rotamı onlardan bulurum', { merak: 1 }), o('Hiç durmam, gece yürüyüşü güzel', { ozgur: 1 }), o('Yanımdakilerle ateşin etrafında otururum', { bag: 1 })),
      Q('Ağaçların arasında parlayan bir şey gördün.', o('Yaklaşıp ne olduğunu çözmeye çalışırım', { merak: 1 }), o('Tehlikeli olabilir, uzak dururum', { guven: 1 }), o('Hemen peşinden koşarım', { ozgur: 1 }), o('Başkalarına da göstermek için çağırırım', { bag: 1 })),
      Q('Ormanda kaybolsan ilk ne hissedersin?', o('Heyecan, bir macera başladı', { ozgur: 1 }), o('Biraz korku ama plan yaparım', { guven: 1 }), o('Merak, burada neler var?', { merak: 1 }), o('Yalnızlık, birini bulmak isterim', { bag: 1 })),
    ],
    results: {
      ozgur: { emoji: '🦅', title: 'Özgür Ruh', text: 'Hayal dünyanda yolun, sınırın ve kuralın pek yok; sen kendi yolunu açıyorsun. Bağımsızlığa, hareket ve değişime değer verirsin. Dikkat: özgürlüğün yanında zaman zaman yakınlığa da yer açmak dengeni güçlendirir.' },
      guven: { emoji: '🏡', title: 'Güvenlik Arayan', text: 'Hayalinde bile önce sağlam zemini, ışığı ve sığınağı seçiyorsun. Planlı, temkinli ve güven veren birisin. Belirsizlik karşısında biraz cesareti denemek keyifli sürprizler getirebilir.' },
      merak: { emoji: '🦉', title: 'Meraklı Zihin', text: 'Gördüğün her ayrıntıyı anlamaya çalışıyorsun: yıldızlar, ışıklar, kapılar. Gözlemci, analitik ve öğrenmeye açıksın. Bazen düşünmeyi bırakıp deneyime atlamak sana iyi gelir.' },
      bag: { emoji: '🤝', title: 'Bağ Kuran', text: 'Sesler, eller ve ateş başı sohbetleri hayalinde öne çıkıyor. Yalnızlıkta değil, insanlarla anlam buluyorsun. Sıcak ve ilgili birisin; kendi ihtiyaçlarını da ifade etmeyi unutma.' },
    },
  },
  {
    id: 'kok-cagrisim',
    category: 'kokoloji',
    emoji: '💭',
    title: 'Kokoloji: Çağrışım Oyunu',
    blurb: 'Bir kelime duyduğunda aklına ilk gelen şey ne? Hızlı seç.',
    basis:
      'Serbest çağrışım ve kelime çağrışımı testleri: Jung’un çağrışım deneyleri (Jung & Riklin, 1904-1910) ve projektif teknik geleneği. Aynı kelimeye verilen ilk tepki, o anki duygusal eğilimi yansıtabilir; ancak güvenilirliği sınırlıdır ve anlık ruh haline göre değişir.',
    mode: 'top',
    dims: {
      huzur: { label: 'Huzur' },
      heyecan: { label: 'Heyecan' },
      ozlem: { label: 'Özlem' },
      guc: { label: 'Güç' },
    },
    questions: [
      Q('DENİZ', o('Dinginlik', { huzur: 1 }), o('Dalgalar ve macera', { heyecan: 1 }), o('Çocukluk yazları', { ozlem: 1 }), o('Uçsuz bucaksızlık ve derinlik', { guc: 1 })),
      Q('KAPI', o('Sıcak bir ev', { huzur: 1 }), o('Yeni bir başlangıç', { heyecan: 1 }), o('Geride kalan bir geçmiş', { ozlem: 1 }), o('Anahtar benim elimde', { guc: 1 })),
      Q('KÖPRÜ', o('Barışmak', { huzur: 1 }), o('Öte yakadaki keşif', { heyecan: 1 }), o('Eski bir yer', { ozlem: 1 }), o('Aştığım engeller', { guc: 1 })),
      Q('AYNA', o('Kendimle baş başa kalmak', { huzur: 1 }), o('Merak: bir sonraki ben', { heyecan: 1 }), o('Eski fotoğraflar', { ozlem: 1 }), o('Etkileyici görünmek', { guc: 1 })),
      Q('YAĞMUR', o('Pencere kenarında çay', { huzur: 1 }), o('Sırılsıklam koşmak', { heyecan: 1 }), o('Bir anıyı hatırlamak', { ozlem: 1 }), o('Fırtınaya meydan okumak', { guc: 1 })),
      Q('MERDİVEN', o('Yavaş yavaş çıkmak', { huzur: 1 }), o('Üçer beşer atlamak', { heyecan: 1 }), o('Çocukluk evinin merdiveni', { ozlem: 1 }), o('En tepeye ulaşmak', { guc: 1 })),
      Q('IŞIK', o('Mum ışığı', { huzur: 1 }), o('Havai fişek', { heyecan: 1 }), o('Eski bir lamba', { ozlem: 1 }), o('Sahnedeki projektör', { guc: 1 })),
      Q('YOLCULUK', o('Eve dönüş', { huzur: 1 }), o('Bilinmeyene gitmek', { heyecan: 1 }), o('Geride bıraktıklarım', { ozlem: 1 }), o('Rotayı ben çizerim', { guc: 1 })),
    ],
    results: {
      huzur: { emoji: '🕯️', title: 'Huzur Arayan', text: 'Çağrışımların sakinlik, sıcaklık ve güvenli alanlar etrafında toplanıyor. Şu sıralar dinlenmeye ve dengeye ihtiyaç duyuyor olabilirsin. Küçük ritüeller (çay, yürüyüş, sessiz bir akşam) sana iyi gelir.' },
      heyecan: { emoji: '🎆', title: 'Heyecan Arayan', text: 'Yeni, hareketli ve bilinmeyen olan seni çağırıyor. Enerjin yüksek ve değişime hazırsın. Bu tatil için harika bir işaret: planın dışına çıkmaya ve spontane kalmaya alan bırak.' },
      ozlem: { emoji: '📼', title: 'Özlem Taşıyan', text: 'Çağrışımların geçmişe, anılara ve eskiye dönük. Duygusal derinliğin ve hatırlama gücün yüksek. Nostalji güzel bir şey; ama bugünün anılarını da biriktirmeyi unutma.' },
      guc: { emoji: '🏔️', title: 'Güç Arayan', text: 'Kontrol, başarı ve öne çıkma temaları baskın. Hedefe kararlı ve iddialı bir ruh halindesin. Gücünün yanında kırılganlığa da biraz yer açmak ilişkilerine iyi gelir.' },
    },
  },
  {
    id: 'kok-ev',
    category: 'kokoloji',
    emoji: '🏠',
    title: 'Kokoloji: Hayalindeki Ev',
    blurb: 'Gözünde bir ev canlandır. Odalar sana ne söylüyor?',
    basis:
      'Mekân projeksiyonu: hayali bir evi tasvir etmek, kişinin mahremiyet, paylaşım ve düzen eğilimlerini yansıtan projektif bir çalışmadır (ev-ağaç-insan çizim testleri geleneğinden esinlenir; Buck, 1948). Bilimsel geçerliliği sınırlıdır, kendine bakmak için bir oyun olarak düşün.',
    mode: 'top',
    dims: {
      mahrem: { label: 'Sığınak Ruhu' },
      paylas: { label: 'Ev Sahibi Ruhu' },
      duzen: { label: 'Mimar Ruhu' },
      yarat: { label: 'Sanatçı Ruhu' },
    },
    questions: [
      Q('Evin kapısı…', o('Sağlam ve kilitli', { mahrem: 1 }), o('Hep açık, misafir kabul eder', { paylas: 1 }), o('Derli toplu, numaralı, düzenli', { duzen: 1 }), o('Rengarenk, tuhaf bir kapı', { yarat: 1 })),
      Q('Salonun en dikkat çeken yeri?', o('Kitap ve tek kişilik koltuk', { mahrem: 1 }), o('Büyük sofra', { paylas: 1 }), o('Her şeyin yerli yerinde olduğu raflar', { duzen: 1 }), o('Duvarda eserler, plaklar, bitkiler', { yarat: 1 })),
      Q('Yatak odanda en önemli şey?', o('Kalın perdeler ve sessizlik', { mahrem: 1 }), o('Misafir yatağı da var', { paylas: 1 }), o('Başucundaki düzenli plan defteri', { duzen: 1 }), o('Yastıklar, ışıklar, hayal kurma köşesi', { yarat: 1 })),
      Q('Mutfakta…', o('Tek kişilik, kendime özel yemekler', { mahrem: 1 }), o('Herkes birlikte pişirir', { paylas: 1 }), o('Her şey etiketli ve düzenli', { duzen: 1 }), o('Yeni tarifler deniyorum', { yarat: 1 })),
      Q('Bahçen nasıl?', o('Yüksek çitli, kimse görmez', { mahrem: 1 }), o('Masa, hamak ve çok sandalye', { paylas: 1 }), o('Budanmış çimler, düz sıralar', { duzen: 1 }), o('Vahşi çiçekler, heykeller', { yarat: 1 })),
      Q('Çatı katında ne var?', o('Kimsenin bilmediği bir kaçış odası', { mahrem: 1 }), o('Film ve oyun odası', { paylas: 1 }), o('Arşiv ve depo', { duzen: 1 }), o('Atölye', { yarat: 1 })),
      Q('Kilitli bir oda var. İçinde ne olabilir?', o('Sadece benim bildiğim şeyler', { mahrem: 1 }), o('Kutlamalar için sürprizler', { paylas: 1 }), o('Düzenli belgeler', { duzen: 1 }), o('Yarım kalmış fikirler ve projeler', { yarat: 1 })),
      Q('Komşularınla ilişkin?', o('Selamlaşırız, mesafe iyi', { mahrem: 1 }), o('Herkesle sıcak ve yakınım', { paylas: 1 }), o('Net sınırlar ve kurallar', { duzen: 1 }), o('Garip ve ilginç insanlarla dostluk', { yarat: 1 })),
    ],
    results: {
      mahrem: { emoji: '🏰', title: 'Sığınak Ruhu', text: 'Evin senin için bir kale: mahremiyet ve iç huzur ön planda. Derin, seçici ve gözlemcisin. Kapını bazen ardına kadar açmak yakınlarına seni daha iyi tanıma fırsatı verir.' },
      paylas: { emoji: '🍷', title: 'Ev Sahibi Ruhu', text: 'Evin senin için paylaşım ve sohbet demek. Sıcak, cömert ve insanlarla enerji bulan birisin. Kendi dinlenme alanını korumayı da unutma.' },
      duzen: { emoji: '📐', title: 'Mimar Ruhu', text: 'Hayalindeki ev planlı, temiz ve öngörülebilir. Düzen, güven ve kontrol sana huzur veriyor. Ara sıra kuralları esnetmek hayata biraz neşe katabilir.' },
      yarat: { emoji: '🎨', title: 'Sanatçı Ruhu', text: 'Evin bir tuval gibi: renkli, farklı ve hikâyeli. Yaratıcı, meraklı ve özgün birisin. Projelerini tamamlamak için küçük adımlar ve düzen biraz yardımcı olur.' },
    },
  },
];
