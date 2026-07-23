import type { Metadata } from "next"
import { ProjectsClient } from "@/components/projects/projects-client"

export const metadata: Metadata = {
  title: "Projeler | KAYRAB Aluminyum",
  description: "KAYRAB Aluminyum'un konut, ticari ve kurumsal referans projeleri.",
}

export default function ProjelerPage() {
  return <ProjectsClient />
}
