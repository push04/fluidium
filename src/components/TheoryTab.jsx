import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/AppContext'

const theoryContent = {
  Bernoulli: {
    objective: 'To verify Bernoulli\'s principle and understand energy conservation in flowing fluids.',
    apparatus: 'Bernoulli apparatus with U-tube manometers, adjustable flow control, transparent pipes, and pressure measurement taps at different sections.',
    theory: `
Bernoulli's equation is a fundamental principle in fluid mechanics that states the conservation of mechanical energy along a streamline in a fluid flow.

The equation is expressed as:
P + ½ρv² + ρgh = constant (along a streamline)

Where:
- P = Static pressure (Pa)
- ρ = Fluid density (kg/m³)
- v = Velocity of fluid (m/s)
- g = Gravitational acceleration (9.81 m/s²)
- h = Height (m)

The three terms represent:
1. Pressure head: P/ρg
2. Velocity head: v²/2g
3. Elevation head: h

Key observations:
- When velocity increases, pressure decreases
- When velocity decreases, pressure increases
- The sum of all three heads remains constant
- This principle applies to incompressible, non-viscous flows along a streamline

Applications include:
- Designing nozzles and diffusers
- Analyzing aircraft wing lift
- Pipeline design
- Venturi meters
- Carburetor design in engines
    `,
    procedure: `
Step 1: Start with zero flow. Note the initial readings of all pressure taps.
Step 2: Gradually increase the flow velocity using the control slider.
Step 3: Observe the pressure readings at different sections.
Step 4: Record pressure head, velocity head, and total head at each position.
Step 5: Plot a graph showing how total head remains approximately constant.
Step 6: Identify the relationship between velocity and pressure changes.
Step 7: Increase velocity further and repeat observations.
Step 8: Document any deviations from theoretical values (real fluid effects).
    `,
    formula: `
P₁/ρg + v₁²/2g + z₁ = P₂/ρg + v₂²/2g + z₂

Simplified (horizontal flow):
P₁ + ½ρv₁² = P₂ + ½ρv₂²

Dynamic pressure: Pd = ½ρv²
Static pressure: Ps = P
Total pressure: Pt = Ps + Pd
    `,
    error_analysis: `
Sources of experimental error:
1. Viscous losses in the apparatus (approximately 5-10%)
2. Turbulence and flow instabilities
3. Measurement errors in pressure gauges
4. Temperature variations affecting fluid properties
5. Air bubbles in manometer tubes
6. Friction losses in pipe sections

Precautions:
- Use calibrated instruments
- Ensure steady flow conditions
- Remove air bubbles from measurement tubes
- Allow temperature stabilization
- Record readings only when flow is stable
    `,
  },
  Reynolds: {
    objective: 'To study the transition of flow regimes from laminar to turbulent and understand the Reynolds number.',
    apparatus: 'Reynolds apparatus with dye injection system, variable flow control valve, transparent test section, and temperature regulation.',
    theory: `
The Reynolds number (Re) is a dimensionless parameter that predicts flow patterns in different fluid flow situations.

Definition:
Re = ρvD/μ = vD/ν

Where:
- ρ = Fluid density (kg/m³)
- v = Velocity (m/s)
- D = Characteristic length/diameter (m)
- μ = Dynamic viscosity (Pa·s)
- ν = Kinematic viscosity (m²/s)

Flow Regimes:
1. Laminar Flow (Re < 2,300):
   - Smooth, orderly flow in parallel layers
   - Pressure loss proportional to velocity
   - Dye moves in straight line without mixing
   - Low energy loss

2. Transitional Flow (2,300 < Re < 4,000):
   - Mix of laminar and turbulent characteristics
   - Unstable and unpredictable flow
   - Intermittent mixing

3. Turbulent Flow (Re > 4,000):
   - Chaotic, irregular flow with mixing
   - Pressure loss increases with velocity squared
   - Dye mixes rapidly throughout
   - Higher energy loss

Significance:
- Helps in pipeline design
- Determines friction factor
- Important for heat and mass transfer
- Critical in microfluidics
- Essential for industrial processes
    `,
    procedure: `
Step 1: Close the dye injection valve and adjust flow to minimum.
Step 2: Open the flow control valve slowly and observe the dye stream.
Step 3: Note the initial laminar flow characteristics (straight dye line).
Step 4: Gradually increase flow rate and observe dye behavior.
Step 5: Record flow rate when transition begins (~Re = 2,300).
Step 6: Continue increasing flow until fully turbulent (Re > 4,000).
Step 7: Observe rapid dye mixing in turbulent regime.
Step 8: Reduce flow and note transition back to laminar.
Step 9: Calculate Reynolds number for each observation.
Step 10: Create a comparison chart showing all regimes.
    `,
    formula: `
Reynolds Number:
Re = ρvD/μ = vD/ν

For circular pipes:
Re_critical ≈ 2,300 (laminar to transitional)
Re_turbulent ≈ 4,000 (transitional to turbulent)

Flow velocity:
v = Q/A = Q/(πD²/4)

Where Q is volumetric flow rate and A is cross-sectional area.
    `,
    error_analysis: `
Sources of error:
1. Temperature fluctuations affecting viscosity
2. Impurities in the fluid
3. Vibrations in the apparatus
4. Inconsistent dye injection rate
5. Observer bias in identifying transitions
6. Measurement uncertainty in flow rate

Precautions:
- Maintain constant temperature
- Use distilled water
- Minimize external vibrations
- Use consistent dye concentration
- Allow flow to stabilize before observation
- Record multiple readings
    `,
  },
  Venturi: {
    objective: 'To measure fluid discharge using the Venturi meter principle and verify flow rate calculations.',
    apparatus: 'Venturi tube with convergent section, throat, divergent section, and pressure measurement taps at inlet and throat.',
    theory: `
A Venturi meter is a device used to measure the flow rate of a fluid through a pipe using Bernoulli's principle and the continuity equation.

Working Principle:
1. The fluid is first accelerated through a convergent section (nozzle)
2. The area decreases, causing velocity to increase
3. By Bernoulli's principle, pressure decreases
4. A pressure difference (differential pressure) is created between inlet and throat
5. This pressure difference is used to calculate the flow rate

Governing Equations:
Continuity Equation: A₁v₁ = A₂v₂

Bernoulli's Equation: P₁ + ½ρv₁² = P₂ + ½ρv₂²

Combined for flow rate:
Q = C × A₂ × √(2Δh × A₁²/(A₁² - A₂²))

Where:
- C = Discharge coefficient (0.98-0.99)
- A₁ = Inlet area
- A₂ = Throat area
- Δh = Pressure head difference
- ρ = Fluid density

Advantages:
- High accuracy
- Low energy loss (recovers ~80% of pressure)
- Suitable for large flow rates
- Minimal maintenance
    `,
    procedure: `
Step 1: Set up the Venturi apparatus with manometers at inlet and throat.
Step 2: Fill the manometer tubes to avoid air pockets.
Step 3: Start with minimum flow rate.
Step 4: Gradually increase flow using the control valve.
Step 5: Record pressure readings at inlet and throat for each flow rate.
Step 6: Calculate pressure difference (Δh).
Step 7: Calculate theoretical flow rate using Bernoulli equation.
Step 8: Compare with actual measured flow rate.
Step 9: Calculate discharge coefficient: C = Q_actual/Q_theoretical
Step 10: Plot graphs of pressure difference vs flow rate.
    `,
    formula: `
Pressure difference:
Δh = h₁ - h₂ = (P₁ - P₂)/(ρg)

Theoretical flow rate:
Q_theo = A₂ × √(2g × Δh × A₁²/(A₁² - A₂²))

Actual flow rate with discharge coefficient:
Q_actual = C × Q_theo

Area ratio:
β = A₂/A₁ = (D₂/D₁)²
    `,
    error_analysis: `
Sources of error:
1. Vena contracta effect (actual throat area is smaller)
2. Viscous losses in the divergent section
3. Irregular pressure distribution
4. Measurement errors in manometer
5. Temperature variations
6. Partial blockages in taps

Typical discharge coefficients:
- Sharp-edged: C ≈ 0.985
- Well-designed: C ≈ 0.99
    `,
  },
  Pitot: {
    objective: 'To measure local fluid velocity using a Pitot tube and understand dynamic pressure concepts.',
    apparatus: 'Pitot tube assembly with two taps (static and stagnation), manometer, flow channel.',
    theory: `
A Pitot tube is a simple device used to measure the local velocity of a fluid at a specific point in the flow field.

Components:
1. Stagnation tap (facing upstream): Measures total pressure
2. Static tap (side opening): Measures static pressure

The difference between these pressures gives the dynamic pressure, which is related to velocity.

Working Principle:
The fluid is brought to rest (stagnation) at the tube tip, converting kinetic energy to pressure energy.

Bernoulli's Equation Application:
P_static + ½ρv² = P_stagnation (at stagnation point)

Dynamic pressure: Pd = ½ρv²

Velocity calculation:
v = √(2Δp/ρ) = √(2gΔh)

Where:
- Δp = Pressure difference (Pa)
- Δh = Manometer height difference (m)

Advantages:
- No moving parts
- Simple and reliable
- Minimal flow disturbance
- Suitable for high-speed flows

Limitations:
- Requires calibration (velocity coefficient ≈ 0.98-1.0)
- Sensitive to flow direction
- Can be damaged easily
- Not suitable for very low velocities
    `,
    procedure: `
Step 1: Mount the Pitot tube in the flow field.
Step 2: Ensure proper alignment with flow direction.
Step 3: Connect the stagnation and static taps to a manometer.
Step 4: Start flow and allow stabilization.
Step 5: Record manometer reading (pressure difference).
Step 6: Repeat at different flow rates.
Step 7: Calculate velocity from pressure difference.
Step 8: Compare with other velocity measurement methods.
Step 9: Investigate effect of tube orientation on readings.
Step 10: Document any pressure recovery characteristics.
    `,
    formula: `
Velocity from dynamic pressure:
v = √(2Δp/ρ) = √(2gΔh)

Where Δh is the manometer height difference in meters.

Corrected velocity (with velocity coefficient):
v_actual = C_v × v_theoretical

Typical velocity coefficient:
C_v ≈ 0.98 to 1.00

For air (ρ ≈ 1.2 kg/m³):
v ≈ 40.4 × √Δh (m/s, Δh in mm)

For water (ρ ≈ 1000 kg/m³):
v ≈ 1.4 × √Δh (m/s, Δh in mm)
    `,
    error_analysis: `
Sources of error:
1. Misalignment with flow direction
2. Viscous losses in tube
3. Temperature variations
4. Manometer parallax errors
5. Blockage at tube tip
6. Compressibility effects at high speeds

Precautions:
- Careful tube alignment
- Regular calibration
- Gentle handling
- Adequate flow stabilization
- Use appropriate manometer fluid
    `,
  },
}

function TheoryTab() {
  const { selectedExperiment } = useAppContext()
  const [activeTab, setActiveTab] = useState('objective')

  const content = theoryContent[selectedExperiment] || {}
  const tabs = ['objective', 'apparatus', 'theory', 'procedure', 'formula', 'error_analysis']

  const tabIcons = {
    objective: 'fa-target',
    apparatus: 'fa-microscope',
    theory: 'fa-book',
    procedure: 'fa-list-check',
    formula: 'fa-function',
    error_analysis: 'fa-chart-area',
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card"
    >
      {/* Tabs Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto pb-2"
      >
        {tabs.map(tab => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold capitalize transition whitespace-nowrap text-sm ${
              activeTab === tab
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            <i className={`fas ${tabIcons[tab]} mr-2`}></i>
            {tab.replace('_', ' ')}
          </motion.button>
        ))}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-medium"
        >
          {content[activeTab] || 'No content available'}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="border-t border-gray-200 mt-6 pt-4 flex items-center gap-2 text-xs text-gray-600"
      >
        <i className="fas fa-lightbulb text-yellow-500"></i>
        <span>Comprehensive theory and procedural guidelines for accurate experimentation</span>
      </motion.div>
    </motion.section>
  )
}

export default TheoryTab
