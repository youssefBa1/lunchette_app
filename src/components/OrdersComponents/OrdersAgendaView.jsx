import { IonIcon } from "@ionic/react";
import { useState, useEffect } from "react";
import AddOrderModal from "../AgendaComponents/addorderModal";
import { calendarOutline, listOutline } from "ionicons/icons";
import Order from "../Orders";
import OrderModal from "../AgendaComponents/OrderModal";
import OrdersHeader from "./OrdersHeader";
import OrdersTableView from "./OrdersTableView";
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
    <div className="h-auto max-w-screen relative">
      <OrdersHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        orders={orders}
        handleAddModal={handleAddModal}
        dayNames={dayNames}
        months={months}
      />
      <div className="w-full mt-2 sm:mt-3 md:mt-5 flex items-center justify-center flex-col">
        <div className="flex bg-rose-50 rounded-full p-1 shadow-md w-[80px] sm:w-[90px] md:w-[100px] justify-between items-center mb-2 sm:mb-3 md:mb-4">
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
          <div className="w-full mt-2 sm:mt-3 md:mt-5 flex items-center justify-center flex-col">
            <div className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2 md:mb-3 font-bold">
              {dayNames[new Date(selectedDate).getDay()]}
            </div>
            <div className="text-gray-500 text-base sm:text-lg font-bold">
              {new Date(selectedDate).getDate()}
            </div>
          </div>
          <div className="h-auto w-1 border-r-2 absolute ml-[3rem] sm:ml-[4rem] md:ml-[5rem]"></div>
          <div className="min-w-full overflow-x-auto flex flex-col ml-4 sm:ml-6 md:ml-10">
            {Array.from({ length: 16 }, (_, i) => {
              const hour = 8 + i;
              const hourOrders = orders
                .filter((order) => {
                  const orderHour = parseInt(order.pickupTime.split(":")[0]);
                  return orderHour === hour;
                })
                .sort((a, b) => {
                  const timeA = a.pickupTime.split(":").map(Number);
                  const timeB = b.pickupTime.split(":").map(Number);
                  return timeA[1] - timeB[1];
                });

              return (
                <div key={i}>
                  <hr />
                  <div className="h-20 sm:h-24 md:h-24 w-full md:w-[96vh] flex flex-row">
                    <span className="text-sm sm:text-base md:text-lg min-w-[2rem] sm:min-w-[3rem] md:min-w-[4rem]">{`${hour}h`}</span>
                    <div className="flex flex-row flex-wrap gap-2 ml-2">
                      {hourOrders.map((order) => (
                        <Order
                          key={order._id}
                          order={{
                            ...order,
                            orderTime: order.pickupTime,
                            customerNumber: order.customerPhoneNumber,
                          }}
                          func={(e) => handleOrderModal(order, e)}
                        />
                      ))}
                    </div>
                  </div>
                  <hr />
                </div>
              );
            })}
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
            orders={orders}
            setOrders={setOrders}
            handleAddModal={handleAddModal}
            dayNames={dayNames}
            months={months}
            updateOrderStatus={updateOrderStatus}
          />
        </div>
      </div>

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
