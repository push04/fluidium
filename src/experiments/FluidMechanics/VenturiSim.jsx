import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../../context/AppContext'
import { calculateVenturiFlowRate, calculateVenturiPressureDiff } from '../../utils/simulationMath'

function VenturiSim({ canvasRef }) {
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

      const inletD = (parameters.inletDiameter || 50) / 1000
      const throatD = (parameters.throatDiameter || 25) / 1000
      const flowRate = parameters.flowRate || 30

      // Calculate pressures and velocities
      const pressureDiff = calculateVenturiPressureDiff(parameters.inletDiameter || 50, parameters.throatDiameter || 25, flowRate)
      const velocity1 = (flowRate * 0.001) / (60 * Math.PI * ((inletD) / 2) ** 2)
      const velocity2 = (flowRate * 0.001) / (60 * Math.PI * ((throatD) / 2) ** 2)

      // Draw Venturi tube profile
      const startX = 80
      const centerY = 200

      // Convergent section (inlet to throat)
      ctx.fillStyle = '#dbeafe'
      ctx.strokeStyle = '#0284c7'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(startX, centerY - 40)
      ctx.lineTo(startX + 100, centerY - 20)
      ctx.lineTo(startX + 100, centerY + 20)
      ctx.lineTo(startX, centerY + 40)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Throat section
      ctx.beginPath()
      ctx.moveTo(startX + 100, centerY - 20)
      ctx.lineTo(startX + 150, centerY - 15)
      ctx.lineTo(startX + 150, centerY + 15)
      ctx.lineTo(startX + 100, centerY + 20)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Divergent section (throat to outlet)
      ctx.beginPath()
      ctx.moveTo(startX + 150, centerY - 15)
      ctx.lineTo(startX + 250, centerY - 35)
      ctx.lineTo(startX + 250, centerY + 35)
      ctx.lineTo(startX + 150, centerY + 15)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Draw inlet and outlet pipes
      ctx.fillRect(startX - 30, centerY - 40, 30, 80)
      ctx.strokeRect(startX - 30, centerY - 40, 30, 80)
      ctx.fillRect(startX + 250, centerY - 35, 30, 70)
      ctx.strokeRect(startX + 250, centerY - 35, 30, 70)

      // Draw flow particles
      const particleCount = Math.max(5, Math.floor(velocity1 / 2))
      for (let i = 0; i < particleCount; i++) {
        const xOffset = ((timeRef.current * velocity1 * 50) % 280) - 20
        let x, y, size

        if (xOffset < 100) {
          // Convergent section
          const ratio = xOffset / 100
          x = startX + xOffset
          y = centerY + (ratio * 0 - 40 * ratio)
          size = 3
        } else if (xOffset < 150) {
          // Throat
          x = startX + xOffset
          y = centerY - 20 + ((xOffset - 100) / 50) * 5
          size = 2
        } else {
          // Divergent
          const ratio = (xOffset - 150) / 100
          x = startX + xOffset
          y = centerY - 15 + ratio * 20
          size = 3.5
        }

        ctx.fillStyle = '#6366f1'
        ctx.globalAlpha = 0.8
        ctx.beginPath()
        ctx.arc(x, y + Math.sin(i * 0.5 + timeRef.current) * 3, size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // Draw manometers (pressure measurement)
      // Inlet manometer
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(startX + 30, centerY + 50)
      ctx.lineTo(startX + 30, centerY + 100)
      ctx.stroke()

      const inletPressureHeight = Math.min(30, Math.max(5, pressureDiff * 10))
      ctx.fillStyle = '#ef4444'
      ctx.fillRect(startX + 25, centerY + 100 - inletPressureHeight, 10, inletPressureHeight)

      // Throat manometer
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(startX + 125, centerY + 50)
      ctx.lineTo(startX + 125, centerY + 100)
      ctx.stroke()

      const throatPressureHeight = Math.min(30, Math.max(5, (pressureDiff - 5) * 10))
      ctx.fillStyle = '#f59e0b'
      ctx.fillRect(startX + 120, centerY + 100 - throatPressureHeight, 10, throatPressureHeight)

      // Outlet manometer
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(startX + 220, centerY + 50)
      ctx.lineTo(startX + 220, centerY + 100)
      ctx.stroke()

      ctx.fillStyle = '#10b981'
      ctx.fillRect(startX + 215, centerY + 100 - inletPressureHeight / 2, 10, inletPressureHeight / 2)

      // Draw labels
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 12px Arial'
      ctx.fillText('Inlet', startX + 15, centerY + 120)
      ctx.fillText('Throat', startX + 110, centerY + 120)
      ctx.fillText('Outlet', startX + 205, centerY + 120)

      // Draw velocity indicators
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2
      ctx.fillStyle = '#10b981'

      // Inlet velocity arrow
      ctx.beginPath()
      ctx.moveTo(startX + 50, centerY - 50)
      ctx.lineTo(startX + 50 + velocity1 * 8, centerY - 50)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(startX + 50 + velocity1 * 8, centerY - 50)
      ctx.lineTo(startX + 50 + velocity1 * 8 - 8, centerY - 55)
      ctx.lineTo(startX + 50 + velocity1 * 8 - 8, centerY - 45)
      ctx.closePath()
      ctx.fill()

      // Throat velocity arrow
      ctx.beginPath()
      ctx.moveTo(startX + 125, centerY - 30)
      ctx.lineTo(startX + 125 + velocity2 * 10, centerY - 30)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(startX + 125 + velocity2 * 10, centerY - 30)
      ctx.lineTo(startX + 125 + velocity2 * 10 - 8, centerY - 35)
      ctx.lineTo(startX + 125 + velocity2 * 10 - 8, centerY - 25)
      ctx.closePath()
      ctx.fill()

      // Draw data
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 14px Arial'
      ctx.fillText('Venturi Meter Simulation', 20, 30)

      ctx.font = '12px Arial'
      ctx.fillStyle = '#0284c7'
      ctx.fillText(`Inlet Diameter: ${parameters.inletDiameter || 50} mm`, 20, 340)
      ctx.fillText(`Throat Diameter: ${parameters.throatDiameter || 25} mm`, 20, 360)
      ctx.fillText(`Flow Rate: ${flowRate.toFixed(1)} L/min`, 20, 380)

      ctx.fillStyle = '#f59e0b'
      ctx.fillText(`Pressure Diff: ${pressureDiff.toFixed(3)} kPa`, 450, 340)
      ctx.fillText(`Inlet Velocity: ${velocity1.toFixed(3)} m/s`, 450, 360)
      ctx.fillText(`Throat Velocity: ${velocity2.toFixed(3)} m/s`, 450, 380)

      // Update results
      setResults({
        pressureDifference: pressureDiff,
        inletVelocity: velocity1,
        throatVelocity: velocity2,
        flowRate,
      })

      addObservation({
        flowRate,
        pressureDiff: pressureDiff.toFixed(3),
        inletVelocity: velocity1.toFixed(4),
        throatVelocity: velocity2.toFixed(4),
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
          Adjust inlet/throat diameter and flow rate to observe pressure and velocity changes. Red and orange bars show pressure heads.
        </p>
      </div>
    </motion.div>
  )
}

export default VenturiSim
