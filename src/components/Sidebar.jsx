import React from "react";
import { useAppContext } from "../context/AppContext";

const experiments = [
  { name: "Bernoulli", label: "Bernoulli’s Theorem" },
  { name: "Venturi", label: "Venturi Meter" },
  { name: "Reynolds", label: "Reynold’s Experiment" },
  { name: "Orifice", label: "Orifice & Mouthpiece" },
  { name: "Notch", label: "Notch / Weir Flow" },
  { name: "Poiseuille", label: "Hagen–Poiseuille (Capillary Flow)" },
  { name: "Pitot", label: "Pitot Tube" },
  { name: "DragLift", label: "Drag & Lift" },
  { name: "Hydrostatic", label: "Hydrostatic Pressure" },
  { name: "HydraulicJump", label: "Hydraulic Jump" },
];

function Sidebar() {
  const { selectedExperiment, dispatch } = useAppContext();
  return (
    <aside className="w-52 bg-white border-r border-indigo-200 px-2 py-6 flex flex-col gap-2 shadow-inner min-h-[calc(100vh-50px)]">
      <div className="text-lg font-semibold uppercase text-indigo-700 mb-6 px-2">Experiments</div>
      {experiments.map(expt => (
        <button
          key={expt.name}
          onClick={() => dispatch({ type: "SET_EXPERIMENT", payload: expt.name })}
          className={`w-full text-left px-4 py-2 rounded-lg font-medium transition
            ${selectedExperiment === expt.name
              ? "bg-indigo-600 text-white"
              : "text-indigo-700 hover:bg-indigo-100"}
          `}
        >
          {expt.label}
        </button>
      ))}
    </aside>
  );
}

export default Sidebar;
