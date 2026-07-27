import type { Metadata } from "next"
import { ProjectsClient } from "@/components/projects/projects-client"
import { getDbProjects } from "@/lib/data.server"

export const metadata: Metadata = {
  title: "Projeler | KAYRAB Aluminyum",
  description: "KAYRAB Aluminyum'un konut, ticari ve kurumsal referans projeleri.",
}

export default async function ProjelerPage() {
  const projects = await getDbProjects()
  return <ProjectsClient projects={projects} />
}