import { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import {
  addOutline,
  searchOutline,
  downloadOutline,
  createOutline,
  trashOutline,
} from "ionicons/icons";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import SupplierExpenseHeader from "../components/ExpenseComponents/SupplierExpenseHeader";

// Helper function to convert Decimal128 to string
const formatDecimal = (value) => {
  if (!value) return "0";
  if (typeof value === "object") {
    if (value.$numberDecimal) {
      return value.$numberDecimal;
    }
    if (value.toString) {
      return value.toString();
    }
  }
  return value.toString();
};

// Add date formatting function
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// Add a helper function for payment calculations
const calculatePaymentSummary = (expense) => {
  if (!expense) return { total: 0, paid: 0, remaining: 0 };

  const total = parseFloat(formatDecimal(expense.totalPrice)) || 0;

  // Calculate total paid from payment history
  let totalPaid = 0;
  if (expense.paymentHistory && expense.paymentHistory.length > 0) {
    totalPaid = expense.paymentHistory.reduce((sum, payment) => {
      return sum + (parseFloat(formatDecimal(payment.amount)) || 0);
    }, 0);
  }

  const remaining = total - totalPaid;

  return {
    total: total.toFixed(2),
    paid: totalPaid.toFixed(2),
    remaining: remaining.toFixed(2),
    status: remaining <= 0 ? "fully_paid" : "partially_paid",
  };
};

// Add a helper function for table display calculations
const calculateTablePaymentInfo = (expense) => {
  if (!expense) return { totalPaid: 0, remaining: 0, status: "partially_paid" };

  const total = parseFloat(formatDecimal(expense.totalPrice)) || 0;

  // Calculate total paid from payment history
  let totalPaid = 0;
  if (expense.paymentHistory && expense.paymentHistory.length > 0) {
    totalPaid = expense.paymentHistory.reduce((sum, payment) => {
      return sum + (parseFloat(formatDecimal(payment.amount)) || 0);
    }, 0);
  }

  const remaining = total - totalPaid;

  return {
    totalPaid: totalPaid.toFixed(2),
    remaining: remaining.toFixed(2),
    status: remaining <= 0 ? "fully_paid" : "partially_paid",
  };
};

const SupplierExpenses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [currentArticle, setCurrentArticle] = useState({
    name: "",
    displayName: "",
    amount: "",
    price: "",
  });
  const [expenses, setExpenses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [isDateRangeMode, setIsDateRangeMode] = useState(false);
  const [newPayment, setNewPayment] = useState("");

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

  // Fetch data on component mount and when date changes
  useEffect(() => {
    fetchData();
  }, [selectedDate, isDateRangeMode, dateRange]);

  // Fetch suppliers and category items on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [suppliersRes, categoryItemsRes] = await Promise.all([
          axios.get("http://localhost:3000/api/suppliers"),
          axios.get("http://localhost:3000/api/expenses/category-items"),
        ]);
        console.log("Fetched suppliers:", suppliersRes.data);
        setSuppliers(suppliersRes.data);
        setCategoryItems(categoryItemsRes.data);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("Erreur lors du chargement des données initiales");
      }
    };

    fetchInitialData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      let response;
      if (isDateRangeMode) {
        response = await axios.get(
          `http://localhost:3000/api/supplier-expenses/date-range`,
          {
            params: {
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
            },
          }
        );
      } else {
        response = await axios.get(
          `http://localhost:3000/api/supplier-expenses/date/${selectedDate}`
        );
      }
      setExpenses(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError(
        err.response?.data?.message ||
          "Erreur lors de la récupération des dépenses"
      );
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddArticle = () => {
    if (
      !currentArticle.name ||
      !currentArticle.amount ||
      !currentArticle.price
    ) {
      setError("Please fill in all article fields");
      return;
    }

    const price = parseFloat(currentArticle.price);
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price");
      return;
    }

    const newArticle = {
      name: currentArticle.name,
      displayName: currentArticle.displayName,
      amount: currentArticle.amount,
      price: price.toFixed(2),
    };

    setSelectedArticles([...selectedArticles, newArticle]);
    setCurrentArticle({ name: "", displayName: "", amount: "", price: "" });
    setError(null);
  };

  const handleRemoveArticle = (index) => {
    const newArticles = selectedArticles.filter((_, i) => i !== index);
    setSelectedArticles(newArticles);
  };

  // Add a function to reset form state
  const resetFormState = () => {
    setSelectedArticles([]);
    setSelectedSupplier("");
    setAmountPaid("");
    setCurrentArticle({
      name: "",
      displayName: "",
      amount: "",
      price: "",
    });
    setError(null);
  };

  // Update the modal open handler
  const handleOpenModal = (mode = "add") => {
    if (mode === "add") {
      resetFormState();
      setIsEditMode(false);
      setEditingExpense(null);
    }
    setIsModalOpen(true);
  };

  // Update handleEdit to use the new modal handler
  const handleEdit = async (expense) => {
    console.log("Full expense data:", JSON.stringify(expense, null, 2));
    console.log("Supplier data:", expense.supplier);
    console.log("Expense items:", expense.expenseItems);

    // Format expense items first
    const formattedArticles = expense.expenseItems.map((item) => {
      console.log("Processing expense item:", item);
      const formatted = {
        name: item.categoryItem._id,
        displayName: item.categoryItem.name,
        amount: item.amount.toString(),
        price: formatDecimal(item.price),
      };
      console.log("Formatted article:", formatted);
      return formatted;
    });

    // Set all state values before opening modal
    setEditingExpense(expense);
    setSelectedSupplier(expense.supplier._id);
    setSelectedArticles(formattedArticles);
    setAmountPaid(formatDecimal(expense.amountPaid));

    // Wait for state to be updated
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Now open the modal
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette dépense ?")) {
      try {
        await axios.delete(
          `http://localhost:3000/api/supplier-expenses/${expenseId}`
        );
        await fetchData();
      } catch (err) {
        setError("Erreur lors de la suppression de la dépense");
        console.error("Error deleting expense:", err);
      }
    }
  };

  const calculateTotal = (articles) => {
    console.log("Calculating total for articles:", articles);
    if (!articles || articles.length === 0) {
      console.log("No articles to calculate total");
      return "0.00";
    }

    const total = articles
      .reduce((sum, article) => {
        console.log("Processing article:", article);
        const price = parseFloat(article.price) || 0;
        console.log("Parsed price:", price);
        return sum + price;
      }, 0)
      .toFixed(2);
    console.log("Final total:", total);
    return total;
  };

  // Update handleSubmit to reset form after submission
  const handleSubmit = async () => {
    try {
      console.log("Starting submit with state:", {
        selectedSupplier,
        selectedArticles,
        amountPaid,
        isEditMode,
        editingExpense,
      });
      setIsSubmitting(true);
      setError(null);

      if (!selectedSupplier) {
        setError("Please select a supplier");
        return;
      }

      if (selectedArticles.length === 0) {
        setError("Please add at least one article");
        return;
      }

      const totalPrice = parseFloat(calculateTotal(selectedArticles));
      console.log("Calculated total price:", totalPrice);
      const paidAmount = parseFloat(amountPaid || 0);
      console.log("Paid amount:", paidAmount);
      const restToBePaid = totalPrice - paidAmount;
      console.log("Rest to be paid:", restToBePaid);

      const expenseData = {
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
        supplier: selectedSupplier,
        expenseItems: selectedArticles.map((article) => {
          console.log("Mapping article for submission:", article);
          return {
            categoryItem: article.name,
            amount: article.amount,
            price: parseFloat(article.price) || 0,
          };
        }),
        totalPrice,
        paymentStatus: restToBePaid === 0 ? "fully_paid" : "partially_paid",
        amountPaid: paidAmount,
        restToBePaid,
      };
      console.log("Submitting expense data:", expenseData);

      if (isEditMode && editingExpense) {
        console.log("Updating existing expense:", editingExpense._id);
        await axios.put(
          `http://localhost:3000/api/supplier-expenses/${editingExpense._id}`,
          expenseData
        );
      } else {
        console.log("Creating new expense");
        await axios.post(
          "http://localhost:3000/api/supplier-expenses",
          expenseData
        );
      }

      // Reset form and close modal
      resetFormState();
      setIsModalOpen(false);
      setEditingExpense(null);

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error("Error creating/updating expense:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create/update expense. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate filtered expenses
  const filteredExpenses = expenses.filter((expense) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      expense.supplier.name.toLowerCase().includes(searchLower) ||
      expense.expenseItems.some((item) =>
        item.categoryItem.name.toLowerCase().includes(searchLower)
      )
    );
  });

  // Calculate totals
  const calculateTotals = (expenses) => {
    return expenses.reduce(
      (totals, expense) => {
        const paymentInfo = calculateTablePaymentInfo(expense);
        return {
          totalPrice:
            totals.totalPrice +
            (parseFloat(formatDecimal(expense.totalPrice)) || 0),
          totalPaid:
            totals.totalPaid + (parseFloat(paymentInfo.totalPaid) || 0),
          totalRemaining:
            totals.totalRemaining + (parseFloat(paymentInfo.remaining) || 0),
        };
      },
      { totalPrice: 0, totalPaid: 0, totalRemaining: 0 }
    );
  };

  // Update Excel export
  const exportToExcel = () => {
    const data = expenses.map((expense) => {
      const paymentInfo = calculateTablePaymentInfo(expense);
      return {
        Heure: expense.time,
        Date: formatDate(expense.date),
        Fournisseur: expense.supplier.name,
        Contenu: expense.expenseItems
          .map(
            (item) =>
              `${item.categoryItem.name}: ${item.amount} - ${formatDecimal(
                item.price
              )} TND`
          )
          .join("\n"),
        "Prix Total": `${formatDecimal(expense.totalPrice)} TND`,
        Statut: paymentInfo.status === "fully_paid" ? "Payé" : "En attente",
        "Montant Payé": `${paymentInfo.totalPaid} TND`,
        "Reste à Payer": `${paymentInfo.remaining} TND`,
      };
    });

    // Add totals row
    const totals = calculateTotals(expenses);
    data.push({
      Heure: "",
      Date: "",
      Fournisseur: "",
      Contenu: "TOTAUX",
      "Prix Total": `${totals.totalPrice.toFixed(2)} TND`,
      Statut: "",
      "Montant Payé": `${totals.totalPaid.toFixed(2)} TND`,
      "Reste à Payer": `${totals.totalRemaining.toFixed(2)} TND`,
    });

    const worksheet = XLSX.utils.json_to_sheet(data);

    // Style the totals row
    const lastRow = data.length;
    worksheet["!rows"] = worksheet["!rows"] || [];
    worksheet["!rows"][lastRow - 1] = { font: { bold: true } };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dépenses Fournisseurs");
    XLSX.writeFile(workbook, "depenses-fournisseurs.xlsx");
  };

  // Update PDF export
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Rapport des Dépenses Fournisseurs", 14, 15);

    // Add date range
    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleDateString("fr-FR")}`, 14, 25);

    // Prepare table data
    const tableData = [];
    expenses.forEach((expense) => {
      const paymentInfo = calculateTablePaymentInfo(expense);
      expense.expenseItems.forEach((item, index) => {
        tableData.push([
          index === 0 ? expense.time : "",
          index === 0 ? formatDate(expense.date) : "",
          index === 0 ? expense.supplier.name : "",
          `${item.categoryItem.name}: ${item.amount}`,
          `${formatDecimal(item.price)} TND`,
          index === 0
            ? paymentInfo.status === "fully_paid"
              ? "Payé"
              : "En attente"
            : "",
          index === 0 ? `${paymentInfo.totalPaid} TND` : "",
          index === 0 ? `${paymentInfo.remaining} TND` : "",
        ]);
      });
    });

    // Add totals row
    const totals = calculateTotals(expenses);
    tableData.push([
      "",
      "",
      "",
      "TOTAUX",
      `${totals.totalPrice.toFixed(2)} TND`,
      "",
      `${totals.totalPaid.toFixed(2)} TND`,
      `${totals.totalRemaining.toFixed(2)} TND`,
    ]);

    // Add table
    autoTable(doc, {
      head: [
        [
          "Heure",
          "Date",
          "Fournisseur",
          "Article",
          "Prix",
          "Statut",
          "Payé",
          "Reste",
        ],
      ],
      body: tableData,
      startY: 35,
      didDrawPage: function (data) {
        // Style the totals row
        const lastRow = data.table.body.length - 1;
        if (lastRow >= 0) {
          const row = data.table.body[lastRow];
          if (row && Array.isArray(row)) {
            row.forEach((cell) => {
              if (cell && cell.styles) {
                cell.styles.fontStyle = "bold";
              }
            });
          }
        }
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "left",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 20 }, // Heure
        1: { cellWidth: 25 }, // Date
        2: { cellWidth: 40 }, // Fournisseur
        3: { cellWidth: 50 }, // Article
        4: { cellWidth: 25 }, // Prix
        5: { cellWidth: 20 }, // Statut
        6: { cellWidth: 25 }, // Payé
        7: { cellWidth: 25 }, // Reste
      },
    });

    doc.save("depenses-fournisseurs.pdf");
  };

  const handleAddPayment = async () => {
    if (
      !newPayment ||
      isNaN(parseFloat(newPayment)) ||
      parseFloat(newPayment) <= 0
    ) {
      setError("Please enter a valid payment amount");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/supplier-expenses/${editingExpense._id}/payment`,
        { amount: parseFloat(newPayment).toFixed(2) }
      );

      // Update the expense in the list
      setExpenses(
        expenses.map((exp) =>
          exp._id === editingExpense._id ? response.data : exp
        )
      );

      // Update the editing expense with new payment history
      setEditingExpense(response.data);

      // Reset new payment input
      setNewPayment("");
      setError(null);
    } catch (err) {
      console.error("Error adding payment:", err);
      setError(err.response?.data?.message || "Failed to add payment");
    }
  };

  // Add debug logging for edit mode
  useEffect(() => {
    if (isEditMode && editingExpense) {
      console.log("Edit mode state updated:", {
        selectedSupplier,
        selectedArticles,
        amountPaid,
        editingExpense,
      });
    }
  }, [
    isEditMode,
    editingExpense,
    selectedSupplier,
    selectedArticles,
    amountPaid,
  ]);

  if (loading) {
    return (
      <div className="p-8 mt-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-300"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 mt-20">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SupplierExpenseHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        handleAddExpense={() => handleOpenModal("add")}
        dayNames={dayNames}
        months={months}
        isDateRangeMode={isDateRangeMode}
        setIsDateRangeMode={setIsDateRangeMode}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      <div className="px-4 sm:px-8 md:px-12 lg:px-20 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dépenses Fournisseurs</h1>
          <div className="flex gap-2">
            <button
              onClick={exportToExcel}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
            >
              <IonIcon icon={downloadOutline} />
              Excel
            </button>
            <button
              onClick={exportToPDF}
              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600"
            >
              <IonIcon icon={downloadOutline} />
              PDF
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher des dépenses..."
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

        {/* Expenses Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fournisseur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contenu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant Payé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reste à Payer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map((expense) => {
                const paymentInfo = calculateTablePaymentInfo(expense);
                return (
                  <tr key={expense._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {expense.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {expense.supplier.name}
                    </td>
                    <td className="px-6 py-4">
                      {expense.expenseItems.map((item, index) => (
                        <div key={index}>
                          {item.categoryItem.name}: {item.amount} -{" "}
                          {formatDecimal(item.price)} TND
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDecimal(expense.totalPrice)} TND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          paymentInfo.status === "fully_paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {paymentInfo.status === "fully_paid"
                          ? "Payé"
                          : "En attente"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {paymentInfo.totalPaid} TND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {paymentInfo.remaining} TND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                          title="Modifier"
                        >
                          <IonIcon icon={createOutline} className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                          title="Supprimer"
                        >
                          <IonIcon icon={trashOutline} className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {/* Add totals row */}
              {filteredExpenses.length > 0 &&
                (() => {
                  const totals = calculateTotals(filteredExpenses);
                  return (
                    <tr className="bg-gray-50 font-semibold">
                      <td colSpan="4" className="px-6 py-4 text-right">
                        Totaux:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {totals.totalPrice.toFixed(2)} TND
                      </td>
                      <td></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {totals.totalPaid.toFixed(2)} TND
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {totals.totalRemaining.toFixed(2)} TND
                      </td>
                      <td></td>
                    </tr>
                  );
                })()}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Expense Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-start justify-center z-50 pt-24">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl">
              <h2 className="text-xl font-bold mb-4">
                {isEditMode
                  ? "Modifier la Dépense"
                  : "Ajouter une Nouvelle Dépense"}
              </h2>

              {error && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {/* Supplier Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fournisseur
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="">Sélectionner un fournisseur</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Article Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ajouter un Article
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Rechercher un article..."
                      value={currentArticle.displayName}
                      onChange={(e) => {
                        setCurrentArticle({
                          ...currentArticle,
                          displayName: e.target.value,
                        });
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                    {currentArticle.displayName && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                        {categoryItems
                          .filter((item) =>
                            item.name
                              .toLowerCase()
                              .includes(
                                currentArticle.displayName.toLowerCase()
                              )
                          )
                          .map((item) => (
                            <div
                              key={item._id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setCurrentArticle({
                                  ...currentArticle,
                                  name: item._id,
                                  displayName: item.name,
                                });
                              }}
                            >
                              {item.name} ({item.category.name})
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Quantité"
                    className="w-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    value={currentArticle.amount}
                    onChange={(e) =>
                      setCurrentArticle({
                        ...currentArticle,
                        amount: e.target.value,
                      })
                    }
                    disabled={isSubmitting}
                  />
                  <input
                    type="number"
                    placeholder="Prix total"
                    className="w-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                    value={currentArticle.price}
                    onChange={(e) =>
                      setCurrentArticle({
                        ...currentArticle,
                        price: e.target.value,
                      })
                    }
                    disabled={isSubmitting}
                    min="0"
                    step="0.01"
                  />
                  <button
                    onClick={handleAddArticle}
                    className="bg-rose-300 text-white px-4 py-2 rounded-lg hover:bg-rose-400 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    Ajouter
                  </button>
                </div>
              </div>

              {/* Selected Articles List */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Articles Sélectionnés
                </h3>
                <div className="border rounded-lg p-2">
                  {selectedArticles && selectedArticles.length > 0 ? (
                    selectedArticles.map((article, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-1"
                      >
                        <span>
                          {article.displayName} : {article.amount} -{" "}
                          {article.price} TND
                        </span>
                        <button
                          onClick={() => handleRemoveArticle(index)}
                          className="text-red-500 hover:text-red-700"
                          disabled={isSubmitting}
                        >
                          Supprimer
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-2">
                      Aucun article sélectionné
                    </div>
                  )}
                </div>
              </div>

              {/* Total Price Display */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">
                    Prix Total:
                  </span>
                  <span className="text-xl font-bold text-rose-600">
                    {calculateTotal(selectedArticles)} TND
                  </span>
                </div>
              </div>

              {/* Payment Information */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant Payé
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder="Entrer le montant payé"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  disabled={isSubmitting}
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Add Payment Section in Modal */}
              {isEditMode && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Ajouter un Paiement
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Montant du paiement"
                      value={newPayment}
                      onChange={(e) => setNewPayment(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                      min="0"
                      step="0.01"
                    />
                    <button
                      onClick={handleAddPayment}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Ajouter Paiement
                    </button>
                  </div>
                </div>
              )}

              {/* Payment History */}
              {isEditMode && editingExpense?.paymentHistory?.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Historique des Paiements
                  </h3>
                  <div className="border rounded-lg p-2">
                    {editingExpense.paymentHistory.map((payment, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-1 border-b last:border-b-0"
                      >
                        <span>
                          {new Date(payment.date).toLocaleDateString("fr-FR")}{" "}
                          {payment.time}
                        </span>
                        <span className="font-medium">
                          {formatDecimal(payment.amount)} TND
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              {isEditMode && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    {(() => {
                      const summary = calculatePaymentSummary(editingExpense);
                      return (
                        <>
                          <div>
                            <span className="text-sm text-gray-600">
                              Prix Total:
                            </span>
                            <div className="text-lg font-medium">
                              {summary.total} TND
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">
                              Montant Payé:
                            </span>
                            <div className="text-lg font-medium text-green-600">
                              {summary.paid} TND
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">
                              Reste à Payer:
                            </span>
                            <div className="text-lg font-medium text-red-600">
                              {summary.remaining} TND
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">
                              Statut:
                            </span>
                            <div className="text-lg font-medium">
                              {summary.status === "fully_paid" ? (
                                <span className="text-green-600">Payé</span>
                              ) : (
                                <span className="text-yellow-600">
                                  Partiellement Payé
                                </span>
                              )}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-rose-300 text-white px-4 py-2 rounded-lg hover:bg-rose-400 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierExpenses;
