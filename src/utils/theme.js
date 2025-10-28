/**
 * Fluidium - Theme & Styling Utilities
 * Theme management, color palettes, and styling helpers
 */

export const themes = {
  light: {
    name: 'Light',
    primary: '#4f46e5',
    primaryDark: '#4338ca',
    primaryLight: '#818cf8',
    secondary: '#06b6d4',
    accent: '#f59e0b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#f3f4f6',
    surface: '#ffffff',
    text: '#1f2937',
    textLight: '#6b7280',
    border: '#e5e7eb',
  },
  dark: {
    name: 'Dark',
    primary: '#818cf8',
    primaryDark: '#6366f1',
    primaryLight: '#a5b4fc',
    secondary: '#06b6d4',
    accent: '#fbbf24',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    background: '#1f2937',
    surface: '#111827',
    text: '#f3f4f6',
    textLight: '#d1d5db',
    border: '#374151',
  },
}

export const colorPalettes = {
  bernoulli: {
    pressureHead: '#f59e0b',
    velocityHead: '#10b981',
    totalHead: '#6366f1',
  },
  reynolds: {
    laminar: '#10b981',
    transitional: '#f59e0b',
    turbulent: '#ef4444',
  },
  venturi: {
    inlet: '#3b82f6',
    throat: '#8b5cf6',
    outlet: '#ec4899',
  },
}

export const getTheme = (themeName = 'light') => {
  return themes[themeName] || themes.light
}

export const applyTheme = (themeName) => {
  const theme = getTheme(themeName)
  const root = document.documentElement

  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key.toLowerCase()}`, value)
  })
}

export const getChartColors = (experiment) => {
  const colors = {
    Bernoulli: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
    Reynolds: ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'],
    Venturi: ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'],
    Pitot: ['#f59e0b', '#10b981', '#6366f1', '#8b5cf6'],
    DragLift: ['#ef4444', '#3b82f6', '#10b981', '#ec4899'],
  }

  return colors[experiment] || ['#6366f1', '#06b6d4', '#f59e0b', '#10b981']
}

export const getExperimentIcon = (experiment) => {
  const icons = {
    Bernoulli: 'fa-water',
    Venturi: 'fa-pipe',
    Reynolds: 'fa-chart-line',
    Orifice: 'fa-circle-notch',
    Notch: 'fa-arrow-down',
    Poiseuille: 'fa-capsules',
    Pitot: 'fa-gauge',
    DragLift: 'fa-wind',
    Hydrostatic: 'fa-compress',
    HydraulicJump: 'fa-water',
  }

  return icons[experiment] || 'fa-flask'
}

export const getExperimentColor = (experiment) => {
  const colors = {
    Bernoulli: '#f59e0b',
    Venturi: '#3b82f6',
    Reynolds: '#10b981',
    Orifice: '#8b5cf6',
    Notch: '#ec4899',
    Poiseuille: '#06b6d4',
    Pitot: '#f59e0b',
    DragLift: '#ef4444',
    Hydrostatic: '#6366f1',
    HydraulicJump: '#10b981',
  }

  return colors[experiment] || '#6366f1'
}

export const getStatusColor = (status) => {
  const statusColors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    loading: '#6366f1',
  }

  return statusColors[status] || '#6366f1'
}

export const generateGradient = (color1, color2) => {
  return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`
}

export const getContrastColor = (hexColor) => {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 155 ? '#000000' : '#ffffff'
}

export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map((x) => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

export const adjustColor = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00ff) + amt
  const B = (num & 0x0000ff) + amt

  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16)
    .slice(1)
}
