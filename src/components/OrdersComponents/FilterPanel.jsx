import { IonIcon } from "@ionic/react";
import {
  checkmarkCircleOutline,
  timeOutline,
  walletOutline,
  filterOutline,
  closeOutline,
} from "ionicons/icons";
import { useState, useEffect } from "react";

const FilterPanel = ({
  isOpen,
  onClose,
  selectedStatuses,
  onStatusChange,
  onTimeRangeChange,
  onPriceRangeChange,
  timeRange,
  priceRange,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Match this with your CSS transition duration
  };

  const statuses = [
    {
      value: "notready",
      label: "En attente",
      icon: timeOutline,
      color: "text-red-600 bg-red-100",
    },
    {
      value: "ready",
      label: "Prêt",
      icon: checkmarkCircleOutline,
      color: "text-blue-600 bg-blue-100",
    },
    {
      value: "payed",
      label: "Payé",
      icon: walletOutline,
      color: "text-green-600 bg-green-100",
    },
  ];

  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-70 mt-24 ${
        isClosing ? "translate-x-full" : "translate-x-0"
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Filtres</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <IonIcon icon={closeOutline} className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Statut</h3>
          <div className="flex flex-col gap-2">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => onStatusChange(status.value)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedStatuses.includes(status.value)
                    ? status.color + " font-medium"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <IonIcon
                  icon={status.icon}
                  className="mr-2"
                  style={{ fontSize: "18px" }}
                />
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Plage horaire
          </h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500">De</label>
              <input
                type="time"
                value={timeRange.start}
                onChange={(e) =>
                  onTimeRangeChange({
                    ...timeRange,
                    start: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">À</label>
              <input
                type="time"
                value={timeRange.end}
                onChange={(e) =>
                  onTimeRangeChange({
                    ...timeRange,
                    end: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Fourchette de prix
          </h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Min DT</label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) =>
                  onPriceRangeChange({
                    ...priceRange,
                    min: e.target.value,
                  })
                }
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Max DT</label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) =>
                  onPriceRangeChange({
                    ...priceRange,
                    max: e.target.value,
                  })
                }
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
