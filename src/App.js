import { useState } from "react";
import { INITIAL_PLANS } from "./data/constants";
import CarePlans from "./components/CarePlans";
import PatientPortal from "./components/PatientPortal";

export default function App() {
  const [view, setView] = useState("admin");
  const [plans, setPlans] = useState(INITIAL_PLANS);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">
              Care plans
            </p>
            <h1 className="text-lg font-bold text-gray-900">
              Health care planning workspace
            </h1>
          </div>
          <div className="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setView("admin")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${view === "admin" ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:text-gray-900"}`}
            >
              Doctor view
            </button>
            <button
              type="button"
              onClick={() => setView("patient")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${view === "patient" ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:text-gray-900"}`}
            >
              Patient view
            </button>
          </div>
        </div>
      </header>

      {view === "admin" ? (
        <CarePlans plans={plans} setPlans={setPlans} />
      ) : (
        <PatientPortal plans={plans} />
      )}
    </div>
  );
}
