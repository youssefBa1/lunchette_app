import { IonIcon } from "@ionic/react";
import { createOutline, trashOutline, closeOutline } from "ionicons/icons";
import { useRef, useEffect, useState } from "react";
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
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("");

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

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.status || "notready");
    }
  }, [order]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      onDelete(order._id);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus !== currentStatus) {
      // Show confirmation dialog
      const statusText = getStatusText(newStatus);
      const confirmed = window.confirm(
        `Voulez-vous changer le statut en "${statusText}" ?`
      );

      if (confirmed) {
        try {
          // Call the update function
          const success = await onStatusChange(order._id, newStatus);

          if (success) {
            // Update local state and show success message
            setCurrentStatus(newStatus);
            setStatusUpdateSuccess(true);

            // Hide success message after 3 seconds
            setTimeout(() => {
              setStatusUpdateSuccess(false);
            }, 3000);
          } else {
            setStatusUpdateSuccess(false);
          }
        } catch (error) {
          console.error("Failed to update status:", error);
          setStatusUpdateSuccess(false);
        }
      }
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

  return (
    <div
      ref={modalRef}
      style={modalStyle}
      className={`${
        show ? "opacity-100 scale-100" : "opacity-100 scale-0"
      } bg-[#f0f4f9] shadow-2xl flex flex-col items-center space-y-4 p-5 h-auto w-[30%] rounded-3xl
      transition-all duration-200 overflow-y-auto overflow-x-visible scrollbar-hide text-lg`}
    >
      <div className="w-full flex justify-end space-x-6">
        <div
          className="rounded-full hover:bg-slate-200 p-2 items-center justify-center flex duration-300 cursor-pointer"
          onClick={() => {
            onEdit(order);
            onClose();
          }}
        >
          <IonIcon
            icon={createOutline}
            style={{ fontSize: "22px", color: "#444746" }}
          />
        </div>
        <div
          className="rounded-full hover:bg-slate-200 p-2 items-center justify-center flex duration-300 cursor-pointer"
          onClick={handleDelete}
        >
          <IonIcon
            icon={trashOutline}
            style={{ fontSize: "22px", color: "#444746" }}
          />
        </div>
        <div
          className="rounded-full hover:bg-slate-200 p-2 items-center justify-center flex duration-300 cursor-pointer"
          onClick={onClose}
        >
          <IonIcon
            icon={closeOutline}
            style={{ fontSize: "22px", color: "#444746" }}
          />
        </div>
      </div>
      <div className="w-full px-3">
        <h1 className="text-xl mb-1">{order.customerName}</h1>
        <span className="text-base text-gray-500">{order.pickupTime}</span>
      </div>
      <div className="mt-2 w-full px-3 flex flex-col space-y-3">
        <div className="text-gray-600 text-base">
          Tel: {order.customerPhoneNumber}
        </div>
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            Commande:
          </h2>
          {order.orderContent && order.orderContent.length > 0 ? (
            order.orderContent.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-base text-gray-700 bg-white p-2 rounded-lg shadow-sm"
              >
                <div className="flex items-center">
                  <span className="font-medium mr-2">{item.quantity}x</span>
                  <span>{item.product_id.name}</span>
                </div>
                <span className="text-gray-500">{item.price} DT</span>
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">Aucun article</div>
          )}
          <div className="mt-1 text-right font-semibold">
            {order.hasAdvancePayment ? (
              <>
                <div>Accompte: {order.advanceAmount} DT</div>
                <div>Reste à payer: {order.remainingAmount} DT</div>
              </>
            ) : (
              <>
                <div>Accompte: aucune</div>
                <div>Total: {order.totalPrice} DT</div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-1">
          <h2 className="text-lg font-semibold text-gray-700">Status:</h2>
          <div className="flex flex-col">
            <select
              value={currentStatus}
              onChange={handleStatusChange}
              className={`text-sm px-3 py-1 rounded-full ${getStatusColor(
                currentStatus
              )}`}
            >
              <option value="notready">En attente</option>
              <option value="ready">Prêt</option>
              <option value="payed">Payé</option>
            </select>
            {statusUpdateSuccess === true && (
              <div className="mt-1 text-sm text-green-600 font-semibold">
                Status mis à jour avec succès!
              </div>
            )}
            {statusUpdateSuccess === false && (
              <div className="mt-1 text-sm text-red-600 font-semibold">
                Erreur lors de la mise à jour du statut.
              </div>
            )}
          </div>
        </div>
        {order.description && (
          <div className="flex flex-col space-y-1">
            <h2 className="text-lg font-semibold text-gray-700">Details:</h2>
            <div className="text-gray-600 bg-white p-2 rounded-lg shadow-sm text-base">
              {order.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderModal;
