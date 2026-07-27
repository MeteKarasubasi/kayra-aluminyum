// Load .env before anything else (Node 20.12+, 22+, 25+ built-in)
try {
  process.loadEnvFile()
} catch {
  // .env may not exist
}

import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from "bcryptjs"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding database...")

  // Create default admin
  const passwordHash = await bcrypt.hash("admin123", 12)
  await prisma.admin.upsert({
    where: { email: "admin@kayrab.com.tr" },
    update: {},
    create: {
      email: "admin@kayrab.com.tr",
      passwordHash,
      name: "KAYRAB Admin",
      role: "admin",
    },
  })
  console.log("✅ Admin user created: admin@kayrab.com.tr")

  // Seed products
  const productsData = [
    {
      titleTr: "Kış Bahçesi Sistemleri",
      titleEn: "Winter Garden Systems",
      slug: "kis-bahcesi",
      descTr: "Dört mevsim konfor sunan, ısı yalıtımlı cam kış bahçeleri.",
      descEn: "Heat-insulated glass winter gardens offering four-season comfort.",
      image: "/product-winter-garden.png",
      code: "01 / WG",
      features: ["Isı yalıtımı", "Ses yalıtımı", "Özel tasarım"],
      order: 1,
    },
    {
      titleTr: "Bioklimatik Pergola",
      titleEn: "Bioclimatic Pergola",
      slug: "bioklimatik-pergola",
      descTr: "Ayarlanabilir tavan kanatlarıyla güneşi ve gölgeyi kontrol edin.",
      descEn: "Control sun and shade with adjustable louvered roof blades.",
      image: "/product-pergola.png",
      code: "02 / PG",
      features: ["Motorlu kanat sistemi", "Yağmur sensörü", "LED aydınlatma"],
      order: 2,
    },
    {
      titleTr: "Korkuluk Sistemleri",
      titleEn: "Railing Systems",
      slug: "korkuluk",
      descTr: "Cam ve alüminyum kombinasyonuyla güvenli, şık korkuluklar.",
      descEn: "Safe, elegant railings combining glass and aluminium.",
      image: "/product-railing.png",
      code: "03 / RL",
      features: ["Temperli cam", "Paslanmaz çelik", "Kolay montaj"],
      order: 3,
    },
    {
      titleTr: "Cam Balkon & Sürme Sistemler",
      titleEn: "Glass Balcony & Sliding Systems",
      slug: "cam-balkon",
      descTr: "Katlanır ve sürme cam sistemleriyle kesintisiz manzara.",
      descEn: "Uninterrupted views with folding and sliding glass systems.",
      image: "/product-glass-balcony.png",
      code: "04 / GB",
      features: ["Katlanır sistem", "Sürme sistem", "Rüzgar dayanımı"],
      order: 4,
    },
    {
      titleTr: "Giydirme Cephe",
      titleEn: "Curtain Wall",
      slug: "giydirme-cephe",
      descTr: "Yüksek yapılar için performanslı alüminyum cephe kaplamaları.",
      descEn: "High-performance aluminium facade cladding for tall buildings.",
      image: "/product-curtain-wall.png",
      code: "05 / CW",
      features: ["Enerji verimliliği", "Deprem dayanımı", "Estetik tasarım"],
      order: 5,
    },
    {
      titleTr: "Alüminyum Doğrama",
      titleEn: "Aluminium Joinery",
      slug: "aluminyum-dograma",
      descTr: "İnce profilli, yalıtımlı kapı ve pencere doğrama sistemleri.",
      descEn: "Slim-profile, insulated door and window joinery systems.",
      image: "/product-joinery.png",
      code: "06 / AJ",
      features: ["İnce profil", "Yüksek yalıtım", "Uzun ömür"],
      order: 6,
    },
  ]

  for (const p of productsData) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    })
  }
  console.log(`✅ ${productsData.length} products seeded`)

  // Seed projects
  const projectsData = [
    {
      title: "Skyline Tower",
      slug: "skyline-tower",
      description: "İstanbul'un siluetine yeni bir boyut kazandıran 42 katlı konut projesi.",
      location: "İstanbul",
      category: "residential",
      image: "/project-tower.png",
      gallery: ["/project-tower.png"],
      products: ["giydirme-cephe", "cam-balkon"],
      area: "28.000 m²",
      year: "2024",
      client: "Skyline İnşaat",
      order: 1,
    },
    {
      title: "Villa Doğa",
      slug: "villa-doga",
      description: "Bodrum'un turkuaz sularına bakan lüks villa projesi.",
      location: "Bodrum",
      category: "residential",
      image: "/project-villa.png",
      gallery: ["/project-villa.png"],
      products: ["kis-bahcesi", "bioklimatik-pergola", "korkuluk"],
      area: "1.200 m²",
      year: "2023",
      client: "Doğa Yapı",
      order: 2,
    },
    {
      title: "Meva Cafe",
      slug: "meva-cafe",
      description: "Ankara'nın merkezinde modern bir cafe projesi.",
      location: "Ankara",
      category: "commercial",
      image: "/project-cafe.png",
      gallery: ["/project-cafe.png"],
      products: ["cam-balkon", "bioklimatik-pergola"],
      area: "450 m²",
      year: "2024",
      client: "Meva Grup",
      order: 3,
    },
  ]

  for (const p of projectsData) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    })
  }
  console.log(`✅ ${projectsData.length} projects seeded`)

  // Seed references
  const referencesData = [
    { name: "ARABICA", logo: "/references/arabica.svg", order: 1 },
    { name: "ARMADA", logo: "/references/armada.svg", order: 2 },
    { name: "CONGRESIUM", logo: "/references/congresium.svg", order: 3 },
    { name: "GİMART", logo: "/references/gimart.svg", order: 4 },
    { name: "MAGNOLIA", logo: "/references/magnolia.svg", order: 5 },
    { name: "MARUS", logo: "/references/marus.svg", order: 6 },
    { name: "TEPE MOZAİK", logo: "/references/tepe-mozaik.svg", order: 7 },
    { name: "BEYKOZ", logo: "/references/beykoz.svg", order: 8 },
    { name: "KOZA", logo: "/references/koza.svg", order: 9 },
    { name: "SYNLAB", logo: "/references/synlab.svg", order: 10 },
    { name: "TÜRK TRAKTÖR", logo: "/references/turk-traktor.svg", order: 11 },
    { name: "WALKINN", logo: "/references/walkinn.svg", order: 12 },
    { name: "KARAKAYA", logo: "/references/karakaya.svg", order: 13 },
    { name: "DÜVEROĞLU", logo: "/references/duveroglu.svg", order: 14 },
  ]

  for (const r of referencesData) {
    const existing = await prisma.reference.findFirst({ where: { name: r.name } })
    if (!existing) {
      await prisma.reference.create({ data: r })
    }
  }
  console.log(`✅ ${referencesData.length} references seeded`)

  // Seed site settings
  const settings = [
    { key: "logo_url", value: "" },
    { key: "logo_text", value: "KAYRAB" },
    { key: "logo_subtext", value: "ALUMINYUM" },
    { key: "catalog_pdf_url", value: "" },
    { key: "phone", value: "+90 312 000 00 00" },
    { key: "phone2", value: "+90 312 000 00 01" },
    { key: "whatsapp", value: "+90 312 000 00 00" },
    { key: "email", value: "info@kayrab.com.tr" },
    { key: "address_tr", value: "Organize Sanayi Bölgesi, 5. Cad. No: 12, Ankara" },
    { key: "address_en", value: "Organized Industrial Zone, 5th St. No: 12, Ankara" },
    { key: "hours_tr", value: "Pazartesi – Cumartesi: 08:00 – 18:00" },
    { key: "hours_en", value: "Monday – Saturday: 08:00 – 18:00" },
    { key: "google_maps_link", value: "https://maps.google.com/?q=Ankara+Organize+Sanayi+B%C3%B6lgesi" },
    { key: "instagram", value: "https://instagram.com/kayrabaluminyum" },
    { key: "facebook", value: "https://facebook.com/kayrabaluminyum" },
    { key: "youtube", value: "" },
    { key: "linkedin", value: "https://linkedin.com/company/kayrab" },
    { key: "site_title", value: "KAYRAB Aluminyum | Alüminyum & Cam Sistemleri" },
    { key: "slogan", value: "Işığı ve mekânı yeniden tasarlayan alüminyum çözümler" },
    { key: "seo_description", value: "KAYRAB Aluminyum; kış bahçesi, bioklimatik pergola, korkuluk, cam balkon, giydirme cephe ve alüminyum doğrama sistemlerinde güvenilir çözüm ortağınız." },
  ]

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    })
  }
  console.log(`✅ ${settings.length} site settings seeded`)

  console.log("🎉 Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
