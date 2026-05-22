'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const worlds = [
  { 
    id: 'memory-forest',
    name: 'Memory Forest',
    icon: '🌲',
    description: 'Where our memories grow like trees',
    color: 'from-green-500 to-emerald-600',
    path: '/universe/memories',
    unlocked: true,
  },
  {
    id: 'heart-lake',
    name: 'Heart Lake',
    icon: '💕',
    description: 'A lake of endless love',
    color: 'from-pink-500 to-red-500',
    path: '/universe/heart-lake',
    unlocked: true,
  },
  {
    id: 'arcade-planet',
    name: 'Arcade Planet',
    icon: '🎮',
    description: 'Play together, stay together',
    color: 'from-purple-500 to-blue-600',
    path: '/universe/arcade',
    unlocked: true,
  },
  {
    id: 'music-island',
    name: 'Music Island',
    icon: '🎵',
    description: 'Our soundtrack of love',
    color: 'from-cyan-500 to-blue-500',
    path: '/universe/music',
    unlocked: true,
  },
  {
    id: 'dream-city',
    name: 'Dream City',
    icon: '🌙',
    description: 'Where dreams come true',
    color: 'from-indigo-500 to-purple-600',
    path: '/universe/dreams',
    unlocked: true,
  },
  {
    id: 'secret-cave',
    name: 'Secret Cave',
    icon: '✨',
    description: 'Hidden treasures await',
    color: 'from-amber-500 to-orange-500',
    path: '/universe/secrets',
    unlocked: true,
  },
  {
    id: 'future-world',
    name: 'Future World',
    icon: '🚀',
    description: 'Our dreams for tomorrow',
    color: 'from-violet-500 to-fuchsia-500',
    path: '/universe/future',
    unlocked: true,
  },
  {
    id: 'cozy-room',
    name: 'Cozy Night Room',
    icon: '🌌',
    description: 'Our safe space',
    color: 'from-slate-600 to-gray-700',
    path: '/universe/cozy',
    unlocked: true,
  },
  {
    id: 'mystery-house',
    name: 'Mystery House',
    icon: '🎁',
    description: 'Surprises around every corner',
    color: 'from-rose-500 to-pink-600',
    path: '/universe/mystery',
    unlocked: true,
  },
  {
    id: 'love-library',
    name: 'Love Library',
    icon: '💌',
    description: 'Our collection of letters',
    color: 'from-red-500 to-rose-600',
    path: '/universe/letters',
    unlocked: true,
  },
  {
    id: 'sky-kingdom',
    name: 'Sky Kingdom',
    icon: '☁️',
    description: 'Above the clouds together',
    color: 'from-sky-400 to-blue-500',
    path: '/universe/sky',
    unlocked: true,
  },
  {
    id: 'flirty-vibes',
    name: 'Flirty Vibes',
    icon: '😏',
    description: 'Playful and romantic',
    color: 'from-pink-500 to-purple-500',
    path: '/universe/flirty',
    unlocked: true,
  },
]

export default function MapPage() {
  const [selectedWorld, setSelectedWorld] = useState<typeof worlds[0] | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen pb-24 md:pb-8 px-4">
      {/* Header */}
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Couple City Map
        </h1>
        <p className="text-muted-foreground">
          Explore every corner of our universe together
        </p>
      </motion.div>

      {/* Map Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {worlds.map((world, index) => (
            <Link key={world.id} href={world.path}>
              <motion.div
                className="relative aspect-square rounded-3xl overflow-hidden cursor-pointer group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${world.color} opacity-80`} />
                
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 25% 25%, white 2%, transparent 2%), radial-gradient(circle at 75% 75%, white 2%, transparent 2%)',
                    backgroundSize: '30px 30px',
                  }} />
                </div>

                {/* Glow on hover */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    boxShadow: hoveredIndex === index
                      ? 'inset 0 0 60px rgba(255,255,255,0.3)'
                      : 'inset 0 0 0px rgba(255,255,255,0)',
                  }}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <motion.span
                    className="text-5xl md:text-6xl mb-2"
                    animate={hoveredIndex === index ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    } : {}}
                    transition={{ duration: 0.5, repeat: hoveredIndex === index ? Infinity : 0 }}
                  >
                    {world.icon}
                  </motion.span>
                  <h3 className="font-bold text-white text-lg md:text-xl drop-shadow-lg">
                    {world.name}
                  </h3>
                  <motion.p
                    className="text-white/80 text-xs md:text-sm mt-1 drop-shadow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: hoveredIndex === index ? 1 : 0, y: hoveredIndex === index ? 0 : 10 }}
                  >
                    {world.description}
                  </motion.p>
                </div>

                {/* Sparkle effects on hover */}
                {hoveredIndex === index && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full"
                        initial={{
                          x: '50%',
                          y: '50%',
                          opacity: 0,
                        }}
                        animate={{
                          x: `${20 + Math.random() * 60}%`,
                          y: `${20 + Math.random() * 60}%`,
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0],
                        }}
                        transition={{
                          duration: 1,
                          delay: i * 0.1,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </>
                )}

                {/* Border glow */}
                <div className="absolute inset-0 rounded-3xl border-2 border-white/20 group-hover:border-white/50 transition-colors" />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom stats */}
      <motion.div
        className="max-w-2xl mx-auto mt-12 glass rounded-2xl p-6 border border-pink-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-around text-center">
          <div>
            <p className="text-3xl font-bold text-pink-400">{worlds.length}</p>
            <p className="text-sm text-muted-foreground">Total Worlds</p>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div>
            <p className="text-3xl font-bold text-purple-400">{worlds.filter(w => w.unlocked).length}</p>
            <p className="text-sm text-muted-foreground">Unlocked</p>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div>
            <p className="text-3xl font-bold text-cyan-400">∞</p>
            <p className="text-sm text-muted-foreground">Adventures</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
