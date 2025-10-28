import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../../../context/AppContext'
import { calculateHydrostaticPressure, calculateHydrostaticForce, calculateCenterOfPressure } from '../../../utils/simulationMath'

function HydrostaticSim({ canvasRef }) {
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

      const depth = parameters.fluidDepth || 2
      const density = parameters.fluidDensity || 1000
      const g = 9.81

      // Calculate hydrostatic properties
      const pressure = calculateHydrostaticPressure(depth, density)
      const force = calculateHydrostaticForce(depth, 2, density) // 2m² area
      const centerOfPressure = calculateCenterOfPressure(depth)

      // Draw tank with vertical gate
      const tankX = 100
      const tankY = 80
      const tankW = 200
      const maxTankH = 250

      // Tank walls
      ctx.fillStyle = '#dbeafe'
      ctx.strokeStyle = '#0284c7'
      ctx.lineWidth = 3
      ctx.fillRect(tankX, tankY, tankW, maxTankH)
      ctx.strokeRect(tankX, tankY, tankW, maxTankH)

      // Water
      const waterHeight = Math.min((depth / 5) * maxTankH, maxTankH)
      ctx.fillStyle = '#06b6d4'
      ctx.globalAlpha = 0.6
      ctx.fillRect(tankX, tankY + maxTankH - waterHeight, tankW, waterHeight)
      ctx.globalAlpha = 1

      // Vertical gate (submerged surface)
      const gateX = tankX + tankW + 20
      const gateY = tankY
      const gateW = 60
      const gateH = waterHeight

      ctx.fillStyle = '#fbbf24'
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 2
      ctx.fillRect(gateX, gateY + maxTankH - gateH, gateW, gateH)
      ctx.strokeRect(gateX, gateY + maxTankH - gateH, gateW, gateH)

      // Pressure distribution on gate
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2
      for (let i = 0; i < 10; i++) {
        const yPos = gateY + maxTankH - (i / 10) * gateH
        const pressureAtPoint = calculateHydrostaticPressure((i / 10) * depth, density)
        const arrowLength = (pressureAtPoint / pressure) * 40

        ctx.beginPath()
        ctx.moveTo(gateX + gateW, yPos)
        ctx.lineTo(gateX + gateW + arrowLength, yPos)
        ctx.stroke()

        // Arrow head
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.moveTo(gateX + gateW + arrowLength, yPos)
        ctx.lineTo(gateX + gateW + arrowLength - 6, yPos - 3)
        ctx.lineTo(gateX + gateW + arrowLength - 6, yPos + 3)
        ctx.closePath()
        ctx.fill()
      }

      // Draw center of pressure
      const copY = gateY + maxTankH - (centerOfPressure / depth) * gateH
      ctx.fillStyle = '#10b981'
      ctx.beginPath()
      ctx.arc(gateX + gateW + 50, copY, 6, 0, Math.PI * 2)
      ctx.fill()

      // Draw centroid (for reference)
      const centroidY = gateY + maxTankH - (depth / 2) * (gateH / depth)
      ctx.strokeStyle = '#6366f1'
      ctx.lineWidth = 2
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.arc(gateX + gateW + 50, centroidY, 4, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw total force vector
      ctx.strokeStyle = '#8b5cf6'
      ctx.lineWidth = 3
      const forceArrowLength = Math.min((force / 100) * 60, 80)
      ctx.beginPath()
      ctx.moveTo(gateX + gateW + 60, copY)
      ctx.lineTo(gateX + gateW + 60 + forceArrowLength, copY)
      ctx.stroke()

      // Force arrow head
      ctx.fillStyle = '#8b5cf6'
      ctx.beginPath()
      ctx.moveTo(gateX + gateW + 60 + forceArrowLength, copY)
      ctx.lineTo(gateX + gateW + 60 + forceArrowLength - 8, copY - 4)
      ctx.lineTo(gateX + gateW + 60 + forceArrowLength - 8, copY + 4)
      ctx.closePath()
      ctx.fill()

      // Draw depth measurement
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(tankX - 20, tankY)
      ctx.lineTo(tankX - 20, tankY + maxTankH - waterHeight)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = '#ef4444'
      ctx.font = 'bold 11px Arial'
      ctx.fillText(`h=${depth.toFixed(2)}m`, tankX - 60, tankY + (maxTankH - waterHeight) / 2)

      // Draw pressure distribution diagram (right side)
      const diagramX = 500
      const diagramY = tankY
      const diagramW = 200
      const diagramH = 250

      // Draw reference lines
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.rect(diagramX, diagramY, diagramW, diagramH)
      ctx.stroke()

      // Draw pressure triangle
      ctx.strokeStyle = '#6366f1'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(diagramX, diagramY)
      ctx.lineTo(diagramX + 80, diagramY + diagramH)
      ctx.lineTo(diagramX, diagramY + diagramH)
      ctx.closePath()
      ctx.stroke()

      ctx.fillStyle = '#6366f1'
      ctx.globalAlpha = 0.2
      ctx.beginPath()
      ctx.moveTo(diagramX, diagramY)
      ctx.lineTo(diagramX + 80, diagramY + diagramH)
      ctx.lineTo(diagramX, diagramY + diagramH)
      ctx.closePath()
      ctx.fill()
      ctx.globalAlpha = 1

      // Draw labels and data
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 14px Arial'
      ctx.fillText('Hydrostatic Pressure on Submerged Surface', 20, 30)

      ctx.font = '12px Arial'
      ctx.fillStyle = '#0284c7'
      ctx.fillText(`Fluid Depth: ${depth.toFixed(2)} m`, 20, 340)
      ctx.fillText(`Fluid Density: ${density} kg/m³`, 20, 360)
      ctx.fillText(`Surface Area: 2 m²`, 20, 380)

      ctx.fillStyle = '#ef4444'
      ctx.fillText(`Max Pressure: ${pressure.toFixed(0)} Pa`, 420, 340)
      ctx.fillStyle = '#8b5cf6'
      ctx.fillText(`Total Force: ${force.toFixed(2)} N`, 420, 360)
      ctx.fillStyle = '#10b981'
      ctx.fillText(`CoP: ${centerOfPressure.toFixed(3)} m`, 420, 380)

      // Draw diagram labels
      ctx.font = '10px Arial'
      ctx.fillStyle = '#6366f1'
      ctx.fillText('Pressure Distribution', diagramX + 50, diagramY - 10)
      ctx.fillText('Depth', diagramX - 30, diagramY + diagramH + 15)
      ctx.fillText('0', diagramX - 15, diagramY - 5)
      ctx.fillText(`${pressure.toFixed(0)}Pa`, diagramX + 85, diagramY + diagramH - 5)

      // Update results
      setResults({
        pressure,
        force,
        centerOfPressure,
        depth,
      })

      addObservation({
        depth: depth.toFixed(2),
        pressure: pressure.toFixed(0),
        force: force.toFixed(2),
        centerOfPressure: centerOfPressure.toFixed(3),
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
          Pressure increases with depth. The pressure distribution forms a triangle. Green dot shows center of pressure (CoP).
        </p>
      </div>
    </motion.div>
  )
}

export default HydrostaticSim
