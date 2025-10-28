import React from "react";
import { useAppContext } from "../context/AppContext";
import BernoulliSim from "../experiments/FluidMechanics/BernoulliSim";
import VenturiSim from "../experiments/FluidMechanics/VenturiSim";
import ReynoldSim from "../experiments/FluidMechanics/ReynoldSim";
// ...import other experiment components

function SimulationArea() {
  const { selectedExperiment } = useAppContext();

  function renderSimulation() {
    switch (selectedExperiment) {
      case "Bernoulli":
        return <BernoulliSim />;
      case "Venturi":
        return <VenturiSim />;
      case "Reynolds":
        return <ReynoldSim />;
      // ...other experiments
      default:
        return <div className="text-center text-indigo-500 font-bold">Select an Experiment</div>;
    }
  }

  return (
    <section className="bg-white rounded-xl shadow-lg p-4 min-h-[350px] flex items-center justify-center">
      {renderSimulation()}
    </section>
  );
}

export default SimulationArea;
