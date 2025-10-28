import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

const experimentCategories = {
  'Fluid Mechanics': [
    { id: 'Bernoulli', label: "Bernoulli's Theorem", icon: 'fa-water' },
    { id: 'Venturi', label: 'Venturi Meter', icon: 'fa-pipe' },
    { id: 'Reynolds', label: "Reynold's Experiment", icon: 'fa-chart-line' },
    { id: 'Orifice', label: 'Orifice & Mouthpiece', icon: 'fa-circle-notch' },
    { id: 'Notch', label: 'Notch / Weir Flow', icon: 'fa-arrow-down' },
    { id: 'Poiseuille', label: 'Hagen–Poiseuille (Capillary)', icon: 'fa-capsules' },
    { id: 'Pitot', label: 'Pitot Tube', icon: 'fa-gauge' },
    { id: 'DragLift', label: 'Drag & Lift', icon: 'fa-wind' },
    { id: 'Hydrostatic', label: 'Hydrostatic Pressure', icon: 'fa-compress' },
    { id: 'HydraulicJump', label: 'Hydraulic Jump', icon: 'fa-water' },
  ],
}

function Sidebar() {
  const { selectedExperiment, setExperiment, sidebarOpen, toggleSidebar } = useAppContext()
  const [expandedCategory, setExpandedCategory] = useState('Fluid Mechanics')

  const sidebarVariants = {
    hidden: { x: -320, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -320, opacity: 0 },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  const handleSelectExperiment = (experimentId) => {
    setExperiment(experimentId)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate={sidebarOpen ? 'visible' : 'hidden'}
        transition={{ duration: 0.3 }}
        className="fixed lg:static w-80 bg-gradient-to-br from-white to-indigo-50 h-screen lg:h-[calc(100vh-64px)] border-r border-indigo-200 flex flex-col shadow-2xl lg:shadow-none z-40"
      >
        {/* Sidebar Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="px-6 py-6 border-b border-indigo-200"
        >
          <h2 className="text-lg font-bold text-indigo-700 flex items-center gap-2">
            <i className="fas fa-flask-vial"></i>
            Experiments
          </h2>
        </motion.div>

        {/* Experiments List */}
        <motion.div
          className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {Object.entries(experimentCategories).map(([category, experiments]) => (
            <motion.div
              key={category}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <button
                onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold transition duration-200"
              >
                <span>{category}</span>
                <motion.i
                  animate={{ rotate: expandedCategory === category ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="fas fa-chevron-down"
                />
              </button>

              <AnimatePresence>
                {expandedCategory === category && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 space-y-2 overflow-hidden"
                  >
                    {experiments.map((experiment, idx) => (
                      <motion.button
                        key={experiment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleSelectExperiment(experiment.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition duration-200 flex items-center gap-3 ${
                          selectedExperiment === experiment.id
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'text-indigo-700 hover:bg-indigo-100'
                        }`}
                      >
                        <i className={`fas ${experiment.icon} w-4`}></i>
                        <span>{experiment.label}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Sidebar Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="px-4 py-6 border-t border-indigo-200 space-y-3"
        >
          <button className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200">
            <i className="fas fa-download mr-2"></i>
            Export Data
          </button>
          <button className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-200">
            <i className="fas fa-cog mr-2"></i>
            Settings
          </button>
        </motion.div>
      </motion.aside>
    </>
  )
}

export default Sidebar
