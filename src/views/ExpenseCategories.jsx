import { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import {
  addOutline,
  createOutline,
  trashOutline,
  searchOutline,
  listOutline,
  gridOutline,
  closeOutline,
} from "ionicons/icons";

const ExpenseCategories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState("categories"); // 'categories' or 'items'
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
    fetchCategoryItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/expenses/categories"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryItems = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/expenses/category-items"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch category items");
      }
      const data = await response.json();
      setCategoryItems(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({ name: "", description: "" });
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || "",
    });
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible."
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/expenses/categories/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete category");
      }

      // Refresh the categories list after successful deletion
      fetchCategories();
      alert("Catégorie supprimée avec succès");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAddCategoryItem = async () => {
    // TODO: Implement add category item functionality
    console.log("Add category item");
  };

  const handleEditCategoryItem = async (item) => {
    // TODO: Implement edit category item functionality
    console.log("Edit category item", item);
  };

  const handleDeleteCategoryItem = async (itemId) => {
    // TODO: Implement delete category item functionality
    console.log("Delete category item", itemId);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    if (categoryFormData.name.length < 2) {
      alert("Le nom doit contenir au moins 2 caractères");
      return;
    }

    try {
      const url = editingCategory
        ? `http://localhost:3000/api/expenses/categories/${editingCategory.id}`
        : "http://localhost:3000/api/expenses/categories";

      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryFormData),
      });

      if (response.ok) {
        setIsCategoryModalOpen(false);
        setEditingCategory(null);
        setCategoryFormData({ name: "", description: "" });
        fetchCategories(); // Refresh the categories list
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Une erreur est survenue lors de l'enregistrement de la catégorie");
    }
  };

  if (loading) {
    return <div className="p-4 mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 mt-20 text-red-600">Error: {error}</div>;
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategoryItems = categoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || item.category.id === selectedCategory)
  );

  return (
    <div className="min-h-screen container mx-auto px-4 py-8 mt-20 bg-gray-50">
      {/* View Toggle Buttons */}
      <div className="flex justify-end mb-6 space-x-4">
        <button
          onClick={() => setViewMode("categories")}
          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
            viewMode === "categories"
              ? "bg-rose-600 text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          <IonIcon icon={gridOutline} className="mr-2" />
          Catégories
        </button>
        <button
          onClick={() => setViewMode("items")}
          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
            viewMode === "items"
              ? "bg-rose-600 text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          <IonIcon icon={listOutline} className="mr-2" />
          Éléments
        </button>
      </div>

      {/* Categories View */}
      <div
        className={`transition-all duration-500 transform min-h-[calc(100vh-12rem)] ${
          viewMode === "categories"
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-full hidden"
        }`}
      >
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Categories de dépenses</h2>
            <button
              onClick={handleAddCategory}
              className="bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-rose-700"
            >
              <IonIcon icon={addOutline} className="mr-1" />
              Ajouter une catégorie
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <IonIcon icon={searchOutline} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Rechercher une catégorie..."
                  className="bg-transparent w-full focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.name}
                    </td>
                    <td className="px-6 py-4">{category.description}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <IonIcon icon={createOutline} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-rose-600 hover:text-rose-900"
                      >
                        <IonIcon icon={trashOutline} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Category Items View */}
      <div
        className={`transition-all duration-500 transform min-h-[calc(100vh-12rem)] ${
          viewMode === "items"
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-full hidden"
        }`}
      >
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Éléments de catégorie</h2>
            <button
              onClick={handleAddCategoryItem}
              className="bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-rose-700"
            >
              <IonIcon icon={addOutline} className="mr-1" />
              Ajouter un élément
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b space-y-4">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <IonIcon icon={searchOutline} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Rechercher un élément..."
                  className="bg-transparent w-full focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="w-full p-2 border rounded-lg"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategoryItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.category?.name}
                    </td>
                    <td className="px-6 py-4">{item.description}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditCategoryItem(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <IonIcon icon={createOutline} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategoryItem(item.id)}
                        className="text-rose-600 hover:text-rose-900"
                      >
                        <IonIcon icon={trashOutline} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-32">
          <div
            className="bg-white rounded-lg w-full max-w-md animate-modal-slide-down"
            style={{
              maxHeight: "calc(100vh - 10rem)",
              overflowY: "auto",
            }}
          >
            <div className="sticky top-0 bg-white p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">
                  {editingCategory
                    ? "Modifier la catégorie"
                    : "Nouvelle catégorie"}
                </h3>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <IonIcon icon={closeOutline} className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleCategorySubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={categoryFormData.name}
                      onChange={(e) =>
                        setCategoryFormData({
                          ...categoryFormData,
                          name: e.target.value,
                        })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={categoryFormData.description}
                      onChange={(e) =>
                        setCategoryFormData({
                          ...categoryFormData,
                          description: e.target.value,
                        })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 transition-colors"
                      rows="3"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
                  >
                    {editingCategory ? "Modifier" : "Créer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseCategories;
