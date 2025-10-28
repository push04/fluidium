import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

const controlConfigs = {
  Bernoulli: [
    { id: 'flowVelocity', label: 'Flow Velocity (m/s)', min: 0.1, max: 10, step: 0.1, default: 2, unit: 'm/s', description: 'Velocity of fluid flow' },
    { id: 'pipeHeight', label: 'Pipe Height (m)', min: 0, max: 5, step: 0.1, default: 2, unit: 'm', description: 'Height of pipe section' },
    { id: 'fluidDensity', label: 'Fluid Density (kg/m³)', min: 500, max: 1500, step: 10, default: 1000, unit: 'kg/m³', description: 'Density of working fluid' },
  ],
  Venturi: [
    { id: 'flowRate', label: 'Flow Rate (L/min)', min: 1, max: 100, step: 1, default: 30, unit: 'L/min', description: 'Volumetric flow rate' },
    { id: 'inletDiameter', label: 'Inlet Diameter (mm)', min: 10, max: 100, step: 5, default: 50, unit: 'mm', description: 'Diameter at inlet' },
    { id: 'throatDiameter', label: 'Throat Diameter (mm)', min: 5, max: 50, step: 2, default: 25, unit: 'mm', description: 'Diameter at throat' },
    { id: 'fluidType', label: 'Fluid Type', type: 'select', options: ['Water', 'Honey', 'Oil', 'Mercury'], default: 'Water', description: 'Type of working fluid' },
  ],
  Reynolds: [
    { id: 'flowRate', label: 'Flow Rate (L/min)', min: 0.5, max: 50, step: 0.5, default: 10, unit: 'L/min', description: 'Volumetric flow rate' },
    { id: 'pipeDiameter', label: 'Pipe Diameter (mm)', min: 5, max: 50, step: 1, default: 20, unit: 'mm', description: 'Internal pipe diameter' },
    { id: 'viscosity', label: 'Viscosity (cP)', min: 0.1, max: 100, step: 0.5, default: 1, unit: 'cP', description: 'Dynamic viscosity' },
    { id: 'temperature', label: 'Temperature (°C)', min: 0, max: 100, step: 5, default: 20, unit: '°C', description: 'Fluid temperature' },
  ],
  Orifice: [
    { id: 'headHeight', label: 'Head Height (m)', min: 0.1, max: 5, step: 0.1, default: 2, unit: 'm', description: 'Height of fluid column' },
    { id: 'orificediameter', label: 'Orifice Diameter (mm)', min: 5, max: 50, step: 1, default: 20, unit: 'mm', description: 'Diameter of orifice' },
    { id: 'coefficientDischarge', label: 'Discharge Coefficient', min: 0.5, max: 1, step: 0.05, default: 0.75, unit: 'dimensionless', description: 'Flow rate correction factor' },
  ],
  Pitot: [
    { id: 'flowVelocity', label: 'Flow Velocity (m/s)', min: 0.1, max: 10, step: 0.1, default: 2, unit: 'm/s', description: 'Velocity of fluid' },
    { id: 'fluidDensity', label: 'Fluid Density (kg/m³)', min: 500, max: 1500, step: 10, default: 1000, unit: 'kg/m³', description: 'Density of fluid' },
    { id: 'tubePressure', label: 'Tube Pressure (Pa)', min: 0, max: 50000, step: 1000, default: 10000, unit: 'Pa', description: 'Pressure in Pitot tube' },
  ],
}

function ControlPanel() {
  const { selectedExperiment, parameters, updateParameters, resetExperiment } = useAppContext()
  const [localParams, setLocalParams] = useState({})
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [tooltipActive, setTooltipActive] = useState(null)

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

  const handleSelectChange = (id, value) => {
    const updatedParams = { ...localParams, [id]: value }
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
  const basicControls = config.slice(0, 3)
  const advancedControls = config.slice(3)

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="card flex flex-col"
    >
      {/* Header */}
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition"
          title="Toggle Advanced Options"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced
        </motion.button>
      </motion.div>

      {/* Controls Container */}
      <motion.div
        className="flex-1 overflow-y-auto space-y-6 max-h-[450px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Basic Controls */}
        {basicControls.map((ctrl, idx) => (
          <motion.div
            key={ctrl.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                {ctrl.label}
                <button
                  onMouseEnter={() => setTooltipActive(ctrl.id)}
                  onMouseLeave={() => setTooltipActive(null)}
                  className="text-gray-400 hover:text-gray-600 relative group"
                >
                  <i className="fas fa-info-circle text-xs"></i>
                  {tooltipActive === ctrl.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full left-0 bg-gray-800 text-white text-xs rounded p-2 w-32 mb-2 z-50"
                    >
                      {ctrl.description}
                    </motion.div>
                  )}
                </button>
              </label>
              <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded">
                {(localParams[ctrl.id] || ctrl.default).toFixed(2)} {ctrl.unit}
              </span>
            </div>

            {ctrl.type === 'select' ? (
              <select
                value={localParams[ctrl.id] || ctrl.default}
                onChange={e => handleSelectChange(ctrl.id, e.target.value)}
                className="w-full px-4 py-2 border-2 border-indigo-200 rounded-lg
