'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  twinkleSpeed: number
  twinkleOffset: number
}

export function Starfield({ count = 150 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const animationRef = useRef<number>(0)

  const initStars = useCallback((width: number, height: number) => {
    starsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.3 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      twinkleOffset: Math.random() * Math.PI * 2,
    }))
  }, [count])

  const animate = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    ctx.clearRect(0, 0, width, height)

    starsRef.current.forEach((star) => {
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset)
      const currentOpacity = star.opacity * (0.5 + twinkle * 0.5)
      const currentSize = star.size * (0.8 + twinkle * 0.2)

      // Create gradient for star glow
      const gradient = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, currentSize * 3
      )
      gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`)
      gradient.addColorStop(0.4, `rgba(255, 182, 193, ${currentOpacity * 0.5})`)
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

      ctx.beginPath()
      ctx.arc(star.x, star.y, currentSize * 3, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Core of the star
      ctx.beginPath()
      ctx.arc(star.x, star.y, currentSize * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`
      ctx.fill()

      // Slow drift
      star.y += star.speed * 0.1
      if (star.y > height + 10) {
        star.y = -10
        star.x = Math.random() * width
      }
    })

    animationRef.current = requestAnimationFrame((t) => animate(ctx, width, height, t))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars(canvas.width, canvas.height)
    }

    resize()
    window.addEventListener('resize', resize)
    animate(ctx, canvas.width, canvas.height, 0)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [initStars, animate])

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  )
}
