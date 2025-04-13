import { IonIcon } from "@ionic/react";
import { useState, useEffect } from "react";
import AddOrderModal from "../AgendaComponents/addorderModal";
import { calendarOutline, listOutline, filterOutline } from "ionicons/icons";
import Order from "../Orders";
import OrderModal from "../AgendaComponents/OrderModal";
import OrdersHeader from "./OrdersHeader";
import OrdersTableView from "./OrdersTableView";
import FilterPanel from "./FilterPanel";
import { orderService } from "../../services/orderService";

const OrdersAgendaView = () => {
  const [isAddModalShown, setIsAddModalShown] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalPosition, setModalPosition] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [viewMode, setViewMode] = useState("agenda");
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState([
    "notready",
    "ready",
    "payed",
  ]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [timeRange, setTimeRange] = useState({ start: "08:00", end: "23:59" });
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

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

  // Fetch orders when date changes
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrdersByDate(selectedDate);
        setOrders(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [selectedDate]);

  const addOrder = async (orderData) => {
    try {
      // Transform frontend data to match backend schema
      const transformedOrder = {
        customerName: orderData.customerName,
        customerPhoneNumber: orderData.customerPhoneNumber,
        pickupDate: orderData.orderDate,
        pickupTime: orderData.orderTime,
        status: "notready",
        orderContent: orderData.orderContent.map((item) => ({
          product_id: item.product_id,
          quantity: parseInt(item.quantity),
          price: item.price,
        })),
        totalPrice: orderData.totalPrice || 0,
        description: orderData.details || "",
      };

      if (orderData._id) {
        // Update existing order
        await orderService.updateOrder(orderData._id, transformedOrder);
      } else {
        // Create new order
        await orderService.createOrder(transformedOrder);
      }

      // Refresh orders
      const updatedOrders = await orderService.getOrdersByDate(selectedDate);
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error saving order:", error);
      // You might want to show an error message to the user here
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await orderService.deleteOrder(orderId);
      const updatedOrders = await orderService.getOrdersByDate(selectedDate);
      setOrders(updatedOrders);
      setIsOrderModalShown(false);
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Use the dedicated status update endpoint
      await orderService.updateOrderStatus(orderId, newStatus);

      // Refresh orders after update
      const updatedOrders = await orderService.getOrdersByDate(selectedDate);
      setOrders(updatedOrders);
      return true; // Return success for confirmation in the modal
    } catch (error) {
      console.error("Error updating order status:", error);
      return false; // Return failure for error handling in the modal
    }
  };

  const handleAddModal = (order = null) => {
    // If we're closing the modal, make sure to reset orderToEdit
    if (isAddModalShown) {
      setOrderToEdit(null);
    } else {
      // If we're opening the modal, set orderToEdit to the passed order (or null)
      setOrderToEdit(order);
    }
    setIsAddModalShown(!isAddModalShown);
  };

  const handleOrderModal = (order, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setSelectedOrder(order);
    setIsOrderModalShown(!isOrderModalShown);
  };

  const [isOrderModalShown, setIsOrderModalShown] = useState(false);

  // Handle status filter changes
  const handleStatusChange = (status) => {
    setSelectedStatuses((prev) => {
      if (prev.includes(status)) {
        // Remove status if already selected
        return prev.filter((s) => s !== status);
      } else {
        // Add status if not selected
        return [...prev, status];
      }
    });
  };

  // Filter orders based on all filters
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (!selectedStatuses.includes(order.status)) {
      return false;
    }

    // Time range filter
    const orderTime = order.pickupTime;
    if (timeRange.start && timeRange.end) {
      if (orderTime < timeRange.start || orderTime > timeRange.end) {
        return false;
      }
    }

    // Price range filter
    const price = parseFloat(order.totalPrice);
    if (priceRange.min && price < parseFloat(priceRange.min)) {
      return false;
    }
    if (priceRange.max && price > parseFloat(priceRange.max)) {
      return false;
    }

    return true;
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="h-auto max-w-screen relative bg-gray-50">
      <OrdersHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        orders={filteredOrders}
        handleAddModal={handleAddModal}
        dayNames={dayNames}
        months={months}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex bg-rose-50 rounded-full p-1 shadow-md w-[80px] sm:w-[90px] md:w-[100px] justify-between items-center">
              <button
                onClick={() => setViewMode("agenda")}
                className={`p-1 sm:p-2 rounded-full transition-colors flex items-center justify-center ${
                  viewMode === "agenda"
                    ? "bg-rose-200 text-rose-600"
                    : "hover:bg-rose-100"
                }`}
              >
                <IonIcon
                  icon={calendarOutline}
                  style={{ fontSize: "18px" }}
                  className="md:text-xl"
                />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1 sm:p-2 rounded-full transition-colors flex items-center justify-center ${
                  viewMode === "table"
                    ? "bg-rose-200 text-rose-600"
                    : "hover:bg-rose-100"
                }`}
              >
                <IonIcon
                  icon={listOutline}
                  style={{ fontSize: "18px" }}
                  className="md:text-xl"
                />
              </button>
            </div>

            <button
              onClick={() => setIsFilterPanelOpen(true)}
              className={`p-2 rounded-full transition-colors flex items-center justify-center ${
                isFilterPanelOpen ||
                selectedStatuses.length < 3 ||
                timeRange.start !== "08:00" ||
                timeRange.end !== "23:59" ||
                priceRange.min ||
                priceRange.max
                  ? "bg-rose-200 text-rose-600"
                  : "bg-rose-50 hover:bg-rose-100"
              }`}
            >
              <IonIcon
                icon={filterOutline}
                style={{ fontSize: "18px" }}
                className="md:text-xl"
              />
            </button>
          </div>
        </div>

        <div className="relative w-full">
          <div
            className={`absolute w-full transition-all duration-300 transform ${
              viewMode === "agenda"
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-full"
            }`}
            style={{ pointerEvents: viewMode === "agenda" ? "auto" : "none" }}
          >
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="text-lg font-semibold text-gray-800">
                    {dayNames[new Date(selectedDate).getDay()]}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {new Date(selectedDate).getDate()}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {
                    filteredOrders.filter(
                      (order) => order.status === "notready"
                    ).length
                  }{" "}
                  commandes en attente
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 16 }, (_, i) => {
                  const hour = 8 + i;
                  const hourOrders = filteredOrders
                    .filter((order) => {
                      const orderHour = parseInt(
                        order.pickupTime.split(":")[0]
                      );
                      return orderHour === hour;
                    })
                    .sort((a, b) => {
                      const timeA = a.pickupTime.split(":").map(Number);
                      const timeB = b.pickupTime.split(":").map(Number);
                      return timeA[1] - timeB[1];
                    });

                  if (hourOrders.length === 0) return null;

                  return (
                    <div key={i} className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-500 mb-3">
                        {`${hour}:00`}
                      </div>
                      <div className="space-y-2">
                        {hourOrders.map((order) => (
                          <div
                            key={order._id}
                            onClick={(e) => handleOrderModal(order, e)}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                              order.status === "notready"
                                ? "bg-red-100 hover:bg-red-200"
                                : order.status === "ready"
                                ? "bg-blue-100 hover:bg-blue-200"
                                : "bg-green-100 hover:bg-green-200"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium text-gray-900">
                                {order.customerName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {order.pickupTime}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              {order.customerPhoneNumber}
                            </div>
                            <div className="mt-2 text-sm">
                              {order.orderContent?.map((item, index) => (
                                <div key={index} className="text-gray-700">
                                  {item.quantity}x {item.product_id.name}
                                </div>
                              ))}
                            </div>
                            <div className="mt-2 text-right font-medium text-gray-900">
                              {order.totalPrice} DT
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className={`absolute w-full transition-all duration-300 transform ${
              viewMode === "table"
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full"
            }`}
            style={{ pointerEvents: viewMode === "table" ? "auto" : "none" }}
          >
            <OrdersTableView
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              orders={filteredOrders}
              setOrders={setOrders}
              handleAddModal={handleAddModal}
              dayNames={dayNames}
              months={months}
              updateOrderStatus={updateOrderStatus}
            />
          </div>
        </div>
      </div>

      {isFilterPanelOpen && (
        <FilterPanel
          isOpen={isFilterPanelOpen}
          onClose={() => setIsFilterPanelOpen(false)}
          selectedStatuses={selectedStatuses}
          onStatusChange={handleStatusChange}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
        />
      )}

      <AddOrderModal
        showModal={isAddModalShown}
        func={handleAddModal}
        addOrder={addOrder}
        viewMode={viewMode}
        orderToEdit={orderToEdit}
      />
      <OrderModal
        show={isOrderModalShown}
        onClose={() => {
          setIsOrderModalShown(false);
          setModalPosition(null);
        }}
        onDelete={deleteOrder}
        order={selectedOrder}
        onStatusChange={updateOrderStatus}
        onEdit={(order) => {
          handleAddModal(order);
          setIsOrderModalShown(false);
        }}
        position={modalPosition}
      />
    </div>
  );
};

export default OrdersAgendaView;
