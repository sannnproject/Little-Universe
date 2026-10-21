export interface GalleryItem {
  id: string;
  src: string;
  fallbackSrc: string;
  alt: string;
  caption: string;
  momentLabel: string;
  locationOrTime: string;
  aspectClass: string;
  gridSpanClass: string;
}

export interface TimelineItem {
  id: string;
  chapterNumber: string;
  dateLabel: string;
  title: string;
  subtitle: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
}

export interface LoveNoteItem {
  id: string;
  numberLabel: string;
  title: string;
  shortHint: string;
  message: string;
}

export interface UniverseCameraPreset {
  id: string;
  label: string;
  description: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface LoveConfig {
  senderName: string;
  recipientName: string;
  creditGroup: string;
  anniversaryDate: string;
  siteTitle: string;
  siteSubtitle: string;
  musicUrl: string;
  musicTitle: string;
  musicArtist: string;
  opening: {
    greeting: string;
    subtitle: string;
    buttonText: string;
    skipText: string;
    sealText: string;
  };
  hero: {
    kicker: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    heroImage: string;
    heroImageAlt: string;
  };
  loveLetter: {
    sectionKicker: string;
    title: string;
    salutation: string;
    paragraphs: string[];
    closing: string;
    replayButtonText: string;
  };
  gallerySection: {
    kicker: string;
    title: string;
    subtitle: string;
  };
  gallery: GalleryItem[];
  timelineSection: {
    kicker: string;
    title: string;
    subtitle: string;
  };
  timeline: TimelineItem[];
  loveNotesSection: {
    kicker: string;
    title: string;
    subtitle: string;
  };
  loveNotes: LoveNoteItem[];
  universe3D: {
    kicker: string;
    title: string;
    subtitle: string;
    presets: UniverseCameraPreset[];
  };
  specialMoment: {
    initialPrompt: string;
    buttonText: string;
    paragraphs: string[];
    climaxLine1: string;
    climaxLine2: string;
    backdropImage: string;
  };
  finalMessage: {
    heading: string;
    subheading: string;
    hugButtonText: string;
    hugActiveText: string;
    hugActiveSubtext: string;
    replayHugText: string;
    restartButtonText: string;
  };
  animation: {
    staggerDelay: number;
    enableParticles: boolean;
  };
}

/**
 * FILE KONFIGURASI UTAMA — A LITTLE UNIVERSE, JUST FOR YOU
 *
 * Ubah nama pengirim, nama pasangan, tanggal spesial, foto galeri,
 * isi surat cinta, timeline, maupun URL musik langsung di objek ini.
 */
export const loveConfig: LoveConfig = {
  senderName: 'Nama Kamu',
  recipientName: 'Nama Pacar',
  creditGroup: 'SANN404 FORUM GROUP',
  // Kosongkan ("") jika ingin menampilkan placeholder jujur, atau isi format "YYYY-MM-DD" (misal "2024-02-14")
  anniversaryDate: '',
  siteTitle: 'A Little Universe, Just for You',
  siteSubtitle: 'Sebuah ruang kecil berisi kata-kata, kenangan, dan perasaan yang ingin kusampaikan kepadamu.',
  // Opsional: masukkan URL file audio MP3/WAV pribadi Anda di sini.
  // Jika dikosongkan, pemutar musik akan memainkan instrumen piano nocturne romantis secara langsung.
  musicUrl: '',
  musicTitle: 'Nocturne for Two · Our Little Soundtrack',
  musicArtist: 'Instrumental Romantic Piano & Strings',

  opening: {
    greeting: 'Hey, kamu…',
    subtitle: 'Ada sesuatu yang ingin aku tunjukkan.',
    buttonText: 'Buka pesan kecil ini',
    skipText: 'Lewati intro',
    sealText: 'Untukmu',
  },

  hero: {
    kicker: 'A LITTLE SOMETHING FOR YOU',
    titleLine1: 'Di antara banyak hal indah di dunia,',
    titleLine2: 'aku tetap memilih kamu.',
    description:
      'Mungkin aku nggak selalu bisa menjelaskan semuanya dengan sempurna. Tapi ada satu hal yang ingin kamu tahu: kehadiranmu punya arti yang jauh lebih besar daripada yang bisa aku ungkapkan lewat kata-kata.',
    primaryCta: 'Baca sesuatu dariku',
    secondaryCta: 'Lihat kenangan kita',
    heroImage: '/images/couple-sunset.svg',
    heroImageAlt: 'Pasangan berjalan bersama di bawah cahaya matahari senja keemasan',
  },

  loveLetter: {
    sectionKicker: 'SURAT YANG INGIN AKU SAMPAIKAN',
    title: 'A letter from my heart',
    salutation: 'Hai, sayang.',
    paragraphs: [
      'Aku mungkin bukan orang yang selalu punya kata-kata indah setiap saat. Kadang aku juga bingung bagaimana cara menjelaskan apa yang sebenarnya aku rasakan.',
      'Tapi sejak kamu hadir, ada banyak hal sederhana yang terasa berbeda. Hal-hal kecil yang sebelumnya biasa saja, sekarang bisa membuatku tersenyum hanya karena aku teringat kamu.',
      'Aku suka caramu menjadi dirimu sendiri. Aku suka percakapan kecil kita, tawa yang muncul tanpa direncanakan, dan momen-momen sederhana yang mungkin terlihat biasa bagi orang lain, tetapi berarti banyak buatku.',
      'Aku nggak berharap hubungan kita selalu sempurna. Aku hanya berharap kita bisa terus belajar memahami satu sama lain, saling mendengarkan, dan tetap memilih untuk berusaha ketika keadaan tidak selalu mudah.',
      'Terima kasih sudah menjadi bagian dari ceritaku.',
      'Kalau suatu hari kamu bertanya seberapa berarti kamu buatku, mungkin aku nggak akan selalu punya jawaban yang cukup indah. Tapi aku akan terus mencoba menunjukkannya melalui caraku memperlakukanmu, mendengarkanmu, dan hadir untukmu.',
      'Aku sayang kamu. Lebih dari yang sering berhasil aku ungkapkan.',
    ],
    closing: 'With all the love I have,',
    replayButtonText: 'Baca surat ini sekali lagi',
  },

  gallerySection: {
    kicker: 'LITTLE MOMENTS, BIG FEELINGS',
    title: 'Kepingan waktu yang ingin kusimpan',
    subtitle:
      'Setiap foto bisa diganti dengan potret perjalanan kita melalui file konfigurasi. Klik pada salah satu bingkai untuk melihat cerita di baliknya.',
  },

  gallery: [
    {
      id: 'gallery-golden-hour',
      src: '/images/couple-sunset.svg',
      fallbackSrc: '/images/couple-sunset.svg',
      alt: 'Pasangan berjalan saat golden hour dengan siluet hangat di tepi tebing senja',
      caption: 'Kalau bisa mengulang satu momen, aku ingin kembali ke saat kita tertawa tanpa memikirkan apa-apa.',
      momentLabel: 'Golden Hour Walk',
      locationOrTime: 'Senja yang Hangat',
      aspectClass: 'aspect-[16/10]',
      gridSpanClass: 'col-span-12 lg:col-span-7',
    },
    {
      id: 'gallery-twilight-silhouette',
      src: '/images/twilight-silhouette.svg',
      fallbackSrc: '/images/twilight-silhouette.svg',
      alt: 'Siluet pasangan di bawah langit senja berwarna ungu temaram dan merah muda lembut',
      caption: 'Hal sederhana terasa istimewa ketika ada kamu.',
      momentLabel: 'Beneath the Twilight',
      locationOrTime: 'Langit Senja',
      aspectClass: 'aspect-[4/5]',
      gridSpanClass: 'col-span-12 sm:col-span-6 lg:col-span-5',
    },
    {
      id: 'gallery-romantic-flowers',
      src: '/images/romantic-flowers.svg',
      fallbackSrc: '/images/romantic-flowers.svg',
      alt: 'Bunga mawar burgundy dan merah muda dengan pencahayaan alami yang lembut',
      caption: 'Seperti kelopak yang mekar perlahan, perasaanku tumbuh tenang setiap kali di dekatmu.',
      momentLabel: 'Quiet Blooms',
      locationOrTime: 'Cahaya Pagi',
      aspectClass: 'aspect-[4/3]',
      gridSpanClass: 'col-span-12 sm:col-span-6 lg:col-span-4',
    },
    {
      id: 'gallery-starry-night',
      src: '/images/starry-night.svg',
      fallbackSrc: '/images/starry-night.svg',
      alt: 'Langit malam penuh bintang dan rasi bintang berkilau di atas cakrawala tenang',
      caption: 'Semoga masih banyak cerita yang bisa kita simpan bersama.',
      momentLabel: 'Under the Same Stars',
      locationOrTime: 'Malam Berbintang',
      aspectClass: 'aspect-[16/9]',
      gridSpanClass: 'col-span-12 lg:col-span-8',
    },
    {
      id: 'gallery-golden-beach',
      src: '/images/golden-beach.svg',
      fallbackSrc: '/images/golden-beach.svg',
      alt: 'Pemandangan pantai dengan pantulan cahaya matahari keemasan di atas ombak tenang',
      caption: 'Di antara riuh dunia, bersamamu selalu terasa seperti pulang ke tempat paling teduh.',
      momentLabel: 'Golden Horizon',
      locationOrTime: 'Tepi Pantai',
      aspectClass: 'aspect-[4/3]',
      gridSpanClass: 'col-span-12 sm:col-span-6 lg:col-span-6',
    },
    {
      id: 'gallery-holding-hands',
      src: '/images/holding-hands.svg',
      fallbackSrc: '/images/holding-hands.svg',
      alt: 'Detail dua tangan yang saling menggenggam erat dalam balutan cahaya senja hangat',
      caption: 'Tidak perlu janji yang berlebihan; cukup genggaman tangan yang saling menguatkan.',
      momentLabel: 'Hand in Hand',
      locationOrTime: 'Selalu Bersama',
      aspectClass: 'aspect-[4/3]',
      gridSpanClass: 'col-span-12 sm:col-span-6 lg:col-span-6',
    },
  ],

  timelineSection: {
    kicker: 'OUR LITTLE TIMELINE',
    title: 'Cerita Kita, Selangkah demi Selangkah',
    subtitle:
      'Perjalanan sederhana yang dimulai dari sapaan biasa, hingga menjadi ruang pulang yang paling berharga.',
  },

  timeline: [
    {
      id: 'chapter-beginning',
      chapterNumber: '01',
      dateLabel: 'Bab Pertama · Tanggal Pertemuan (Isi di love-config.ts)',
      title: 'The Beginning',
      subtitle: 'Saat dua cerita mulai saling mengenal.',
      description:
        'Awalnya hanya perkenalan sederhana. Belum ada yang tahu bahwa sapaan singkat waktu itu akan membuka bab baru yang begitu hangat di dalam hidupku.',
      imageSrc: '/images/romantic-flowers.svg',
      imageAlt: 'Ilustrasi bunga awal perjumpaan',
    },
    {
      id: 'chapter-closer',
      chapterNumber: '02',
      dateLabel: 'Bab Kedua · Momen Pendekatan',
      title: 'Getting Closer',
      subtitle: 'Saat percakapan kecil mulai terasa berarti.',
      description:
        'Obrolan ringan yang tadinya singkat perlahan berubah menjadi pesan dan cerita yang selalu kutunggu setiap hari. Cara kamu mendengarkan membuatku merasa benar-benar diterima.',
      imageSrc: '/images/golden-beach.svg',
      imageAlt: 'Ilustrasi pantai senja saat semakin dekat',
    },
    {
      id: 'chapter-memories',
      chapterNumber: '03',
      dateLabel: 'Bab Ketiga · Tanggal Spesial Kita',
      title: 'Favorite Memories',
      subtitle: 'Saat banyak momen sederhana menjadi kenangan.',
      description:
        'Entah itu berjalan berdua, berbagi cerita setelah hari yang panjang, atau sekadar menertawakan hal-hal sepele—semuanya berubah menjadi kenangan favorit karena ada kamu di sana.',
      imageSrc: '/images/couple-sunset.svg',
      imageAlt: 'Ilustrasi pasangan menikmati senja bersama',
    },
    {
      id: 'chapter-today',
      chapterNumber: '04',
      dateLabel: 'Bab Keempat · Hari Ini',
      title: 'Today',
      subtitle: 'Saat aku ingin kamu tahu betapa berartinya dirimu.',
      description:
        'Halaman kecil ini kubuat khusus untukmu, sebagai pengingat bahwa di tengah hari-hari yang sibuk sekalipun, kamu tetap seseorang yang selalu kusyukuri kehadirannya.',
      imageSrc: '/images/holding-hands.svg',
      imageAlt: 'Ilustrasi genggaman tangan yang hangat',
    },
    {
      id: 'chapter-next',
      chapterNumber: '05',
      dateLabel: 'Bab Kelima · Masa Depan Kita',
      title: 'Our Next Chapter',
      subtitle: 'Cerita yang masih ingin kita lanjutkan.',
      description:
        'Masih banyak tempat yang belum kita kunjungi, cerita yang belum kita bagi, dan mimpi yang ingin kita wujudkan perlahan—selama kita terus melangkah berdampingan.',
      imageSrc: '/images/starry-night.svg',
      imageAlt: 'Ilustrasi langit malam berbintang untuk masa depan bersama',
    },
  ],

  loveNotesSection: {
    kicker: 'HAL KECIL TENTANG KAMU',
    title: 'Things I adore about you',
    subtitle: 'Sentuh atau klik setiap kartu untuk membalik dan membaca catatan kecil yang kusimpan tentangmu.',
  },

  loveNotes: [
    {
      id: 'note-smile',
      numberLabel: '01',
      title: 'Senyummu',
      shortHint: 'Sentuh untuk membaca catatan',
      message: 'Ada sesuatu yang sederhana dari senyummu yang bisa membuat hariku terasa lebih baik.',
    },
    {
      id: 'note-stories',
      numberLabel: '02',
      title: 'Caramu bercerita',
      shortHint: 'Sentuh untuk membaca catatan',
      message: 'Aku suka mendengarkan hal-hal kecil yang ingin kamu ceritakan, lengkap dengan antusiasme di matamu.',
    },
    {
      id: 'note-presence',
      numberLabel: '03',
      title: 'Kehadiranmu',
      shortHint: 'Sentuh untuk membaca catatan',
      message:
        'Bahkan ketika kita tidak melakukan sesuatu yang istimewa, aku tetap senang menghabiskan waktu bersamamu.',
    },
    {
      id: 'note-authentic',
      numberLabel: '04',
      title: 'Menjadi dirimu sendiri',
      shortHint: 'Sentuh untuk membaca catatan',
      message: 'Aku menghargai caramu menjadi dirimu, tanpa harus berpura-pura menjadi orang lain.',
    },
    {
      id: 'note-kindness',
      numberLabel: '05',
      title: 'Perhatian kecilmu',
      shortHint: 'Sentuh untuk membaca catatan',
      message:
        'Cara kamu mengingat hal-hal sederhana dan menanyakan kabarku selalu berhasil membuat hatiku terasa tenang.',
    },
    {
      id: 'note-patience',
      numberLabel: '06',
      title: 'Ruang untuk bertumbuh',
      shortHint: 'Sentuh untuk membaca catatan',
      message:
        'Bersamamu, aku merasa punya ruang yang aman untuk belajar, bercerita dengan jujur, dan menjadi pribadi yang lebih baik.',
    },
  ],

  universe3D: {
    kicker: 'INTERACTIVE 3D SANCTUARY',
    title: 'A Little Universe, Just for You',
    subtitle:
      'Sebuah observatorium kecil di antara bintang-bintang yang kubangun untukmu. Geser sudut pandang atau gunakan kontrol di bawah untuk menjelajahi monumen rasi hati kita.',
    presets: [
      {
        id: 'vista',
        label: 'Vista Observatorium',
        description: 'Menatap monumen hati kristal dan bangku senja di bawah taburan bintang.',
        position: [0, 3.6, 11.5],
        target: [0, 1.8, 0],
      },
      {
        id: 'heart-core',
        label: 'Inti Hati Kristal',
        description: 'Melihat lebih dekat astrolabe emas dan kristal mawar yang berputar lembut.',
        position: [2.4, 2.7, 5.2],
        target: [0, 2.3, 0],
      },
      {
        id: 'bench',
        label: 'Bangku Berdua',
        description: 'Sudut tenang tempat dua siluet duduk berdampingan ditemani lentera hangat.',
        position: [-4.2, 2.1, 6.2],
        target: [-1.8, 1.1, 1.4],
      },
      {
        id: 'celestial',
        label: 'Orbit Bintang',
        description: 'Pandangan menyeluruh dari atas pulau observatorium di tengah angkasa.',
        position: [0, 8.8, 9.5],
        target: [0, 1.2, 0],
      },
    ],
  },

  specialMoment: {
    initialPrompt: 'Sebelum kamu menutup halaman ini…',
    buttonText: 'Ada satu hal lagi',
    paragraphs: [
      'Dari semua hal yang bisa berubah dalam hidup, aku berharap kita selalu punya ruang untuk saling memahami.',
      'Aku ingin terus mengenalmu, bukan hanya di hari-hari yang mudah, tetapi juga saat kita sama-sama sedang belajar menjadi lebih baik.',
      'Aku nggak bisa menjanjikan bahwa semuanya akan selalu sempurna. Tapi aku ingin terus berusaha mencintaimu dengan cara yang sehat, jujur, dan tulus.',
    ],
    climaxLine1: 'Kalau aku boleh memilih sekali lagi, aku tetap ingin mengenalmu.',
    climaxLine2: 'Aku tetap ingin memilihmu.',
    backdropImage: '/images/starry-night.svg',
  },

  finalMessage: {
    heading: 'Sudah sampai di akhir, sayang.',
    subheading: 'Semoga kamu bisa merasakan sedikit dari apa yang ingin aku sampaikan.',
    hugButtonText: 'Peluk virtual untuk kamu',
    hugActiveText: 'Sending you the warmest hug.',
    hugActiveSubtext: 'Terima kasih sudah membaca setiap kata di ruang kecil ini. Aku sayang kamu.',
    replayHugText: 'Kirim pelukan sekali lagi',
    restartButtonText: 'Baca dari awal',
  },

  animation: {
    staggerDelay: 0.12,
    enableParticles: true,
  },
};
