import { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import { enterOutline, exitOutline, pencilOutline } from "ionicons/icons";
import { presenceService } from "../services/presenceService";
import { employeeService } from "../services/employeeService";
import EditPresenceModal from "./EditPresenceModal";

const PresenceTable = () => {
  const [employees, setEmployees] = useState([]);
  const [todayPresence, setTodayPresence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPresence, setSelectedPresence] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
    // Refresh data every minute
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesData, presenceData] = await Promise.all([
        employeeService.getAllEmployees(),
        presenceService.getTodayPresence(),
      ]);
      setEmployees(employeesData);
      setTodayPresence(presenceData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (employeeId) => {
    try {
      await presenceService.checkIn(employeeId);
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckOut = async (presence) => {
    try {
      await presenceService.checkOut(presence);
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const getEmployeePresence = (employeeId) => {
    return todayPresence.find((p) => p.employee._id === employeeId);
  };

  const handleEdit = (presence) => {
    setSelectedPresence(presence);
    setIsEditModalOpen(true);
  };

  const handleUpdatePresence = async (updatedPresence) => {
    try {
      await presenceService.updatePresence(updatedPresence);
      await fetchData();
      setIsEditModalOpen(false);
      setSelectedPresence(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-4">Chargement...</div>;
  if (error)
    return <div className="text-center text-red-500 py-4">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employé
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
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
          {employees.map((employee) => {
            const presence = getEmployeePresence(employee._id);
            return (
              <tr key={employee._id}>
                <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {employee.employeeType === "regular" ? "Régulier" : "Backup"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {presence?.checkInTime || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {presence?.checkOutTime || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {presence?.totalHours
                    ? `${presence.totalHours.toFixed(2)}h`
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  {!presence ? (
                    <button
                      onClick={() => handleCheckIn(employee._id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <IonIcon icon={enterOutline} className="mr-1" />
                      Arrivée
                    </button>
                  ) : !presence.checkOutTime ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleCheckOut(presence)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <IonIcon icon={exitOutline} className="mr-1" />
                        Départ
                      </button>
                      <button
                        onClick={() => handleEdit(presence)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <IonIcon icon={pencilOutline} className="mr-1" />
                        Modifier
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Journée terminée</span>
                      <button
                        onClick={() => handleEdit(presence)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <IonIcon icon={pencilOutline} className="mr-1" />
                        Modifier
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isEditModalOpen && (
        <EditPresenceModal
          presence={selectedPresence}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPresence(null);
          }}
          onUpdate={handleUpdatePresence}
        />
      )}
    </div>
  );
};

export default PresenceTable;
