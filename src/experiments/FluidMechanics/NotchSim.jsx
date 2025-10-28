import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../../context/AppContext'
import { calculateWeirFlowRate } from '../../utils/simulationMath'

function NotchSim({ canvasRef }) {
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

      const headHeight = parameters.headHeight || 1.5

      // Calculate flow rates for different notch types
      const rectangularFlow = calculateWeirFlowRate(headHeight, 90, 'rectangular')
      const triangularFlow = calculateWeirFlowRate(headHeight, 45, 'triangular')

      // Draw rectangular notch section
      const rect1X = 80
      const rect1Y = 100

      ctx.fillStyle = '#dbeafe'
      ctx.strokeStyle = '#0284c7'
      ctx.lineWidth = 2
      ctx.fillRect(rect1X, rect1Y, 200, 150)
      ctx.strokeRect(rect1X, rect1Y, 200, rect1Y + 150)

      // Draw rectangular notch
      ctx.fillStyle = '#374151'
      ctx.fillRect(rect1X + 75, rect1Y, 50, 40)

      // Draw water level
      const waterLevel1 = Math.min((timeRef.current * 0.3) % 130, 130)
      ctx.fillStyle = '#06b6d4'
      ctx.globalAlpha = 0.6
      ctx.fillRect(rect1X, rect1Y + 150 - waterLevel1, 200, waterLevel1)
      ctx.globalAlpha = 1

      // Draw water flow over rectangular notch
      if (waterLevel1 > 40) {
        ctx.strokeStyle = '#06b6d4'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(rect1X + 100, rect1Y, Math.sin(timeRef.current * 5) * 10 + 15, 0, Math.PI, true)
        ctx.stroke()
      }

      // Draw triangular notch section
      const triX = 420
      const triY = 100

      ctx.fillStyle = '#dbeafe'
      ctx.strokeStyle = '#0284c7'
      ctx.lineWidth = 2
      ctx.fillRect(triX, triY, 200, 150)
      ctx.strokeRect(triX, triY, 200, 150)

      // Draw triangular notch
      ctx.fillStyle = '#374151'
      ctx.beginPath()
      ctx.moveTo(triX + 100, triY)
      ctx.lineTo(triX + 60, triY + 40)
      ctx.lineTo(triX + 140, triY + 40)
      ctx.closePath()
      ctx.fill()

      // Draw water level
      const waterLevel2 = Math.min((timeRef.current * 0.3) % 130, 130)
      ctx.fillStyle = '#06b6d4'
      ctx.globalAlpha = 0.6
      ctx.fillRect(triX, triY + 150 - waterLevel2, 200, waterLevel2)
      ctx.globalAlpha = 1

      // Draw water flow over triangular notch
      if (waterLevel2 > 40) {
        ctx.strokeStyle = '#06b6d4'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(triX + 100, triY, Math.sin(timeRef.current * 5) * 12 + 18, 0, Math.PI, true)
        ctx.stroke()
      }

      // Draw collection tanks
      ctx.fillStyle = '#f3f4f6'
      ctx.strokeStyle = '#0284c7'
      ctx.lineWidth = 2
      ctx.fillRect(rect1X, rect1Y + 170, 200, 80)
      ctx.strokeRect(rect1X, rect1Y + 170, 200, 80)
      ctx.fillRect(triX, triY + 170, 200, 80)
      ctx.strokeRect(triX, triY + 170, 200, 80)

      // Draw collected water in tanks
      const collectedLevel1 = Math.min((timeRef.current * 0.5) % 70, 70)
      const collectedLevel2 = Math.min((timeRef.current * 0.3) % 70, 70)

      ctx.fillStyle = '#0284c7'
      ctx.globalAlpha = 0.5
      ctx.fillRect(rect1X, rect1Y + 170 + 80 - collectedLevel1, 200, collectedLevel1)
      ctx.globalAlpha = 0.7
      ctx.fillRect(triX, triY + 170 + 80 - collectedLevel2, 200, collectedLevel2)
      ctx.globalAlpha = 1

      // Draw measurement lines
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(rect1X - 20, rect1Y)
      ctx.lineTo(rect1X - 20, rect1Y + 150 - waterLevel1)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(triX - 20, triY)
      ctx.lineTo(triX - 20, triY + 150 - waterLevel2)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw labels and data
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 14px Arial'
      ctx.fillText('Notch & Weir Flow Comparison', 20, 30)

      ctx.font = 'bold 12px Arial'
      ctx.fillStyle = '#0284c7'
      ctx.fillText('Rectangular Notch', rect1X + 50, rect1Y - 10)
      ctx.fillText('Triangular Notch', triX + 50, triY - 10)

      ctx.font = '11px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.fillText(`Head: ${headHeight.toFixed(2)} m`, rect1X + 30, rect1Y + 210)
      ctx.fillText(`Q: ${rectangularFlow.toFixed(2)} L/min`, rect1X + 30, rect1Y + 230)

      ctx.fillText(`Head: ${headHeight.toFixed(2)} m`, triX + 30, triY + 210)
      ctx.fillText(`Q: ${triangularFlow.toFixed(2)} L/min`, triX + 30, triY + 230)

      // Draw flow rate comparison
      ctx.fillStyle = '#10b981'
      ctx.font = '12px Arial'
      ctx.fillText(`Rectangular is ${(rectangularFlow / triangularFlow).toFixed(1)}x more efficient`, 200, 360)

      // Update results
      setResults({
        rectangularFlowRate: rectangularFlow,
        triangularFlowRate: triangularFlow,
        headHeight,
      })

      addObservation({
        headHeight: headHeight.toFixed(2),
        rectangularFlow: rectangularFlow.toFixed(2),
        triangularFlow: triangularFlow.toFixed(2),
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
          Compare flow rates between rectangular and triangular notches at the same head height. Observe discharge rate differences.
        </p>
      </div>
    </motion.div>
  )
}

export default NotchSim
