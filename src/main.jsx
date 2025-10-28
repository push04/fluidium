import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/tailwind.css'
import './styles/theme.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200 p-8">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center">
            <i className="fas fa-exclamation-triangle text-red-500 text-6xl mb-4"></i>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Application Error</h1>
            <p className="text-gray-600 mb-6">An unexpected error occurred. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Reload Application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'))
if (root) {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  )
}
