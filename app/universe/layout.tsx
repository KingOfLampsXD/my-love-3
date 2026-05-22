'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AnimatedBackground } from '@/components/universe/animated-background'
import { MouseTrail } from '@/components/universe/mouse-trail'
import { LoadingScreen } from '@/components/universe/loading-screen'
import { UniverseNav } from '@/components/universe/universe-nav'
import { useUniverseStore } from '@/lib/store'

export default function UniverseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const { setCurrentUser, setLoggedIn, setPartner } = useUniverseStore()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setCurrentUser(profile)
        setLoggedIn(true)
      }

      // Fetch partner (other profile)
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .limit(1)

      if (allProfiles && allProfiles.length > 0) {
        setPartner(allProfiles[0])
      }

      setLoading(false)
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push('/auth/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase, setCurrentUser, setLoggedIn, setPartner])

  if (loading || showLoadingScreen) {
    return (
      <LoadingScreen onComplete={() => setShowLoadingScreen(false)} />
    )
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <MouseTrail />
      <UniverseNav />
      <main className="relative z-10 pt-20">
        {children}
      </main>
    </div>
  )
}
