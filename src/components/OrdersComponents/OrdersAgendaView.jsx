import { IonIcon } from "@ionic/react";
import { useState } from "react";
import AddOrderModal from "../AgendaComponents/addorderModal";
import { calendarOutline, listOutline } from "ionicons/icons";
import Order from "../Orders";
import OrderModal from "../AgendaComponents/OrderModal";
import OrdersHeader from "./OrdersHeader";
import OrdersTableView from "./OrdersTableView";

const OrdersAgendaView = () => {
  const [isAddModalShown, setIsAddModalShown] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalPosition, setModalPosition] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [viewMode, setViewMode] = useState("agenda");
  const [orderToEdit, setOrderToEdit] = useState(null);

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

  const addOrder = (order) => {
    if (order.id) {
      // This is an edit
      setOrders((prevOrders) =>
        prevOrders.map((prevOrder) =>
          prevOrder.id === order.id ? { ...order } : prevOrder
        )
      );
    } else {
      // This is a new order
      setOrders((prevOrders) => [
        ...prevOrders,
        { ...order, status: "pending" },
      ]);
    }
  };

  const deleteOrder = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== orderId)
    );
    setIsOrderModalShown(false);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const [orders, setOrders] = useState([
    {
      id: "1",
      customerName: "Mme Sousou",
      orderTime: "10:35",
      customerPhoneNumber: "28256698",
      po: "10",
      status: "pending",
      orderContent: [
        { article: "Pizza Margherita", quantity: 2 },
        { article: "Coca Cola", quantity: 3 },
      ],
    },
    {
      id: "2",
      customerName: "Mme Sousou",
      orderTime: "8:35",
      customerNumber: "28256698",
      po: "8",
      status: "ready",
      orderContent: [{ article: "Pizza 4 Fromages", quantity: 1 }],
    },
    {
      id: "3",
      customerName: "Mme Sousou",
      orderTime: "8:30",
      customerNumber: "28256698",
      po: "8",
      status: "completed",
      orderContent: [
        { article: "Pizza Pepperoni", quantity: 4 },
        { article: "Sprite", quantity: 2 },
      ],
    },
    {
      id: "4",
      customerName: "Mme Sousou",
      orderTime: "12:35",
      customerNumber: "28256698",
      po: "12",
      status: "pending",
      orderContent: [{ article: "Pizza Hawaienne", quantity: 1 }],
    },
  ]);

  const handleAddModal = (order = null) => {
    if (order) {
      setOrderToEdit(order);
    } else {
      setOrderToEdit(null);
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

  const currentDate = new Date(selectedDate);
  const dayName = dayNames[currentDate.getDay()];
  const dayNumber = currentDate.getDate();

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
      <div className="w-full mt-5 flex items-center justify-center flex-col">
        <div className="flex bg-rose-50 rounded-full p-1 shadow-md w-[100px] justify-between items-center mb-4">
          <button
            onClick={() => setViewMode("agenda")}
            className={`p-2 rounded-full transition-colors flex items-center justify-center ${
              viewMode === "agenda"
                ? "bg-rose-200 text-rose-600"
                : "hover:bg-rose-100"
            }`}
          >
            <IonIcon icon={calendarOutline} style={{ fontSize: "20px" }} />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-full transition-colors flex items-center justify-center ${
              viewMode === "table"
                ? "bg-rose-200 text-rose-600"
                : "hover:bg-rose-100"
            }`}
          >
            <IonIcon icon={listOutline} style={{ fontSize: "20px" }} />
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
          <div className="w-full mt-5 flex items-center justify-center flex-col">
            <div className="text-gray-500 text-xs mb-3 font-bold">
              {dayName}
            </div>
            <div className="text-gray-500 text-lg font-bold">{dayNumber}</div>
          </div>
          <div className="h-auto w-1 border-r-2 absolute ml-[5rem]"></div>
          <div className="min-w-full flex flex-col ml-10">
            {Array.from({ length: 16 }, (_, i) => {
              const hourOrders = orders
                .filter((order) => parseInt(order.po) === 8 + i)
                .sort((a, b) => {
                  const timeA = a.orderTime.split(":").map(Number);
                  const timeB = b.orderTime.split(":").map(Number);
                  return timeA[1] - timeB[1];
                });

              return (
                <div key={i}>
                  <hr />
                  <div className="h-24 w-[96vh] flex flex-row">
                    <span>{`${8 + i}h`}</span>

                    {hourOrders.map((order) => (
                      <Order
                        key={order.id}
                        order={order}
                        func={(e) => handleOrderModal(order, e)}
                      />
                    ))}
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
