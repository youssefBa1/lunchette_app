import { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import {
  createOutline,
  trashOutline,
  addCircleOutline,
  closeOutline,
} from "ionicons/icons";
import { employeeService } from "../../services/employeeService";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    salaryType: "monthly",
    employeeType: "regular",
    baseSalary: "",
    shiftStart: "09:00",
    shiftEnd: "17:00",
    lateThreshold: 10,
  });

  // Fetch employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
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
      if (selectedEmployee) {
        await employeeService.updateEmployee(selectedEmployee._id, formData);
      } else {
        await employeeService.createEmployee(formData);
      }
      await fetchEmployees();
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      try {
        await employeeService.deleteEmployee(id);
        await fetchEmployees();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await employeeService.toggleEmployeeStatus(id);
      await fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenModal = (employee = null) => {
    if (employee) {
      setSelectedEmployee(employee);
      setFormData({
        name: employee.name,
        phoneNumber: employee.phoneNumber,
        salaryType: employee.salaryType,
        employeeType: employee.employeeType,
        baseSalary: employee.baseSalary,
        shiftStart: employee.shiftStart || "09:00",
        shiftEnd: employee.shiftEnd || "17:00",
        lateThreshold: employee.lateThreshold || 10,
      });
    } else {
      setSelectedEmployee(null);
      setFormData({
        name: "",
        phoneNumber: "",
        salaryType: "monthly",
        employeeType: "regular",
        baseSalary: "",
        shiftStart: "09:00",
        shiftEnd: "17:00",
        lateThreshold: 10,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setFormData({
      name: "",
      phoneNumber: "",
      salaryType: "monthly",
      employeeType: "regular",
      baseSalary: "",
      shiftStart: "09:00",
      shiftEnd: "17:00",
      lateThreshold: 10,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) return <div className="text-center py-4">Chargement...</div>;
  if (error)
    return <div className="text-center text-red-500 py-4">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Employés</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
        >
          <IonIcon icon={addCircleOutline} className="text-xl" />
          <span>Ajouter un employé</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salaire
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {employee.phoneNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {employee.employeeType === "regular" ? "Régulier" : "Backup"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {employee.baseSalary} DT ({employee.salaryType})
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleStatus(employee._id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      employee.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {employee.isActive ? "Actif" : "Inactif"}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(employee)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <IonIcon icon={createOutline} className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(employee._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <IonIcon icon={trashOutline} className="text-xl" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-start justify-center z-50 pt-32">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {selectedEmployee ? "Modifier" : "Ajouter"} un employé
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <IonIcon icon={closeOutline} className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type d'employé
                </label>
                <select
                  name="employeeType"
                  value={formData.employeeType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                >
                  <option value="regular">Régulier</option>
                  <option value="backup">Backup</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type de salaire
                </label>
                <select
                  name="salaryType"
                  value={formData.salaryType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  disabled={formData.employeeType === "backup"}
                >
                  <option value="daily">Journalier</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Salaire de base
                </label>
                <input
                  type="number"
                  name="baseSalary"
                  value={formData.baseSalary}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Horaires de travail
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Heure de début
                    </label>
                    <input
                      type="time"
                      name="shiftStart"
                      value={formData.shiftStart}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Heure de fin
                    </label>
                    <input
                      type="time"
                      name="shiftEnd"
                      value={formData.shiftEnd}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Seuil de retard (minutes)
                  </label>
                  <input
                    type="number"
                    name="lateThreshold"
                    value={formData.lateThreshold}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    min="0"
                    max="60"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Minutes de tolérance après l'heure de début avant de marquer
                    comme retard
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  {selectedEmployee ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
