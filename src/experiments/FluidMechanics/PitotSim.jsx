import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../../context/AppContext'
import { calculatePitotVelocity, calculateDynamicPressure } from '../../utils/simulationMath'

function PitotSim({ canvasRef }) {
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

      const velocity = parameters.flowVelocity || 2
      const density = parameters.fluidDensity || 1000
      const tubePressure = parameters.tubePressure || 10000

      // Calculate dynamic pressure
      const dynamicPressure = calculateDynamicPressure(velocity, density)

      // Draw flow channel
      const channelX = 80
      const channelY = 150
      const channelW = 500
      const channelH = 80

      ctx.fillStyle = '#dbeafe'
      ctx.strokeStyle = '#0284c7'
      ctx.lineWidth = 2
      ctx.fillRect(channelX, channelY, channelW, channelH)
      ctx.strokeRect(channelX, channelY, channelW, channelH)

      // Draw flow particles
      for (let i = 0; i < 25; i++) {
        const particleX = (channelX + (timeRef.current * velocity * 30 + i * 20) % channelW)
        const particleY = channelY + channelH / 2 + Math.sin(i * 0.3 + timeRef.current) * 15

        ctx.fillStyle = '#06b6d4'
        ctx.globalAlpha = 0.7
        ctx.beginPath()
        ctx.arc(particleX, particleY, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // Draw Pitot tube assembly
      const tubeX = channelX + 250
      const tubeY = channelY - 60

      // Stagnation probe (facing upstream)
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(tubeX - 30, tubeY)
      ctx.lineTo(tubeX - 30, tubeY + 100)
      ctx.stroke()

      // Stagnation point marker
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(tubeX - 30, channelY, 4, 0, Math.PI * 2)
      ctx.fill()

      // Static probe (side opening)
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(tubeX + 30, tubeY)
      ctx.lineTo(tubeX + 30, tubeY + 100)
      ctx.stroke()

      // Static opening marker
      ctx.fillStyle = '#f59e0b'
      ctx.beginPath()
      ctx.arc(tubeX + 30, channelY, 4, 0, Math.PI * 2)
      ctx.fill()

      // Draw manometer connections
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(tubeX - 30, tubeY + 100)
      ctx.lineTo(tubeX - 30, tubeY + 120)
      ctx.lineTo(tubeX - 80, tubeY + 120)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(tubeX + 30, tubeY + 100)
      ctx.lineTo(tubeX + 30, tubeY + 120)
      ctx.lineTo(tubeX + 80, tubeY + 120)
      ctx.stroke()

      // Draw manometer tubes
      ctx.fillStyle = '#f3f4f6'
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 2
      ctx.fillRect(tubeX - 100, tubeY + 120, 30, 100)
      ctx.strokeRect(tubeX - 100, tubeY + 120, 30, 100)
      ctx.fillRect(tubeX + 70, tubeY + 120, 30, 100)
      ctx.strokeRect(tubeX + 70, tubeY + 120, 30, 100)

      // Draw fluid levels in manometer
      const manometerDiff = Math.min(dynamicPressure / 100, 80)

      // Stagnation pressure (higher)
      ctx.fillStyle = '#ef4444'
      ctx.globalAlpha = 0.7
      ctx.fillRect(tubeX - 100, tubeY + 220 - manometerDiff, 30, manometerDiff)
      ctx.globalAlpha = 1

      // Static pressure (lower)
      ctx.fillStyle = '#f59e0b'
      ctx.globalAlpha = 0.7
      ctx.fillRect(tubeX + 70, tubeY + 220 - (manometerDiff * 0.3), 30, manometerDiff * 0.3)
      ctx.globalAlpha = 1

      // Draw connecting tube with fluid
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2
      const tubeLevel = tubeY + 220 - manometerDiff
      ctx.beginPath()
      ctx.moveTo(tubeX - 70, tubeLevel)
      ctx.quadraticCurveTo(tubeX, tubeLevel - 10, tubeX + 70, tubeLevel - (manometerDiff * 0.7))
      ctx.stroke()

      // Draw pressure readings
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 12px Arial'
      ctx.fillText('Stagnation', tubeX - 120, tubeY + 240)
      ctx.fillText('Static', tubeX + 70, tubeY + 240)

      // Draw labels and data
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 14px Arial'
      ctx.fillText('Pitot Tube Velocity Measurement', 20, 30)

      ctx.font = '12px Arial'
      ctx.fillStyle = '#ef4444'
      ctx.fillText(`Stagnation Pressure: ${(tubePressure + dynamicPressure).toFixed(0)} Pa`, 20, 340)
      ctx.fillStyle = '#f59e0b'
      ctx.fillText(`Static Pressure: ${tubePressure.toFixed(0)} Pa`, 20, 360)
      ctx.fillStyle = '#10b981'
      ctx.fillText(`Dynamic Pressure: ${dynamicPressure.toFixed(0)} Pa`, 20, 380)

      ctx.fillStyle = '#6366f1'
      const calculatedVelocity = calculatePitotVelocity(dynamicPressure, density)
      ctx.fillText(`Measured Velocity: ${calculatedVelocity.toFixed(3)} m/s`, 450, 340)
      ctx.fillText(`Actual Velocity: ${velocity.toFixed(3)} m/s`, 450, 360)
      ctx.fillText(`Fluid Density: ${density} kg/m³`, 450, 380)

      // Update results
      setResults({
        dynamicPressure,
        calculatedVelocity,
        stagnationPressure: tubePressure + dynamicPressure,
      })

      addObservation({
        velocity: velocity.toFixed(3),
        dynamicPressure: dynamicPressure.toFixed(1),
        calculatedVelocity: calculatedVelocity.toFixed(4),
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
          The Pitot tube measures velocity by converting kinetic energy to pressure. Observe the manometer height difference.
        </p>
      </div>
    </motion.div>
  )
}

export default PitotSim
