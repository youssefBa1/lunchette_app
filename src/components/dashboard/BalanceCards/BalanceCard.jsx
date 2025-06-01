import { FaWallet, FaChartLine, FaCalendarAlt } from "react-icons/fa";

const BalanceCard = ({ title, amount, period, icon: Icon, onClick }) => (
  <div
    className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-105 h-full cursor-pointer"
    onClick={onClick}
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

export default BalanceCard;
