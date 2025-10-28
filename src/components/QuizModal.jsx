import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

const quizzes = {
  Bernoulli: [
    {
      id: 1,
      question: "What does Bernoulli's principle state about energy in flowing fluids?",
      options: [
        'Energy is lost as heat in the fluid',
        'Mechanical energy is conserved along a streamline',
        'Energy increases with pressure',
        'Energy is independent of velocity',
      ],
      correct: 1,
      explanation: 'Bernoulli\'s principle states that the total mechanical energy (pressure + kinetic + potential) remains constant along a streamline in ideal fluid flow.',
    },
    {
      id: 2,
      question: 'If velocity of a fluid increases in a pipe, what happens to pressure?',
      options: [
        'Pressure increases',
        'Pressure decreases',
        'Pressure remains constant',
        'Pressure becomes zero',
      ],
      correct: 1,
      explanation: 'According to Bernoulli\'s equation, when velocity increases, pressure decreases, and vice versa, to maintain constant total energy.',
    },
    {
      id: 3,
      question: 'The total head in Bernoulli equation includes which components?',
      options: [
        'Only pressure head',
        'Pressure head + velocity head',
        'Pressure head + velocity head + elevation head',
        'Only elevation head',
      ],
      correct: 2,
      explanation: 'Total head = Pressure head (P/ρg) + Velocity head (v²/2g) + Elevation head (z).',
    },
    {
      id: 4,
      question: 'In a horizontal pipe with decreasing diameter, how does velocity change?',
      options: [
        'Decreases proportionally',
        'Increases proportionally',
        'Remains constant',
        'Becomes zero',
      ],
      correct: 1,
      explanation: 'By continuity equation, A₁v₁ = A₂v₂. When area decreases, velocity must increase.',
    },
    {
      id: 5,
      question: 'What is dynamic pressure in fluid flow?',
      options: [
        'Pressure due to fluid weight',
        'Pressure due to fluid motion (½ρv²)',
        'Pressure of stagnant fluid',
        'Atmospheric pressure',
      ],
      correct: 1,
      explanation: 'Dynamic pressure (½ρv²) is the pressure resulting from fluid motion and kinetic energy.',
    },
  ],
  Reynolds: [
    {
      id: 1,
      question: 'What does Reynolds number characterize?',
      options: [
        'Fluid viscosity only',
        'Flow regime transition (laminar/turbulent)',
        'Pipe material strength',
        'Temperature of fluid',
      ],
      correct: 1,
      explanation: 'Reynolds number (Re) is a dimensionless number that predicts flow regimes.',
    },
    {
      id: 2,
      question: 'Laminar flow occurs when Reynolds number is:',
      options: [
        'Re < 2,300',
        'Re > 4,000',
        'Re = 3,000',
        'Re > 10,000',
      ],
      correct: 0,
      explanation: 'Laminar flow is characterized by Re < 2,300 where flow is smooth and orderly.',
    },
    {
      id: 3,
      question: 'In turbulent flow, dye injected into a stream:',
      options: [
        'Flows in a straight line',
        'Mixes rapidly throughout the flow',
        'Stays at the center',
        'Flows only on the surface',
      ],
      correct: 1,
      explanation: 'In turbulent flow, the chaotic mixing causes dye to distribute throughout the entire flow rapidly.',
    },
    {
      id: 4,
      question: 'Which formula correctly represents Reynolds number?',
      options: [
        'Re = ρ/v',
        'Re = ρvD/μ',
        'Re = P/ρ',
        'Re = v/D',
      ],
      correct: 1,
      explanation: 'Reynolds number is defined as Re = ρvD/μ, where ρ is density, v is velocity, D is diameter, and μ is dynamic viscosity.',
    },
    {
      id: 5,
      question: 'Transitional flow occurs in the range:',
      options: [
        '0 < Re < 2,300',
        '2,300 < Re < 4,000',
        'Re > 4,000',
        'Re < 0',
      ],
      correct: 1,
      explanation: 'Transitional flow is the intermediate regime between laminar and turbulent, approximately 2,300 < Re < 4,000.',
    },
    {
      id: 6,
      question: 'How does kinematic viscosity relate to dynamic viscosity?',
      options: [
        'ν = μ × ρ',
        'ν = μ / ρ',
        'ν = ρ / μ',
        'ν = μ + ρ',
      ],
      correct: 1,
      explanation: 'Kinematic viscosity ν = dynamic viscosity μ / density ρ.',
    },
  ],
  Venturi: [
    {
      id: 1,
      question: 'What is the primary principle used by a Venturi meter?',
      options: [
        'Archimedes\' principle',
        'Bernoulli\'s principle',
        'Pascal\'s principle',
        'Stokes\' law',
      ],
      correct: 1,
      explanation: 'A Venturi meter uses Bernoulli\'s principle to measure flow by creating a pressure difference.',
    },
    {
      id: 2,
      question: 'In a Venturi tube, when the cross-sectional area decreases:',
      options: [
        'Velocity decreases and pressure increases',
        'Velocity increases and pressure decreases',
        'Both velocity and pressure increase',
        'Both velocity and pressure decrease',
      ],
      correct: 1,
      explanation: 'As area decreases (by continuity), velocity increases, and by Bernoulli, pressure decreases.',
    },
    {
      id: 3,
      question: 'The discharge coefficient of an ideal Venturi meter is approximately:',
      options: [
        '0.5',
        '0.75',
        '0.98-0.99',
        '1.2',
      ],
      correct: 2,
      explanation: 'Well-designed Venturi meters have discharge coefficients of 0.98-0.99, very close to the theoretical value of 1.0.',
    },
    {
      id: 4,
      question: 'What is an advantage of Venturi meters?',
      options: [
        'Low cost',
        'Easy installation',
        'Minimal energy loss (recovers ~80% of pressure)',
        'Requires frequent maintenance',
      ],
      correct: 2,
      explanation: 'Venturi meters have the advantage of recovering approximately 80% of the pressure drop, making them energy-efficient.',
    },
  ],
  Pitot: [
    {
      id: 1,
      question: 'A Pitot tube measures velocity by:',
      options: [
        'Converting kinetic energy to pressure energy at stagnation point',
        'Measuring friction in the pipe',
        'Calculating fluid density',
        'Determining viscosity',
      ],
      correct: 0,
      explanation: 'A Pitot tube works by bringing fluid to rest (stagnation), converting kinetic energy to pressure energy.',
    },
    {
      id: 2,
      question: 'The dynamic pressure measured by a Pitot tube is:',
      options: [
        'P_static + P_stagnation',
        'P_stagnation - P_static',
        'P_static × velocity',
        'P_stagnation / 2',
      ],
      correct: 1,
      explanation: 'Dynamic pressure = P_stagnation - P_static = ½ρv².',
    },
    {
      id: 3,
      question: 'What is a limitation of Pitot tubes?',
      options: [
        'Very expensive',
        'Sensitive to flow direction',
        'Cannot measure liquid flow',
        'Requires large installation space',
      ],
      correct: 1,
      explanation: 'Pitot tubes are sensitive to flow direction and require careful alignment with the flow for accurate measurements.',
    },
  ],
}

function QuizModal({ onClose }) {
  const { selectedExperiment } = useAppContext()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [answers, setAnswers] = useState([])

  const quiz = quizzes[selectedExperiment] || []

  const handleAnswer = (idx) => {
    setSelectedAnswer(idx)
    setAnswers([
      ...answers,
      {
        questionId: quiz[currentQuestion].id,
        selected: idx,
        correct: quiz[currentQuestion].correct,
        isCorrect: idx === quiz[currentQuestion].correct,
      },
    ])

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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  }

  const questionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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
          <p className="text-indigo-100 mt-2">
            {selectedExperiment} - Test your knowledge
          </p>
        </motion.div>

        {/* Content */}
        <div className="p-8">
          {!showResults ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                variants={questionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Progress Bar */}
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

                {/* Question */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    {quiz[currentQuestion]?.question}
                  </h3>

                  {/* Options */}
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
                            : 'bg-indigo-50 border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-400'
                        } ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span>{option}</span>
                        {answered && idx === quiz[currentQuestion].correct && (
                          <i className="fas fa-check ml-auto text-green-600 text-lg"></i>
                        )}
                        {answered && selectedAnswer === idx && idx !== quiz[currentQuestion].correct && (
                          <i className="fas fa-times ml-auto text-red-600 text-lg"></i>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Explanation */}
                <AnimatePresence>
                  {answered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg mb-6 ${
                        selectedAnswer === quiz[currentQuestion].correct
                          ? 'bg-green-50 border-l-4 border-green-500 text-green-700'
                          : 'bg-red-50 border-l-4 border-red-500 text-red-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <i className={`fas ${selectedAnswer === quiz[currentQuestion].correct ? 'fa-lightbulb' : 'fa-info-circle'} mt-1`}></i>
                        <div>
                          <p className="font-bold mb-1">
                            {selectedAnswer === quiz[currentQuestion].correct ? 'Correct!' : 'Incorrect!'}
                          </p>
                          <p className="text-sm">{quiz[currentQuestion]?.explanation}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                {answered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNext}
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
                    >
                      {currentQuestion + 1 === quiz.length ? (
                        <>
                          <i className="fas fa-flag-checkered"></i>
                          Finish Quiz
                        </>
                      ) : (
                        <>
                          <i className="fas fa-arrow-right"></i>
                          Next Question
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            /* Results Section */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="inline-block mb-6"
              >
                {score >= quiz.length * 0.8 ? (
                  <i className="fas fa-trophy text-6xl text-yellow-500"></i>
                ) : score >= quiz.length * 0.6 ? (
                  <i className="fas fa-star text-6xl text-blue-500"></i>
                ) : (
                  <i className="fas fa-book-open text-6xl text-gray-400"></i>
                )}
              </motion.div>

              <h3 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h3>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <p className="text-6xl font-bold gradient-text mb-2">
                  {calculatePercentage()}%
                </p>
                <p className="text-xl text-gray-700">
                  You scored <span className="font-bold text-indigo-600">{score} out of {quiz.length}</span> questions
                </p>
              </motion.div>

              {/* Performance Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-indigo-50 rounded-lg p-6 mb-8 text-left"
              >
                <p className="text-gray-700">
                  {score >= quiz.length * 0.8
                    ? '🎉 Excellent work! You have a strong understanding of the concepts.'
                    : score >= quiz.length * 0.6
                    ? '👍 Good effort! Review the concepts to strengthen your knowledge.'
                    : '📚 Keep practicing! Go through the theory section to improve.'}
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setCurrentQuestion(0)
                    setScore(0)
                    setAnswered(false)
                    setSelectedAnswer(null)
                    setShowResults(false)
                    setAnswers([])
                  }}
                  className="w-full py-3 px-6 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  <i className="fas fa-redo"></i>
                  Retake Quiz
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-full py-3 px-6 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition"
                >
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default QuizModal
