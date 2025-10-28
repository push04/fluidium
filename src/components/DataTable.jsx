import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

function DataTable() {
  const { selectedExperiment, parameters } = useAppContext()
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    const data = Array.from({ length: 5 }, (_, i) => ({
      index: i + 1,
      parameter1: (Math.random() * 100).toFixed(2),
      parameter2: (Math.random() * 50).toFixed(2),
      result: (Math.random() * 75).toFixed(2),
      timestamp: new Date(Date.now() - i * 1000).toLocaleTimeString(),
    }))
    setTableData(data)
  }, [selectedExperiment, parameters])

  const exportToCSV = () => {
    const headers = Object.keys(tableData[0] || {})
    const rows = tableData.map(row => headers.map(h => row[h]).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `data-${selectedExperiment}-${Date.now()}.csv`
    a.click()
  }

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
          Export
        </motion.button>
      </motion.div>

      {tableData.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="overflow-x-auto flex-1"
        >
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-100 to-purple-100">
                {Object.keys(tableData[0]).map(key => (
                  <th key={key} className="border border-indigo-200 px-4 py-3 font-bold text-left text-indigo-700">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
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
                    <td key={valIdx} className="border border-indigo-100 px-4 py-3 font-medium text-gray-700">
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="border-t border-gray-200 mt-6 pt-4 text-xs text-gray-600"
      >
        <p>
          <i className="fas fa-info-circle text-indigo-600 mr-2"></i>
          Total Records: <span className="font-bold text-indigo-700">{tableData.length}</span>
        </p>
      </motion.div>
    </motion.section>
  )
}

export default DataTable
