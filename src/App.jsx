import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import SimulationArea from "./components/SimulationArea";
import ControlPanel from "./components/ControlPanel";
import GraphPanel from "./components/GraphPanel";
import DataTable from "./components/DataTable";
import TheoryTab from "./components/TheoryTab";
import QuizModal from "./components/QuizModal";
import { AppProvider } from "./context/AppContext";

function App() {
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <AppProvider>
      <div className="bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200 min-h-screen font-sans">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-5 flex flex-col gap-4">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SimulationArea />
              <ControlPanel />
            </section>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GraphPanel />
              <DataTable />
            </section>
            <section className="mt-4">
              <TheoryTab />
            </section>
          </main>
        </div>
        <button
          className="fixed bottom-6 right-6 py-3 px-5 bg-indigo-600 text-white font-bold rounded-full shadow-md hover:bg-indigo-800"
          onClick={() => setShowQuiz(true)}
        >
          Quiz Me
        </button>
        {showQuiz && <QuizModal onClose={() => setShowQuiz(false)} />}
      </div>
    </AppProvider>
  );
}

export default App;
