(function () {
  const products = [
    { slug: "kis-bahcesi", titleTr: "Kış Bahçesi Sistemleri", titleEn: "Winter Garden Systems", code: "01 / WG", image: "/images/product-winter-garden.png",
      descTr: "Dört mevsim konfor sunan, ısı yalıtımlı cam kış bahçeleri.", descEn: "Heat-insulated glass winter gardens offering four-season comfort.",
      features: ["Isı yalıtımı", "Ses yalıtımı", "Özel tasarım"], order: 1,
      titleKey: "prod.wintergarden.title", descKey: "prod.wintergarden.desc" },
    { slug: "bioklimatik-pergola", titleTr: "Bioklimatik Pergola", titleEn: "Bioclimatic Pergola", code: "02 / PG", image: "/images/product-pergola.png",
      descTr: "Ayarlanabilir tavan kanatlarıyla güneşi ve gölgeyi kontrol edin.", descEn: "Control sun and shade with adjustable louvered roof blades.",
      features: ["Motorlu kanat sistemi", "Yağmur sensörü", "LED aydınlatma"], order: 2,
      titleKey: "prod.pergola.title", descKey: "prod.pergola.desc" },
    { slug: "korkuluk", titleTr: "Korkuluk Sistemleri", titleEn: "Railing Systems", code: "03 / RL", image: "/images/product-railing.png",
      descTr: "Cam ve alüminyum kombinasyonuyla güvenli, şık korkuluklar.", descEn: "Safe, elegant railings combining glass and aluminium.",
      features: ["Temperli cam", "Paslanmaz çelik", "Kolay montaj"], order: 3,
      titleKey: "prod.railing.title", descKey: "prod.railing.desc" },
    { slug: "cam-balkon", titleTr: "Cam Balkon & Sürme Sistemler", titleEn: "Glass Balcony & Sliding Systems", code: "04 / GB", image: "/images/product-glass-balcony.png",
      descTr: "Katlanır ve sürme cam sistemleriyle kesintisiz manzara.", descEn: "Uninterrupted views with folding and sliding glass systems.",
      features: ["Katlanır sistem", "Sürme sistem", "Rüzgar dayanımı"], order: 4,
      titleKey: "prod.balcony.title", descKey: "prod.balcony.desc" },
    { slug: "giydirme-cephe", titleTr: "Giydirme Cephe", titleEn: "Curtain Wall", code: "05 / CW", image: "/images/product-curtain-wall.png",
      descTr: "Yüksek yapılar için performanslı alüminyum cephe kaplamaları.", descEn: "High-performance aluminium facade cladding for tall buildings.",
      features: ["Enerji verimliliği", "Deprem dayanımı", "Estetik tasarım"], order: 5,
      titleKey: "prod.curtainwall.title", descKey: "prod.curtainwall.desc" },
    { slug: "aluminyum-dograma", titleTr: "Alüminyum Doğrama", titleEn: "Aluminium Joinery", code: "06 / AJ", image: "/images/product-joinery.png",
      descTr: "İnce profilli, yalıtımlı kapı ve pencere doğrama sistemleri.", descEn: "Slim-profile, insulated door and window joinery systems.",
      features: ["İnce profil", "Yüksek yalıtım", "Uzun ömür"], order: 6,
      titleKey: "prod.joinery.title", descKey: "prod.joinery.desc" },
  ];

  const projects = [
    { title: "Skyline Tower", slug: "skyline-tower", description: "İstanbul'un siluetine yeni bir boyut kazandıran 42 katlı konut projesi.", location: "İstanbul", category: "residential", image: "/images/project-tower.png", gallery: ["/images/project-tower.png"], products: ["giydirme-cephe", "cam-balkon"], area: "28.000 m²", year: "2024", client: "Skyline İnşaat", order: 1 },
    { title: "Villa Doğa", slug: "villa-doga", description: "Bodrum'un turkuaz sularına bakan lüks villa projesi.", location: "Bodrum", category: "residential", image: "/images/project-villa.png", gallery: ["/images/project-villa.png"], products: ["kis-bahcesi", "bioklimatik-pergola", "korkuluk"], area: "1.200 m²", year: "2023", client: "Doğa Yapı", order: 2 },
    { title: "Meva Cafe", slug: "meva-cafe", description: "Ankara'nın merkezinde modern bir cafe projesi.", location: "Ankara", category: "commercial", image: "/images/project-cafe.png", gallery: ["/images/project-cafe.png"], products: ["cam-balkon", "bioklimatik-pergola"], area: "450 m²", year: "2024", client: "Meva Grup", order: 3 },
  ];

  const references = [
    { name: "ARABICA", logo: "/images/references/arabica.svg" }, { name: "ARMADA", logo: "/images/references/armada.svg" },
    { name: "CONGRESIUM", logo: "/images/references/congresium.svg" }, { name: "GİMART", logo: "/images/references/gimart.svg" },
    { name: "MAGNOLIA", logo: "/images/references/magnolia.svg" }, { name: "MARUS", logo: "/images/references/marus.svg" },
    { name: "TEPE MOZAİK", logo: "/images/references/tepe-mozaik.svg" }, { name: "BEYKOZ", logo: "/images/references/beykoz.svg" },
    { name: "KOZA", logo: "/images/references/koza.svg" }, { name: "SYNLAB", logo: "/images/references/synlab.svg" },
    { name: "TÜRK TRAKTÖR", logo: "/images/references/turk-traktor.svg" }, { name: "WALKINN", logo: "/images/references/walkinn.svg" },
    { name: "KARAKAYA", logo: "/images/references/karakaya.svg" }, { name: "DÜVEROĞLU", logo: "/images/references/duveroglu.svg" },
  ];

  window.DATA = { products, projects, references };
})();