const FilterPanel = ({
  selectedStatuses,
  handleStatusChange,
  timeRange,
  setTimeRange,
  priceRange,
  setPriceRange,
  statuses,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "received":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "received":
        return "Reçu";
      case "completed":
        return "Complété";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white p-4 shadow-sm">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`${
                  selectedStatuses.includes(status)
                    ? getStatusColor(status)
                    : "bg-gray-100 text-gray-400"
                } px-3 py-1 rounded-full text-sm font-medium transition-colors`}
              >
                {getStatusText(status)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Plage horaire
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">De</label>
              <input
                type="time"
                value={timeRange.start}
                onChange={(e) =>
                  setTimeRange({ ...timeRange, start: e.target.value })
                }
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">À</label>
              <input
                type="time"
                value={timeRange.end}
                onChange={(e) =>
                  setTimeRange({ ...timeRange, end: e.target.value })
                }
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Plage de prix
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Min (DT)</label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: e.target.value })
                }
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm text-sm"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Max (DT)</label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: e.target.value })
                }
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm text-sm"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
