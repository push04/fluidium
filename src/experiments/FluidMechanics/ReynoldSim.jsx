import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../../context/AppContext'
import { calculateReynoldsNumber, getFlowRegime } from '../../utils/simulationMath'

function ReynoldSim({ canvasRef }) {
  const { parameters, setResults, addObservation } = useAppContext()
  const animationRef = useRef(null)
  const [isAnimating, setIsAnimating] = useState(true)
  const canvasCtxRef = useRef(null)
  const streamlineDataRef = useRef([])
  const timeRef = useRef(0)

  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 400
  const PIPE_X = 100
  const PIPE_Y = 150
  const PIPE_LENGTH = 600
  const PIPE_WIDTH = 100

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
      const viscosity = (parameters.viscosity || 1) * 0.001
      const density = 1000

      // Calculate Reynolds number
      const velocity = (flowRate * 0.001) / (60 * Math.PI * (diameter / 2) ** 2)
      const re = calculateReynoldsNumber(velocity, parameters.pipeDiameter || 20, parameters.viscosity || 1, density)
      const flowRegime = getFlowRegime(re)

      // Draw pipe
      ctx.fillStyle = '#dbeafe'
      ctx.strokeStyle = '#0284c7'
      ctx.lineWidth = 3
      ctx.fillRect(PIPE_X, PIPE_Y - PIPE_WIDTH / 2, PIPE_LENGTH, PIPE_WIDTH)
      ctx.strokeRect(PIPE_X, PIPE_Y - PIPE_WIDTH / 2, PIPE_LENGTH, PIPE_WIDTH)

      // Draw inlet and outlet
      ctx.fillStyle = '#0284c7'
      ctx.fillRect(PIPE_X - 20, PIPE_Y - PIPE_WIDTH / 2, 20, PIPE_WIDTH)
      ctx.fillRect(PIPE_X + PIPE_LENGTH, PIPE_Y - PIPE_WIDTH / 2, 20, PIPE_WIDTH)

      // Visualize flow pattern based on regime
      if (re < 2300) {
        // Laminar flow - straight streamlines
        ctx.strokeStyle = '#10b981'
        ctx.lineWidth = 2
        for (let y = PIPE_Y - PIPE_WIDTH / 2 + 10; y < PIPE_Y + PIPE_WIDTH / 2; y += 10) {
          ctx.beginPath()
          ctx.moveTo(PIPE_X, y)
          ctx.lineTo(PIPE_X + PIPE_LENGTH, y)
          ctx.stroke()
        }

        // Draw dye stream
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 3
        ctx.globalAlpha = 0.6
        ctx.beginPath()
        ctx.moveTo(PIPE_X, PIPE_Y - 10)
        ctx.lineTo(PIPE_X + PIPE_LENGTH, PIPE_Y - 10)
        ctx.stroke()
        ctx.globalAlpha = 1
      } else if (re <= 4000) {
        // Transitional flow - wavy streamlines
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 2
        for (let y = PIPE_Y - PIPE_WIDTH / 2 + 10; y < PIPE_Y + PIPE_WIDTH / 2; y += 10) {
          ctx.beginPath()
          for (let x = PIPE_X; x < PIPE_X + PIPE_LENGTH; x += 10) {
            const wave = Math.sin((x + timeRef.current * 100) / 50) * 5
            ctx.lineTo(x, y + wave)
          }
          ctx.stroke()
        }

        // Turbulent dye - mixing
        ctx.fillStyle = '#f59e0b'
        ctx.globalAlpha = 0.4
        for (let i = 0; i < 20; i++) {
          const x = PIPE_X + ((timeRef.current * 100 + i * 30) % PIPE_LENGTH)
          const y = PIPE_Y + (Math.sin(timeRef.current * 5 + i) * PIPE_WIDTH / 3)
          ctx.beginPath()
          ctx.arc(x, y, 3, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
      } else {
        // Turbulent flow - chaotic mixing
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.4

        for (let i = 0; i < 50; i++) {
          const x = PIPE_X + Math.random() * PIPE_LENGTH
          const y = PIPE_Y - PIPE_WIDTH / 2 + Math.random() * PIPE_WIDTH
          const size = Math.random() * 4 + 2

          ctx.fillStyle = '#ef4444'
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1

        // Draw wavy, chaotic streamlines
        for (let y = PIPE_Y - PIPE_WIDTH / 2 + 15; y < PIPE_Y + PIPE_WIDTH / 2; y += 15) {
          ctx.beginPath()
          for (let x = PIPE_X; x < PIPE_X + PIPE_LENGTH; x += 5) {
            const chaos = (Math.sin(x / 20 + timeRef.current * 2) * Math.cos(y / 15) * 8)
            ctx.lineTo(x, y + chaos)
          }
          ctx.stroke()
        }
      }

      // Draw velocity profile (parabolic for laminar, flatter for turbulent)
      const profileX = PIPE_X + PIPE_LENGTH / 2
      ctx.strokeStyle = '#6366f1'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(profileX, PIPE_Y - PIPE_WIDTH / 2)

      for (let dy = -PIPE_WIDTH / 2; dy <= PIPE_WIDTH / 2; dy += 2) {
        let profileWidth
        if (re < 2300) {
          // Parabolic profile for laminar
          profileWidth = 50 * (1 - ((2 * dy) / PIPE_WIDTH) ** 2)
        } else if (re > 4000) {
          // Flatter profile for turbulent
          profileWidth = 50 * (1 - Math.abs((2 * dy) / PIPE_WIDTH) ** (1 / 7))
        } else {
          // Intermediate
          profileWidth = 50 * (1 - Math.abs((2 * dy) / PIPE_WIDTH) ** 0.5)
        }
        ctx.lineTo(profileX + profileWidth, PIPE_Y + dy)
      }
      ctx.stroke()

      // Draw legend and data
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 14px Arial'
      ctx.fillText('Reynolds Number Experiment', 20, 30)

      ctx.font = '12px Arial'
      ctx.fillStyle = flowRegime.color
      ctx.fillText(`Flow Regime: ${flowRegime.regime}`, 20, 340)
      ctx.fillText(flowRegime.description, 20, 360)

      ctx.fillStyle = '#1f2937'
      ctx.fillText(`Re = ${re.toFixed(0)}`, 350, 340)
      ctx.fillText(`Velocity = ${velocity.toFixed(3)} m/s`, 350, 360)
      ctx.fillText(`Temperature = ${parameters.temperature || 20}°C`, 350, 380)

      // Update results
      setResults({ reynoldsNumber: re, flowRegime: flowRegime.regime, velocity })
      addObservation({
        flowRate,
        reynoldsNumber: re,
        regime: flowRegime.regime,
        velocity: velocity.toFixed(4),
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
          Observe the flow pattern change from laminar (organized) to turbulent (chaotic) as you increase flow rate or decrease viscosity.
        </p>
      </div>
    </motion.div>
  )
}

export default ReynoldSim
