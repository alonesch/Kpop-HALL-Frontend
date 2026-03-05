import type { Metadata, Viewport } from 'next'
import { Poppins, Inter, Permanent_Marker } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

const permanentMarker = Permanent_Marker({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-brush',
})

export const metadata: Metadata = {
  title: 'Kpop! HALL',
  description: 'Sua vitrine de photocards K-pop. Colecione, organize e compartilhe!',
  generator: 'v0.app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Kpop! HALL',
  },
  icons: {
    icon: '/icons/icon-192x192.jpg',
    apple: '/icons/icon-512x512.jpg',
  },
}

export const viewport: Viewport = {
  themeColor: '#7B3FA0',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} ${inter.variable} ${permanentMarker.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
