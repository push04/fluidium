import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../../../context/AppContext'
import { calculateHydraulicJumpHeight, calculateFroudeNumber, calculateEnergyLoss } from '../../../utils/simulationMath'

function HydraulicJumpSim({ canvasRef }) {
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

      const upstreamDepth = 0.3
      const downstreamDepth = parameters.pipeHeight || 1.2
      const g = 9.81

      // Calculate from upstream condition
      const channelWidth = 2 // m
      const discharge = 1.5 // m³/s
      const upstreamVelocity = discharge / (channelWidth * upstreamDepth)
      const froude = calculateFroudeNumber(upstreamVelocity, upstreamDepth)
      const downstreamVelocity = discharge / (channelWidth * downstreamDepth)
      const energyLoss = calculateEnergyLoss(upstreamDepth, downstreamDepth)

      // Draw open channel
      const channelStartX = 80
      const channelY = 250
      const channelLength = 600

      // Channel bed
      ctx.fillStyle = '#92400e'
      ctx.fillRect(channelStartX, channelY, channelLength, 30)
      ctx.strokeStyle = '#78350f'
      ctx.lineWidth = 2
      ctx.strokeRect(channelStartX, channelY, channelLength, 30)

      // Upstream section (supercritical, shallow)
      const upstreamLength = 150
      const upstreamH = upstreamDepth * 100
      ctx.fillStyle = '#06b6d4'
      ctx.globalAlpha = 0.7
      ctx.fillRect(channelStartX, channelY - upstreamH, upstreamLength, upstreamH)
      ctx.globalAlpha = 1

      // Draw upstream flow particles
      for (let i = 0; i < 15; i++) {
        const particleX = channelStartX + (timeRef.current * upstreamVelocity * 100 + i * 10) % upstreamLength
        const particleY = channelY - upstreamH / 2

        ctx.fillStyle = '#0284c7'
        ctx.globalAlpha = 0.8
        ctx.beginPath()
        ctx.arc(particleX, particleY, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // Hydraulic jump (transition zone)
      const jumpX = channelStartX + upstreamLength
      const jumpLength = 100

      // Draw wavy jump pattern
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(jumpX, channelY - upstreamH)
      for (let i = 0; i <= 20; i++) {
        const t = i / 20
        const x = jumpX + t * jumpLength
        const y = channelY - upstreamH + t * (downstreamDepth * 100 - upstreamH) + Math.sin(t * Math.PI * 3) * 10
        ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Draw jump surface with turbulence
      ctx.fillStyle = '#f59e0b'
      ctx.globalAlpha = 0.3
      for (let i = 0; i < 20; i++) {
        const x = jumpX + Math.random() * jumpLength
        const y = channelY - upstreamH + Math.random() * (downstreamDepth * 100 - upstreamH)
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Downstream section (subcritical, deeper)
      const downstreamLength = 250
      const downstreamH = downstreamDepth * 100
      const downstreamX = jumpX + jumpLength

      ctx.fillStyle = '#06b6d4'
      ctx.globalAlpha = 0.5
      ctx.fillRect(downstreamX, channelY - downstreamH, downstreamLength, downstreamH)
      ctx.globalAlpha = 1

      // Draw downstream flow particles
      for (let i = 0; i < 10; i++) {
        const particleX = downstreamX + (timeRef.current * downstreamVelocity * 50 + i * 15) % downstreamLength
        const particleY = channelY - downstreamH / 2

        ctx.fillStyle = '#0284c7'
        ctx.globalAlpha = 0.8
        ctx.beginPath()
        ctx.arc(particleX, particleY, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // Draw depth measurements
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])

      // Upstream depth line
      ctx.beginPath()
      ctx.moveTo(channelStartX + 50, channelY)
      ctx.lineTo(channelStartX + 50, channelY - upstreamH)
      ctx.stroke()

      // Downstream depth line
      ctx.beginPath()
      ctx.moveTo(downstreamX + 100, channelY)
      ctx.lineTo(downstreamX + 100, channelY - downstreamH)
      ctx.stroke()

      ctx.setLineDash([])

      // Draw depth labels
      ctx.fillStyle = '#ef4444'
      ctx.font = 'bold 11px Arial'
      ctx.fillText(`y1=${upstreamDepth.toFixed(2)}m`, channelStartX - 50, channelY - upstreamH / 2)
      ctx.fillText(`y2=${downstreamDepth.toFixed(2)}m`, downstreamX - 50, channelY - downstreamH / 2)

      // Draw energy line
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2
      const upstreamEnergy = upstreamDepth + (upstreamVelocity ** 2) / (2 * g)
      const downstreamEnergy = downstreamDepth + (downstreamVelocity ** 2) / (2 * g)

      ctx.beginPath()
      ctx.moveTo(channelStartX, channelY - upstreamEnergy * 100)
      ctx.lineTo(jumpX, channelY - upstreamEnergy * 100)
      ctx.lineTo(downstreamX, channelY - downstreamEnergy * 100)
      ctx.lineTo(downstreamX + downstreamLength, channelY - downstreamEnergy * 100)
      ctx.stroke()

      // Draw labels and data
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 14px Arial'
      ctx.fillText('Hydraulic Jump in Open Channel', 20, 30)

      ctx.font = '12px Arial'
      ctx.fillStyle = '#0284c7'
      ctx.fillText(`Upstream Velocity: ${upstreamVelocity.toFixed(2)} m/s`, 20, 340)
      ctx.fillText(`Downstream Velocity: ${downstreamVelocity.toFixed(2)} m/s`, 20, 360)

      ctx.fillStyle = '#f59e0b'
      ctx.fillText(`Froude Number: ${froude.toFixed(3)} (Supercritical)`, 450, 340)
      ctx.fillStyle = '#ef4444'
      ctx.fillText(`Energy Loss: ${energyLoss.toFixed(3)} m`, 450, 360)
      ctx.fillStyle = '#10b981'
      ctx.fillText(`Jump occurs when Fr > 1`, 450, 380)

      // Update results
      setResults({
        upstreamDepth,
        downstreamDepth,
        froude,
        energyLoss,
      })

      addObservation({
        upstreamVelocity: upstreamVelocity.toFixed(3),
        downstreamVelocity: downstreamVelocity.toFixed(3),
        froude: froude.toFixed(3),
        energyLoss: energyLoss.toFixed(4),
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
          Observe the sudden rise in water level when supercritical flow (Froude > 1) transitions to subcritical (Froude < 1).
        </p>
      </div>
    </motion.div>
  )
}

export default HydraulicJumpSim
