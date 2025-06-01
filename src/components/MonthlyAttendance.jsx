import { useState, useEffect } from "react";
import { presenceService } from "../services/presenceService";
import { employeeService } from "../services/employeeService";

const MonthlyAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [monthlyData, setMonthlyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, [currentMonth]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const employeesData = await employeeService.getAllEmployees();
      setEmployees(employeesData);

      // Calculate start and end dates for the month
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

      // Fetch presence data for all employees
      const presencePromises = employeesData.map((employee) =>
        presenceService.getEmployeePresence(
          employee._id,
          startDate.toISOString().split("T")[0],
          endDate.toISOString().split("T")[0]
        )
      );

      const presenceData = await Promise.all(presencePromises);

      // Organize data by employee
      const monthlyPresence = {};
      employeesData.forEach((employee, index) => {
        monthlyPresence[employee._id] = presenceData[index];
      });

      setMonthlyData(monthlyPresence);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    return new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
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

  if (loading) return <div className="text-center py-4">Chargement...</div>;
  if (error)
    return <div className="text-center text-red-500 py-4">{error}</div>;

  return (
    <div>
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

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                Employé
              </th>
              {[...Array(getDaysInMonth())].map((_, index) => (
                <th
                  key={index + 1}
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                >
                  {index + 1}
                </th>
              ))}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Heures
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => {
              const employeePresence = monthlyData[employee._id] || [];
              const totalHours = employeePresence.reduce(
                (sum, p) => sum + (p.totalHours || 0),
                0
              );

              return (
                <tr key={employee._id}>
                  <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.employeeType === "regular"
                            ? "Régulier"
                            : "Backup"}
                        </div>
                      </div>
                    </div>
                  </td>
                  {[...Array(getDaysInMonth())].map((_, index) => {
                    const date = new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth(),
                      index + 1
                    )
                      .toISOString()
                      .split("T")[0];
                    const dayPresence = employeePresence.find(
                      (p) => p.date.split("T")[0] === date
                    );

                    return (
                      <td key={index} className="px-3 py-4">
                        {dayPresence ? (
                          <div
                            className={`text-center text-xs rounded-full py-1 ${getStatusColor(
                              dayPresence.status
                            )}`}
                          >
                            {dayPresence.totalHours?.toFixed(1) || "-"}h
                          </div>
                        ) : (
                          <div className="text-center text-xs text-gray-400">
                            -
                          </div>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="font-medium">
                      {totalHours.toFixed(1)}h
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center space-x-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-100 mr-2"></div>
          <span className="text-sm text-gray-600">Présent</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-100 mr-2"></div>
          <span className="text-sm text-gray-600">En retard</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-100 mr-2"></div>
          <span className="text-sm text-gray-600">Absent</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-100 mr-2"></div>
          <span className="text-sm text-gray-600">Excusé</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyAttendance;
