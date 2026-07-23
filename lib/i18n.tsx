"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

export type Lang = "tr" | "en"

type Dict = Record<string, { tr: string; en: string }>

export const dict = {
  "nav.home": { tr: "Anasayfa", en: "Home" },
  "nav.about": { tr: "Kurumsal", en: "About" },
  "nav.products": { tr: "Ürünler", en: "Products" },
  "nav.catalog": { tr: "Katalog", en: "Catalog" },
  "nav.projects": { tr: "Projeler", en: "Projects" },
  "nav.contact": { tr: "İletişim", en: "Contact" },
  "nav.quote": { tr: "Teklif Al", en: "Get a Quote" },

  "hero.tag": { tr: "ALÜMİNYUM & CAM SİSTEMLERİ", en: "ALUMINIUM & GLASS SYSTEMS" },
  "hero.title": {
    tr: "Işığı ve mekânı yeniden tasarlayan alüminyum çözümler",
    en: "Aluminium solutions that redefine light and space",
  },
  "hero.desc": {
    tr: "KAYRAB Aluminyum; kış bahçesinden giydirme cepheye, mimari vizyonunuzu hassas mühendislik ve kusursuz işçilikle hayata geçirir.",
    en: "From winter gardens to curtain walls, KAYRAB Aluminyum turns your architectural vision into reality with precise engineering and flawless craftsmanship.",
  },
  "hero.cta1": { tr: "Ürünleri Keşfet", en: "Explore Products" },
  "hero.cta2": { tr: "Kataloğu İncele", en: "View Catalog" },
  "hero.stat1": { tr: "Tamamlanan Proje", en: "Completed Projects" },
  "hero.stat2": { tr: "Yıllık Tecrübe", en: "Years of Experience" },
  "hero.stat3": { tr: "Kurumsal Referans", en: "Corporate References" },

  "products.tag": { tr: "ÜRÜNLER", en: "PRODUCTS" },
  "products.title": { tr: "Sistem Çözümlerimiz", en: "Our System Solutions" },
  "products.desc": {
    tr: "Her mekân için mühendislik odaklı, dayanıklı ve estetik alüminyum sistemleri.",
    en: "Engineering-driven, durable and aesthetic aluminium systems for every space.",
  },
  "products.all": { tr: "Tüm Ürünler", en: "All Products" },
  "products.detail": { tr: "Detayları Gör", en: "View Details" },

  "prod.wintergarden.title": { tr: "Kış Bahçesi Sistemleri", en: "Winter Garden Systems" },
  "prod.wintergarden.desc": {
    tr: "Dört mevsim konfor sunan, ısı yalıtımlı cam kış bahçeleri.",
    en: "Heat-insulated glass winter gardens offering four-season comfort.",
  },
  "prod.pergola.title": { tr: "Bioklimatik Pergola", en: "Bioclimatic Pergola" },
  "prod.pergola.desc": {
    tr: "Ayarlanabilir tavan kanatlarıyla güneşi ve gölgeyi kontrol edin.",
    en: "Control sun and shade with adjustable louvered roof blades.",
  },
  "prod.railing.title": { tr: "Korkuluk Sistemleri", en: "Railing Systems" },
  "prod.railing.desc": {
    tr: "Cam ve alüminyum kombinasyonuyla güvenli, şık korkuluklar.",
    en: "Safe, elegant railings combining glass and aluminium.",
  },
  "prod.balcony.title": { tr: "Cam Balkon & Sürme Sistemler", en: "Glass Balcony & Sliding Systems" },
  "prod.balcony.desc": {
    tr: "Katlanır ve sürme cam sistemleriyle kesintisiz manzara.",
    en: "Uninterrupted views with folding and sliding glass systems.",
  },
  "prod.curtainwall.title": { tr: "Giydirme Cephe", en: "Curtain Wall" },
  "prod.curtainwall.desc": {
    tr: "Yüksek yapılar için performanslı alüminyum cephe kaplamaları.",
    en: "High-performance aluminium facade cladding for tall buildings.",
  },
  "prod.joinery.title": { tr: "Alüminyum Doğrama", en: "Aluminium Joinery" },
  "prod.joinery.desc": {
    tr: "İnce profilli, yalıtımlı kapı ve pencere doğrama sistemleri.",
    en: "Slim-profile, insulated door and window joinery systems.",
  },

  "projects.tag": { tr: "PROJELER", en: "PROJECTS" },
  "projects.title": { tr: "Güncel Projeler", en: "Current Projects" },
  "projects.desc": {
    tr: "Türkiye genelinde konut, ticari ve kurumsal projelerdeki imzamız.",
    en: "Our signature across residential, commercial and corporate projects nationwide.",
  },
  "projects.all": { tr: "Tümünü Görüntüle", en: "View All" },
  "projects.filter.all": { tr: "Hepsi", en: "All" },
  "projects.filter.residential": { tr: "Konut", en: "Residential" },
  "projects.filter.commercial": { tr: "Ticari", en: "Commercial" },
  "projects.filter.corporate": { tr: "Kurumsal", en: "Corporate" },

  "refs.tag": { tr: "REFERANSLAR", en: "REFERENCES" },
  "refs.title": { tr: "Bize Güvenenler", en: "Trusted By" },
  "refs.desc": {
    tr: "Kurumsal iş ortaklarımız ve tamamladığımız markalar.",
    en: "Our corporate partners and the brands we have delivered for.",
  },

  "cta.title": { tr: "Projeniz için birlikte çalışalım", en: "Let's build your project together" },
  "cta.desc": {
    tr: "Ücretsiz keşif ve teklif için ekibimizle iletişime geçin.",
    en: "Contact our team for a free site survey and quote.",
  },
  "cta.button": { tr: "Teklif Al", en: "Get a Quote" },

  "catalog.tag": { tr: "DİJİTAL KATALOG", en: "DIGITAL CATALOG" },
  "catalog.title": { tr: "Ürün Kataloğu", en: "Product Catalog" },
  "catalog.desc": {
    tr: "Kartları sağa veya sola kaydırarak sistemlerimizi keşfedin.",
    en: "Swipe cards left or right to explore our systems.",
  },
  "catalog.hint": { tr: "Kaydırın veya okları kullanın", en: "Swipe or use the arrows" },
  "catalog.page": { tr: "Sayfa", en: "Page" },
  "catalog.explore": { tr: "İncele", en: "Explore" },

  "footer.desc": {
    tr: "KAYRAB Aluminyum, alüminyum ve cam sistemlerinde güvenilir çözüm ortağınız.",
    en: "KAYRAB Aluminyum, your trusted partner in aluminium and glass systems.",
  },
  "footer.products": { tr: "Ürünler", en: "Products" },
  "footer.company": { tr: "Kurumsal", en: "Company" },
  "footer.contact": { tr: "İletişim", en: "Contact" },
  "footer.rights": { tr: "Tüm hakları saklıdır.", en: "All rights reserved." },
  "footer.about": { tr: "Hakkımızda", en: "About Us" },
  "footer.catalog": { tr: "Katalog", en: "Catalog" },
  "footer.projects": { tr: "Projeler", en: "Projects" },
  "footer.certificates": { tr: "Sertifikalar", en: "Certificates" },

  "contact.tag": { tr: "İLETİŞİM", en: "CONTACT" },
  "contact.title": { tr: "Bize Ulaşın", en: "Get in Touch" },
  "contact.desc": {
    tr: "Sorularınız ve teklif talepleriniz için formu doldurun; en kısa sürede dönüş yapalım.",
    en: "Fill out the form for questions and quote requests; we will get back to you shortly.",
  },
  "contact.name": { tr: "Ad Soyad", en: "Full Name" },
  "contact.email": { tr: "E-posta", en: "Email" },
  "contact.phone": { tr: "Telefon", en: "Phone" },
  "contact.message": { tr: "Mesajınız", en: "Your Message" },
  "contact.send": { tr: "Gönder", en: "Send" },
  "contact.sent": { tr: "Mesajınız alındı, teşekkürler!", en: "Message received, thank you!" },
  "contact.address": { tr: "Adres", en: "Address" },
  "contact.hours": { tr: "Çalışma Saatleri", en: "Working Hours" },

  "page.products.title": { tr: "Ürün & Sistemler", en: "Products & Systems" },
  "page.projects.title": { tr: "Projelerimiz", en: "Our Projects" },

  "products.heading": {
    tr: "Her ölçekte alüminyum sistem çözümleri",
    en: "Aluminium system solutions at every scale",
  },
  "products.sub": {
    tr: "Konfor, güvenlik ve estetiği bir araya getiren; mühendislik odaklı ürün gamımızı keşfedin.",
    en: "Discover our engineering-driven product range that unites comfort, safety and aesthetics.",
  },
  "feature.1": { tr: "Isı ve ses yalıtımı", en: "Thermal & acoustic insulation" },
  "feature.2": { tr: "Yüksek dayanıklı elektrostatik boya", en: "High-durability powder coating" },
  "feature.3": { tr: "Projeye özel ölçü ve montaj", en: "Custom sizing & installation" },
  "cta.quote": { tr: "Teklif Al", en: "Get a Quote" },

  "projects.heading": { tr: "Hayata geçirdiğimiz projeler", en: "Projects we have delivered" },
  "projects.sub": {
    tr: "Konut, ticari ve kurumsal alanlarda tamamladığımız seçili işler.",
    en: "Selected work delivered across residential, commercial and corporate spaces.",
  },
} satisfies Dict

type Ctx = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: keyof typeof dict) => string
}

const LangContext = createContext<Ctx | null>(null)

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("tr")

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("kayrab-lang") as Lang | null) : null
    if (stored === "tr" || stored === "en") setLangState(stored)
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    if (typeof window !== "undefined") {
      localStorage.setItem("kayrab-lang", l)
      document.documentElement.lang = l
    }
  }, [])

  const t = useCallback((key: keyof typeof dict) => dict[key][lang], [lang])

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error("useLang must be used within LangProvider")
  return ctx
}
