import { IonIcon } from "@ionic/react";
import { useState, useEffect } from "react";
import AddPurchaseModal from "./AddPurchaseModal";
import { calendarOutline } from "ionicons/icons";
import PurchaseModal from "./PurchaseModal";
import PurchasesHeader from "./PurchasesHeader";
import PurchasesTableView from "./PurchasesTableView";

const RegularSales = () => {
  const [isAddModalShown, setIsAddModalShown] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [modalPosition, setModalPosition] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [purchaseToEdit, setPurchaseToEdit] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPurchaseModalShown, setIsPurchaseModalShown] = useState(false);

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

  // Fetch purchases when date changes
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/purchases/date/${selectedDate}`
        );
        if (!response.ok) throw new Error("Failed to fetch purchases");
        const data = await response.json();
        setPurchases(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, [selectedDate]);

  const addPurchase = async (purchaseData) => {
    try {
      const transformedPurchase = {
        supplierName: purchaseData.supplierName,
        supplierPhoneNumber: purchaseData.supplierPhoneNumber,
        purchaseDate: new Date(purchaseData.purchaseDate).toISOString(),
        purchaseTime: purchaseData.purchaseTime,
        status: purchaseData._id ? purchaseToEdit.status : "pending",
        purchaseContent: purchaseData.purchaseContent.map((item) => ({
          product_id: item.product_id,
          quantity: parseInt(item.quantity),
          price: item.price,
        })),
        totalPrice: purchaseData.totalPrice || 0,
        hasAdvancePayment: purchaseData.hasAdvancePayment || false,
        advanceAmount: purchaseData.hasAdvancePayment
          ? parseFloat(purchaseData.advanceAmount) || 0
          : 0,
        remainingAmount: purchaseData.hasAdvancePayment
          ? purchaseData.totalPrice -
            (parseFloat(purchaseData.advanceAmount) || 0)
          : purchaseData.totalPrice,
        details: purchaseData.details || "",
      };

      const url = purchaseData._id
        ? `http://localhost:3000/api/purchases/${purchaseData._id}`
        : "http://localhost:3000/api/purchases";

      const method = purchaseData._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedPurchase),
      });

      if (!response.ok) throw new Error("Failed to save purchase");

      // Refresh purchases
      const updatedResponse = await fetch(
        `http://localhost:3000/api/purchases/date/${selectedDate}`
      );
      if (!updatedResponse.ok)
        throw new Error("Failed to fetch updated purchases");
      const updatedPurchases = await updatedResponse.json();
      setPurchases(updatedPurchases);
    } catch (error) {
      console.error("Error saving purchase:", error);
    }
  };

  const deletePurchase = async (purchaseId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/purchases/${purchaseId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete purchase");

      const updatedResponse = await fetch(
        `http://localhost:3000/api/purchases/date/${selectedDate}`
      );
      if (!updatedResponse.ok)
        throw new Error("Failed to fetch updated purchases");
      const updatedPurchases = await updatedResponse.json();
      setPurchases(updatedPurchases);
      setIsPurchaseModalShown(false);
    } catch (error) {
      console.error("Error deleting purchase:", error);
    }
  };

  const updatePurchaseStatus = async (purchaseId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/purchases/${purchaseId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update purchase status");

      const updatedResponse = await fetch(
        `http://localhost:3000/api/purchases/date/${selectedDate}`
      );
      if (!updatedResponse.ok)
        throw new Error("Failed to fetch updated purchases");
      const updatedPurchases = await updatedResponse.json();
      setPurchases(updatedPurchases);
      return true;
    } catch (error) {
      console.error("Error updating purchase status:", error);
      return false;
    }
  };

  const handleAddModal = (purchase = null) => {
    if (isAddModalShown) {
      setPurchaseToEdit(null);
    } else {
      setPurchaseToEdit(purchase);
    }
    setIsAddModalShown(!isAddModalShown);
  };

  const handlePurchaseModal = (purchase, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setSelectedPurchase(purchase);
    setIsPurchaseModalShown(!isPurchaseModalShown);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 mt-28 md:mt-28">
      <PurchasesHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        months={months}
        handleAddModal={handleAddModal}
      />

      <div className="flex-1 overflow-auto">
        <PurchasesTableView
          purchases={purchases}
          handlePurchaseClick={handlePurchaseModal}
        />
      </div>

      {isAddModalShown && (
        <AddPurchaseModal
          showModal={isAddModalShown}
          func={handleAddModal}
          addPurchase={addPurchase}
          purchaseToEdit={purchaseToEdit}
        />
      )}

      {isPurchaseModalShown && selectedPurchase && (
        <PurchaseModal
          show={isPurchaseModalShown}
          onClose={() => setIsPurchaseModalShown(false)}
          onDelete={deletePurchase}
          purchase={selectedPurchase}
          onStatusChange={updatePurchaseStatus}
          onEdit={handleAddModal}
          position={modalPosition}
        />
      )}
    </div>
  );
};

export default RegularSales;
