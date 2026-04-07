import { redirect, notFound } from 'next/navigation'
import { getRiver, getRiverPath, ALL_RIVERS } from '@/data/rivers'

// Legacy route — redirects /rivers/ausable to /rivers/michigan/au-sable-river
// 301 permanent redirect for SEO

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return ALL_RIVERS.map(r => ({ id: r.id }))
}

export default async function LegacyRiverRedirect({ params }: Props) {
  const { id } = await params
  const river = getRiver(id)
  if (!river) notFound()

  const newPath = getRiverPath(river)
  redirect(newPath)
}
