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
      case "pending":
        return "bg-red-100 text-red-800";
      case "ready":
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
      case "ready":
        return "Prêt";
      case "completed":
        return "Payé";
      default:
        return status;
    }
  };

  return (
    <div className="p-8 ">
      <div className="w-full flex items-center justify-center flex-col">
        <div className="text-gray-500 text-xs mb-3 font-bold">{dayName}</div>
        <div className="text-gray-500 text-lg font-bold">{dayNumber}</div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Heure
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contenu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.customerName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {order.customerPhoneNumber || order.customerNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{order.orderTime}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {order.orderContent.map((item, index) => (
                      <div key={index}>
                        {item.quantity}x {item.article}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                    className={`text-sm px-2 py-1 rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    <option value="pending">En attente</option>
                    <option value="ready">Prêt</option>
                    <option value="completed">Payé</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-4">
                    <button
                      className="text-rose-600 hover:text-rose-900"
                      onClick={() => handleAddModal(order)}
                    >
                      <IonIcon
                        icon={createOutline}
                        style={{ fontSize: "20px" }}
                      />
                    </button>
                    <button
                      className="text-rose-600 hover:text-rose-900"
                      onClick={() => deleteOrder(order.id)}
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
  );
};

export default OrdersTableView;
