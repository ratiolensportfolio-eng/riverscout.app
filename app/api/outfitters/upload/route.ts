import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

// POST /api/outfitters/upload — upload logo or cover photo for an outfitter
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const outfitterId = formData.get('outfitterId') as string | null
    const imageType = formData.get('type') as string | null // 'logo' or 'cover'

    if (!file || !outfitterId || !imageType) {
      return NextResponse.json({ error: 'file, outfitterId, and type (logo|cover) required' }, { status: 400 })
    }

    if (!['logo', 'cover'].includes(imageType)) {
      return NextResponse.json({ error: 'type must be logo or cover' }, { status: 400 })
    }

    // Validate file type
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP, and SVG images allowed' }, { status: 400 })
    }

    // Validate file size (5MB for logo, 10MB for cover)
    const maxSize = imageType === 'logo' ? 5 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File too large (max ${imageType === 'logo' ? '5MB' : '10MB'})` }, { status: 400 })
    }

    const supabase = createSupabaseClient()

    // Generate filename
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${outfitterId}/${imageType}-${Date.now()}.${ext}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('outfitter-assets')
      .upload(filename, file, {
        contentType: file.type,
        upsert: true,
      })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('outfitter-assets')
      .getPublicUrl(data.path)

    const publicUrl = urlData.publicUrl

    // Update the outfitter record with the new URL
    const updateField = imageType === 'logo' ? 'logo_url' : 'cover_photo_url'
    const { error: updateErr } = await supabase
      .from('outfitters')
      .update({ [updateField]: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', outfitterId)

    if (updateErr) {
      console.error('DB update error:', updateErr)
      return NextResponse.json({ error: 'File uploaded but failed to update listing' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, url: publicUrl, type: imageType })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
