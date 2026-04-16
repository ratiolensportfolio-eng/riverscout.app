import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

// POST /api/catches/upload — upload a fish catch photo to Supabase Storage.
// Mirrors /api/trips/upload but writes to the fish-photos bucket
// created in mig 041. Client strips EXIF from the File on the way out
// only AFTER reading coords/timestamp; server just stores the bytes.

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const riverId = formData.get('riverId') as string | null
    const userId = formData.get('userId') as string | null

    if (!file || !riverId || !userId) {
      return NextResponse.json({ error: 'file, riverId, userId required' }, { status: 400 })
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP, and HEIC images allowed' }, { status: 400 })
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    const supabase = createSupabaseClient()

    // user/river scoped path so we can tell at-a-glance who uploaded
    // what, and so admin cleanup can target a single user's photos.
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${userId}/${riverId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { data, error } = await supabase.storage
      .from('fish-photos')
      .upload(filename, file, { contentType: file.type, upsert: false })

    if (error) {
      console.error('[CATCHES] Upload error:', error)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from('fish-photos')
      .getPublicUrl(data.path)

    return NextResponse.json({ ok: true, url: urlData.publicUrl })
  } catch (err) {
    console.error('[CATCHES] Upload error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
