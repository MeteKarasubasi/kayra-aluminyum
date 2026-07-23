import type { dict } from "./i18n"

type Key = keyof typeof dict

export type Product = {
  slug: string
  titleKey: Key
  descKey: Key
  image: string
  code: string
}

export const products: Product[] = [
  {
    slug: "kis-bahcesi",
    titleKey: "prod.wintergarden.title",
    descKey: "prod.wintergarden.desc",
    image: "/product-winter-garden.png",
    code: "01 / WG",
  },
  {
    slug: "bioklimatik-pergola",
    titleKey: "prod.pergola.title",
    descKey: "prod.pergola.desc",
    image: "/product-pergola.png",
    code: "02 / PG",
  },
  {
    slug: "korkuluk",
    titleKey: "prod.railing.title",
    descKey: "prod.railing.desc",
    image: "/product-railing.png",
    code: "03 / RL",
  },
  {
    slug: "cam-balkon",
    titleKey: "prod.balcony.title",
    descKey: "prod.balcony.desc",
    image: "/product-glass-balcony.png",
    code: "04 / GB",
  },
  {
    slug: "giydirme-cephe",
    titleKey: "prod.curtainwall.title",
    descKey: "prod.curtainwall.desc",
    image: "/product-curtain-wall.png",
    code: "05 / CW",
  },
  {
    slug: "aluminyum-dograma",
    titleKey: "prod.joinery.title",
    descKey: "prod.joinery.desc",
    image: "/product-joinery.png",
    code: "06 / AJ",
  },
]

export type ProjectCategory = "residential" | "commercial" | "corporate"

export type Project = {
  id: string
  title: string
  location: string
  category: ProjectCategory
  image: string
}

export const projects: Project[] = [
  { id: "p1", title: "Skyline Tower", location: "İstanbul", category: "residential", image: "/project-tower.png" },
  { id: "p2", title: "Villa Doğa", location: "Bodrum", category: "residential", image: "/project-villa.png" },
  { id: "p3", title: "Meva Cafe", location: "Ankara", category: "commercial", image: "/project-cafe.png" },
  { id: "p4", title: "Nexus Plaza", location: "İzmir", category: "corporate", image: "/project-office.png" },
  { id: "p5", title: "Park Rezidans", location: "Ankara", category: "residential", image: "/project-residence.png" },
  { id: "p6", title: "Aurora Office", location: "İstanbul", category: "corporate", image: "/project-office.png" },
  { id: "p7", title: "Lotus Villa", location: "Antalya", category: "residential", image: "/project-villa.png" },
  { id: "p8", title: "Grand Tower", location: "İstanbul", category: "corporate", image: "/project-tower.png" },
  { id: "p9", title: "Bahçe Cafe", location: "Eskişehir", category: "commercial", image: "/project-cafe.png" },
]

export const references = [
  "ARABICA",
  "ARMADA",
  "CONGRESIUM",
  "GİMART",
  "MAGNOLIA",
  "MARUS",
  "TEPE MOZAİK",
  "BEYKOZ",
  "KOZA",
  "SYNLAB",
  "TÜRK TRAKTÖR",
  "WALKINN",
  "KARAKAYA",
  "DÜVEROĞLU",
]
