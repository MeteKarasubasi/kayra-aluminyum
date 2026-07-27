import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")

  const projects = await db.project.findMany({
    where: {
      isActive: true,
      ...(category ? { category } : {}),
    },
    orderBy: { order: "asc" },
  })
  return NextResponse.json(projects)
}