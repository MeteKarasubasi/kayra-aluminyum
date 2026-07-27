import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const references = await db.reference.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })
  return NextResponse.json(references)
}