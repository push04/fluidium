import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../../context/AppContext'
import { calculateDragForce, calculateLiftForce } from '../../utils/simulationMath'

function DragLiftSim({ canvasRef }) {
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
      const fluidDensity = parameters.fluidDensity || 1000
      const refArea = 0.1 // m²
      const dragCoeff = 1.2
      const liftCoeff = 0.5

      // Calculate forces
      const dragForce = calculateDragForce(velocity, fluidDensity, refArea, dragCoeff)
      const liftForce = calculateLiftForce(velocity, fluidDensity, refArea, liftCoeff)

      // Draw wind tunnel channel
      const tunnelX = 80
      const tunnelY = 80
      const tunnelW = 600
      const tunnelH = 200

      ctx.fillStyle = '#dbeafe'
      ctx.strokeStyle = '#0284c7'
      ctx.lineWidth = 2
      ctx.fillRect(tunnelX, tunnelY, tunnelW, tunnelH)
      ctx.strokeRect(tunnelX, tunnelY, tunnelW, tunnelH)

      // Draw flow particles
      for (let i = 0; i < 30; i++) {
        const particleX = tunnelX + (timeRef.current * velocity * 40 + i * 20) % tunnelW
        const particleY = tunnelY + 50 + Math.sin(i * 0.2 + timeRef.current * 2) * 30

        ctx.fillStyle = '#06b6d4'
        ctx.globalAlpha = 0.6
        ctx.beginPath()
        ctx.arc(particleX, particleY, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // Draw airfoil/cylinder (at center)
      const objectX = tunnelX + tunnelW / 2
      const objectY = tunnelY + tunnelH / 2

      // Draw airfoil shape
      ctx.fillStyle = '#374151'
      ctx.beginPath()
      ctx.ellipse(objectX, objectY, 40, 25, 0.3, 0, Math.PI * 2)
      ctx.fill()

      // Draw pressure streamlines around object
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.5

      for (let i = 0; i < 4; i++) {
        ctx.beginPath()
        for (let x = tunnelX + 50; x < objectX - 50; x += 10) {
          const y = tunnelY + 50 + i * 40 + Math.sin((x - tunnelX) / 50) * 5
          ctx.lineTo(x, y)
        }
        ctx.stroke()

        ctx.beginPath()
        for (let x = objectX + 50; x < tunnelX + tunnelW - 50; x += 10) {
          const y = tunnelY + 50 + i * 40 + Math.sin((x - objectX) / 40) * 8
          ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // Draw force vectors
      // Drag force (horizontal, opposing flow)
      const dragScale = Math.min(dragForce / 10, 80)
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(objectX, objectY)
      ctx.lineTo(objectX - dragScale, objectY)
      ctx.stroke()

      // Drag arrow
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.moveTo(objectX - dragScale, objectY)
      ctx.lineTo(objectX - dragScale + 8, objectY - 5)
      ctx.lineTo(objectX - dragScale + 8, objectY + 5)
      ctx.closePath()
      ctx.fill()

      // Lift force (vertical, perpendicular to flow)
      const liftScale = Math.min(liftForce / 10, 60)
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(objectX, objectY)
      ctx.lineTo(objectX, objectY - liftScale)
      ctx.stroke()

      // Lift arrow
      ctx.fillStyle = '#10b981'
      ctx.beginPath()
      ctx.moveTo(objectX, objectY - liftScale)
      ctx.lineTo(objectX - 5, objectY - liftScale + 8)
      ctx.lineTo(objectX + 5, objectY - liftScale + 8)
      ctx.closePath()
      ctx.fill()

      // Draw resultant force
      const resultantX = -dragScale
      const resultantY = -liftScale
      const resultantMag = Math.sqrt(resultantX ** 2 + resultantY ** 2)
      const resultantScale = resultantMag

      ctx.strokeStyle = '#8b5cf6'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(objectX, objectY)
      ctx.lineTo(objectX + resultantX, objectY + resultantY)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw pressure distribution lines
      ctx.strokeStyle = '#6366f1'
      ctx.lineWidth = 1
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
        const px = objectX + 45 * Math.cos(angle)
        const py = objectY + 28 * Math.sin(angle)
        const pressureMag = Math.abs(Math.sin(angle + timeRef.current)) * 5

        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(px + pressureMag * Math.cos(angle), py + pressureMag * Math.sin(angle))
        ctx.stroke()
      }

      // Draw labels and data
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 14px Arial'
      ctx.fillText('Drag & Lift Forces on Airfoil', 20, 30)

      ctx.font = '12px Arial'
      ctx.fillStyle = '#ef4444'
      ctx.fillText(`Drag Force: ${dragForce.toFixed(2)} N`, 20, 310)
      ctx.fillStyle = '#10b981'
      ctx.fillText(`Lift Force: ${liftForce.toFixed(2)} N`, 20, 330)
      ctx.fillStyle = '#8b5cf6'
      ctx.fillText(`Resultant: ${Math.sqrt(dragForce ** 2 + liftForce ** 2).toFixed(2)} N`, 20, 350)

      ctx.fillStyle = '#1f2937'
      ctx.fillText(`Velocity: ${velocity.toFixed(2)} m/s`, 450, 310)
      ctx.fillText(`L/D Ratio: ${(liftForce / dragForce).toFixed(2)}`, 450, 330)
      ctx.fillText(`Density: ${fluidDensity} kg/m³`, 450, 350)

      // Update results
      setResults({
        dragForce,
        liftForce,
        liftToDragRatio: liftForce / dragForce,
      })

      addObservation({
        velocity: velocity.toFixed(2),
        dragForce: dragForce.toFixed(3),
        liftForce: liftForce.toFixed(3),
        ratio: (liftForce / dragForce).toFixed(3),
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
          Observe how drag (red, horizontal) and lift (green, vertical) forces change with velocity. Adjust flow to see force changes.
        </p>
      </div>
    </motion.div>
  )
}

export default DragLiftSim
