import type { Metadata } from "next"
import { ContactClient } from "@/components/contact/contact-client"

export const metadata: Metadata = {
  title: "İletişim | KAYRAB Aluminyum",
  description:
    "KAYRAB Aluminyum ile iletişime geçin. Teklif talebi, proje danışmanlığı ve sorularınız için bize ulaşın.",
}

export default function IletisimPage() {
  return <ContactClient />
}
