import { useState, useRef, useEffect } from "react";
import ModalInput from "./ModalInput";

const AddOrderModal = ({
  showModal,
  func,
  addOrder,
  viewMode,
  orderToEdit,
}) => {
  const modalRef = useRef(null);

  // Initialize all state values with orderToEdit data if it exists
  const [customerName, setCustomerName] = useState("");
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");
  const [orderTime, setOrderTime] = useState("");
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [index, setIndex] = useState(1);
  const [articles, setArticles] = useState([{ article: "", quantity: "" }]);
  const [details, setDetails] = useState("");

  // Update form values when orderToEdit changes
  useEffect(() => {
    if (orderToEdit) {
      setCustomerName(orderToEdit.customerName || "");
      setCustomerPhoneNumber(
        orderToEdit.customerPhoneNumber || orderToEdit.customerNumber || ""
      );
      setOrderTime(orderToEdit.orderTime || "");
      setOrderDate(
        orderToEdit.orderDate || new Date().toISOString().split("T")[0]
      );
      setDetails(orderToEdit.details || "");

      // If there's orderContent, update articles array
      if (orderToEdit.orderContent && orderToEdit.orderContent.length > 0) {
        setArticles(orderToEdit.orderContent);
        setIndex(orderToEdit.orderContent.length);
      }
    } else {
      // Reset form when orderToEdit is null
      setCustomerName("");
      setCustomerPhoneNumber("");
      setOrderTime("");
      setOrderDate(new Date().toISOString().split("T")[0]);
      setIndex(1);
      setArticles([{ article: "", quantity: "" }]);
      setDetails("");
    }
  }, [orderToEdit]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        func();
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal, func]);

  const handleSubmit = () => {
    const po = parseInt(orderTime.split(":")[0], 10);
    let orderData = {};

    if (orderToEdit) {
      // Keep all original data and only update the changed fields
      orderData = {
        ...orderToEdit,
        customerName,
        customerPhoneNumber,
        orderTime,
        orderDate,
        po,
        details,
        orderContent: articles.filter((item) => item.article && item.quantity),
      };
    } else {
      // For new orders, create fresh data
      orderData = {
        id: Math.random(300),
        customerName,
        customerPhoneNumber,
        orderTime,
        orderDate,
        po,
        status: "pending",
        details,
        orderContent: articles.filter((item) => item.article && item.quantity),
      };
    }

    addOrder(orderData);
    func();
  };

  const increaseOrderField = () => {
    setIndex(index + 1);
    setArticles([...articles, { article: "", quantity: "" }]);
  };

  const decreaseOrderField = () => {
    if (index > 1) {
      setIndex(index - 1);
      setArticles(articles.slice(0, -1));
    }
  };

  const updateArticle = (index, field, value) => {
    const newArticles = [...articles];
    newArticles[index] = { ...newArticles[index], [field]: value };
    setArticles(newArticles);
  };

  return (
    <form action="" method="post">
      <div
        ref={modalRef}
        className={`bg-[#f0f4f9] shadow-2xl transform flex flex-col items-center space-y-6 p-4 absolute  w-1/4  left-[40%] rounded-3xl
  transition-all duration-200  overflow-y-scroll overflow-x-hidden scrollbar-hide ${
    viewMode === "agenda" ? "h-[30%] top-[10%]" : "h-[80%] top-[20%]"
  }
  ${showModal ? "opacity-100 scale-100" : "opacity-100 scale-0"}`}
      >
        <ModalInput
          name={"nomcustomer"}
          text={"Nom De customer"}
          type={"text"}
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <ModalInput
          name={"phoneNumber"}
          text={"Numero De Telephone"}
          type={"text"}
          value={customerPhoneNumber}
          onChange={(e) => setCustomerPhoneNumber(e.target.value)}
        />

        <div className="relative z-0 w-[100%] mb-5 group ml-[72px] mt-60">
          <ModalInput
            name={"orderDate"}
            text={null}
            type={"date"}
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
          />
        </div>
        <div className="relative z-0 w-[100%] mb-5 group ml-[72px] mt-60">
          <ModalInput
            name={"orderTime"}
            text={null}
            type={"time"}
            value={orderTime}
            onChange={(e) => setOrderTime(e.target.value)}
          />
        </div>
        {articles.map((item, i) => (
          <div className="flex flex-row" key={i}>
            <div className="w-3/5 ml-8">
              <ModalInput
                name={`article-${i}`}
                text={`Article-${i + 1}`}
                type={"text"}
                value={item.article}
                onChange={(e) => updateArticle(i, "article", e.target.value)}
              />
            </div>
            <div className="w-1/5">
              <ModalInput
                name={`articleQ-${i}`}
                text={"Nbre"}
                type={"number"}
                value={item.quantity}
                onChange={(e) => updateArticle(i, "quantity", e.target.value)}
              />
            </div>
            {i === articles.length - 1 && (
              <>
                <div
                  className="w-8 h-8 bg-green-300 rounded-full mt-4 flex items-center justify-center text-xl hover:bg-green-500 duration-200"
                  onClick={increaseOrderField}
                >
                  +
                </div>
                <div>
                  <div
                    className="w-8 h-8 bg-red-300 rounded-full mt-4 flex items-center justify-center text-xl ml-1 hover:bg-red-500 duration-200"
                    onClick={decreaseOrderField}
                  >
                    -
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
        <div className="relative z-0 w-[80%] mb-5 group">
          <textarea
            name="details"
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-rose-300 peer"
          ></textarea>
          <label
            htmlFor="details"
            className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-rose-300  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            details de commande
          </label>
        </div>
        <div
          className="rounded-3xl bg-green-400 border-green-200 border-2 p-4 hover:bg-green-200 duration-300 cursor-pointer"
          onClick={handleSubmit}
        >
          {orderToEdit ? "Modifier" : "Ajouter"}
        </div>
      </div>
    </form>
  );
};

export default AddOrderModal;
