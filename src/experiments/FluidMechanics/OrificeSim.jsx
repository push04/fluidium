import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../../context/AppContext'
import { calculateOrificeFlowRate, calculateJetTrajectory } from '../../utils/simulationMath'

function OrificeSim({ canvasRef }) {
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

      const headHeight = parameters.headHeight || 2
      const orificeDiameter = parameters.orificediameter || 20
      const discCoeff = parameters.coefficientDischarge || 0.75

      // Calculate flow
      const flowRate = calculateOrificeFlowRate(headHeight, orificeDiameter, discCoeff)
      const trajectoryPoints = calculateJetTrajectory(headHeight, orificeDiameter, discCoeff)

      // Draw tank
      const tankX = 100
      const tankY = 80
      const tankW = 150
      const tankH = 150

      ctx.fillStyle = '#dbeafe'
      ctx.strokeStyle = '#0284c7'
      ctx.lineWidth = 2
      ctx.fillRect(tankX, tankY, tankW, tankH)
      ctx.strokeRect(tankX, tankY, tankW, tankH)

      // Draw water level (animated)
      const waterLevel = (headHeight / 5) * tankH
      ctx.fillStyle = '#06b6d4'
      ctx.globalAlpha = 0.7
      ctx.fillRect(tankX, tankY + tankH - waterLevel, tankW, waterLevel)
      ctx.globalAlpha = 1

      // Draw orifice
      const orificeX = tankX + 80
      const orificeY = tankY + tankH
      const orificeR = orificeDiameter / 6

      ctx.fillStyle = '#374151'
      ctx.beginPath()
      ctx.arc(orificeX, orificeY, orificeR, 0, Math.PI * 2)
      ctx.fill()

      // Draw jet trajectory
      ctx.strokeStyle = '#06b6d4'
      ctx.lineWidth = 3
      ctx.globalAlpha = 0.8
      ctx.beginPath()

      const scale = 30
      trajectoryPoints.forEach((point, idx) => {
        const x = orificeX + point.x * scale
        const y = orificeY + point.y * scale
        if (idx === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()
      ctx.globalAlpha = 1

      // Draw falling water particles
      for (let i = 0; i < 15; i++) {
        const offset = (timeRef.current * 100 + i * 20) % 200
        const trajectoryIdx = Math.floor((offset / 200) * trajectoryPoints.length)
        if (trajectoryIdx < trajectoryPoints.length) {
          const point = trajectoryPoints[trajectoryIdx]
          const x = orificeX + point.x * scale + (Math.random() - 0.5) * 10
          const y = orificeY + point.y * scale

          ctx.fillStyle = '#06b6d4'
          ctx.globalAlpha = 0.6
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
        }
      }

      // Draw collection tank
      ctx.fillStyle = '#dbeafe'
      ctx.strokeStyle = '#0284c7'
      ctx.lineWidth = 2
      ctx.fillRect(400, 250, 250, 100)
      ctx.strokeRect(400, 250, 250, 100)

      // Draw collected water level
      const collectedLevel = Math.min((timeRef.current * 0.5) % 100, 80)
      ctx.fillStyle = '#0284c7'
      ctx.globalAlpha = 0.6
      ctx.fillRect(400, 250 + 100 - collectedLevel, 250, collectedLevel)
      ctx.globalAlpha = 1

      // Draw measurement indicators
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(tankX + tankW + 10, tankY)
      ctx.lineTo(tankX + tankW + 10, tankY + tankH - waterLevel)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = '#ef4444'
      ctx.font = 'bold 12px Arial'
      ctx.fillText(`H = ${headHeight.toFixed(2)} m`, tankX + tankW + 20, tankY + (tankH - waterLevel) / 2)

      // Draw labels
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 14px Arial'
      ctx.fillText('Orifice & Mouthpiece Flow', 20, 30)

      ctx.font = '12px Arial'
      ctx.fillText('Water Tank', tankX + 30, tankY - 10)
      ctx.fillText('Collection Tank', 450, 240)

      // Draw data
      ctx.fillStyle = '#1f2937'
      ctx.font = '12px Arial'
      ctx.fillText(`Head Height: ${headHeight.toFixed(2)} m`, 20, 340)
      ctx.fillText(`Orifice Diameter: ${orificeDiameter} mm`, 20, 360)
      ctx.fillText(`Discharge Coefficient: ${discCoeff.toFixed(2)}`, 20, 380)

      ctx.fillStyle = '#10b981'
      ctx.fillText(`Flow Rate: ${flowRate.toFixed(2)} L/min`, 450, 340)
      ctx.fillText(`Theoretical Velocity: ${Math.sqrt(2 * 9.81 * headHeight).toFixed(3)} m/s`, 450, 360)
      ctx.fillText(`Actual Velocity: ${(discCoeff * Math.sqrt(2 * 9.81 * headHeight)).toFixed(3)} m/s`, 450, 380)

      // Update results
      setResults({ flowRate, headHeight, orificeDiameter })
      addObservation({
        headHeight: headHeight.toFixed(2),
        flowRate: flowRate.toFixed(2),
        discharge: discCoeff.toFixed(2),
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
          Observe how jet trajectory changes with head height and orifice diameter. Water is collected in the bottom tank.
        </p>
      </div>
    </motion.div>
  )
}

export default OrificeSim
