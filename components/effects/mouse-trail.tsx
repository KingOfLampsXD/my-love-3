'use client'

import { useEffect, useRef } from 'react'

interface TrailPoint {
  x: number
  y: number
  age: number
}

export function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointsRef = useRef<TrailPoint[]>([])
  const animationRef = useRef<number>(0)

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
      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      pointsRef.current = pointsRef.current.filter((point) => {
        point.age += 1
        return point.age < 30
      })

      if (pointsRef.current.length > 1) {
        ctx.beginPath()
        ctx.moveTo(pointsRef.current[0].x, pointsRef.current[0].y)

        for (let i = 1; i < pointsRef.current.length; i++) {
          const point = pointsRef.current[i]
          const prevPoint = pointsRef.current[i - 1]
          
          const midX = (prevPoint.x + point.x) / 2
          const midY = (prevPoint.y + point.y) / 2
          
          ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, midX, midY)
        }

        const gradient = ctx.createLinearGradient(
          pointsRef.current[0].x,
          pointsRef.current[0].y,
          pointsRef.current[pointsRef.current.length - 1].x,
          pointsRef.current[pointsRef.current.length - 1].y
        )
        gradient.addColorStop(0, 'rgba(255, 105, 180, 0)')
        gradient.addColorStop(0.5, 'rgba(255, 105, 180, 0.5)')
        gradient.addColorStop(1, 'rgba(138, 43, 226, 0.3)')

        ctx.strokeStyle = gradient
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()

        // Draw glowing dots
        pointsRef.current.forEach((point, i) => {
          const alpha = 1 - point.age / 30
          const size = (1 - point.age / 30) * 4

          ctx.beginPath()
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 182, 193, ${alpha})`
          ctx.fill()
        })
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[3]"
    />
  )
}
