import type { Metadata } from "next"
import { ProductsClient } from "@/components/products/products-client"

export const metadata: Metadata = {
  title: "Ürünler | KAYRAB Aluminyum",
  description:
    "Kış bahçesi, bioklimatik pergola, korkuluk, cam balkon, giydirme cephe ve alüminyum doğrama sistemleri.",
}

export default function UrunlerPage() {
  return <ProductsClient />
}
