import type { Metadata } from "next"
import { projects } from "@/lib/data"
import { getDbProjectById } from "@/lib/data.server"
import { ProjectDetailClient } from "@/components/projects/project-detail-client"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const project = await getDbProjectById(id)
  return {
    title: project ? `${project.title} | KAYRAB Aluminyum` : "Proje | KAYRAB Aluminyum",
    description: project?.description || "KAYRAB Aluminyum proje detayı",
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params
  return <ProjectDetailClient projectId={id} />
}
