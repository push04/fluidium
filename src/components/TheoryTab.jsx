import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

const theoryContent = {
  Bernoulli: {
    objective: 'To verify Bernoulli\'s principle and understand energy conservation in flowing fluids.',
    theory: 'Bernoulli\'s equation: P + ½ρv² + ρgh = constant. This principle demonstrates energy conservation in fluid flow.',
    formula: 'P₁/ρg + v₁²/2g + z₁ = P₂/ρg + v₂²/2g + z₂',
    procedure: 'Adjust flow velocity and pipe height using the controls. Observe pressure and velocity changes.',
  },
  Reynolds: {
    objective: 'To study the transition of flow regimes from laminar to turbulent.',
    theory: 'Reynolds number (Re) predicts flow patterns. Re < 2300 = Laminar, Re > 4000 = Turbulent.',
    formula: 'Re = ρvD/μ = vD/ν',
    procedure: 'Increase flow rate gradually and observe flow regime transition.',
  },
  Venturi: {
    objective: 'To measure fluid discharge using the Venturi meter principle.',
    theory: 'Venturi meter exploits Bernoulli\'s principle to measure flow rate using pressure difference.',
    formula: 'Q = C × A₂ × √(2Δh × A₁² / (A₁² - A₂²))',
    procedure: 'Adjust inlet/throat diameter and observe pressure changes.',
  },
  Orifice: {
    objective: 'To measure fluid discharge through orifice.',
    theory: 'Flow through an orifice with discharge coefficient Cd.',
    formula: 'Q = Cd × A × √(2gh)',
    procedure: 'Adjust head height and orifice diameter.',
  },
  Pitot: {
    objective: 'To measure local fluid velocity.',
    theory: 'Pitot tube measures velocity by converting kinetic energy to pressure.',
    formula: 'v = √(2Δp/ρ)',
    procedure: 'Observe dynamic pressure changes with flow velocity.',
  },
  Poiseuille: {
    objective: 'To study laminar pipe flow.',
    theory: 'Hagen-Poiseuille law describes laminar flow in pipes with parabolic velocity profile.',
    formula: 'v(r) = (Δp/4μL)(R² - r²)',
    procedure: 'Observe parabolic velocity profile in laminar flow.',
  },
  Notch: {
    objective: 'To measure discharge over weirs and notches.',
    theory: 'Flow over weirs creates pressure-based flow measurement.',
    formula: 'Q = C × (2/3) × b × √(2g) × H^(3/2)',
    procedure: 'Adjust head height and compare different notch types.',
  },
  DragLift: {
    objective: 'To study forces on immersed objects.',
    theory: 'Drag and lift forces depend on velocity and fluid properties.',
    formula: 'F = ½ × ρ × v² × C × A',
    procedure: 'Observe how forces change with velocity.',
  },
  Hydrostatic: {
    objective: 'To study pressure distribution on submerged surfaces.',
    theory: 'Pressure increases with depth: P = ρgh.',
    formula: 'P = ρgh, F = ρgh_c × A',
    procedure: 'Observe pressure distribution and center of pressure.',
  },
  HydraulicJump: {
    objective: 'To observe energy dissipation in open channel flow.',
    theory: 'Hydraulic jump occurs when supercritical flow transitions to subcritical.',
    formula: 'y₂/y₁ = (1/2) × (√(1 + 8Fr²) - 1)',
    procedure: 'Observe the jump when Froude number transitions.',
  },
}

function TheoryTab() {
  const { selectedExperiment } = useAppContext()
  const [activeTab, setActiveTab] = useState('objective')

  const content = theoryContent[selectedExperiment] || {}
  const tabs = ['objective', 'theory', 'formula', 'procedure']

  const tabIcons = {
    objective: 'fa-target',
    theory: 'fa-book',
    formula: 'fa-function',
    procedure: 'fa-list-check',
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto pb-2"
      >
        {tabs.map(tab => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold capitalize transition whitespace-nowrap text-sm ${
              activeTab === tab
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            <i className={`fas ${tabIcons[tab]} mr-2`}></i>
            {tab}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 text-gray-700 text-sm leading-relaxed font-medium min-h-[150px]"
        >
          {content[activeTab] || 'No content available'}
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="border-t border-gray-200 mt-6 pt-4 flex items-center gap-2 text-xs text-gray-600"
      >
        <i className="fas fa-lightbulb text-yellow-500"></i>
        <span>Comprehensive theory and procedural guidelines</span>
      </motion.div>
    </motion.section>
  )
}

export default TheoryTab
