import React, { useMemo, useState } from "react";

const FilteredOrders = ({ orders }) => {
  const [filterCriteria, setFilterCriteria] = useState({
    status: "all",
    dateRange: "all",
    minAmount: 0,
    searchTerm: "",
  });

  // Memoized filtered orders using useMemo
  const filteredOrders = useMemo(() => {
    console.log("Filtering orders..."); // To demonstrate memoization
    return orders.filter((order) => {
      // Filter by status
      if (
        filterCriteria.status !== "all" &&
        order.status !== filterCriteria.status
      ) {
        return false;
      }

      // Filter by date range
      const orderDate = new Date(order.date);
      const today = new Date();
      if (filterCriteria.dateRange === "today") {
        return orderDate.toDateString() === today.toDateString();
      } else if (filterCriteria.dateRange === "week") {
        const weekAgo = new Date(today.setDate(today.getDate() - 7));
        return orderDate >= weekAgo;
      }

      // Filter by minimum amount
      if (order.totalAmount < filterCriteria.minAmount) {
        return false;
      }

      // Filter by search term
      if (filterCriteria.searchTerm) {
        const searchLower = filterCriteria.searchTerm.toLowerCase();
        return (
          order.customerName.toLowerCase().includes(searchLower) ||
          order.orderId.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [orders, filterCriteria]); // Only recompute when orders or filter criteria change

  // Memoized statistics using useMemo
  const orderStats = useMemo(() => {
    return {
      totalOrders: filteredOrders.length,
      totalAmount: filteredOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      ),
      averageAmount:
        filteredOrders.length > 0
          ? filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0) /
            filteredOrders.length
          : 0,
    };
  }, [filteredOrders]);

  return (
    <div className="p-4">
      <div className="mb-4 space-y-4">
        <div className="flex gap-4">
          <select
            value={filterCriteria.status}
            onChange={(e) =>
              setFilterCriteria((prev) => ({ ...prev, status: e.target.value }))
            }
            className="p-2 border rounded"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filterCriteria.dateRange}
            onChange={(e) =>
              setFilterCriteria((prev) => ({
                ...prev,
                dateRange: e.target.value,
              }))
            }
            className="p-2 border rounded"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
          </select>

          <input
            type="number"
            value={filterCriteria.minAmount}
            onChange={(e) =>
              setFilterCriteria((prev) => ({
                ...prev,
                minAmount: Number(e.target.value),
              }))
            }
            placeholder="Min Amount"
            className="p-2 border rounded"
          />

          <input
            type="text"
            value={filterCriteria.searchTerm}
            onChange={(e) =>
              setFilterCriteria((prev) => ({
                ...prev,
                searchTerm: e.target.value,
              }))
            }
            placeholder="Search orders..."
            className="p-2 border rounded"
          />
        </div>
      </div>

      {/* Display Statistics */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded">
          <h3 className="font-bold">Total Orders</h3>
          <p>{orderStats.totalOrders}</p>
        </div>
        <div className="p-4 bg-green-50 rounded">
          <h3 className="font-bold">Total Amount</h3>
          <p>${orderStats.totalAmount.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-purple-50 rounded">
          <h3 className="font-bold">Average Amount</h3>
          <p>${orderStats.averageAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Display Filtered Orders */}
      <div className="space-y-2">
        {filteredOrders.map((order) => (
          <div key={order.id} className="p-4 border rounded hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">{order.customerName}</h3>
                <p className="text-sm text-gray-600">
                  Order ID: {order.orderId}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">${order.totalAmount.toFixed(2)}</p>
                <p className="text-sm text-gray-600">{order.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilteredOrders;
