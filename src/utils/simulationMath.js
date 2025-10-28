/**
 * Fluidium - Simulation Mathematics Utilities
 * Core calculations and physics algorithms for fluid mechanics simulations
 */

// ============================================================================
// BERNOULLI'S THEOREM CALCULATIONS
// ============================================================================

export const calculateBernoulliHeads = (velocity, height, density = 1000) => {
  const g = 9.81
  const pressureHead = height
  const velocityHead = (velocity ** 2) / (2 * g)
  const totalHead = pressureHead + velocityHead

  return {
    pressureHead: parseFloat(pressureHead.toFixed(4)),
    velocityHead: parseFloat(velocityHead.toFixed(4)),
    totalHead: parseFloat(totalHead.toFixed(4)),
  }
}

export const calculateBernoulliEnergy = (pressure, velocity, height, density = 1000) => {
  const g = 9.81
  const pressureEnergy = pressure / (density * g)
  const kineticEnergy = (velocity ** 2) / (2 * g)
  const potentialEnergy = height
  const totalEnergy = pressureEnergy + kineticEnergy + potentialEnergy

  return {
    pressureEnergy: parseFloat(pressureEnergy.toFixed(4)),
    kineticEnergy: parseFloat(kineticEnergy.toFixed(4)),
    potentialEnergy: parseFloat(potentialEnergy.toFixed(4)),
    totalEnergy: parseFloat(totalEnergy.toFixed(4)),
  }
}

export const calculateVelocityFromBernoulli = (pressureDiff, density = 1000) => {
  const velocity = Math.sqrt((2 * pressureDiff) / density)
  return parseFloat(velocity.toFixed(4))
}

// ============================================================================
// REYNOLDS NUMBER CALCULATIONS
// ============================================================================

export const calculateReynoldsNumber = (velocity, diameter, viscosity, density = 1000) => {
  // Convert diameter from mm to m if needed
  const diameterM = diameter < 10 ? diameter / 1000 : diameter
  // Convert viscosity from cP to Pa·s if needed (1 cP = 0.001 Pa·s)
  const viscosityPas = viscosity > 1 ? viscosity * 0.001 : viscosity

  const re = (density * velocity * diameterM) / viscosityPas
  return parseFloat(re.toFixed(2))
}

export const getFlowRegime = (reynoldsNumber) => {
  if (reynoldsNumber < 2300) {
    return {
      regime: 'Laminar',
      color: '#10b981',
      description: 'Smooth, orderly flow',
    }
  } else if (reynoldsNumber <= 4000) {
    return {
      regime: 'Transitional',
      color: '#f59e0b',
      description: 'Mixed flow characteristics',
    }
  } else {
    return {
      regime: 'Turbulent',
      color: '#ef4444',
      description: 'Chaotic, mixing flow',
    }
  }
}

export const calculateKinematicViscosity = (dynamicViscosity, density = 1000) => {
  // ν = μ / ρ
  const kinematicViscosity = dynamicViscosity / density
  return parseFloat(kinematicViscosity.toFixed(6))
}

export const calculateDynamicViscosity = (kinematicViscosity, density = 1000) => {
  // μ = ν × ρ
  const dynamicViscosity = kinematicViscosity * density
  return parseFloat(dynamicViscosity.toFixed(6))
}

// ============================================================================
// VENTURI METER CALCULATIONS
// ============================================================================

export const calculateVenturiFlowRate = (inletDiameter, throatDiameter, pressureDiff, dischargeCoeff = 0.98, density = 1000) => {
  const g = 9.81
  // Convert diameters from mm to m
  const d1 = inletDiameter / 1000
  const d2 = throatDiameter / 1000

  const area1 = Math.PI * (d1 ** 2) / 4
  const area2 = Math.PI * (d2 ** 2) / 4

  // Q = C × A2 × √(2gΔh × A1² / (A1² - A2²))
  const numerator = 2 * g * pressureDiff * (area1 ** 2)
  const denominator = area1 ** 2 - area2 ** 2

  const flowRate = dischargeCoeff * area2 * Math.sqrt(numerator / denominator)
  // Convert from m³/s to L/min
  return parseFloat((flowRate * 60000).toFixed(2))
}

export const calculateVenturiPressureDiff = (inletDiameter, throatDiameter, flowRate, density = 1000) => {
  const g = 9.81
  const d1 = inletDiameter / 1000
  const d2 = throatDiameter / 1000

  const area1 = Math.PI * (d1 ** 2) / 4
  const area2 = Math.PI * (d2 ** 2) / 4

  // Convert flow rate from L/min to m³/s
  const Q = flowRate / 60000

  const velocity1 = Q / area1
  const velocity2 = Q / area2

  // Δh = (v2² - v1²) / (2g)
  const pressureDiff = (velocity2 ** 2 - velocity1 ** 2) / (2 * g)
  return parseFloat(pressureDiff.toFixed(4))
}

export const calculateDischargeCoefficient = (actualFlowRate, theoreticalFlowRate) => {
  if (theoreticalFlowRate === 0) return 0
  const cd = actualFlowRate / theoreticalFlowRate
  return parseFloat(cd.toFixed(4))
}

// ============================================================================
// ORIFICE & MOUTHPIECE CALCULATIONS
// ============================================================================

export const calculateOrificeFlowRate = (headHeight, orificeDiameter, dischargeCoeff = 0.75, density = 1000) => {
  const g = 9.81
  const d = orificeDiameter / 1000 // Convert mm to m
  const area = Math.PI * (d ** 2) / 4

  // Q = Cd × A × √(2gh)
  const velocity = Math.sqrt(2 * g * headHeight)
  const flowRate = dischargeCoeff * area * velocity

  // Convert from m³/s to L/min
  return parseFloat((flowRate * 60000).toFixed(2))
}

export const calculateJetTrajectory = (headHeight, orificeDiameter, dischargeCoeff = 0.75, density = 1000) => {
  const g = 9.81
  const velocity = Math.sqrt(2 * g * headHeight) * dischargeCoeff

  const trajectoryPoints = []
  for (let t = 0; t <= 1; t += 0.1) {
    const x = velocity * t
    const y = -0.5 * g * (t ** 2)
    trajectoryPoints.push({ x: parseFloat(x.toFixed(3)), y: parseFloat(y.toFixed(3)) })
  }

  return trajectoryPoints
}

// ============================================================================
// NOTCH & WEIR FLOW CALCULATIONS
// ============================================================================

export const calculateWeirFlowRate = (headHeight, notchAngle = 90, formulaType = 'rectangular') => {
  const g = 9.81
  const H = headHeight

  let flowRate = 0

  if (formulaType === 'rectangular') {
    // Q = (2/3) × Cd × b × √(2g) × H^(3/2)
    const Cd = 0.62
    const b = 0.75 // Width in meters
    flowRate = (2 / 3) * Cd * b * Math.sqrt(2 * g) * (H ** 1.5)
  } else if (formulaType === 'triangular') {
    // Q = (8/15) × Cd × tan(θ/2) × √(2g) × H^(3/2)
    const Cd = 0.61
    const theta = (notchAngle * Math.PI) / 180
    flowRate = (8 / 15) * Cd * Math.tan(theta / 2) * Math.sqrt(2 * g) * (H ** 1.5)
  }

  // Convert from m³/s to L/min
  return parseFloat((flowRate * 60000).toFixed(2))
}

// ============================================================================
// HAGEN-POISEUILLE LAW CALCULATIONS
// ============================================================================

export const calculatePoiseuillePressureGradient = (flowRate, pipeDiameter, viscosity, density = 1000) => {
  const Q = flowRate / 60000 // Convert L/min to m³/s
  const r = (pipeDiameter / 1000) / 2 // Convert mm to m
  const mu = viscosity * 0.001 // Convert cP to Pa·s

  // Δp = (8 × μ × Q) / (π × r⁴)
  const pressureGradient = (8 * mu * Q) / (Math.PI * (r ** 4))
  return parseFloat(pressureGradient.toFixed(2))
}

export const calculateVelocityProfile = (pipeDiameter, pressureGradient, viscosity, points = 10) => {
  const r = (pipeDiameter / 1000) / 2
  const mu = viscosity * 0.001

  const profile = []
  for (let i = 0; i <= points; i++) {
    const rLocal = (i / points) * r
    // v(r) = (Δp / (4μL)) × (r² - rLocal²)
    const velocity = (pressureGradient / (4 * mu)) * ((r ** 2) - (rLocal ** 2))
    profile.push({
      radius: parseFloat(rLocal.toFixed(4)),
      velocity: parseFloat(Math.max(0, velocity).toFixed(4)),
    })
  }

  return profile
}

// ============================================================================
// PITOT TUBE CALCULATIONS
// ============================================================================

export const calculatePitotVelocity = (pressureDiff, fluidDensity = 1000, velocityCoeff = 1.0) => {
  // v = √(2 × Δp / ρ)
  const velocity = velocityCoeff * Math.sqrt((2 * pressureDiff) / fluidDensity)
  return parseFloat(velocity.toFixed(4))
}

export const calculateDynamicPressure = (velocity, fluidDensity = 1000) => {
  // Pd = ½ρv²
  const dynamicPressure = 0.5 * fluidDensity * (velocity ** 2)
  return parseFloat(dynamicPressure.toFixed(2))
}

// ============================================================================
// DRAG & LIFT CALCULATIONS
// ============================================================================

export const calculateDragForce = (velocity, fluidDensity, refArea, dragCoeff = 1.0) => {
  // Fd = ½ × ρ × v² × Cd × A
  const dragForce = 0.5 * fluidDensity * (velocity ** 2) * dragCoeff * refArea
  return parseFloat(dragForce.toFixed(3))
}

export const calculateLiftForce = (velocity, fluidDensity, refArea, liftCoeff = 1.0) => {
  // FL = ½ × ρ × v² × CL × A
  const liftForce = 0.5 * fluidDensity * (velocity ** 2) * liftCoeff * refArea
  return parseFloat(liftForce.toFixed(3))
}

// ============================================================================
// HYDROSTATIC PRESSURE CALCULATIONS
// ============================================================================

export const calculateHydrostaticPressure = (fluidDepth, fluidDensity = 1000) => {
  const g = 9.81
  // P = ρ × g × h
  const pressure = fluidDensity * g * fluidDepth
  return parseFloat(pressure.toFixed(2))
}

export const calculateHydrostaticForce = (fluidDepth, surfaceArea, fluidDensity = 1000) => {
  const g = 9.81
  // F = ρ × g × h_c × A (where h_c is depth to centroid)
  const force = fluidDensity * g * (fluidDepth / 2) * surfaceArea
  return parseFloat(force.toFixed(2))
}

export const calculateCenterOfPressure = (fluidDepth) => {
  // For rectangular surface: h_cp = 2h/3
  const centerOfPressure = (2 * fluidDepth) / 3
  return parseFloat(centerOfPressure.toFixed(4))
}

// ============================================================================
// HYDRAULIC JUMP CALCULATIONS
// ============================================================================

export const calculateHydraulicJumpHeight = (upstreamDepth, froude Number, fluidDensity = 1000) => {
  if (froudeNumber < 1) return 0 // No jump for subcritical flow

  // y2/y1 = (1/2) × (√(1 + 8Fr²) - 1)
  const depthRatio = 0.5 * (Math.sqrt(1 + 8 * (froudeNumber ** 2)) - 1)
  const downstreamDepth = upstreamDepth * depthRatio

  return parseFloat(downstreamDepth.toFixed(4))
}

export const calculateFroudeNumber = (velocity, fluidDepth) => {
  const g = 9.81
  // Fr = v / √(g × h)
  const froudeNumber = velocity / Math.sqrt(g * fluidDepth)
  return parseFloat(froudeNumber.toFixed(4))
}

export const calculateEnergyLoss = (upstreamDepth, downstreamDepth) => {
  // Energy loss in jump: ΔE = ((y2 - y1)³) / (4 × y1 × y2)
  const energyLoss = ((downstreamDepth - upstreamDepth) ** 3) / (4 * upstreamDepth * downstreamDepth)
  return parseFloat(energyLoss.toFixed(4))
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const convertUnits = (value, fromUnit, toUnit) => {
  const conversions = {
    mmTom: (v) => v / 1000,
    mTomm: (v) => v * 1000,
    LminToMs3: (v) => v / 60000,
    Ms3ToLmin: (v) => v * 60000,
    cPToPas: (v) => v * 0.001,
    PasTocP: (v) => v / 0.001,
    KPaToPa: (v) => v * 1000,
    PaToKPa: (v) => v / 1000,
  }

  const key = `${fromUnit}To${toUnit}`
  if (conversions[key]) {
    return parseFloat(conversions[key](value).toFixed(4))
  }
  return value
}

export const getFluidProperties = (fluidType = 'Water', temperature = 20) => {
  const fluids = {
    Water: { density: 1000, viscosity: 1.002 },
    Oil: { density: 860, viscosity: 100 },
    Honey: { density: 1420, viscosity: 10000 },
    Mercury: { density: 13600, viscosity: 1.526 },
    Glycerin: { density: 1260, viscosity: 1500 },
  }

  return fluids[fluidType] || fluids['Water']
}

export const roundToDecimal = (value, decimal = 2) => {
  return parseFloat(value.toFixed(decimal))
}
