import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import SimulationArea from './components/SimulationArea'
import ControlPanel from './components/ControlPanel'
import GraphPanel from './components/GraphPanel'
import DataTable from './components/DataTable'
import TheoryTab from './components/TheoryTab'
import QuizModal from './components/QuizModal'
import Loader from './components/Loader'
import { AppProvider } from './context/AppContext'

function App() {
  const [showQuiz, setShowQuiz] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    const hasVisited = localStorage.getItem('fluidium_visited')
    if (hasVisited) {
      setShowWelcome(false)
    }
  }, [])

  const handleWelcomeClose = () => {
    setShowWelcome(false)
    localStorage.setItem('fluidium_visited', 'true')
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <AppProvider>
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen font-sans overflow-x-hidden">
        <Navbar />

        <div className="flex min-h-[calc(100vh-64px)]">
          <Sidebar />

          <main className="flex-1 p-4 lg:p-6 flex flex-col gap-4 overflow-y-auto">
            <AnimatePresence>
              {showWelcome && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                  onClick={handleWelcomeClose}
                >
                  <motion.div
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 50 }}
                    className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="inline-block mb-4"
                      >
                        <i className="fas fa-flask text-6xl text-indigo-600"></i>
                      </motion.div>
                      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-4">
                        Welcome to Fluidium
                      </h1>
                      <p className="text-gray-600 text-lg mb-6">
                        Your Interactive Virtual Laboratory for Fluid Mechanics & Engineering Simulations
                      </p>
                      <div className="flex flex-col gap-3 text-left bg-indigo-50 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <i className="fas fa-check-circle text-green-500 mt-1"></i>
                          <span className="text-gray-700">10+ Interactive Experiments</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <i className="fas fa-check-circle text-green-500 mt-1"></i>
                          <span className="text-gray-700">Real-time Visualization & Data Analysis</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <i className="fas fa-check-circle text-green-500 mt-1"></i>
                          <span className="text-gray-700">Comprehensive Theory & Quizzes</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <i className="fas fa-check-circle text-green-500 mt-1"></i>
                          <span className="text-gray-700">Export Data & Results</span>
                        </div>
                      </div>
                      <button
                        onClick={handleWelcomeClose}
                        className="w-full py-3 px-6 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
                      >
                        Start Exploring <i className="fas fa-arrow-right ml-2"></i>
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              <SimulationArea />
              <ControlPanel />
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              <GraphPanel />
              <DataTable />
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-2"
            >
              <TheoryTab />
            </motion.section>
          </main>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowQuiz(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40"
          title="Take Quiz"
        >
          <i className="fas fa-question text-xl"></i>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-6 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40"
          title="Scroll to Top"
        >
          <i className="fas fa-arrow-up text-xl"></i>
        </motion.button>

        <AnimatePresence>
          {showQuiz && <QuizModal onClose={() => setShowQuiz(false)} />}
        </AnimatePresence>
      </div>
    </AppProvider>
  )
}

export default App
