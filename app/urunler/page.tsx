import type { Metadata } from "next"
import { ProductsClient } from "@/components/products/products-client"
import { getDbProducts } from "@/lib/data.server"

export const metadata: Metadata = {
  title: "Ürünler | KAYRAB Aluminyum",
  description:
    "Kış bahçesi, bioklimatik pergola, korkuluk, cam balkon, giydirme cephe ve alüminyum doğrama sistemleri.",
}

export default async function UrunlerPage() {
  const products = await getDbProducts()
  return <ProductsClient products={products} />
}