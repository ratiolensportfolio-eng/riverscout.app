import type { Metadata, Viewport } from 'next'
import './globals.css'
import LargeTextToggle from '@/components/LargeTextToggle'
import GlobalNav from '@/components/GlobalNav'
import GlobalFooter from '@/components/GlobalFooter'
import LaunchBanner from '@/components/LaunchBanner'

export const metadata: Metadata = {
  title: 'RiverScout — Paddle Every River in America',
  description: 'Live USGS flow data, interactive maps, hatch calendars, and trip reports for 375 paddling rivers across 48 states.',
  metadataBase: new URL('https://riverscout.app'),
  icons: {
    icon: '/icon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'RiverScout — Paddle Every River in America',
    description: 'Live USGS flow data, interactive maps, hatch calendars, and trip reports for 375 rivers across 48 states.',
    url: 'https://riverscout.app',
    siteName: 'RiverScout',
    type: 'website',
  },
}

// Next.js 15 moved themeColor + viewport metadata out of the metadata
// export and into a separate viewport export. Doing both at once
// silences the deprecation warning that fires on every route, and
// removes the hand-rolled <meta name="viewport"> tag below — Next
// generates that automatically from this export now.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#085041',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* River Vision pre-render hydration: read the persisted
            font-size preference from localStorage and apply the
            class to <html> BEFORE React hydrates, so users with the
            preference set never see a flash of normal-sized text on
            page load. This must run inline in the head, before any
            paint, which is why it's not in the React component. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('riverscout_large_text')==='1')document.documentElement.classList.add('large-text-mode')}catch(e){}})();`,
          }}
        />
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
      <body>
        {/* #rs-zoom-target is the wrapper that gets `zoom: 1.25`
            when River Vision is active (see globals.css). It must
            wrap the page content but NOT the toggle button — the
            toggle stays at its normal size while the page scales
            up around it. The GlobalNav lives inside the wrapper
            so it scales with the rest of the page. */}
        <div id="rs-zoom-target">
          <LaunchBanner />
          <GlobalNav />
          {children}
          <GlobalFooter />
        </div>
        <LargeTextToggle />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').catch(function() {});
            });
          }
        `}} />
      </body>
    </html>
  )
}
