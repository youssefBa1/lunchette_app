import { IonIcon } from "@ionic/react";
import { createOutline, trashOutline, closeOutline } from "ionicons/icons";
import { useRef, useEffect, useState } from "react";

const PurchaseModal = ({
  show,
  onClose,
  onDelete,
  purchase,
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
    if (purchase) {
      setCurrentStatus(purchase.status || "pending");
    }
  }, [purchase]);

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet achat ?")) {
      onDelete(purchase._id);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus !== currentStatus) {
      const statusText = getStatusText(newStatus);
      const confirmed = window.confirm(
        `Voulez-vous changer le statut en "${statusText}" ?`
      );

      if (confirmed) {
        try {
          const success = await onStatusChange(purchase._id, newStatus);

          if (success) {
            setCurrentStatus(newStatus);
            setStatusUpdateSuccess(true);

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

  if (!purchase) return null;

  const modalStyle = {
    position: "fixed",
    top: position ? `${position.y}px` : "10%",
    left: position ? `${position.x}px` : "20%",
    transform: "translate(-50%, -50%)",
    zIndex: 1000,
  };

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
            onEdit(purchase);
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
        <h1 className="text-xl mb-1">{purchase.supplierName}</h1>
        <span className="text-base text-gray-500">{purchase.purchaseTime}</span>
      </div>
      <div className="mt-2 w-full px-3 flex flex-col space-y-3">
        <div className="text-gray-600 text-base">
          Tel: {purchase.supplierPhoneNumber}
        </div>
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            Produits:
          </h2>
          {purchase.purchaseContent && purchase.purchaseContent.length > 0 ? (
            purchase.purchaseContent.map((item, index) => (
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
            <div className="text-gray-500 italic">Aucun produit</div>
          )}
          <div className="mt-1 text-right font-semibold">
            {purchase.hasAdvancePayment ? (
              <>
                <div>Avance: {purchase.advanceAmount} DT</div>
                <div>Reste à payer: {purchase.remainingAmount} DT</div>
              </>
            ) : (
              <>
                <div>Avance: aucune</div>
                <div>Total: {purchase.totalPrice} DT</div>
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
              <option value="pending">En attente</option>
              <option value="received">Reçu</option>
              <option value="completed">Complété</option>
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
        {purchase.details && (
          <div className="flex flex-col space-y-1">
            <h2 className="text-lg font-semibold text-gray-700">Details:</h2>
            <div className="text-gray-600 bg-white p-2 rounded-lg shadow-sm text-base">
              {purchase.details}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseModal;
