import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

function Navbar() {
  const { toggleSidebar, setTheme, theme } = useAppContext()
  const [showMenu, setShowMenu] = useState(false)

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <nav className="w-full bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 py-4 px-6 flex items-center justify-between shadow-xl sticky top-0 z-40">
      {/* Left Section - Logo & Title */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-indigo-800 rounded-lg transition duration-200 text-white"
          title="Toggle Sidebar"
        >
          <i className="fas fa-bars text-xl"></i>
        </button>

        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-3xl"
          >
            <i className="fas fa-flask text-white"></i>
          </motion.div>
          <div className="flex flex-col">
            <span className="text-white text-xl font-bold tracking-wide">Fluidium</span>
            <span className="text-indigo-100 text-xs font-medium">Virtual Engineering Lab</span>
          </div>
        </div>
      </motion.div>

      {/* Center Section - Navigation Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="hidden md:flex items-center gap-8"
      >
        <a
          href="#"
          className="text-indigo-100 hover:text-white font-medium transition duration-200"
        >
          Home
        </a>
        <a
          href="#features"
          className="text-indigo-100 hover:text-white font-medium transition duration-200"
        >
          Features
        </a>
        <a
          href="#docs"
          className="text-indigo-100 hover:text-white font-medium transition duration-200"
        >
          Documentation
        </a>
        <a
          href="#about"
          className="text-indigo-100 hover:text-white font-medium transition duration-200"
        >
          About
        </a>
      </motion.div>

      {/* Right Section - Actions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4"
      >
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 hover:bg-indigo-800 rounded-lg transition duration-200 text-white"
          title="Toggle Theme"
        >
          <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'} text-lg`}></i>
        </button>

        {/* Menu Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-indigo-800 rounded-lg transition duration-200 text-white relative"
            title="Menu"
          >
            <i className="fas fa-ellipsis-v text-lg"></i>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl overflow-hidden w-48 z-50"
            >
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 text-gray-700 font-medium transition"
              >
                <i className="fab fa-github text-lg"></i>
                GitHub
              </a>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 text-gray-700 font-medium transition text-left"
              >
                <i className="fas fa-download text-lg"></i>
                Download Data
              </button>
              <a
                href="#contact"
                className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 text-gray-700 font-medium transition"
              >
                <i className="fas fa-envelope text-lg"></i>
                Contact
              </a>
              <hr className="border-gray-200" />
              <button
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 font-medium transition text-left"
              >
                <i className="fas fa-sign-out-alt text-lg"></i>
                Settings
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </nav>
  )
}

export default Navbar
