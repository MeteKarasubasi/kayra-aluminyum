import type { Metadata } from "next"
import { ReferencesPageClient } from "@/components/references/references-client"
import { getDbReferences } from "@/lib/data.server"

export const metadata: Metadata = {
  title: "Referanslar | KAYRAB Aluminyum",
  description:
    "KAYRAB Aluminyum'un güvenilir iş ortakları ve kurumsal referansları. Türkiye'nin önde gelen markalarıyla projeler.",
}

export default async function ReferanslarPage() {
  const references = await getDbReferences()
  return <ReferencesPageClient references={references} />
}