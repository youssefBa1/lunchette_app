import { IonIcon } from "@ionic/react";
import { useEffect, useState, useRef } from "react";
import { closeOutline, addOutline } from "ionicons/icons";

const AddPurchaseModal = ({ showModal, func, addPurchase }) => {
  const [articles, setArticles] = useState([{ product_id: "", quantity: "" }]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerms, setSearchTerms] = useState(Array(10).fill(""));
  const [filteredProducts, setFilteredProducts] = useState(Array(10).fill([]));
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const modalRef = useRef(null);

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products");
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
    // Filter out empty articles and validate
    const validArticles = articles.filter(
      (item) => item.product_id && item.quantity
    );

    if (validArticles.length === 0) {
      alert("Please add at least one product");
      return;
    }

    const purchaseData = {
      date: date,
      time: time,
      orderContent: validArticles.map((item) => {
        const product = products.find((p) => p._id === item.product_id);
        if (!product) {
          throw new Error("Product not found");
        }
        return {
          product: item.product_id, // This is the MongoDB ObjectId
          quantity: parseInt(item.quantity),
          price: product.price,
        };
      }),
      totalPrice: validArticles.reduce((total, item) => {
        const product = products.find((p) => p._id === item.product_id);
        return total + (product ? product.price * parseInt(item.quantity) : 0);
      }, 0),
    };

    try {
      addPurchase(purchaseData);
      func();
    } catch (error) {
      alert(error.message);
    }
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

      <div className="w-full flex justify-end">
        <div
          className="rounded-full hover:bg-slate-200 p-2 items-center justify-center flex duration-300 cursor-pointer"
          onClick={func}
        >
          <IonIcon
            icon={closeOutline}
            style={{ fontSize: "22px", color: "#444746" }}
          />
        </div>
      </div>

      <div className="w-full space-y-4">
        {/* Date and Time fields */}
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-rose-300 peer"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-rose-300 peer"
              required
            />
          </div>
        </div>

        {articles.map((item, i) => (
          <div
            className={`flex ${
              isMobile ? "flex-col space-y-2 w-full" : "flex-row"
            }`}
            key={i}
          >
            <div className={`${isMobile ? "w-full" : "w-3/5"}`}>
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
                        <span className="text-gray-500">
                          {product.price} DT
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={`${isMobile ? "w-full" : "w-1/5"}`}>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateArticle(i, "quantity", e.target.value)}
                placeholder="Quantité"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-rose-300 peer"
                min="1"
                required
              />
            </div>
            {i === articles.length - 1 && (
              <div className={`flex ${isMobile ? "justify-end mt-2" : ""}`}>
                <div
                  className="w-8 h-8 bg-green-300 rounded-full mt-4 flex items-center justify-center text-xl hover:bg-green-500 duration-200 cursor-pointer"
                  onClick={increaseOrderField}
                >
                  +
                </div>
                <div
                  className="w-8 h-8 bg-red-300 rounded-full mt-4 flex items-center justify-center text-xl ml-1 hover:bg-red-500 duration-200 cursor-pointer"
                  onClick={decreaseOrderField}
                >
                  -
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-between items-center mt-6">
          <div className="text-xl font-semibold">
            Total:{" "}
            {articles.reduce((total, item) => {
              const product = products.find((p) => p._id === item.product_id);
              return total + (product ? product.price * item.quantity : 0);
            }, 0)}{" "}
            DT
          </div>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <IonIcon icon={addOutline} />
            <span>Ajouter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPurchaseModal;
