import { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import {
  addOutline,
  searchOutline,
  createOutline,
  trashOutline,
} from "ionicons/icons";
import axios from "axios";

// Helper function to format decimal values
const formatDecimal = (value) => {
  if (!value) return "0";
  if (typeof value === "object" && value.$numberDecimal) {
    return value.$numberDecimal;
  }
  return value.toString();
};

const Suppliers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    type: "",
    phoneNumber: "",
    notes: "",
  });

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/suppliers");
      setSuppliers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch suppliers: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async () => {
    try {
      if (editingSupplier) {
        await axios.put(
          `http://localhost:3000/api/suppliers/${editingSupplier._id}`,
          supplierForm
        );
      } else {
        await axios.post("http://localhost:3000/api/suppliers", supplierForm);
      }
      await fetchSuppliers(); // Refresh the list
      setSupplierForm({ name: "", type: "", phoneNumber: "", notes: "" });
      setEditingSupplier(null);
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to save supplier: " + err.message);
    }
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setSupplierForm({
      name: supplier.name,
      type: supplier.type,
      phoneNumber: supplier.phoneNumber,
      notes: supplier.notes || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteSupplier = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/suppliers/${id}`);
      await fetchSuppliers(); // Refresh the list
    } catch (err) {
      setError("Failed to delete supplier: " + err.message);
    }
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.phoneNumber.includes(searchQuery) ||
      (supplier.notes &&
        supplier.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <div className="p-8 mt-20">Loading...</div>;
  if (error) return <div className="p-8 mt-20 text-red-500">{error}</div>;

  return (
    <div className="p-8 mt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Fournisseurs</h1>
        <button
          onClick={() => {
            setEditingSupplier(null);
            setSupplierForm({
              name: "",
              type: "",
              phoneNumber: "",
              notes: "",
            });
            setIsModalOpen(true);
          }}
          className="bg-rose-300 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-rose-400"
        >
          <IonIcon icon={addOutline} />
          Ajouter un Fournisseur
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un fournisseur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <IonIcon
            icon={searchOutline}
            className="absolute left-3 top-2.5 text-gray-400"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dette
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {supplier.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{supplier.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {supplier.phoneNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDecimal(supplier.totalAmountOwed)} DT
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {supplier.notes}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditSupplier(supplier)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <IonIcon
                          icon={createOutline}
                          style={{ fontSize: "20px" }}
                        />
                      </button>
                      <button
                        onClick={() => handleDeleteSupplier(supplier._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <IonIcon
                          icon={trashOutline}
                          style={{ fontSize: "20px" }}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-start justify-center z-50 pt-24">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              {editingSupplier
                ? "Modifier le Fournisseur"
                : "Ajouter un Fournisseur"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du Fournisseur
                </label>
                <input
                  type="text"
                  value={supplierForm.name}
                  onChange={(e) =>
                    setSupplierForm({ ...supplierForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="Entrer le nom du fournisseur"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de Fournisseur
                </label>
                <input
                  type="text"
                  value={supplierForm.type}
                  onChange={(e) =>
                    setSupplierForm({ ...supplierForm, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="Ex: Légumes, Volaille, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={supplierForm.phoneNumber}
                  onChange={(e) =>
                    setSupplierForm({
                      ...supplierForm,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="Entrer le numéro de téléphone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={supplierForm.notes}
                  onChange={(e) =>
                    setSupplierForm({ ...supplierForm, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="Ajouter des notes (optionnel)"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingSupplier(null);
                  setSupplierForm({
                    name: "",
                    type: "",
                    phoneNumber: "",
                    notes: "",
                  });
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={handleAddSupplier}
                className="bg-rose-300 text-white px-4 py-2 rounded-lg hover:bg-rose-400"
              >
                {editingSupplier ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
