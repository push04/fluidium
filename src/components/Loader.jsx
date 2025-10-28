import React from 'react'
import { motion } from 'framer-motion'

function Loader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-block mb-8"
        >
          <i className="fas fa-flask text-8xl text-indigo-600"></i>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-4"
        >
          Fluidium
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-600 mb-12"
        >
          Virtual Engineering Lab
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-2 mb-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-12 bg-indigo-600 rounded-full"
              animate={{ height: [48, 64, 48] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 font-medium"
        >
          <p className="mb-2">Initializing Simulation Engine...</p>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="inline-block"
          >
            <span className="text-indigo-600">●</span>
            <span className="text-indigo-600 ml-1">●</span>
            <span className="text-indigo-600 ml-1">●</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Loader
