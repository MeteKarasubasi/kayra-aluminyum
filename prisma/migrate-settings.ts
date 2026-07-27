try {
  process.loadEnvFile()
} catch {}

import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const settings: { key: string; value: string }[] = [
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

async function main() {
  console.log("⚙️  Site ayarları migrasyonu başlıyor...")

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    })
    console.log(`  ✅ ${s.key}`)
  }

  console.log(`🎉 ${settings.length} ayar başarıyla eklendi/güncellendi!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
