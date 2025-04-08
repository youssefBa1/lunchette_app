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
  const [articles, setArticles] = useState([{ product_id: "", quantity: "" }]);
  const [details, setDetails] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerms, setSearchTerms] = useState(Array(10).fill("")); // Array to store search terms for each article
  const [filteredProducts, setFilteredProducts] = useState(Array(10).fill([])); // Array to store filtered products for each article

  // Track window width for responsive design
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width when resized
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine if we're on mobile
  const isMobile = windowWidth < 768;

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Update form values when orderToEdit changes
  useEffect(() => {
    if (orderToEdit) {
      console.log("Editing order:", orderToEdit);
      setCustomerName(orderToEdit.customerName || "");
      setCustomerPhoneNumber(
        orderToEdit.customerPhoneNumber || orderToEdit.customerNumber || ""
      );
      setOrderTime(orderToEdit.pickupTime || orderToEdit.orderTime || "");
      setOrderDate(
        orderToEdit.pickupDate ||
          orderToEdit.orderDate ||
          new Date().toISOString().split("T")[0]
      );
      setDetails(orderToEdit.description || orderToEdit.details || "");

      // If there's orderContent, update articles array
      if (orderToEdit.orderContent && orderToEdit.orderContent.length > 0) {
        setArticles(
          orderToEdit.orderContent.map((item) => ({
            product_id: item.product_id._id || item.product_id,
            quantity: item.quantity,
          }))
        );
      }
    } else {
      console.log("Creating new order");
      // Reset form when orderToEdit is null
      setCustomerName("");
      setCustomerPhoneNumber("");
      setOrderTime("");
      setOrderDate(new Date().toISOString().split("T")[0]);
      setArticles([{ product_id: "", quantity: "" }]);
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
    // Calculate total price
    let totalPrice = 0;
    articles.forEach((item) => {
      const product = products.find((p) => p._id === item.product_id);
      if (product) {
        totalPrice += product.price * item.quantity;
      }
    });

    const orderData = {
      _id: orderToEdit?._id,
      customerName,
      customerPhoneNumber,
      orderDate,
      orderTime,
      orderContent: articles
        .filter((item) => item.product_id && item.quantity)
        .map((item) => {
          const product = products.find((p) => p._id === item.product_id);
          return {
            product_id: item.product_id,
            quantity: parseInt(item.quantity),
            price: product ? product.price : 0,
          };
        }),
      totalPrice,
      details,
    };

    addOrder(orderData);
    func();
  };

  const increaseOrderField = () => {
    setArticles([...articles, { product_id: "", quantity: "" }]);
  };

  const decreaseOrderField = () => {
    if (articles.length > 1) {
      setArticles(articles.slice(0, -1));
    }
  };

  const updateArticle = (index, field, value) => {
    const newArticles = [...articles];
    newArticles[index] = { ...newArticles[index], [field]: value };
    setArticles(newArticles);
  };

  const handleSearch = (index, searchTerm) => {
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = searchTerm;
    setSearchTerms(newSearchTerms);

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const newFilteredProducts = [...filteredProducts];
    newFilteredProducts[index] = filtered;
    setFilteredProducts(newFilteredProducts);
  };

  const selectProduct = (index, product) => {
    updateArticle(index, "product_id", product._id);
    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = product.name;
    setSearchTerms(newSearchTerms);
    const newFilteredProducts = [...filteredProducts];
    newFilteredProducts[index] = [];
    setFilteredProducts(newFilteredProducts);
  };

  if (loading) return null;

  // Desktop modal container styles
  const desktopModalStyles = `
    bg-[#f0f4f9] shadow-2xl transform flex flex-col items-center space-y-6 p-4 fixed 
    w-1/4 left-[40%] rounded-3xl transition-all duration-300 overflow-y-auto
    overflow-x-hidden scrollbar-hide top-[120px] h-[80vh] max-h-[80vh] z-50
  `;

  // Mobile modal container styles with slide-up animation
  const mobileModalStyles = `
    bg-[#f0f4f9] shadow-2xl transform flex flex-col items-center space-y-4 p-4 fixed 
    w-[90%] sm:w-[80%] md:w-1/4 left-[5%] sm:left-[10%] md:left-[40%] rounded-t-3xl
    overflow-y-auto overflow-x-hidden scrollbar-hide bottom-0 h-[90vh] z-50
    transition-all duration-500 ease-in-out
  `;

  return (
    <form action="" method="post">
      <div
        ref={modalRef}
        className={`${isMobile ? mobileModalStyles : desktopModalStyles} ${
          showModal
            ? isMobile
              ? "translate-y-0 opacity-100 visible"
              : "opacity-100 scale-100 visible"
            : isMobile
            ? "translate-y-full opacity-0 invisible"
            : "opacity-0 scale-0 invisible"
        }`}
      >
        {/* Close button for mobile */}
        {isMobile && (
          <div className="w-full flex justify-center mb-2">
            <div className="w-16 h-1 bg-gray-300 rounded-full"></div>
          </div>
        )}

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

        <div
          className={`relative z-0 w-[100%] mb-5 group ${
            isMobile ? "px-4" : "ml-[72px]"
          } mt-${isMobile ? "0" : "60"}`}
        >
          <ModalInput
            name={"orderDate"}
            text={null}
            type={"date"}
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
          />
        </div>
        <div
          className={`relative z-0 w-[100%] mb-5 group ${
            isMobile ? "px-4" : "ml-[72px]"
          } mt-${isMobile ? "0" : "60"}`}
        >
          <ModalInput
            name={"orderTime"}
            text={null}
            type={"time"}
            value={orderTime}
            onChange={(e) => setOrderTime(e.target.value)}
          />
        </div>

        {articles.map((item, i) => (
          <div
            className={`flex ${
              isMobile ? "flex-col space-y-2 w-full px-4" : "flex-row"
            }`}
            key={i}
          >
            <div className={`${isMobile ? "w-full" : "w-3/5 ml-8"}`}>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerms[i] || ""}
                  onChange={(e) => handleSearch(i, e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-rose-300 peer"
                />
                {filteredProducts[i]?.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredProducts[i].map((product) => (
                      <div
                        key={product._id}
                        onClick={() => selectProduct(i, product)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      >
                        <span>{product.name}</span>
                        <span className="text-gray-500">{product.price}€</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={`${isMobile ? "w-full" : "w-1/5"}`}>
              <ModalInput
                name={`articleQ-${i}`}
                text={"Nbre"}
                type={"number"}
                value={item.quantity}
                onChange={(e) => updateArticle(i, "quantity", e.target.value)}
              />
            </div>
            {i === articles.length - 1 && (
              <div className={`flex ${isMobile ? "justify-end mt-2" : ""}`}>
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
              </div>
            )}
          </div>
        ))}
        <div
          className={`relative z-0 ${
            isMobile ? "w-[95%]" : "w-[80%]"
          } mb-5 group`}
        >
          <textarea
            name="details"
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-rose-300 peer"
          ></textarea>
          <label
            htmlFor="details"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-rose-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            details de commande
          </label>
        </div>
        <div
          className={`rounded-3xl bg-green-400 border-green-200 border-2 p-4 hover:bg-green-200 duration-300 cursor-pointer ${
            isMobile ? "w-[60%] text-center mb-6" : ""
          }`}
          onClick={handleSubmit}
        >
          {orderToEdit ? "Modifier" : "Ajouter"}
        </div>
      </div>
    </form>
  );
};

export default AddOrderModal;
