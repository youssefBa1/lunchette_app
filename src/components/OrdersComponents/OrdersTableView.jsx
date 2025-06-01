import { useState } from "react";
import { IonIcon } from "@ionic/react";
import { createOutline, trashOutline } from "ionicons/icons";

const OrdersTableView = ({
  selectedDate,
  setSelectedDate,
  orders,
  setOrders,
  handleAddModal,
  dayNames,
  months,
  updateOrderStatus,
}) => {
  const deleteOrder = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== orderId)
    );
  };

  const currentDate = new Date(selectedDate);
  const dayName = dayNames[currentDate.getDay()];
  const dayNumber = currentDate.getDate();

  const getStatusColor = (status) => {
    switch (status) {
      case "notready":
        return "bg-red-100 text-red-800";
      case "ready":
        return "bg-blue-100 text-blue-800";
      case "payed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "notready":
        return "En attente";
      case "ready":
        return "Prêt";
      case "payed":
        return "Payé";
      default:
        return status;
    }
  };

  const handleStatusChange = (orderId, newStatus, currentStatus) => {
    const statusText = getStatusText(newStatus);
    const confirmed = window.confirm(
      `Voulez-vous changer le statut en "${statusText}" ?`
    );

    if (confirmed) {
      updateOrderStatus(orderId, newStatus);
    }
  };

  return (
    <div className="p-8 relative">
      <div className="w-full flex items-center justify-center flex-col mb-6">
        <div className="text-gray-500 text-xs mb-3 font-bold">{dayName}</div>
        <div className="text-gray-500 text-lg font-bold">{dayNumber}</div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Client
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Content
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleAddModal(order)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.customerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.customerPhoneNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.pickupTime}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.orderContent &&
                        order.orderContent.map((item) => (
                          <div
                            key={`${order._id}-${
                              item.product_id?._id || "unknown"
                            }-${item.quantity}`}
                          >
                            {item.quantity}x{" "}
                            {item.product_id?.name || "Produit inconnu"}
                          </div>
                        ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.totalPrice} DT
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          e.target.value,
                          order.status
                        )
                      }
                      className={`text-sm px-2 py-1 rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <option value="notready">En attente</option>
                      <option value="ready">Prêt</option>
                      <option value="payed">Payé</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-4">
                      <button
                        className="text-rose-600 hover:text-rose-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteOrder(order._id);
                        }}
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
    </div>
  );
};

export default OrdersTableView;
