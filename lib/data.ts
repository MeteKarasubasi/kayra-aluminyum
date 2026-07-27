import type { dict } from "./i18n"

type Key = keyof typeof dict

export type Product = {
  slug: string
  titleKey: Key
  descKey: Key
  image: string
  code: string
}

export const products: Product[] = [
  {
    slug: "kis-bahcesi",
    titleKey: "prod.wintergarden.title",
    descKey: "prod.wintergarden.desc",
    image: "/product-winter-garden.png",
    code: "01 / WG",
  },
  {
    slug: "bioklimatik-pergola",
    titleKey: "prod.pergola.title",
    descKey: "prod.pergola.desc",
    image: "/product-pergola.png",
    code: "02 / PG",
  },
  {
    slug: "korkuluk",
    titleKey: "prod.railing.title",
    descKey: "prod.railing.desc",
    image: "/product-railing.png",
    code: "03 / RL",
  },
  {
    slug: "cam-balkon",
    titleKey: "prod.balcony.title",
    descKey: "prod.balcony.desc",
    image: "/product-glass-balcony.png",
    code: "04 / GB",
  },
  {
    slug: "giydirme-cephe",
    titleKey: "prod.curtainwall.title",
    descKey: "prod.curtainwall.desc",
    image: "/product-curtain-wall.png",
    code: "05 / CW",
  },
  {
    slug: "aluminyum-dograma",
    titleKey: "prod.joinery.title",
    descKey: "prod.joinery.desc",
    image: "/product-joinery.png",
    code: "06 / AJ",
  },
]

export type ProjectCategory = "residential" | "commercial" | "corporate"

export type Project = {
  id: string
  title: string
  location: string
  category: ProjectCategory
  image: string
  description?: string
  gallery?: string[]
  products?: string[]
  area?: string
  year?: string
  client?: string
}

export const projects: Project[] = [
  {
    id: "p1",
    title: "Skyline Tower",
    location: "İstanbul",
    category: "residential",
    image: "/project-tower.png",
    description: "İstanbul'un siluetine yeni bir boyut kazandıran 42 katlı konut projesi. Giydirme cephe ve cam balkon sistemleri ile donatılmıştır.",
    gallery: ["/project-tower.png"],
    products: ["giydirme-cephe", "cam-balkon"],
    area: "28.000 m²",
    year: "2024",
    client: "Skyline İnşaat",
  },
  {
    id: "p2",
    title: "Villa Doğa",
    location: "Bodrum",
    category: "residential",
    image: "/project-villa.png",
    description: "Bodrum'un turkuaz sularına bakan lüks villa projesi. Kış bahçesi ve bioklimatik pergola sistemleri ile yaşam alanları genişletilmiştir.",
    gallery: ["/project-villa.png"],
    products: ["kis-bahcesi", "bioklimatik-pergola", "korkuluk"],
    area: "1.200 m²",
    year: "2023",
    client: "Doğa Yapı",
  },
  {
    id: "p3",
    title: "Meva Cafe",
    location: "Ankara",
    category: "commercial",
    image: "/project-cafe.png",
    description: "Ankara'nın merkezinde modern bir cafe projesi. Cam sürme sistemleri ile açık-kapalı konsept tasarlanmıştır.",
    gallery: ["/project-cafe.png"],
    products: ["cam-balkon", "bioklimatik-pergola"],
    area: "450 m²",
    year: "2024",
    client: "Meva Grup",
  },
  {
    id: "p4",
    title: "Nexus Plaza",
    location: "İzmir",
    category: "corporate",
    image: "/project-office.png",
    description: "İzmir'in iş merkezinde konumlanan kurumsal ofis projesi. Performanslı giydirme cephe ve alüminyum doğrama sistemleri uygulanmıştır.",
    gallery: ["/project-office.png"],
    products: ["giydirme-cephe", "aluminyum-dograma"],
    area: "15.000 m²",
    year: "2023",
    client: "Nexus Holding",
  },
  {
    id: "p5",
    title: "Park Rezidans",
    location: "Ankara",
    category: "residential",
    image: "/project-residence.png",
    description: "Ankara Park bölgesinde konumlanan premium rezidans projesi. Tüm dairelerde cam balkon ve korkuluk sistemleri kullanılmıştır.",
    gallery: ["/project-residence.png"],
    products: ["cam-balkon", "korkuluk", "aluminyum-dograma"],
    area: "22.000 m²",
    year: "2024",
    client: "Park İnşaat",
  },
  {
    id: "p6",
    title: "Aurora Office",
    location: "İstanbul",
    category: "corporate",
    image: "/project-office.png",
    description: "İstanbul finans merkezinde A+ sınıfı ofis projesi. Enerji verimli giydirme cephe sistemi ile LEED sertifikası hedeflenmiştir.",
    gallery: ["/project-office.png"],
    products: ["giydirme-cephe", "aluminyum-dograma"],
    area: "35.000 m²",
    year: "2023",
    client: "Aurora Yatırım",
  },
  {
    id: "p7",
    title: "Lotus Villa",
    location: "Antalya",
    category: "residential",
    image: "/project-villa.png",
    description: "Antalya'nın en prestijli bölgesinde konumlanan villa projesi. Özel tasarım kış bahçesi ve pergola sistemleri ile donatılmıştır.",
    gallery: ["/project-villa.png"],
    products: ["kis-bahcesi", "bioklimatik-pergola", "korkuluk"],
    area: "980 m²",
    year: "2024",
    client: "Lotus Yapı",
  },
  {
    id: "p8",
    title: "Grand Tower",
    location: "İstanbul",
    category: "corporate",
    image: "/project-tower.png",
    description: "İstanbul'un yeni iş merkezindeki 55 katlı karma kullanımlı kule. Yüksek performanslı cephe ve doğrama sistemleri uygulanmıştır.",
    gallery: ["/project-tower.png"],
    products: ["giydirme-cephe", "aluminyum-dograma", "korkuluk"],
    area: "45.000 m²",
    year: "2022",
    client: "Grand İnşaat",
  },
  {
    id: "p9",
    title: "Bahçe Cafe",
    location: "Eskişehir",
    category: "commercial",
    image: "/project-cafe.png",
    description: "Eskişehir'in popüler cafe ve restoran projesi. Bioklimatik pergola ile dört mevsim kullanılabilir teras alanı oluşturulmuştur.",
    gallery: ["/project-cafe.png"],
    products: ["bioklimatik-pergola", "cam-balkon"],
    area: "320 m²",
    year: "2024",
    client: "Bahçe Gastronomi",
  },
]

export type Reference = {
  id: string
  name: string
  logo: string
  website?: string
}

export const references: Reference[] = [
  { id: "r1", name: "ARABICA", logo: "/references/arabica.svg" },
  { id: "r2", name: "ARMADA", logo: "/references/armada.svg" },
  { id: "r3", name: "CONGRESIUM", logo: "/references/congresium.svg" },
  { id: "r4", name: "GİMART", logo: "/references/gimart.svg" },
  { id: "r5", name: "MAGNOLIA", logo: "/references/magnolia.svg" },
  { id: "r6", name: "MARUS", logo: "/references/marus.svg" },
  { id: "r7", name: "TEPE MOZAİK", logo: "/references/tepe-mozaik.svg" },
  { id: "r8", name: "BEYKOZ", logo: "/references/beykoz.svg" },
  { id: "r9", name: "KOZA", logo: "/references/koza.svg" },
  { id: "r10", name: "SYNLAB", logo: "/references/synlab.svg" },
  { id: "r11", name: "TÜRK TRAKTÖR", logo: "/references/turk-traktor.svg" },
  { id: "r12", name: "WALKINN", logo: "/references/walkinn.svg" },
  { id: "r13", name: "KARAKAYA", logo: "/references/karakaya.svg" },
  { id: "r14", name: "DÜVEROĞLU", logo: "/references/duveroglu.svg" },
]

