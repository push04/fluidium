import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

function SimulationArea() {
  const { selectedExperiment, simulationRunning } = useAppContext()
  const canvasRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [selectedExperiment])

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card min-h-[400px] lg:min-h-[500px] flex flex-col relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border-b border-gray-200 pb-4 mb-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h2 className="text-2xl font-bold text-indigo-700">
            {selectedExperiment} Simulation
          </h2>
        </div>
        {simulationRunning && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <i className="fas fa-cog text-indigo-600 text-xl"></i>
          </motion.div>
        )}
      </motion.div>

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-4"
            >
              <i className="fas fa-spinner text-indigo-600 text-4xl"></i>
            </motion.div>
            <p className="text-gray-600 font-medium">Loading Simulation...</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full max-w-full"
            style={{ display: 'block' }}
          />
          <div className="text-center text-indigo-500 font-bold">
            <i className="fas fa-vial text-4xl mb-2"></i>
            <p>Simulation visualization ready</p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="border-t border-gray-200 mt-4 pt-4 flex gap-2 justify-center flex-wrap"
      >
        <button className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center gap-2 text-sm">
          <i className="fas fa-play"></i>
          Start
        </button>
        <button className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-200 flex items-center gap-2 text-sm">
          <i className="fas fa-pause"></i>
          Pause
        </button>
        <button className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200 flex items-center gap-2 text-sm">
          <i className="fas fa-stop"></i>
          Stop
        </button>
        <button className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-200 flex items-center gap-2 text-sm">
          <i className="fas fa-redo"></i>
          Reset
        </button>
      </motion.div>
    </motion.section>
  )
}

export default SimulationArea
