import { MetadataRoute } from 'next'
import { ALL_RIVERS, STATES, getStateSlug, getRiverSlug } from '@/data/rivers'
import { SHOW_PRO_TIER } from '@/lib/features'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://riverscout.app'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/rivers`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/releases`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/alerts`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/hatches`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    ...(SHOW_PRO_TIER ? [{ url: `${baseUrl}/pro`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 }] : []),
    { url: `${baseUrl}/outfitters`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/about/improvements`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
  ]

  // State pages
  const statePages: MetadataRoute.Sitemap = Object.keys(STATES).map(key => ({
    url: `${baseUrl}/state/${key}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // River detail pages
  const riverPages: MetadataRoute.Sitemap = ALL_RIVERS.map(river => ({
    url: `${baseUrl}/rivers/${getStateSlug(river.stateKey as string)}/${getRiverSlug(river)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [...staticPages, ...statePages, ...riverPages]
}
