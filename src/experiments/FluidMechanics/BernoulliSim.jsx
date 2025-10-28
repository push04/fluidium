import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../../context/AppContext'
import { calculateBernoulliHeads, calculateBernoulliEnergy } from '../../utils/simulationMath'

function BernoulliSim({ canvasRef }) {
  const { parameters, setResults, addObservation } = useAppContext()
  const animationRef = useRef(null)
  const [isAnimating, setIsAnimating] = useState(true)
  const canvasCtxRef = useRef(null)
  const particlesRef = useRef([])

  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 400
  const PIPE_Y = 150
  const PIPE_HEIGHT = 60

  // Initialize canvas and start animation
  useEffect(() => {
    if (!canvasRef?.current) return

    const canvas = canvasRef.current
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    const ctx = canvas.getContext('2d')
    canvasCtxRef.current = ctx

    // Initialize particles
    particlesRef.current = Array.from({ length: 30 }, (_, i) => ({
      x: (i * CANVAS_WIDTH) / 30,
      y: PIPE_Y + PIPE_HEIGHT / 2,
      speed: (parameters.flowVelocity || 2) * 10,
      size: 3,
      opacity: Math.random() * 0.7 + 0.3,
    }))

    setIsAnimating(true)
    return () => {
      setIsAnimating(false)
    }
  }, [canvasRef])

  // Animation loop
  useEffect(() => {
    const animateFrame = () => {
      if (!isAnimating || !canvasCtxRef.current) return

      const ctx = canvasCtxRef.current
      const canvas = canvasRef.current

      // Clear canvas
      ctx.fillStyle = '#f0f9ff'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw grid background
      ctx.strokeStyle = '#e0e7ff'
      ctx.lineWidth = 0.5
      for (let i = 0; i < CANVAS_WIDTH; i += 50) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, CANVAS_HEIGHT)
        ctx.stroke()
      }

      const velocity = parameters.flowVelocity || 2
      const pipeHeight = parameters.pipeHeight || 2
      const density = parameters.fluidDensity || 1000

      // Calculate heads
      const heads = calculateBernoulliHeads(velocity, pipeHeight, density)
      const energy = calculateBernoulliEnergy(0, velocity, pipeHeight, density)

      // Draw three pipe sections with different diameters (showing continuity)
      const sections = [
        { x: 50, width: 120, pipeH: 60, label: 'Section 1' },
        { x: 220, width: 80, pipeH: 40, label: 'Section 2' },
        { x: 360, width: 120, pipeH: 60, label: 'Section 3' },
      ]

      sections.forEach((section, idx) => {
        // Draw pipe
        ctx.fillStyle = '#dbeafe'
        ctx.strokeStyle = '#0284c7'
        ctx.lineWidth = 2
        ctx.fillRect(section.x, PIPE_Y - section.pipeH / 2, section.width, section.pipeH)
        ctx.strokeRect(section.x, PIPE_Y - section.pipeH / 2, section.width, section.pipeH)

        // Draw section label
        ctx.fillStyle = '#0284c7'
        ctx.font = 'bold 12px Arial'
        ctx.fillText(section.label, section.x + 10, PIPE_Y - section.pipeH / 2 - 10)

        // Draw pressure indicator (U-tube manometer)
        const pressureHeight = Math.min((heads.pressureHead || 0) * 20, 80)
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(section.x + section.width / 2 - 10, PIPE_Y + section.pipeH / 2)
        ctx.lineTo(section.x + section.width / 2 - 10, PIPE_Y + section.pipeH / 2 + 40)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(section.x + section.width / 2 + 10, PIPE_Y + section.pipeH / 2)
        ctx.lineTo(section.x + section.width / 2 + 10, PIPE_Y + section.pipeH / 2 + 40)
        ctx.stroke()

        // Draw fluid level in manometer
        ctx.fillStyle = '#ef4444'
        ctx.fillRect(section.x + section.width / 2 - 12, PIPE_Y + section.pipeH / 2 + 40 - pressureHeight, 8, pressureHeight)
      })

      // Draw velocity indicators (arrows)
      const velocityScale = velocity * 2
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2
      ctx.fillStyle = '#10b981'

      for (let i = 0; i < 3; i++) {
        const arrowX = 100 + i * 150
        ctx.beginPath()
        ctx.moveTo(arrowX, PIPE_Y)
        ctx.lineTo(arrowX + velocityScale, PIPE_Y)
        ctx.stroke()

        // Arrow head
        ctx.beginPath()
        ctx.moveTo(arrowX + velocityScale, PIPE_Y)
        ctx.lineTo(arrowX + velocityScale - 8, PIPE_Y - 5)
        ctx.lineTo(arrowX + velocityScale - 8, PIPE_Y + 5)
        ctx.closePath()
        ctx.fill()
      }

      // Draw particles (flow visualization)
      ctx.fillStyle = '#6366f1'
      particlesRef.current.forEach((particle) => {
        particle.x += particle.speed * 0.016
        if (particle.x > CANVAS_WIDTH + 10) {
          particle.x = -10
        }

        ctx.globalAlpha = particle.opacity
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      })

      // Draw legend and values
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 14px Arial'
      ctx.fillText('Bernoulli\'s Theorem Visualization', 20, 30)

      ctx.font = '12px Arial'
      ctx.fillStyle = '#f59e0b'
      ctx.fillText(`Pressure Head: ${heads.pressureHead.toFixed(3)} m`, 20, 340)
      ctx.fillText(`Velocity Head: ${heads.velocityHead.toFixed(3)} m`, 20, 360)
      ctx.fillText(`Total Head: ${heads.totalHead.toFixed(3)} m`, 20, 380)

      ctx.fillStyle = '#10b981'
      ctx.fillText(`Flow Velocity: ${velocity.toFixed(2)} m/s`, 300, 340)
      ctx.fillText(`Pipe Height: ${pipeHeight.toFixed(2)} m`, 300, 360)
      ctx.fillText(`Fluid Density: ${density} kg/m³`, 300, 380)

      // Update results
      setResults(heads)
      addObservation({
        velocity,
        pressureHead: heads.pressureHead,
        velocityHead: heads.velocityHead,
        totalHead: heads.totalHead,
      })

      animationRef.current = requestAnimationFrame(animateFrame)
    }

    if (isAnimating) {
      animationRef.current = requestAnimationFrame(animateFrame)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [parameters, isAnimating, setResults, addObservation, canvasRef])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {/* Instructions */}
      <div className="bg-indigo-50 p-4 rounded-lg mb-4 text-sm text-gray-700">
        <p className="font-semibold mb-2">
          <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
          Adjust flow velocity and pipe height using the controls to observe how Bernoulli's principle works.
        </p>
      </div>
    </motion.div>
  )
}

export default BernoulliSim
