import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../../context/AppContext'
import { calculatePoiseuillePressureGradient, calculateVelocityProfile } from '../../utils/simulationMath'

function PoiseuilleSim({ canvasRef }) {
  const { parameters, setResults, addObservation } = useAppContext()
  const animationRef = useRef(null)
  const [isAnimating, setIsAnimating] = useState(true)
  const canvasCtxRef = useRef(null)
  const timeRef = useRef(0)

  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 400

  useEffect(() => {
    if (!canvasRef?.current) return

    const canvas = canvasRef.current
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    const ctx = canvas.getContext('2d')
    canvasCtxRef.current = ctx

    setIsAnimating(true)
    timeRef.current = 0

    return () => {
      setIsAnimating(false)
    }
  }, [canvasRef])

  useEffect(() => {
    const animateFrame = () => {
      if (!isAnimating || !canvasCtxRef.current) return

      const ctx = canvasCtxRef.current
      timeRef.current += 0.016

      // Clear canvas
      ctx.fillStyle = '#f0f9ff'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      const flowRate = parameters.flowRate || 10
      const diameter = (parameters.pipeDiameter || 20) / 1000
      const viscosity = parameters.viscosity || 1
      const radius = diameter / 2

      // Calculate pressure gradient and velocity profile
      const pressureGradient = calculatePoiseuillePressureGradient(flowRate, parameters.pipeDiameter || 20, viscosity)
      const velocityProfile = calculateVelocityProfile(parameters.pipeDiameter || 20, pressureGradient, viscosity, 15)

      // Draw pipe sections
      const pipeStartX = 100
      const pipeY = 150
      const pipeSections = 4
      const sectionWidth = 150

      ctx.fillStyle = '#dbeafe'
      ctx.strokeStyle = '#0284c7'
      ctx.lineWidth = 2

      for (let i = 0; i < pipeSections; i++) {
        const x = pipeStartX + i * sectionWidth
        ctx.fillRect(x, pipeY - 50, sectionWidth, 100)
        ctx.strokeRect(x, pipeY - 50, sectionWidth, 100)

        // Draw velocity profile at each section
        ctx.strokeStyle = '#6366f1'
        ctx.lineWidth = 1
        ctx.beginPath()
        velocityProfile.forEach((point, idx) => {
          const vx = x + sectionWidth / 2 + (point.velocity * 30)
          const vy = pipeY + (point.radius * 100) - 50
          if (idx === 0) {
            ctx.moveTo(vx, vy)
          } else {
            ctx.lineTo(vx, vy)
          }
        })
        ctx.stroke()

        // Draw centerline
        ctx.strokeStyle = '#10b981'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x, pipeY)
        ctx.lineTo(x + sectionWidth, pipeY)
        ctx.stroke()
      }

      // Draw flow particles with parabolic velocity profile
      for (let i = 0; i < 20; i++) {
        const particleTime = (timeRef.current * 50 + i * 40) % (pipeSections * sectionWidth)
        const sectionIdx = Math.floor(particleTime / sectionWidth)
        const posInSection = particleTime % sectionWidth

        if (sectionIdx < pipeSections) {
          const x = pipeStartX + sectionIdx * sectionWidth + posInSection

          // Parabolic profile - faster at center, slower at walls
          const radiusRatio = 0.8 * Math.sin(i * Math.PI / 20)
          const y = pipeY + radiusRatio * 50

          ctx.fillStyle = '#6366f1'
          ctx.globalAlpha = 0.7
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
        }
      }

      // Draw velocity profile diagram (right side)
      const profileX = pipeStartX + pipeSections * sectionWidth + 50
      const profileY = pipeY

      ctx.strokeStyle = '#6366f1'
      ctx.lineWidth = 2
      ctx.beginPath()
      velocityProfile.forEach((point, idx) => {
        const vx = profileX + point.velocity * 40
        const vy = profileY + (point.radius * 100) - 50
        if (idx === 0) {
          ctx.moveTo(vx, vy)
        } else {
          ctx.lineTo(vx, vy)
        }
      })
      ctx.stroke()

      // Draw pipe outline for profile
      ctx.strokeStyle = '#0284c7'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(profileX, profileY - 50)
      ctx.lineTo(profileX, profileY + 50)
      ctx.stroke()

      // Draw centerline
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(profileX, profileY)
      ctx.lineTo(profileX + 60, profileY)
      ctx.stroke()

      // Draw pressure gradient indicators
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      for (let i = 0; i < pipeSections; i++) {
        const x = pipeStartX + i * sectionWidth
        ctx.beginPath()
        ctx.moveTo(x, pipeY - 70)
        ctx.lineTo(x + sectionWidth, pipeY - 70)
        ctx.stroke()
      }
      ctx.setLineDash([])

      // Draw labels and data
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 14px Arial'
      ctx.fillText('Hagen-Poiseuille Laminar Flow', 20, 30)

      ctx.font = '12px Arial'
      ctx.fillStyle = '#0284c7'
      ctx.fillText(`Pipe Diameter: ${parameters.pipeDiameter || 20} mm`, 20, 340)
      ctx.fillText(`Flow Rate: ${flowRate.toFixed(1)} L/min`, 20, 360)
      ctx.fillText(`Viscosity: ${viscosity} cP`, 20, 380)

      ctx.fillStyle = '#6366f1'
      ctx.fillText(`Pressure Gradient: ${pressureGradient.toFixed(2)} Pa/m`, 380, 340)
      ctx.fillText(`Max Velocity (center): ${velocityProfile[velocityProfile.length - 1].velocity.toFixed(4)} m/s`, 380, 360)
      ctx.fillText(`Min Velocity (wall): ${velocityProfile[0].velocity.toFixed(4)} m/s`, 380, 380)

      // Draw formula
      ctx.fillStyle = '#4f46e5'
      ctx.font = 'italic 11px Arial'
      ctx.fillText('Parabolic velocity profile: v(r) = (Δp/4μL)(R² - r²)', 20, 320)

      // Update results
      setResults({
        pressureGradient,
        maxVelocity: velocityProfile[velocityProfile.length - 1].velocity,
        minVelocity: velocityProfile[0].velocity,
      })

      addObservation({
        flowRate: flowRate.toFixed(1),
        diameter: (parameters.pipeDiameter || 20).toFixed(1),
        viscosity: viscosity.toFixed(2),
        pressureGradient: pressureGradient.toFixed(2),
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
      <div className="bg-indigo-50 p-4 rounded-lg mb-4 text-sm text-gray-700">
        <p className="font-semibold mb-2">
          <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
          Observe the parabolic velocity profile in laminar pipe flow. Velocity is maximum at center and zero at walls.
        </p>
      </div>
    </motion.div>
  )
}

export default PoiseuilleSim
