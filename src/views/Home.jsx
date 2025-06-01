import { useState, useEffect } from "react";
import {
  FaWallet,
  FaChartLine,
  FaCalendarAlt,
  FaShoppingCart,
  FaTruck,
  FaUserFriends,
  FaPlus,
  FaTimes,
  FaArrowUp,
  FaArrowDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { IonIcon } from "@ionic/react";
import { closeOutline, chevronForwardOutline } from "ionicons/icons";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  const [balances, setBalances] = useState({
    today: 1250.75,
    weekly: 8750.5,
    monthly: 32500.25,
  });

  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [reportData, setReportData] = useState({
    income: 0,
    expenses: 0,
    transactions: [],
  });

  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [
      {
        label: "Income",
        data: [],
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        tension: 0.4,
      },
      {
        label: "Expenses",
        data: [],
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        tension: 0.4,
      },
      {
        label: "Balance",
        data: [],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4,
      },
    ],
  });

  const [productDateRange, setProductDateRange] = useState({
    start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd"),
  });

  const [productData, setProductData] = useState({
    labels: [],
    datasets: [],
  });

  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 10;

  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: [],
  });

  const [spendingData, setSpendingData] = useState({
    categories: [],
    items: [],
  });

  const [supplierDebts, setSupplierDebts] = useState([]);

  const [employeeAdvances, setEmployeeAdvances] = useState([]);

  const [showAddAdvanceModal, setShowAddAdvanceModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newAdvance, setNewAdvance] = useState({
    amount: "",
    reason: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [financialView, setFinancialView] = useState("daily"); // 'daily', 'weekly', 'monthly'

  const [isTodayModalOpen, setIsTodayModalOpen] = useState(false);
  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false);
  const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState(false);

  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  // Add dummy data for today's report
  const todayReport = {
    totalSales: 2500.0,
    totalExpenses: 1200.0,
    employeeAccounts: [
      { name: "Ahmed", sales: 850.0, commission: 42.5 },
      { name: "Mohamed", sales: 950.0, commission: 47.5 },
      { name: "Sami", sales: 700.0, commission: 35.0 },
    ],
  };

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Generate mock data for the graph based on selected view
    const generateMockData = () => {
      const baseIncome = 1500;
      const baseExpenses = 800;
      const variance = 0.3; // 30% variance

      let days;
      let labels;
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      switch (financialView) {
        case "weekly":
          // Generate data for weeks within the selected date range
          const weeks = [];
          let currentDate = new Date(startDate);
          while (currentDate <= endDate) {
            weeks.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 7);
          }
          days = weeks;
          labels = days.map((day) => `Semaine ${format(day, "w")}`);
          break;
        case "monthly":
          // Generate data for months within the selected date range
          const months = [];
          currentDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            1
          );
          while (currentDate <= endDate) {
            months.push(new Date(currentDate));
            currentDate.setMonth(currentDate.getMonth() + 1);
          }
          days = months;
          labels = days.map((day) => format(day, "MMM yyyy"));
          break;
        default: // daily
          days = eachDayOfInterval({
            start: startDate,
            end: endDate,
          });
          labels = days.map((day) => format(day, "dd MMM"));
      }

      const data = days.map(() => {
        const income = baseIncome * (1 + (Math.random() * 2 - 1) * variance);
        const expenses =
          baseExpenses * (1 + (Math.random() * 2 - 1) * variance);
        return {
          income: Math.round(income * 100) / 100,
          expenses: Math.round(expenses * 100) / 100,
          balance: Math.round((income - expenses) * 100) / 100,
        };
      });

      return { data, labels };
    };

    const { data, labels } = generateMockData();

    const mockGraphData = {
      labels: labels,
      datasets: [
        {
          label: "Revenus",
          data: data.map((d) => d.income),
          borderColor: "rgb(34, 197, 94)",
          backgroundColor: "rgba(34, 197, 94, 0.5)",
          tension: 0.4,
        },
        {
          label: "Dépenses",
          data: data.map((d) => d.expenses),
          borderColor: "rgb(239, 68, 68)",
          backgroundColor: "rgba(239, 68, 68, 0.5)",
          tension: 0.4,
        },
        {
          label: "Solde",
          data: data.map((d) => d.balance),
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          tension: 0.4,
        },
      ],
    };

    setGraphData(mockGraphData);

    // Generate mock product data with French restaurant items
    const mockProducts = [
      { name: "Mini Lafif", sales: 245 },
      { name: "Mini Croissant Jambon", sales: 198 },
      { name: "Mini Pizza", sales: 312 },
      { name: "Mini Quiche Lorraine", sales: 156 },
      { name: "Sandwich Poulet Crudités", sales: 178 },
      { name: "Légumes Surgelés Mix", sales: 203 },
      { name: "Wrap Végétarien", sales: 289 },
      { name: "Salade César", sales: 167 },
      { name: "Gratin Dauphinois Surgelé", sales: 145 },
      { name: "Pizza Margherita Surgelée", sales: 132 },
      { name: "Lasagne Surgelée", sales: 187 },
      { name: "Boeuf Bourguignon", sales: 156 },
      { name: "Salade Niçoise", sales: 234 },
      { name: "Croque Monsieur", sales: 278 },
      { name: "Croque Madame", sales: 245 },
      { name: "Moules Marinières", sales: 167 },
      { name: "Escargots de Bourgogne", sales: 134 },
      { name: "Foie Gras", sales: 98 },
      { name: "Duck Confit", sales: 156 },
      { name: "Cassoulet", sales: 143 },
      { name: "Bouillabaisse", sales: 167 },
      { name: "Steak Frites", sales: 289 },
      { name: "Poulet Rôti", sales: 234 },
      { name: "Gratin Dauphinois", sales: 198 },
      { name: "Soupe de Poisson", sales: 145 },
      { name: "Salade de Chèvre Chaud", sales: 178 },
      { name: "Tarte Flambée", sales: 167 },
      { name: "Quiche aux Poireaux", sales: 156 },
      { name: "Pissaladière", sales: 134 },
      { name: "Pan Bagnat", sales: 145 },
      { name: "Socca", sales: 123 },
      { name: "Fougasse", sales: 134 },
      { name: "Pissaladière", sales: 145 },
      { name: "Panisse", sales: 156 },
      { name: "Tapenade", sales: 167 },
      { name: "Anchoïade", sales: 178 },
      { name: "Brandade de Morue", sales: 189 },
      { name: "Soupe au Pistou", sales: 167 },
      { name: "Salade de Lentilles", sales: 156 },
      { name: "Gratin de Courgettes", sales: 145 },
      { name: "Tarte aux Pommes", sales: 234 },
      { name: "Mille-Feuille", sales: 198 },
      { name: "Profiteroles", sales: 167 },
      { name: "Crêpe Suzette", sales: 156 },
      { name: "Île Flottante", sales: 145 },
      { name: "Tarte au Citron", sales: 134 },
      { name: "Paris-Brest", sales: 123 },
      { name: "Saint-Honoré", sales: 112 },
      { name: "Opéra", sales: 101 },
      { name: "Éclair au Café", sales: 198 },
      { name: "Éclair à la Vanille", sales: 187 },
      { name: "Éclair aux Fraises", sales: 176 },
      { name: "Pain aux Raisins", sales: 165 },
      { name: "Chausson aux Pommes", sales: 154 },
      { name: "Palmier", sales: 143 },
      { name: "Financier", sales: 132 },
      { name: "Madeleine", sales: 121 },
      { name: "Canelé", sales: 110 },
      { name: "Kouign-Amann", sales: 99 },
    ].sort((a, b) => b.sales - a.sales);

    const startIndex = currentPage * productsPerPage;
    const paginatedProducts = mockProducts.slice(
      startIndex,
      startIndex + productsPerPage
    );

    const mockProductData = {
      labels: paginatedProducts.map((p) => p.name),
      datasets: [
        {
          label: "Units Sold",
          data: paginatedProducts.map((p) => p.sales),
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 1,
        },
      ],
    };

    setProductData(mockProductData);

    // Generate mock category data
    const mockCategoryData = {
      labels: ["Vitrine", "Mini Salée", "Produit Surgelé"],
      datasets: [
        {
          data: [45, 30, 25],
          backgroundColor: [
            "rgba(239, 68, 68, 0.8)",
            "rgba(59, 130, 246, 0.8)",
            "rgba(16, 185, 129, 0.8)",
          ],
        },
      ],
    };

    setCategoryData(mockCategoryData);

    // Generate mock spending data
    const mockSpendingData = {
      categories: [
        {
          name: "Légumes",
          total: 2500,
          items: [
            { name: "Laitue", amount: 500, unit: "kg" },
            { name: "Tomates", amount: 800, unit: "kg" },
            { name: "Oignons", amount: 400, unit: "kg" },
          ],
        },
        {
          name: "Viande & Volaille",
          total: 4500,
          items: [
            { name: "Poulet", amount: 2000, unit: "kg" },
            { name: "Bœuf", amount: 1500, unit: "kg" },
          ],
        },
        {
          name: "Produits Laitiers",
          total: 1800,
          items: [
            { name: "Lait", amount: 800, unit: "L" },
            { name: "Fromage", amount: 1000, unit: "kg" },
          ],
        },
        {
          name: "Boulangerie",
          total: 1200,
          items: [
            { name: "Pain", amount: 500, unit: "unité" },
            { name: "Croissants", amount: 700, unit: "unité" },
          ],
        },
        {
          name: "Surgelés",
          total: 3000,
          items: [
            { name: "Légumes Mix", amount: 1500, unit: "kg" },
            { name: "Pizza", amount: 1500, unit: "unité" },
          ],
        },
      ],
    };

    setSpendingData(mockSpendingData);

    // Mock supplier debts
    setSupplierDebts([
      {
        name: "Fournisseur Légumes",
        amount: 2500,
        lastPayment: "2024-02-15",
        items: ["Légumes frais", "Fruits"],
      },
      {
        name: "Boucherie Centrale",
        amount: 4500,
        lastPayment: "2024-02-10",
        items: ["Viande", "Volaille"],
      },
      {
        name: "Laiterie du Nord",
        amount: 1800,
        lastPayment: "2024-02-20",
        items: ["Lait", "Fromage", "Yaourt"],
      },
    ]);
  }, [dateRange, productDateRange, currentPage, financialView]);

  const totalPages = Math.ceil(30 / productsPerPage); // Assuming 30 products total

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const handleBalanceClick = (period, event) => {
    // Get the clicked card's position
    const rect = event.currentTarget.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;

    // Calculate position for the modal
    const x = rect.left + scrollLeft;
    const y = rect.bottom + scrollTop + 10; // 10px gap from the card

    setModalPosition({ x, y });
    setSelectedPeriod(period);
  };

  const BalanceCard = ({ title, amount, period, icon: Icon }) => (
    <div
      className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-105 h-full cursor-pointer"
      onClick={(e) => handleBalanceClick(period.toLowerCase(), e)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <Icon className="text-2xl text-blue-500" />
      </div>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-900">
          {amount.toLocaleString("fr-FR")} TND
        </span>
        <span className="ml-2 text-sm text-gray-500">{period}</span>
      </div>
    </div>
  );

  const ReportModal = ({ isOpen, onClose, data, period }) => {
    if (!isOpen) return null;

    // Mock data for employee advances - replace with actual data
    const employeeAdvances = [
      { name: "Ahmed", amount: 150.0, date: "2024-03-20" },
      { name: "Mohamed", amount: 200.0, date: "2024-03-20" },
      { name: "Sami", amount: 100.0, date: "2024-03-20" },
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
        <div
          className="absolute bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl"
          style={{
            left: `${modalPosition.x}px`,
            top: `${modalPosition.y}px`,
            transform: "translateX(-25%)",
            marginLeft: "2rem",
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Rapport du Jour
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center text-green-600 mb-2">
                <FaArrowUp className="mr-2" />
                <h3 className="font-semibold">Total des Revenus</h3>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {data.income.toLocaleString("fr-FR")} TND
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center text-red-600 mb-2">
                <FaArrowDown className="mr-2" />
                <h3 className="font-semibold">Total des Dépenses</h3>
              </div>
              <p className="text-2xl font-bold text-red-700">
                {data.expenses.toLocaleString("fr-FR")} TND
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Avances des Employés
            </h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Employé
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Montant
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employeeAdvances.map((advance, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {advance.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {advance.amount.toFixed(2)} TND
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {new Date(advance.date).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">
                      Total
                    </td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">
                      {employeeAdvances
                        .reduce((sum, advance) => sum + advance.amount, 0)
                        .toFixed(2)}{" "}
                      TND
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Solde Net
              </span>
              <span className="text-lg font-bold text-gray-900">
                {(data.income - data.expenses).toLocaleString("fr-FR")} TND
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Total des Avances
              </span>
              <span className="text-lg font-bold text-gray-900">
                {employeeAdvances
                  .reduce((sum, advance) => sum + advance.amount, 0)
                  .toFixed(2)}{" "}
                TND
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Financial Overview",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
    },
  };

  const productChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Most Sold Products (Page ${currentPage + 1} of ${totalPages})`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Units Sold",
        },
      },
      x: {
        title: {
          display: true,
          text: "Products",
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Income by Category",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  const spendingChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Spending by Category",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: $${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
    },
  };

  const itemsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Spending by Item",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: $${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 mt-16">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Tableau de Bord
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <BalanceCard
            title="Aujourd'hui"
            amount={balances.today}
            period="today"
            icon={FaWallet}
          />
          <BalanceCard
            title="Cette Semaine"
            amount={balances.weekly}
            period="weekly"
            icon={FaChartLine}
          />
          <BalanceCard
            title="Ce Mois"
            amount={balances.monthly}
            period="monthly"
            icon={FaCalendarAlt}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaChartLine className="mr-2 text-blue-500" />
              Évolution des Finances
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setFinancialView("daily")}
                  className={`px-3 py-2 rounded-lg ${
                    financialView === "daily"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Journalier
                </button>
                <button
                  onClick={() => setFinancialView("weekly")}
                  className={`px-3 py-2 rounded-lg ${
                    financialView === "weekly"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Hebdomadaire
                </button>
                <button
                  onClick={() => setFinancialView("monthly")}
                  className={`px-3 py-2 rounded-lg ${
                    financialView === "monthly"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Mensuel
                </button>
              </div>
              <div className="flex gap-4">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="h-[400px]">
            <Line options={chartOptions} data={graphData} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaChartLine className="mr-2 text-blue-500" />
                Top Produits
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex gap-4">
                  <input
                    type="date"
                    value={productDateRange.start}
                    onChange={(e) =>
                      setProductDateRange({
                        ...productDateRange,
                        start: e.target.value,
                      })
                    }
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={productDateRange.end}
                    onChange={(e) =>
                      setProductDateRange({
                        ...productDateRange,
                        end: e.target.value,
                      })
                    }
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className={`p-2 rounded-lg ${
                      currentPage === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    <FaChevronLeft />
                  </button>
                  <span className="text-sm text-gray-600">
                    {currentPage + 1} / {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                    className={`p-2 rounded-lg ${
                      currentPage === totalPages - 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </div>
            <div className="h-[400px]">
              <Bar options={productChartOptions} data={productData} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaChartLine className="mr-2 text-blue-500" />
                Répartition des Dépenses
              </h2>
              <div className="flex gap-4">
                <input
                  type="date"
                  value={productDateRange.start}
                  onChange={(e) =>
                    setProductDateRange({
                      ...productDateRange,
                      start: e.target.value,
                    })
                  }
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={productDateRange.end}
                  onChange={(e) =>
                    setProductDateRange({
                      ...productDateRange,
                      end: e.target.value,
                    })
                  }
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="h-[400px]">
              <Pie options={categoryChartOptions} data={categoryData} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaShoppingCart className="mr-2 text-blue-500" />
              Analyse des Dépenses par Catégorie
            </h2>
            <div className="flex gap-4">
              <input
                type="date"
                value={productDateRange.start}
                onChange={(e) =>
                  setProductDateRange({
                    ...productDateRange,
                    start: e.target.value,
                  })
                }
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={productDateRange.end}
                onChange={(e) =>
                  setProductDateRange({
                    ...productDateRange,
                    end: e.target.value,
                  })
                }
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="h-[400px]">
            <Bar
              options={spendingChartOptions}
              data={{
                labels: spendingData.categories.map((cat) => cat.name),
                datasets: [
                  {
                    label: "Dépenses Totales",
                    data: spendingData.categories.map((cat) => cat.total),
                    backgroundColor: "rgba(59, 130, 246, 0.5)",
                    borderColor: "rgb(59, 130, 246)",
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaShoppingCart className="mr-2 text-blue-500" />
              Analyse des Dépenses par Article
            </h2>
            <div className="flex gap-4">
              <input
                type="date"
                value={productDateRange.start}
                onChange={(e) =>
                  setProductDateRange({
                    ...productDateRange,
                    start: e.target.value,
                  })
                }
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={productDateRange.end}
                onChange={(e) =>
                  setProductDateRange({
                    ...productDateRange,
                    end: e.target.value,
                  })
                }
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="h-[400px]">
            <Bar
              options={itemsChartOptions}
              data={{
                labels: spendingData.categories.flatMap((cat) =>
                  cat.items.map((item) => `${item.name} (${cat.name})`)
                ),
                datasets: [
                  {
                    label: "Dépenses par Article",
                    data: spendingData.categories.flatMap((cat) =>
                      cat.items.map((item) => item.amount)
                    ),
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                    borderColor: "rgb(255, 99, 132)",
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaTruck className="mr-2 text-red-500" />
                Dettes Fournisseurs
              </h2>
              <p className="text-gray-600 mt-1">
                Total:{" "}
                {supplierDebts
                  .reduce((sum, debt) => sum + debt.amount, 0)
                  .toLocaleString("fr-FR")}{" "}
                TND
              </p>
            </div>
            <div className="flex gap-4">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supplierDebts.map((debt, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <FaTruck className="text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{debt.name}</h3>
                </div>
                <p className="text-2xl font-bold text-red-600 mb-2">
                  {debt.amount.toLocaleString("fr-FR")} TND
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Dernier paiement:{" "}
                  {new Date(debt.lastPayment).toLocaleDateString("fr-FR")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {debt.items.map((item, i) => (
                    <span
                      key={i}
                      className="bg-white px-2 py-1 rounded-full text-sm text-gray-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Activité Récente
          </h2>
          <div className="text-gray-500 text-center py-8">
            L'activité récente sera affichée ici
          </div>
        </div>
      </div>

      <ReportModal
        isOpen={selectedPeriod !== null}
        onClose={() => setSelectedPeriod(null)}
        data={reportData}
        period={selectedPeriod || ""}
      />

      {/* Today's Report Modal */}
      {isTodayModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Rapport du Jour</h2>
              <button
                onClick={() => setIsTodayModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IonIcon icon={closeOutline} className="w-6 h-6" />
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-800 mb-1">
                  Total des Ventes
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {todayReport.totalSales.toFixed(2)} TND
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  Total des Dépenses
                </h3>
                <p className="text-2xl font-bold text-red-600">
                  {todayReport.totalExpenses.toFixed(2)} TND
                </p>
              </div>
            </div>

            {/* Employee Accounts */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3">
                Comptes des Employés
              </h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                        Employé
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                        Ventes
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                        Commission
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {todayReport.employeeAccounts.map((employee, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {employee.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {employee.sales.toFixed(2)} TND
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {employee.commission.toFixed(2)} TND
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Solde Net
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {(todayReport.totalSales - todayReport.totalExpenses).toFixed(
                    2
                  )}{" "}
                  TND
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Total des Commissions
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {todayReport.employeeAccounts
                    .reduce((sum, emp) => sum + emp.commission, 0)
                    .toFixed(2)}{" "}
                  TND
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
