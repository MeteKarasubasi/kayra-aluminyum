"use client"

import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"
import { Logo } from "./logo"
import { useLang } from "@/lib/i18n"
import { products } from "@/lib/data"

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-10h4v1.5" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

export function Footer() {
  const { t } = useLang()

  return (
    <footer className="relative mt-24 border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{t("footer.desc")}</p>
          <div className="flex gap-2 pt-1">
            {[InstagramIcon, LinkedinIcon, FacebookIcon].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground">{t("footer.products")}</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={`/urunler#${p.slug}`} className="transition-colors hover:text-primary">
                  {t(p.titleKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground">{t("footer.company")}</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link href="/#hakkimizda" className="transition-colors hover:text-primary">{t("footer.about")}</Link></li>
            <li><Link href="/katalog" className="transition-colors hover:text-primary">{t("footer.catalog")}</Link></li>
            <li><Link href="/projeler" className="transition-colors hover:text-primary">{t("footer.projects")}</Link></li>
            <li><Link href="/#referanslar" className="transition-colors hover:text-primary">{t("refs.tag")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground">{t("footer.contact")}</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              <span>Organize Sanayi Bölgesi, 5. Cad. No: 12, Ankara</span>
            </li>
            <li className="flex gap-3">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <a href="tel:+903120000000" className="transition-colors hover:text-primary">+90 312 000 00 00</a>
            </li>
            <li className="flex gap-3">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              <a href="mailto:info@kayrab.com.tr" className="transition-colors hover:text-primary">info@kayrab.com.tr</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} KAYRAB Aluminyum. {t("footer.rights")}</p>
          <p className="font-display tracking-widest">KAYRAB ALUMINYUM</p>
        </div>
      </div>
    </footer>
  )
}
