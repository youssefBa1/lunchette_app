import { useState } from "react";
import PresenceTable from "../components/PresenceTable";
import MonthlyAttendance from "../components/MonthlyAttendance";
import EmployeeMonthlyPresence from "../components/EmployeeMonthlyPresence";

const TeamView = () => {
  const [activeSection, setActiveSection] = useState("daily"); // "daily", "monthly", or "individual"

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Présence de l'équipe
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Gérez la présence quotidienne de vos employés
            </p>
          </div>

          {/* Section Selector */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveSection("daily")}
                  className={`${
                    activeSection === "daily"
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Présence journalière
                </button>
                <button
                  onClick={() => setActiveSection("monthly")}
                  className={`${
                    activeSection === "monthly"
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Vue mensuelle
                </button>
                <button
                  onClick={() => setActiveSection("individual")}
                  className={`${
                    activeSection === "individual"
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Détails par employé
                </button>
              </nav>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white shadow rounded-lg p-6">
            {activeSection === "daily" && <PresenceTable />}
            {activeSection === "monthly" && <MonthlyAttendance />}
            {activeSection === "individual" && <EmployeeMonthlyPresence />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamView;
