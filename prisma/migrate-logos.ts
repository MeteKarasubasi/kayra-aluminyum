try {
  process.loadEnvFile()
} catch {}

import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const referencesPngs: { name: string; file: string }[] = [
  { name: "ARABICA", file: "arabica.png" },
  { name: "ARMADA", file: "armada.png" },
  { name: "BEYKOZ", file: "beykoz.png" },
  { name: "CONGRESIUM", file: "congresium.png" },
  { name: "DÜVEROĞLU", file: "duveroglu.png" },
  { name: "GİMART", file: "gimart.png" },
  { name: "KARAKAYA", file: "karakaya.png" },
  { name: "KOZA", file: "koza.png" },
  { name: "MAGNOLIA", file: "magnolia.png" },
  { name: "MARUS", file: "marus.png" },
  { name: "SYNLAB", file: "synlab.png" },
  { name: "TEPE MOZAİK", file: "tepe-mozaik.png" },
  { name: "TÜRK TRAKTÖR", file: "turk-traktor.png" },
  { name: "WALKINN", file: "walkinn.png" },
]

async function main() {
  console.log("🖼️  PNG logoları veritabanına yükleniyor...")

  for (const ref of referencesPngs) {
    const filePath = join(process.cwd(), "public", "references", ref.file)
    let buffer: Buffer
    try {
      buffer = await readFile(filePath)
    } catch {
      console.warn(`  ⚠️  ${ref.file} okunamadı, atlanıyor`)
      continue
    }

    const existing = await prisma.asset.findFirst({
      where: { filename: ref.file },
    })

    let assetId: string
    if (existing) {
      const updated = await prisma.asset.update({
        where: { id: existing.id },
        data: {
          filename: ref.file,
          mimeType: "image/png",
          size: buffer.length,
          data: buffer,
        },
      })
      assetId = updated.id
    } else {
      const created = await prisma.asset.create({
        data: {
          filename: ref.file,
          mimeType: "image/png",
          size: buffer.length,
          data: buffer,
        },
      })
      assetId = created.id
    }

    const assetUrl = `/api/assets/${assetId}`
    const refRecord = await prisma.reference.findFirst({
      where: { name: { equals: ref.name, mode: "insensitive" } },
    })

    if (refRecord) {
      await prisma.reference.update({
        where: { id: refRecord.id },
        data: { logo: assetUrl },
      })
      console.log(`  ✅ ${ref.name} → ${assetUrl}`)
    } else {
      console.warn(`  ⚠️  ${ref.name} referans kaydı bulunamadı, asset yaratıldı: ${assetUrl}`)
    }
  }

  console.log("🎉 Logo migrasyonu tamamlandı!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })