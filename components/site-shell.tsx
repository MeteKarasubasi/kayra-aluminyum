"use client"

import { LangProvider } from "@/lib/i18n"
import { Navbar } from "./navbar"
import { Footer } from "./footer"

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </LangProvider>
  )
}
