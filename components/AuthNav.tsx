'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const mono = "'IBM Plex Mono', monospace"

export default function AuthNav() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return null

  if (!user) {
    return (
      <Link href="/login" style={{
        fontFamily: mono, fontSize: '10px',
        padding: '5px 10px', borderRadius: '20px',
        border: '.5px solid var(--bd2)', color: 'var(--tx2)',
        textDecoration: 'none',
      }}>
        Sign In
      </Link>
    )
  }

  const avatar = user.user_metadata?.avatar_url
  const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <Link href="/outfitters/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
        {avatar ? (
          <img src={avatar} alt={name} style={{ width: 22, height: 22, borderRadius: '50%', border: '.5px solid var(--bd2)' }} />
        ) : (
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: 'var(--rvlt)', border: '.5px solid var(--rvmd)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: mono, fontSize: '9px', fontWeight: 600, color: 'var(--rvdk)',
          }}>
            {name[0].toUpperCase()}
          </div>
        )}
        <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)' }}>
          {name}
        </span>
      </Link>
      <form action="/auth/signout" method="POST">
        <button type="submit" style={{
          fontFamily: mono, fontSize: '9px', color: 'var(--tx3)',
          background: 'none', border: 'none', cursor: 'pointer',
          textDecoration: 'underline',
        }}>
          out
        </button>
      </form>
    </div>
  )
}
