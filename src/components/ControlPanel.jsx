import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

const controlConfigs = {
  Bernoulli: [
    { id: 'flowVelocity', label: 'Flow Velocity (m/s)', min: 0.1, max: 10, step: 0.1, default: 2 },
    { id: 'pipeHeight', label: 'Pipe Height (m)', min: 0, max: 5, step: 0.1, default: 2 },
    { id: 'fluidDensity', label: 'Fluid Density (kg/m³)', min: 500, max: 1500, step: 10, default: 1000 },
  ],
  Venturi: [
    { id: 'flowRate', label: 'Flow Rate (L/min)', min: 1, max: 100, step: 1, default: 30 },
    { id: 'inletDiameter', label: 'Inlet Diameter (mm)', min: 10, max: 100, step: 5, default: 50 },
    { id: 'throatDiameter', label: 'Throat Diameter (mm)', min: 5, max: 50, step: 2, default: 25 },
  ],
  Reynolds: [
    { id: 'flowRate', label: 'Flow Rate (L/min)', min: 0.5, max: 50, step: 0.5, default: 10 },
    { id: 'pipeDiameter', label: 'Pipe Diameter (mm)', min: 5, max: 50, step: 1, default: 20 },
    { id: 'viscosity', label: 'Viscosity (cP)', min: 0.1, max: 100, step: 0.5, default: 1 },
  ],
  Orifice: [
    { id: 'headHeight', label: 'Head Height (m)', min: 0.1, max: 5, step: 0.1, default: 2 },
    { id: 'orificediameter', label: 'Orifice Diameter (mm)', min: 5, max: 50, step: 1, default: 20 },
  ],
  Pitot: [
    { id: 'flowVelocity', label: 'Flow Velocity (m/s)', min: 0.1, max: 10, step: 0.1, default: 2 },
    { id: 'fluidDensity', label: 'Fluid Density (kg/m³)', min: 500, max: 1500, step: 10, default: 1000 },
  ],
  Poiseuille: [
    { id: 'flowRate', label: 'Flow Rate (L/min)', min: 1, max: 50, step: 1, default: 10 },
    { id: 'pipeDiameter', label: 'Pipe Diameter (mm)', min: 5, max: 50, step: 1, default: 20 },
    { id: 'viscosity', label: 'Viscosity (cP)', min: 0.1, max: 100, step: 0.5, default: 1 },
  ],
  Notch: [
    { id: 'headHeight', label: 'Head Height (m)', min: 0.1, max: 2, step: 0.1, default: 1 },
  ],
  DragLift: [
    { id: 'flowVelocity', label: 'Flow Velocity (m/s)', min: 0.1, max: 10, step: 0.1, default: 2 },
    { id: 'fluidDensity', label: 'Fluid Density (kg/m³)', min: 500, max: 1500, step: 10, default: 1000 },
  ],
  Hydrostatic: [
    { id: 'fluidDepth', label: 'Fluid Depth (m)', min: 0.1, max: 5, step: 0.1, default: 2 },
    { id: 'fluidDensity', label: 'Fluid Density (kg/m³)', min: 500, max: 1500, step: 10, default: 1000 },
  ],
  HydraulicJump: [
    { id: 'pipeHeight', label: 'Channel Depth (m)', min: 0.1, max: 3, step: 0.1, default: 1 },
  ],
}

function ControlPanel() {
  const { selectedExperiment, parameters, updateParameters, resetExperiment } = useAppContext()
  const [localParams, setLocalParams] = useState({})
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    const config = controlConfigs[selectedExperiment] || []
    const defaults = {}
    config.forEach(ctrl => {
      defaults[ctrl.id] = ctrl.default
    })
    setLocalParams(defaults)
    updateParameters(defaults)
  }, [selectedExperiment, updateParameters])

  const handleSliderChange = (id, value) => {
    const numValue = parseFloat(value)
    const updatedParams = { ...localParams, [id]: numValue }
    setLocalParams(updatedParams)
    updateParameters(updatedParams)
  }

  const handleReset = () => {
    const config = controlConfigs[selectedExperiment] || []
    const defaults = {}
    config.forEach(ctrl => {
      defaults[ctrl.id] = ctrl.default
    })
    setLocalParams(defaults)
    updateParameters(defaults)
    resetExperiment()
  }

  const config = controlConfigs[selectedExperiment] || []

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="card flex flex-col"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border-b border-gray-200 pb-4 mb-6 flex items-center justify-between"
      >
        <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
          <i className="fas fa-sliders-h"></i>
          Control Panel
        </h2>
      </motion.div>

      <motion.div
        className="flex-1 overflow-y-auto space-y-6 max-h-[450px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {config.map((ctrl, idx) => (
          <motion.div
            key={ctrl.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-semibold text-gray-700">
                {ctrl.label}
              </label>
              <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded">
                {(localParams[ctrl.id] || ctrl.default).toFixed(2)}
              </span>
            </div>

            <input
              type="range"
              min={ctrl.min}
              max={ctrl.max}
              step={ctrl.step}
              value={localParams[ctrl.id] || ctrl.default}
              onChange={e => handleSliderChange(ctrl.id, e.target.value)}
              className="w-full h-2 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />

            <div className="flex justify-between text-xs text-gray-500">
              <span className="font-semibold">{ctrl.min}</span>
              <span className="font-semibold">{ctrl.max}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="border-t border-gray-200 mt-6 pt-6 flex gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition duration-200 flex items-center justify-center gap-2 text-sm"
        >
          <i className="fas fa-redo"></i>
          Reset All
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 py-3 px-4 bg-green-600 text-white font-bold rounded-lg hover:shadow-lg transition duration-200 flex items-center justify-center gap-2 text-sm"
        >
          <i className="fas fa-play"></i>
          Run
        </motion.button>
      </motion.div>
    </motion.section>
  )
}

export default ControlPanel
