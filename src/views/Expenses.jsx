import { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import {
  createOutline,
  trashOutline,
  downloadOutline,
  calendarOutline,
} from "ionicons/icons";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ExpenseHeader from "../components/ExpenseComponents/ExpenseHeader";
import ExpenseModal from "../components/ExpenseComponents/ExpenseModal";
import { expenseService } from "../services/expenseService";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [isDateRangeMode, setIsDateRangeMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);

  const dayNames = ["DIM.", "LUN.", "MAR.", "MER.", "JEU.", "VEN.", "SAM."];
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
    fetchCategoryItems();
  }, [selectedDate, isDateRangeMode, dateRange]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      let data;
      if (isDateRangeMode) {
        data = await expenseService.getExpensesByDateRange(
          dateRange.startDate,
          dateRange.endDate
        );
      } else {
        data = await expenseService.getExpensesByDateRange(selectedDate);
      }
      setExpenses(data.expenses || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await expenseService.getAllExpenseCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchCategoryItems = async () => {
    try {
      const data = await expenseService.getAllExpenseCategoryItems();
      setCategoryItems(data);
    } catch (err) {
      console.error("Error fetching category items:", err);
    }
  };

  const formatAmount = (amount) => {
    if (!amount) return "0.00";
    // Handle Decimal128 from MongoDB
    if (typeof amount === "object" && amount.$numberDecimal) {
      return Number(amount.$numberDecimal).toFixed(2);
    }
    // Handle regular numbers
    return Number(amount).toFixed(2);
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense) => {
    // Convert Decimal128 to number for editing
    const formattedExpense = {
      ...expense,
      amount: expense.amount.$numberDecimal
        ? Number(expense.amount.$numberDecimal)
        : Number(expense.amount),
    };
    setEditingExpense(formattedExpense);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = async (expenseId) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette dépense ?"
    );

    if (confirmDelete) {
      try {
        await expenseService.deleteExpense(expenseId);
        fetchExpenses();
      } catch (error) {
        alert("Erreur lors de la suppression de la dépense");
      }
    }
  };

  const handleExpenseSubmit = async (expenseData) => {
    try {
      const now = new Date();
      const currentTime = now.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const data = {
        ...expenseData,
        time: currentTime,
        date: selectedDate,
      };

      if (editingExpense) {
        await expenseService.updateExpense(editingExpense._id, data);
      } else {
        await expenseService.createExpense(data);
      }
      setIsModalOpen(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (error) {
      alert("Erreur lors de l'enregistrement de la dépense");
    }
  };

  const calculateTotal = (expenses) => {
    return expenses.reduce((total, expense) => {
      const amount = expense.amount.$numberDecimal
        ? Number(expense.amount.$numberDecimal)
        : Number(expense.amount);
      return total + amount;
    }, 0);
  };

  const exportToExcel = () => {
    // Prepare data for export
    const exportData = expenses.map((expense) => ({
      Date: new Date(expense.date).toLocaleDateString(),
      Heure: expense.time,
      Catégorie: expense.categoryItem?.category?.name || "",
      Article: expense.categoryItem?.name || "",
      Montant: formatAmount(expense.amount) + " DT",
      Description: expense.description || "",
    }));

    // Add total row
    exportData.push({
      Date: "",
      Heure: "",
      Catégorie: "TOTAL",
      Article: "",
      Montant: formatAmount(calculateTotal(expenses)) + " DT",
      Description: "",
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Style the total row
    const lastRow = exportData.length;
    ws["!rows"] = ws["!rows"] || [];
    ws["!rows"][lastRow - 1] = { font: { bold: true } };

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dépenses");

    // Generate filename with date range or single date
    const fileName = isDateRangeMode
      ? `depenses_${dateRange.startDate}_to_${dateRange.endDate}.xlsx`
      : `depenses_${selectedDate}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
  };

  const exportToPDF = () => {
    // Initialize PDF document
    const doc = new jsPDF();

    // Add title with appropriate date range
    doc.setFontSize(16);
    const title = isDateRangeMode
      ? `Dépenses du ${new Date(
          dateRange.startDate
        ).toLocaleDateString()} au ${new Date(
          dateRange.endDate
        ).toLocaleDateString()}`
      : `Dépenses du ${new Date(selectedDate).toLocaleDateString()}`;
    doc.text(title, 14, 15);

    // Prepare data for the table
    const tableData = expenses.map((expense) => [
      new Date(expense.date).toLocaleDateString(),
      expense.time,
      expense.categoryItem?.category?.name || "",
      expense.categoryItem?.name || "",
      formatAmount(expense.amount) + " DT",
      expense.description || "",
    ]);

    // Add total row
    tableData.push([
      "",
      "",
      "TOTAL",
      "",
      formatAmount(calculateTotal(expenses)) + " DT",
      "",
    ]);

    // Add table using the imported autoTable
    autoTable(doc, {
      head: [
        ["Date", "Heure", "Catégorie", "Article", "Montant", "Description"],
      ],
      body: tableData,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      theme: "grid",
    });

    // Generate filename with date range or single date
    const fileName = isDateRangeMode
      ? `depenses_${dateRange.startDate}_to_${dateRange.endDate}.pdf`
      : `depenses_${selectedDate}.pdf`;

    // Save PDF
    doc.save(fileName);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ExpenseHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        handleAddExpense={handleAddExpense}
        dayNames={dayNames}
        months={months}
      />

      <div className="px-4 sm:px-8 md:px-12 lg:px-20 py-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="text-xl font-semibold text-gray-800">
              Total: {formatAmount(calculateTotal(expenses))} DT
            </div>
            <button
              onClick={() => setIsDateRangeMode(!isDateRangeMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                isDateRangeMode
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <IonIcon icon={calendarOutline} className="text-xl" />
              {isDateRangeMode ? "Mode Date Unique" : "Mode Plage de Dates"}
            </button>
          </div>
          <div className="flex gap-2">
            {isDateRangeMode && (
              <div className="flex items-center gap-2 mr-4">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="px-2 py-1 border rounded"
                />
                <span>à</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="px-2 py-1 border rounded"
                />
              </div>
            )}
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <IonIcon icon={downloadOutline} className="text-xl" />
              Excel
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <IonIcon icon={downloadOutline} className="text-xl" />
              PDF
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
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
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {expense.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {expense.categoryItem?.category?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {expense.categoryItem?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatAmount(expense.amount)} DT
                  </td>
                  <td className="px-6 py-4">{expense.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditExpense(expense)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <IonIcon icon={createOutline} className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="text-rose-600 hover:text-rose-900"
                    >
                      <IonIcon icon={trashOutline} className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length > 0 && (
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-6 py-4 whitespace-nowrap">Total</td>
                  <td></td>
                  <td></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatAmount(calculateTotal(expenses))} DT
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ExpenseModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingExpense(null);
          }}
          onSubmit={handleExpenseSubmit}
          expense={editingExpense}
          categories={categories}
          categoryItems={categoryItems}
        />
      )}
    </div>
  );
};

export default Expenses;
