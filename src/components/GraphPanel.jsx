import React, { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts'
import { useAppContext } from '../context/AppContext'

function GraphPanel() {
  const { selectedExperiment, parameters } = useAppContext()
  const [chartData, setChartData] = useState([])
  const [chartType, setChartType] = useState('line')

  const generateChartData = useMemo(() => {
    if (selectedExperiment === 'Bernoulli') {
      const data = []
      const positions = 11
      for (let i = 0; i < positions; i++) {
        const position = (i / (positions - 1)) * 10
        const velocity = (parameters.flowVelocity || 2) + (i * 0.1)
        const pressureHead = (parameters.pipeHeight || 2) - (i * 0.15)
        const velocityHead = (velocity ** 2) / (2 * 9.81)
        const totalHead = pressureHead + velocityHead

        data.push({
          position: position.toFixed(1),
          pressureHead: Math.max(0, pressureHead).toFixed(2),
          velocityHead: velocityHead.toFixed(2),
          totalHead: totalHead.toFixed(2),
        })
      }
      return data
    } else if (selectedExperiment === 'Reynolds') {
      const data = []
      const flowRates = 21
      for (let i = 0; i < flowRates; i++) {
        const flow = (i / (flowRates - 1)) * 50
        const diameter = (parameters.pipeDiameter || 20) / 1000
        const viscosity = (parameters.viscosity || 1) * 0.001
        const velocity = (flow * 0.001) / (60 * Math.PI * (diameter / 2) ** 2)
        const density = 1000
        const re = (density * velocity * diameter) / viscosity

        let regime = 'Laminar'
        if (re > 4000) regime = 'Turbulent'
        else if (re > 2300) regime = 'Transitional'

        data.push({
          flowRate: flow.toFixed(1),
          reynoldsNumber: re.toFixed(0),
          regime: regime,
        })
      }
      return data
    } else if (selectedExperiment === 'Venturi') {
      const data = []
      const rates = 15
      for (let i = 0; i < rates; i++) {
        const rate = (i / (rates - 1)) * 100
        const inletD = (parameters.inletDiameter || 50) / 1000
        const throatD = (parameters.throatDiameter || 25) / 1000
        const velocity1 = (rate * 0.001) / (60 * Math.PI * (inletD / 2) ** 2)
        const velocity2 = (rate * 0.001) / (60 * Math.PI * (throatD / 2) ** 2)
        const pressureDiff = (0.5 * 1000 * (velocity2 ** 2 - velocity1 ** 2)) / 1000

        data.push({
          flowRate: rate.toFixed(1),
          velocity1: velocity1.toFixed(2),
          velocity2: velocity2.toFixed(2),
          pressureDifference: pressureDiff.toFixed(2),
        })
      }
      return data
    }
    return []
  }, [selectedExperiment, parameters])

  useEffect(() => {
    setChartData(generateChartData)
  }, [generateChartData])

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-80 text-gray-500">
          <div className="text-center">
            <i className="fas fa-chart-line text-4xl mb-4 opacity-50"></i>
            <p className="font-medium">No data available for visualization</p>
          </div>
        </div>
      )
    }

    const commonProps = {
      width: '100%',
      height: 350,
      data: chartData,
      margin: { top: 5, right: 30, left: 0, bottom: 5 },
    }

    switch (selectedExperiment) {
      case 'Bernoulli':
        return (
          <ResponsiveContainer {...commonProps}>
            <ComposedChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="position" label={{ value: 'Position (m)', position: 'insideBottomRight', offset: -5 }} />
              <YAxis label={{ value: 'Head (m)', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#f3f4f6', border: '2px solid #4f46e5' }}
                labelStyle={{ color: '#1f2937' }}
              />
              <Legend />
              <Area type="monotone" dataKey="totalHead" fill="#818cf8" stroke="#4f46e5" isAnimationActive={true} />
              <Line type="monotone" dataKey="pressureHead" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="velocityHead" stroke="#10b981" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        )

      case 'Reynolds':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="flowRate" label={{ value: 'Flow Rate (L/min)', position: 'insideBottomRight', offset: -5 }} />
              <YAxis label={{ value: 'Reynolds Number', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#f3f4f6', border: '2px solid #4f46e5' }}
                labelStyle={{ color: '#1f2937' }}
              />
              <Legend />
              <Bar dataKey="reynoldsNumber" fill="#6366f1" isAnimationActive={true} />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'Venturi':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="flowRate" label={{ value: 'Flow Rate (L/min)', position: 'insideBottomRight', offset: -5 }} />
              <YAxis yAxisId="left" label={{ value: 'Velocity (m/s)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Pressure Diff (kPa)', angle: 90, position: 'insideRight' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#f3f4f6', border: '2px solid #4f46e5' }}
                labelStyle={{ color: '#1f2937' }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="velocity1" stroke="#f59e0b" strokeWidth={2} />
              <Line yAxisId="left" type="monotone" dataKey="velocity2" stroke="#10b981" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="pressureDifference" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
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
          <i className="fas fa-chart-line"></i>
          Results & Analysis
        </h2>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded text-sm font-semibold transition ${
              chartType === 'line'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <i className="fas fa-chart-line mr-1"></i>Line
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded text-sm font-semibold transition ${
              chartType === 'bar'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <i className="fas fa-chart-bar mr-1"></i>Bar
          </motion.button>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1"
      >
        {renderChart()}
      </motion.div>

      {/* Chart Info */}
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
