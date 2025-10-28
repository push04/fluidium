import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

const quizzes = {
  Bernoulli: [
    { id: 1, question: "What does Bernoulli's principle state?", options: ['Energy is lost', 'Energy is conserved along streamline', 'Pressure is constant'], correct: 1 },
    { id: 2, question: 'If velocity increases, pressure:', options: ['Increases', 'Decreases', 'Stays same'], correct: 1 },
    { id: 3, question: 'Total head includes:', options: ['Only pressure', 'Pressure + velocity + elevation', 'Only velocity'], correct: 1 },
    { id: 4, question: 'In horizontal pipe flow:', options: ['Height varies', 'Height is constant', 'Height increases'], correct: 1 },
    { id: 5, question: 'Dynamic pressure is:', options: ['P total', '½ρv²', 'P static'], correct: 1 },
  ],
  Reynolds: [
    { id: 1, question: 'What does Reynolds number characterize?', options: ['Viscosity', 'Flow regime', 'Density'], correct: 1 },
    { id: 2, question: 'Laminar flow occurs when Re:', options: ['< 2300', '> 4000', '= 3000'], correct: 0 },
    { id: 3, question: 'In turbulent flow, dye:', options: ['Flows straight', 'Mixes rapidly', 'Stays at center'], correct: 1 },
    { id: 4, question: 'Transitional flow range:', options: ['0-2300', '2300-4000', '> 4000'], correct: 1 },
    { id: 5, question: 'Kinematic viscosity ν equals:', options: ['μ × ρ', 'μ / ρ', 'ρ / μ'], correct: 1 },
  ],
}

function QuizModal({ onClose }) {
  const { selectedExperiment } = useAppContext()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const quiz = quizzes[selectedExperiment] || []

  const handleAnswer = (idx) => {
    setSelectedAnswer(idx)
    if (idx === quiz[currentQuestion].correct) {
      setScore(score + 1)
    }
    setAnswered(true)
  }

  const handleNext = () => {
    if (currentQuestion + 1 < quiz.length) {
      setCurrentQuestion(currentQuestion + 1)
      setAnswered(false)
      setSelectedAnswer(null)
    } else {
      setShowResults(true)
    }
  }

  const calculatePercentage = () => {
    return quiz.length > 0 ? ((score / quiz.length) * 100).toFixed(1) : 0
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 sticky top-0 z-10"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <i className="fas fa-brain"></i>
              Quiz Challenge
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-white text-2xl hover:text-gray-200 transition"
            >
              <i className="fas fa-times"></i>
            </motion.button>
          </div>
        </motion.div>

        <div className="p-8">
          {!showResults ? (
            <>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Question {currentQuestion + 1} of {quiz.length}
                  </span>
                  <span className="text-sm font-bold text-indigo-600">
                    {((currentQuestion / quiz.length) * 100).toFixed(0)}%
                  </span>
                </div>
                <motion.div
                  className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                    animate={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  {quiz[currentQuestion]?.question}
                </h3>

                <div className="space-y-3">
                  {quiz[currentQuestion]?.options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(idx)}
                      disabled={answered}
                      className={`w-full px-6 py-4 rounded-lg font-medium transition text-left flex items-center gap-4 ${
                        selectedAnswer === idx
                          ? idx === quiz[currentQuestion].correct
                            ? 'bg-green-100 border-2 border-green-500 text-green-700'
                            : 'bg-red-100 border-2 border-red-500 text-red-700'
                          : answered
                          ? idx === quiz[currentQuestion].correct
                            ? 'bg-green-100 border-2 border-green-500 text-green-700'
                            : 'bg-gray-100 border-2 border-gray-300 text-gray-700'
                          : 'bg-indigo-50 border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                      } ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span>{option}</span>
                      {answered && idx === quiz[currentQuestion].correct && (
                        <i className="fas fa-check ml-auto text-green-600 text-lg"></i>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    {currentQuestion + 1 === quiz.length ? 'Finish' : 'Next'} <i className="fas fa-arrow-right"></i>
                  </motion.button>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <i className="fas fa-trophy text-6xl text-yellow-500 mb-4 block"></i>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h3>
              <p className="text-6xl font-bold gradient-text mb-2">{calculatePercentage()}%</p>
              <p className="text-xl text-gray-700 mb-8">
                You scored <span className="font-bold text-indigo-600">{score} out of {quiz.length}</span>
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full py-3 px-6 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
              >
                Close
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default QuizModal
