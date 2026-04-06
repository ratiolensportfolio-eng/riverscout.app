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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
