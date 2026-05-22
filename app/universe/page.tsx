'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUniverseStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { HeartMeter } from '@/components/universe/heart-meter'
import { DaysTogether } from '@/components/universe/days-together'
import { MoodSelector } from '@/components/universe/mood-selector'
import { QuickActions } from '@/components/universe/quick-actions'
import { WorldMap } from '@/components/universe/world-map'

const subtitles = [
  "Our tiny universe",
  "Our beautiful chaos",
  "Our endless memories",
  "You + Me = Infinity",
  "Forever loading love...",
  "Two hearts, one soul",
  "Our secret world",
]

export default function UniverseHomePage() {
  const [currentSubtitle, setCurrentSubtitle] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const { currentUser, partner, addDiscovery, incrementHeartsSent } = useUniverseStore()
  const supabase = createClient()

  // Rotate subtitles
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSubtitle((prev) => (prev + 1) % subtitles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Easter egg on title click
  const handleTitleClick = () => {
    setClickCount((prev) => prev + 1)
    if (clickCount >= 4) {
      setShowEasterEgg(true)
      addDiscovery('secret-title-click')
      setClickCount(0)
      setTimeout(() => setShowEasterEgg(false), 3000)
    }
  }

  const handleSendHeart = async () => {
    incrementHeartsSent()
    // Update database
    await supabase
      .from('couple_stats')
      .update({ stat_value: supabase.rpc('increment_stat', { stat: 'hearts_sent' }) })
      .eq('stat_type', 'hearts_sent')
  }

  const relationshipLevel = useMemo(() => {
    const { heartsSent, adventurePoints, discoveries } = useUniverseStore.getState()
    const totalPoints = heartsSent + adventurePoints + discoveries.length * 10
    if (totalPoints > 1000) return { level: 10, title: 'Soulmates', emoji: '👑' }
    if (totalPoints > 500) return { level: 8, title: 'Inseparable', emoji: '💫' }
    if (totalPoints > 200) return { level: 6, title: 'Deeply Connected', emoji: '💕' }
    if (totalPoints > 100) return { level: 4, title: 'Growing Together', emoji: '🌱' }
    return { level: 2, title: 'Just Beginning', emoji: '✨' }
  }, [])

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-4">
        {/* Main title */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold cursor-pointer select-none"
            onClick={handleTitleClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
              Lampy
            </span>
            <motion.span
              className="inline-block mx-4 text-red-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ❤️
            </motion.span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
              Rose
            </span>
          </motion.h1>

          {/* Animated subtitle */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentSubtitle}
              className="mt-6 text-xl md:text-2xl text-pink-300/80 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {subtitles[currentSubtitle]}
            </motion.p>
          </AnimatePresence>

          {/* Relationship level */}
          <motion.div
            className="mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-full glass border border-pink-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl">{relationshipLevel.emoji}</span>
            <div>
              <p className="text-sm text-muted-foreground">Relationship Level</p>
              <p className="text-pink-400 font-semibold">{relationshipLevel.title}</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-3xl font-bold text-pink-400">
              Lv.{relationshipLevel.level}
            </div>
          </motion.div>
        </motion.div>

        {/* Easter egg */}
        <AnimatePresence>
          {showEasterEgg && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl"
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 1,
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 500,
                    y: (Math.random() - 0.5) * 500,
                    opacity: 0,
                    rotate: Math.random() * 360,
                  }}
                  transition={{ duration: 2 }}
                >
                  ❤️
                </motion.div>
              ))}
              <motion.p
                className="text-2xl font-bold text-pink-400 bg-black/50 px-6 py-3 rounded-full"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                Secret Found!
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Stats Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <HeartMeter />
          <DaysTogether />
          <MoodSelector />
          <QuickActions onSendHeart={handleSendHeart} />
        </div>
      </section>

      {/* Profile Cards */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current user card */}
          <motion.div
            className="glass rounded-3xl p-6 border border-pink-500/20"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-3xl"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {currentUser?.display_name === 'Lampy' ? '🌟' : '🌹'}
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {currentUser?.display_name || 'You'}
                </h3>
                <p className="text-pink-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Online
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-muted-foreground">
                Mood: <span className="text-foreground">{currentUser?.mood || 'Happy'} 😊</span>
              </p>
            </div>
          </motion.div>

          {/* Partner card */}
          <motion.div
            className="glass rounded-3xl p-6 border border-purple-500/20"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-3xl"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {partner?.display_name === 'Lampy' ? '🌟' : '🌹'}
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {partner?.display_name || 'Partner'}
                </h3>
                <p className="text-purple-400 flex items-center gap-2">
                  <motion.span
                    className="w-2 h-2 rounded-full bg-pink-400"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {partner?.status === 'online' ? 'Online' : 'Away'}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-muted-foreground">
                Mood: <span className="text-foreground">{partner?.mood || 'Happy'} 😊</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* World Map Preview */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <motion.h2
          className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Explore Our Universe
        </motion.h2>
        <WorldMap />
      </section>
    </div>
  )
}
