import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { SiteShell } from '@/components/site-shell'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KAYRAB Aluminyum | Alüminyum & Cam Sistemleri',
  description:
    'KAYRAB Aluminyum; kış bahçesi, bioklimatik pergola, korkuluk, cam balkon, giydirme cephe ve alüminyum doğrama sistemlerinde güvenilir çözüm ortağınız.',
  generator: 'v0.app',
  keywords: [
    'KAYRAB',
    'alüminyum',
    'cam balkon',
    'kış bahçesi',
    'bioklimatik pergola',
    'giydirme cephe',
    'korkuluk',
    'alüminyum doğrama',
  ],
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#2b2823',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${spaceGrotesk.variable} bg-background`}>
      <body className="font-sans antialiased">
        <SiteShell>{children}</SiteShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
