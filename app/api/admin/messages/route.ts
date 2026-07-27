import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withAuth } from "@/lib/api-guard"

export async function GET(request: Request) {
  return withAuth(request, async () => {
    const { searchParams } = new URL(request.url)
    const unread = searchParams.get("unread") === "true"

    const messages = await db.contactMessage.findMany({
      where: unread ? { isRead: false } : undefined,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(messages)
  })
}