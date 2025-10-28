import React from 'react'
import { motion } from 'framer-motion'

function Loader() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        {/* Animated Flask Icon */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="inline-block mb-8"
        >
          <i className="fas fa-flask text-8xl text-indigo-600"></i>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl font-bold gradient-text mb-4"
        >
          Fluidium
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-600 mb-12"
        >
          Virtual Engineering Lab
        </motion.p>

        {/* Loading Bars */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-2 mb-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-12 bg-indigo-600 rounded-full"
              animate={{
                height: [48, 64, 48],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>

        {/* Status Text */}
        <motion.div
          variants={itemVariants}
          className="text-gray-600 font-medium"
        >
          <p className="mb-2">Initializing Simulation Engine...</p>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="inline-block"
          >
            <span className="text-indigo-600">●</span>
            <span className="text-indigo-600">●</span>
            <span className="text-indigo-600">●</span>
          </motion.div>
        </motion.div>

        {/* Progress Info */}
        <motion.div
          variants={itemVariants}
          className="mt-12 text-sm text-gray-500"
        >
          <p>Loading assets and components...</p>
          <motion.div
            className="w-48 h-1 bg-gray-200 rounded-full mt-4 mx-auto overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2 }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Loader
