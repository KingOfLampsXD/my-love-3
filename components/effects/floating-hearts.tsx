'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Heart {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  rotation: number
}

export function FloatingHearts({ count = 20 }: { count?: number }) {
  const [hearts, setHearts] = useState<Heart[]>([])

  useEffect(() => {
    const generateHearts = () => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 5,
        rotation: Math.random() * 360,
      }))
    }
    setHearts(generateHearts())
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute"
            style={{
              left: `${heart.x}%`,
              fontSize: heart.size,
            }}
            initial={{ 
              y: '100vh', 
              opacity: 0,
              rotate: heart.rotation,
              scale: 0.5
            }}
            animate={{ 
              y: '-100vh', 
              opacity: [0, 0.6, 0.6, 0],
              rotate: heart.rotation + 360,
              scale: [0.5, 1, 1, 0.5]
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <span className="text-pink-400/40 drop-shadow-[0_0_10px_rgba(255,105,180,0.5)]">
              ❤
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function ClickHeart({ x, y, onComplete }: { x: number; y: number; onComplete: () => void }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{ left: x - 15, top: y - 15 }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{ 
        scale: [0, 1.5, 2],
        opacity: [1, 1, 0],
        y: -100
      }}
      transition={{ duration: 1, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
    >
      <span className="text-3xl text-pink-500 drop-shadow-[0_0_20px_rgba(255,105,180,0.8)]">
        ❤
      </span>
    </motion.div>
  )
}
