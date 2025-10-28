import React, { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

function DataTable() {
  const { selectedExperiment, parameters, observationData } = useAppContext()
  const [tableData, setTableData] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: 'position', direction: 'asc' })

  const generateTableData = useMemo(() => {
    if (selectedExperiment === 'Bernoulli') {
      return [
        {
          position: '0.0',
          pressure: (parameters.pipeHeight || 2).toFixed(3),
          velocity: (parameters.flowVelocity || 2).toFixed(3),
          total: ((parameters.pipeHeight || 2) + ((parameters.flowVelocity || 2) ** 2 / (2 * 9.81))).toFixed(3),
        },
        {
          position: '2.5',
          pressure: ((parameters.pipeHeight || 2) - 0.375).toFixed(3),
          velocity: ((parameters.flowVelocity || 2) + 0.25).toFixed(3),
          total: (((parameters.pipeHeight || 2) - 0.375) + (((parameters.flowVelocity || 2) + 0.25) ** 2 / (2 * 9.81))).toFixed(3),
        },
        {
          position: '5.0',
          pressure: ((parameters.pipeHeight || 2) - 0.75).toFixed(3),
          velocity: ((parameters.flowVelocity || 2) + 0.5).toFixed(3),
          total: (((parameters.pipeHeight || 2) - 0.75) + (((parameters.flowVelocity || 2) + 0.5) ** 2 / (2 * 9.81))).toFixed(3),
        },
      ]
    } else if (selectedExperiment === 'Reynolds') {
      const diameter = (parameters.pipeDiameter || 20) / 1000
      const viscosity = (parameters.viscosity || 1) * 0.001
      const density = 1000

      const rates = [5, 10, 20, 30, 40]
      return rates.map(rate => {
        const velocity = (rate * 0.001) / (60 * Math.PI * (diameter / 2) ** 2)
        const re = (density * velocity * diameter) / viscosity
        const regime = re < 2300 ? 'Laminar' : re > 4000 ? 'Turbulent' : 'Transitional'

        return {
          flowRate: rate.toFixed(2),
          diameter: diameter.toFixed(4),
          velocity: velocity.toFixed(4),
          viscosity: (parameters.viscosity || 1).toFixed(3),
          re: re.toFixed(0),
          regime,
        }
      })
    }
    return []
  }, [selectedExperiment, parameters])

  useEffect(() => {
    setTableData(generateTableData)
  }, [generateTableData])

  const sortedData = useMemo(() => {
    let sorted = [...tableData]
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return sortConfig.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue
    })
    return sorted
  }, [tableData, sortConfig])

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    })
  }

  const exportToCSV = () => {
    const headers = Object.keys(sortedData[0] || {})
    const rows = sortedData.map(row => headers.map(h => row[h]).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fluidium-${selectedExperiment}-${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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
          <i className="fas fa-table"></i>
          Data Observations
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToCSV}
          className="px-3 py-1 bg-green-600 text-white rounded text-sm font-semibold hover:bg-green-700 transition flex items-center gap-2"
        >
          <i className="fas fa-download"></i>
          Export CSV
        </motion.button>
      </motion.div>

      {/* Table */}
      {sortedData.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="overflow-x-auto flex-1"
        >
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-100 to-purple-100">
                {Object.keys(sortedData[0]).map(key => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="border border-indigo-200 px-4 py-3 font-bold text-left text-indigo-700 cursor-pointer hover:bg-indigo-200 transition"
                  >
                    <div className="flex items-center gap-2">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                      <motion.i
                        animate={{ rotate: sortConfig.key === key && sortConfig.direction === 'desc' ? 180 : 0 }}
                        className={`fas fa-arrow-up text-xs ${
                          sortConfig.key === key ? 'text-indigo-600' : 'text-gray-300'
                        }`}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`border border-indigo-100 transition hover:bg-indigo-50 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-indigo-50'
                  }`}
                >
                  {Object.values(row).map((val, valIdx) => (
                    <td
                      key={valIdx}
                      className="border border-indigo-100 px-4 py-3 font-medium text-gray-700"
                    >
                      {val}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      ) : (
        <div className="flex items-center justify-center h-40 text-gray-500">
          <div className="text-center">
            <i className="fas fa-inbox text-4xl mb-4 opacity-50"></i>
            <p className="font-medium">No data available</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="border-t border-gray-200 mt-6 pt-4 text-xs text-gray-600"
      >
        <p>
          <i className="fas fa-info-circle text-indigo-600 mr-2"></i>
          Total Records: <span className="font-bold text-indigo-700">{sortedData.length}</span> | Click column headers to sort
        </p>
      </motion.div>
    </motion.section>
  )
}

export default DataTable
