import { useState, useEffect, useRef } from "react";
import { IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";

const ExpenseModal = ({
  isOpen,
  onClose,
  onSubmit,
  expense = null,
  categories,
  categoryItems,
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    categoryItem: "",
    amount: "",
    description: "",
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    if (expense) {
      setFormData({
        date: expense.date.split("T")[0],
        categoryItem: expense.categoryItem._id,
        amount: expense.amount,
        description: expense.description || "",
      });
      setSelectedCategory(expense.categoryItem.category._id);
    } else {
      resetForm();
    }
  }, [expense]);

  useEffect(() => {
    setFilteredItems(
      categoryItems.filter((item) => item.category._id === selectedCategory)
    );
  }, [selectedCategory, categoryItems]);

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      categoryItem: "",
      amount: "",
      description: "",
    });
    setSelectedCategory("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    resetForm();
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-md p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <IonIcon icon={closeOutline} className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {expense ? "Modifier la dépense" : "Nouvelle dépense"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Article
            </label>
            <select
              value={formData.categoryItem}
              onChange={(e) =>
                setFormData({ ...formData, categoryItem: e.target.value })
              }
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              required
              disabled={!selectedCategory}
            >
              <option value="">Sélectionner un article</option>
              {filteredItems.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              rows="3"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              {expense ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
