import { IonIcon } from "@ionic/react";
import { createOutline, trashOutline, closeOutline } from "ionicons/icons";
import { useRef, useEffect } from "react";

const OrderModal = ({
  show,
  onClose,
  onDelete,
  order,
  onStatusChange,
  onEdit,
  position,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      onDelete(order.id);
    }
  };

  if (!order) return null;

  // Calculate modal position
  const modalStyle = {
    position: "fixed",
    top: position ? `${position.y}px` : "10%",
    left: position ? `${position.x}px` : "20%",
    transform: "translate(-50%, -50%)",
    zIndex: 1000,
  };

  return (
    <div
      ref={modalRef}
      style={modalStyle}
      className={`${
        show ? "opacity-100 scale-100" : "opacity-100 scale-0"
      } bg-[#f0f4f9] shadow-2xl flex flex-col items-center space-y-6 p-4 h-auto w-[30%] rounded-3xl
      transition-all duration-200 overflow-y-scroll overflow-x-hidden scrollbar-hide text-xl`}
    >
      <div className="w-full flex justify-end space-x-8">
        <div
          className="rounded-full hover:bg-slate-200 p-2 items-center justify-center flex duration-300 cursor-pointer"
          onClick={() => {
            onEdit(order);
            onClose();
          }}
        >
          <IonIcon
            icon={createOutline}
            style={{ fontSize: "25px", color: "#444746" }}
          />
        </div>
        <div
          className="rounded-full hover:bg-slate-200 p-2 items-center justify-center flex duration-300 cursor-pointer"
          onClick={handleDelete}
        >
          <IonIcon
            icon={trashOutline}
            style={{ fontSize: "25px", color: "#444746" }}
          />
        </div>
        <div
          className="rounded-full hover:bg-slate-200 p-2 items-center justify-center flex duration-300 cursor-pointer"
          onClick={onClose}
        >
          <IonIcon
            icon={closeOutline}
            style={{ fontSize: "25px", color: "#444746" }}
          />
        </div>
      </div>
      <div className="w-full ml-20 ">
        <h1 className="text-2xl mb-2">{order.customerName}</h1>
        <span className="text-lg text-gray-500">{order.orderTime}</span>
      </div>
      <div className="mt-4 w-full ml-20 flex flex-col space-y-4">
        <div className="text-gray-600 text-lg">
          Tel: {order.customerNumber || order.customerPhoneNumber}
        </div>
        <div className="flex flex-col space-y-2">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Commande:
          </h2>
          {order.orderContent && order.orderContent.length > 0 ? (
            order.orderContent.map((item, index) => (
              <div
                key={index}
                className="flex items-center text-lg text-gray-700 bg-white p-2 rounded-lg shadow-sm"
              >
                <span className="font-medium mr-2">{item.quantity}x</span>
                <span>{item.article}</span>
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">Aucun article</div>
          )}
        </div>
        {order.details && (
          <div className="flex flex-col space-y-2">
            <h2 className="text-xl font-semibold text-gray-700">Details:</h2>
            <div className="text-gray-600 bg-white p-3 rounded-lg shadow-sm">
              {order.details}
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex justify-center space-x-4 mt-4">
        <button
          onClick={() => onStatusChange(order.id, "pending")}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            order.status === "pending"
              ? "bg-red-400"
              : "bg-red-300 hover:bg-red-400"
          }`}
        >
          En attente
        </button>
        <button
          onClick={() => onStatusChange(order.id, "ready")}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            order.status === "ready"
              ? "bg-blue-400"
              : "bg-blue-300 hover:bg-blue-400"
          }`}
        >
          Prêt
        </button>
        <button
          onClick={() => onStatusChange(order.id, "completed")}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            order.status === "completed"
              ? "bg-green-400"
              : "bg-green-300 hover:bg-green-400"
          }`}
        >
          Payé
        </button>
      </div>
    </div>
  );
};

export default OrderModal;
