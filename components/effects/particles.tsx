'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life: number
  maxLife: number
}

const COLORS = [
  'rgba(255, 105, 180, 0.8)',  // Pink
  'rgba(138, 43, 226, 0.7)',   // Purple
  'rgba(255, 182, 193, 0.6)',  // Light pink
  'rgba(147, 112, 219, 0.7)',  // Medium purple
  'rgba(255, 20, 147, 0.6)',   // Deep pink
]

export function Particles({ type = 'ambient' }: { type?: 'ambient' | 'petals' | 'sparkles' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })

  const createParticle = useCallback((x: number, y: number, isAmbient = true): Particle => {
    const angle = Math.random() * Math.PI * 2
    const speed = isAmbient ? Math.random() * 0.5 + 0.2 : Math.random() * 3 + 2
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (isAmbient ? 0.5 : 2),
      size: Math.random() * 4 + 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 1,
      maxLife: isAmbient ? 300 + Math.random() * 200 : 60 + Math.random() * 40,
    }
  }, [])

  const animate = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height)

    // Add ambient particles
    if (particlesRef.current.length < 50 && Math.random() < 0.1) {
      particlesRef.current.push(
        createParticle(Math.random() * width, height + 10, true)
      )
    }

    particlesRef.current = particlesRef.current.filter((p) => {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.01 // Slight gravity
      p.life -= 1 / p.maxLife

      if (p.life <= 0) return false

      const alpha = p.life
      ctx.beginPath()
      
      if (type === 'sparkles') {
        // Draw sparkle
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.life * Math.PI * 2)
        for (let i = 0; i < 4; i++) {
          ctx.rotate(Math.PI / 2)
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(0, p.size * 2)
          ctx.strokeStyle = p.color.replace(/[\d.]+\)$/, `${alpha * 0.8})`)
          ctx.lineWidth = 1
          ctx.stroke()
        }
        ctx.restore()
      } else {
        // Draw circular particle
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        gradient.addColorStop(0, p.color.replace(/[\d.]+\)$/, `${alpha})`))
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      return p.y > -50 && p.y < height + 50 && p.x > -50 && p.x < width + 50
    })

    animationRef.current = requestAnimationFrame(() => animate(ctx, width, height))
  }, [createParticle, type])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      // Add particles near mouse
      if (Math.random() < 0.3) {
        particlesRef.current.push(createParticle(e.clientX, e.clientY, false))
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    animate(ctx, canvas.width, canvas.height)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationRef.current)
    }
  }, [animate, createParticle])

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[2]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  )
}
