import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

function GraphPanel() {
  const { selectedExperiment, parameters } = useAppContext()
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const data = []
    for (let i = 0; i <= 10; i++) {
      data.push({
        position: (i / 10 * 10).toFixed(1),
        value1: (Math.random() * 10 + 5).toFixed(2),
        value2: (Math.random() * 8 + 3).toFixed(2),
        value3: (Math.random() * 6 + 2).toFixed(2),
      })
    }
    setChartData(data)
  }, [selectedExperiment, parameters])

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card flex flex-col"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border-b border-gray-200 pb-4 mb-6 flex items-center justify-between"
      >
        <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
          <i className="fas fa-chart-line"></i>
          Results & Analysis
        </h2>
      </motion.div>

      {chartData.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1"
        >
          <div className="h-80 flex items-end justify-around gap-2 px-4">
            {chartData.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ height: 0 }}
                animate={{ height: `${(parseFloat(item.value1) / 15) * 100}%` }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg hover:from-indigo-700 hover:to-indigo-500 transition cursor-pointer"
                title={`Value: ${item.value1}`}
              />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
            <div className="bg-indigo-50 p-3 rounded-lg">
              <p className="text-gray-600">Max Value</p>
              <p className="text-lg font-bold text-indigo-600">{Math.max(...chartData.map(d => parseFloat(d.value1))).toFixed(2)}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-gray-600">Avg Value</p>
              <p className="text-lg font-bold text-purple-600">{(chartData.reduce((sum, d) => sum + parseFloat(d.value1), 0) / chartData.length).toFixed(2)}</p>
            </div>
            <div className="bg-pink-50 p-3 rounded-lg">
              <p className="text-gray-600">Min Value</p>
              <p className="text-lg font-bold text-pink-600">{Math.min(...chartData.map(d => parseFloat(d.value1))).toFixed(2)}</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex items-center justify-center h-80 text-gray-500">
          <div className="text-center">
            <i className="fas fa-chart-line text-4xl mb-4 opacity-50"></i>
            <p className="font-medium">No data available</p>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="border-t border-gray-200 mt-6 pt-4 text-xs text-gray-600 flex items-center gap-2"
      >
        <i className="fas fa-info-circle text-indigo-600"></i>
        <span>Real-time data visualization based on current parameters</span>
      </motion.div>
    </motion.section>
  )
}

export default GraphPanel
