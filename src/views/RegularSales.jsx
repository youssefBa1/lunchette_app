import { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import { calendarOutline } from "ionicons/icons";
import AddPurchaseModal from "../components/PurchasesComponents/AddPurchaseModal";
import PurchaseModal from "../components/PurchasesComponents/PurchaseModal";
import PurchasesHeader from "../components/PurchasesComponents/PurchasesHeader";
import PurchasesTableView from "../components/PurchasesComponents/PurchasesTableView";

const RegularSales = () => {
  const [isAddModalShown, setIsAddModalShown] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [modalPosition, setModalPosition] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [saleToEdit, setSaleToEdit] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaleModalShown, setIsSaleModalShown] = useState(false);

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

  // Fetch sales when date changes
  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/regular-sales/date/${selectedDate}`
        );
        if (!response.ok) throw new Error("Failed to fetch sales");
        const data = await response.json();
        setSales(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [selectedDate]);

  const addSale = async (saleData) => {
    try {
      const transformedSale = {
        date: new Date(saleData.date).toISOString(),
        time: saleData.time,
        orderContent: saleData.orderContent.map((item) => ({
          product: item.product,
          quantity: parseInt(item.quantity),
          price: item.price,
        })),
        totalPrice: saleData.totalPrice || 0,
        status: saleData._id ? saleToEdit.status : "pending",
      };

      const url = saleData._id
        ? `http://localhost:3000/api/regular-sales/${saleData._id}`
        : "http://localhost:3000/api/regular-sales";

      const method = saleData._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedSale),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save sale");
      }

      // Refresh sales
      const updatedResponse = await fetch(
        `http://localhost:3000/api/regular-sales/date/${selectedDate}`
      );
      if (!updatedResponse.ok) throw new Error("Failed to fetch updated sales");
      const updatedSales = await updatedResponse.json();
      setSales(updatedSales);
      setIsAddModalShown(false);
    } catch (error) {
      console.error("Error saving sale:", error);
      alert(error.message); // Show error to user
    }
  };

  const deleteSale = async (saleId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/regular-sales/${saleId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete sale");

      const updatedResponse = await fetch(
        `http://localhost:3000/api/regular-sales/date/${selectedDate}`
      );
      if (!updatedResponse.ok) throw new Error("Failed to fetch updated sales");
      const updatedSales = await updatedResponse.json();
      setSales(updatedSales);
      setIsSaleModalShown(false);
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  const updateSaleStatus = async (saleId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/regular-sales/${saleId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update sale status");

      const updatedResponse = await fetch(
        `http://localhost:3000/api/regular-sales/date/${selectedDate}`
      );
      if (!updatedResponse.ok) throw new Error("Failed to fetch updated sales");
      const updatedSales = await updatedResponse.json();
      setSales(updatedSales);
      return true;
    } catch (error) {
      console.error("Error updating sale status:", error);
      return false;
    }
  };

  const handleAddModal = (sale = null) => {
    if (isAddModalShown) {
      setSaleToEdit(null);
    } else {
      setSaleToEdit(sale);
    }
    setIsAddModalShown(!isAddModalShown);
  };

  const handleSaleModal = (sale, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setSelectedSale(sale);
    setIsSaleModalShown(!isSaleModalShown);
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
          purchases={sales}
          handlePurchaseClick={handleSaleModal}
        />
      </div>

      {isAddModalShown && (
        <AddPurchaseModal
          showModal={isAddModalShown}
          func={handleAddModal}
          addPurchase={addSale}
          purchaseToEdit={saleToEdit}
        />
      )}

      {isSaleModalShown && selectedSale && (
        <PurchaseModal
          show={isSaleModalShown}
          onClose={() => setIsSaleModalShown(false)}
          onDelete={deleteSale}
          purchase={selectedSale}
          onStatusChange={updateSaleStatus}
          onEdit={handleAddModal}
          position={modalPosition}
        />
      )}
    </div>
  );
};

export default RegularSales;
