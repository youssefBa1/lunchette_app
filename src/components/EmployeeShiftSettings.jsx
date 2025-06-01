import { useState, useEffect } from "react";
import { employeeService } from "../services/employeeService";

const EmployeeShiftSettings = ({ employeeId, onUpdate }) => {
  const [shiftSettings, setShiftSettings] = useState({
    shiftStart: "09:00",
    shiftEnd: "17:00",
    lateThreshold: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEmployeeSettings();
  }, [employeeId]);

  const loadEmployeeSettings = async () => {
    try {
      const employee = await employeeService.getEmployee(employeeId);
      setShiftSettings({
        shiftStart: employee.shiftStart || "09:00",
        shiftEnd: employee.shiftEnd || "17:00",
        lateThreshold: employee.lateThreshold || 10,
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await employeeService.updateEmployee(employeeId, {
        ...shiftSettings,
      });
      if (onUpdate) {
        onUpdate();
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  return (
    <div className="bg-white shadow sm:rounded-lg p-4">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
        Paramètres des horaires
      </h3>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="shiftStart"
            className="block text-sm font-medium text-gray-700"
          >
            Heure de début
          </label>
          <input
            type="time"
            id="shiftStart"
            value={shiftSettings.shiftStart}
            onChange={(e) =>
              setShiftSettings({ ...shiftSettings, shiftStart: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="shiftEnd"
            className="block text-sm font-medium text-gray-700"
          >
            Heure de fin
          </label>
          <input
            type="time"
            id="shiftEnd"
            value={shiftSettings.shiftEnd}
            onChange={(e) =>
              setShiftSettings({ ...shiftSettings, shiftEnd: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="lateThreshold"
            className="block text-sm font-medium text-gray-700"
          >
            Seuil de retard (minutes)
          </label>
          <input
            type="number"
            id="lateThreshold"
            min="0"
            max="60"
            value={shiftSettings.lateThreshold}
            onChange={(e) =>
              setShiftSettings({
                ...shiftSettings,
                lateThreshold: parseInt(e.target.value, 10),
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
          />
          <p className="mt-1 text-sm text-gray-500">
            Nombre de minutes de tolérance après l'heure de début avant de
            marquer comme retard
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeShiftSettings;
