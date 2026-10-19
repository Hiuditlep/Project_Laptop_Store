import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

// COMPONENTS BÊN TRONG
import MegaMenu from "./components/MegaMenu";

// PAGES
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import SearchPage from "./pages/SearchPage";

function AppContent() {
  const [cart, setCart] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null,
  );

  // === STATE CHO TÍNH NĂNG GỢI Ý ===
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchInput.trim().length > 0) {
      fetch(`http://localhost:5000/api/products?search=${searchInput.trim()}`)
        .then((res) => res.json())
        .then((data) => {
          setSearchSuggestions(data.slice(0, 4));
        });
    } else {
      setSearchSuggestions([]);
    }
  }, [searchInput]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const addToCart = (product) => {
    if (!user) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/auth");
      return;
    }
    if (product.stock_quantity <= 0) {
      alert("Sản phẩm này đã tạm hết hàng!");
      return;
    }

    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem && existingItem.qty >= product.stock_quantity) {
      alert(`Rất tiếc, kho chỉ còn tối đa ${product.stock_quantity} sản phẩm!`);
      return;
    }
