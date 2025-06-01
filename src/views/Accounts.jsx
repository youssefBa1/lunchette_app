import { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import {
  addOutline,
  searchOutline,
  createOutline,
  trashOutline,
  personOutline,
  eyeOutline,
  eyeOffOutline,
} from "ionicons/icons";
import userService from "../services/userService";

const Accounts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingAccount, setEditingAccount] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accountForm, setAccountForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "worker",
    phone: "",
    isActive: true,
  });

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAllUsers();
      console.log("Fetched accounts:", data); // Debug log
      setAccounts(data);
    } catch (err) {
      setError("Failed to fetch accounts. Please try again later.");
      console.error("Error fetching accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      setError(null);
      console.log("Form status before sending:", accountForm.isActive); // Debug log

      const userData = {
        username: accountForm.name,
        email: accountForm.email,
        password: accountForm.password,
        role: accountForm.role,
        isActive: accountForm.isActive,
        phone: accountForm.phone,
      };
      console.log("User data being sent:", userData); // Debug log

      if (editingAccount) {
        // Update existing account
        const updatedUser = await userService.updateUser(
          editingAccount._id,
          userData
        );
        console.log("Response from update:", updatedUser); // Debug log
        setAccounts(
          accounts.map((acc) =>
            acc._id === updatedUser._id ? updatedUser : acc
          )
        );
      } else {
        // Create new account
        const newUser = await userService.createUser(userData);
        console.log("Response from create:", newUser); // Debug log
        setAccounts([...accounts, newUser]);
      }

      // Reset form and close modal
      setAccountForm({
        name: "",
        email: "",
        password: "",
        role: "worker",
        phone: "",
        isActive: true,
      });
      setEditingAccount(null);
      setIsModalOpen(false);
      setShowPassword(false);
    } catch (err) {
      console.error("Error details:", err); // Debug log
      setError(err.message || "Failed to save account. Please try again.");
    }
  };

  const handleEditAccount = (account) => {
    console.log("Account being edited:", account); // Debug log
    setEditingAccount(account);
    setAccountForm({
      name: account.username,
      email: account.email,
      password: "",
      role: account.role,
      phone: account.phone || "",
      isActive: account.isActive,
    });
    console.log("Form after setting:", accountForm); // Debug log
    setIsModalOpen(true);
  };

  const handleDeleteAccount = async (id) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        setError(null);
        await userService.deleteUser(id);
        setAccounts(accounts.filter((acc) => acc._id !== id));
      } catch (err) {
        setError(err.message || "Failed to delete account. Please try again.");
        console.error("Error deleting account:", err);
      }
    }
  };

  const filteredAccounts = accounts.filter(
    (account) =>
      account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (account.phone && account.phone.includes(searchQuery)) ||
      account.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add validation before submitting
  const validateForm = () => {
    if (!accountForm.name || !accountForm.email) {
      setError("Name and email are required");
      return false;
    }
    if (!editingAccount && !accountForm.password) {
      setError("Password is required for new accounts");
      return false;
    }
    if (!accountForm.isActive) {
      setError("Status is required");
      return false;
    }
    return true;
  };

  if (loading) {
    return (
      <div className="p-8 mt-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-300"></div>
      </div>
    );
  }

  return (
    <div className="p-8 mt-20">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Comptes</h1>
        <button
          onClick={() => {
            setEditingAccount(null);
            setAccountForm({
              name: "",
              email: "",
              password: "",
              role: "worker",
              phone: "",
              isActive: true,
            });
            setIsModalOpen(true);
          }}
          className="bg-rose-300 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-rose-400"
        >
          <IonIcon icon={addOutline} />
          Ajouter un Compte
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un compte..."
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

      {/* Accounts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.map((account) => (
                <tr key={account._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                          <IonIcon
                            icon={personOutline}
                            className="text-rose-500"
                            style={{ fontSize: "24px" }}
                          />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {account.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{account.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        account.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {account.role === "admin"
                        ? "Administrateur"
                        : "Travailleur"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {account.phone || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        account.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {account.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditAccount(account)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <IonIcon
                          icon={createOutline}
                          style={{ fontSize: "20px" }}
                        />
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account._id)}
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

      {/* Add/Edit Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-start justify-center z-50 pt-24">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              {editingAccount ? "Modifier le Compte" : "Ajouter un Compte"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={accountForm.name}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="Entrer le nom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={accountForm.email}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="Entrer l'email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={accountForm.password}
                    onChange={(e) =>
                      setAccountForm({
                        ...accountForm,
                        password: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    placeholder={
                      editingAccount
                        ? "Laisser vide pour ne pas modifier"
                        : "Entrer le mot de passe"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <IonIcon
                      icon={showPassword ? eyeOffOutline : eyeOutline}
                      className="text-gray-400 hover:text-gray-600"
                    />
                  </button>
                </div>
                {editingAccount && (
                  <p className="mt-1 text-sm text-gray-500">
                    Laisser vide pour conserver le mot de passe actuel
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle
                </label>
                <select
                  value={accountForm.role}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                  <option value="worker">Travailleur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={accountForm.phone}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="Entrer le numéro de téléphone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  value={accountForm.isActive ? "active" : "inactive"}
                  onChange={(e) =>
                    setAccountForm({
                      ...accountForm,
                      isActive: e.target.value === "active",
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingAccount(null);
                  setAccountForm({
                    name: "",
                    email: "",
                    password: "",
                    role: "worker",
                    phone: "",
                    isActive: true,
                  });
                  setShowPassword(false);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={handleAddAccount}
                className="bg-rose-300 text-white px-4 py-2 rounded-lg hover:bg-rose-400"
              >
                {editingAccount ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
