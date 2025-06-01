import { useState, useEffect } from "react";
import { presenceService } from "../services/presenceService";
import { employeeService } from "../services/employeeService";
import { FaPlus, FaTimes } from "react-icons/fa";

const EmployeeMonthlyPresence = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddAdvanceModal, setShowAddAdvanceModal] = useState(false);
  const [newAdvance, setNewAdvance] = useState({
    amount: "",
    reason: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      fetchMonthlyData();
    }
  }, [selectedEmployee, currentMonth]);

  const loadEmployees = async () => {
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      if (data.length > 0) {
        setSelectedEmployee(data[0]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchMonthlyData = async () => {
    try {
      setLoading(true);
      const startDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
      );
      const endDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
      );

      const data = await presenceService.getEmployeePresence(
        selectedEmployee._id,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );
      setMonthlyData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const changeMonth = (increment) => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + increment,
        1
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "late":
        return "bg-yellow-100 text-yellow-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "excused":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "present":
        return "Présent";
      case "late":
        return "En retard";
      case "absent":
        return "Absent";
      case "excused":
        return "Excusé";
      default:
        return status;
    }
  };

  const calculateMonthlyStats = () => {
    const stats = {
      totalDays: monthlyData.length,
      presentDays: 0,
      lateDays: 0,
      absentDays: 0,
      excusedDays: 0,
      totalHours: 0,
    };

    monthlyData.forEach((day) => {
      switch (day.status) {
        case "present":
          stats.presentDays++;
          break;
        case "late":
          stats.lateDays++;
          break;
        case "absent":
          stats.absentDays++;
          break;
        case "excused":
          stats.excusedDays++;
          break;
      }
      stats.totalHours += day.totalHours || 0;
    });

    return stats;
  };

  const handleMarkPresent = async (day) => {
    try {
      const updateData = {
        employee: selectedEmployee._id,
        date: day.date,
        status: "present",
        checkInTime: "00:00",
        checkOutTime: null,
        totalHours: 0,
      };
      await presenceService.updatePresence(day._id, updateData);
      await fetchMonthlyData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMarkDayOff = async (day) => {
    try {
      const updateData = {
        employee: selectedEmployee._id,
        date: day.date,
        status: "excused",
        checkInTime: "00:00",
        checkOutTime: null,
        totalHours: 0,
      };
      await presenceService.updatePresence(day._id, updateData);
      await fetchMonthlyData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMarkAbsent = async (day) => {
    try {
      const updateData = {
        employee: selectedEmployee._id,
        date: day.date,
        status: "absent",
        checkInTime: "00:00",
        checkOutTime: null,
        totalHours: 0,
      };
      await presenceService.updatePresence(day._id, updateData);
      await fetchMonthlyData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddAdvance = async () => {
    if (!newAdvance.amount || !newAdvance.reason) return;

    try {
      // Here you would typically make an API call to save the advance
      // For now, we'll just update the UI
      const advance = {
        id: Date.now(), // temporary ID
        amount: Number(newAdvance.amount),
        reason: newAdvance.reason,
        date: newAdvance.date,
      };

      // Update the employee's advances
      setSelectedEmployee((prev) => ({
        ...prev,
        advances: [...(prev.advances || []), advance],
      }));

      // Reset form and close modal
      setNewAdvance({
        amount: "",
        reason: "",
        date: new Date().toISOString().split("T")[0],
      });
      setShowAddAdvanceModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const AdvanceModal = () => {
    if (!showAddAdvanceModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Ajouter un acompte
            </h2>
            <button
              onClick={() => setShowAddAdvanceModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant
              </label>
              <input
                type="number"
                value={newAdvance.amount}
                onChange={(e) =>
                  setNewAdvance({ ...newAdvance, amount: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Entrez le montant"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raison
              </label>
              <input
                type="text"
                value={newAdvance.reason}
                onChange={(e) =>
                  setNewAdvance({ ...newAdvance, reason: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Entrez la raison"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={newAdvance.date}
                onChange={(e) =>
                  setNewAdvance({ ...newAdvance, date: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              onClick={handleAddAdvance}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              Ajouter l'acompte
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading && !monthlyData.length) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  return (
    <div>
      {/* Employee Selector */}
      <div className="mb-6">
        <label
          htmlFor="employee"
          className="block text-sm font-medium text-gray-700"
        >
          Sélectionner un employé
        </label>
        <select
          id="employee"
          value={selectedEmployee?._id || ""}
          onChange={(e) =>
            setSelectedEmployee(
              employees.find((emp) => emp._id === e.target.value)
            )
          }
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
        >
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.name} (
              {employee.employeeType === "regular" ? "Régulier" : "Backup"})
            </option>
          ))}
        </select>
      </div>

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => changeMonth(-1)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Mois précédent
        </button>
        <h2 className="text-xl font-semibold text-gray-900">
          {formatDate(currentMonth)}
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Mois suivant
        </button>
      </div>

      {/* Monthly Stats */}
      {selectedEmployee && monthlyData.length > 0 && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {Object.entries(calculateMonthlyStats()).map(([key, value]) => (
              <div
                key={key}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {key === "totalDays" && "Jours totaux"}
                    {key === "presentDays" && "Jours présent"}
                    {key === "lateDays" && "Jours en retard"}
                    {key === "absentDays" && "Jours absent"}
                    {key === "excusedDays" && "Jours excusés"}
                    {key === "totalHours" && "Heures totales"}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {key === "totalHours" ? `${value.toFixed(1)}h` : value}
                  </dd>
                </div>
              </div>
            ))}
          </div>

          {/* Advances Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Acomptes</h3>
              <button
                onClick={() => setShowAddAdvanceModal(true)}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <FaPlus />
                <span>Ajouter un acompte</span>
              </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {selectedEmployee.advances?.length > 0 ? (
                  selectedEmployee.advances.map((advance) => (
                    <div key={advance.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(advance.date).toLocaleDateString("fr-FR")}
                          </p>
                          <p className="text-sm text-gray-500">
                            {advance.reason}
                          </p>
                        </div>
                        <span className="text-lg font-semibold text-red-600">
                          {advance.amount.toLocaleString("fr-FR")} TND
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Aucun acompte enregistré
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Presence Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Heure d'arrivée
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Heure de départ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Heures totales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {monthlyData.map((day) => (
              <tr key={day._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(day.date).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      day.status
                    )}`}
                  >
                    {getStatusText(day.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {day.checkInTime || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {day.checkOutTime || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {day.totalHours ? `${day.totalHours.toFixed(1)}h` : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMarkPresent(day)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Marquer présent
                    </button>
                    <button
                      onClick={() => handleMarkDayOff(day)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Marquer congé
                    </button>
                    <button
                      onClick={() => handleMarkAbsent(day)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Marquer absent
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdvanceModal />
    </div>
  );
};

export default EmployeeMonthlyPresence;
