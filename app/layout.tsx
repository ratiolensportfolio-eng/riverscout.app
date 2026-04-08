import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RiverScout — Paddle Every River in America',
  description: 'Live USGS flow data, interactive maps, hatch calendars, and trip reports for 375 paddling rivers across 48 states.',
  metadataBase: new URL('https://riverscout.app'),
  icons: {
    icon: '/icon.svg',
  },
  manifest: '/manifest.json',
  themeColor: '#085041',
  openGraph: {
    title: 'RiverScout — Paddle Every River in America',
    description: 'Live USGS flow data, interactive maps, hatch calendars, and trip reports for 375 rivers across 48 states.',
    url: 'https://riverscout.app',
    siteName: 'RiverScout',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {/* Privacy-friendly analytics by Plausible */}
        <script async src="https://plausible.io/js/pa-DIiweVYaC109_gt38Iecz.js" />
        <script dangerouslySetInnerHTML={{ __html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()` }} />
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
