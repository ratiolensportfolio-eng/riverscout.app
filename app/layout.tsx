import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RiverScout — Paddle Every River in America',
  description: 'Live USGS flow data, river history, trip reports, and outfitter listings for 40+ paddling rivers across 14 states.',
  metadataBase: new URL('https://riverscout.app'),
  openGraph: {
    title: 'RiverScout — Paddle Every River in America',
    description: 'Live USGS flow data, river history, trip reports, and outfitter listings.',
    url: 'https://riverscout.app',
    siteName: 'RiverScout',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
