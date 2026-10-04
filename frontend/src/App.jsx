import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

// Các trang (Pages) của trang web
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";

function App() {
  // ==========================================
  // 1. STATE TOÀN CỤC (GLOBAL STATE)
  // ==========================================
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Khởi tạo user từ localStorage. Dùng hàm callback () => ... để tối ưu hiệu suất,
  // chỉ đọc ổ cứng 1 lần duy nhất khi web vừa bật lên.
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null,
  );

  // ==========================================
  // 2. CÁC HÀM XỬ LÝ DỮ LIỆU TÀI KHOẢN & GIỎ HÀNG
  // ==========================================
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      // Kiểm tra xem laptop này đã có trong giỏ chưa
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // Nếu có rồi thì tăng số lượng lên 1
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      // Nếu chưa có thì thêm mới vào mảng với số lượng là 1
      return [...prevCart, { ...product, qty: 1 }];
    });
    alert("Đã thêm vào giỏ hàng!");
  };

  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + amount) } // Không cho số lượng tụt xuống dưới 1
          : item,
      ),
    );
  };

  const removeFromCart = (id) =>
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));

  const clearCart = () => setCart([]);

  // ==========================================
  // 3. HIỂN THỊ GIAO DIỆN CHÍNH (LAYOUT & ROUTER)
  // ==========================================
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 font-sans w-full">
        {/* HEADER CỐ ĐỊNH (STICKY) */}
        <header className="bg-red-600 text-white p-3 shadow-md sticky top-0 z-50 w-full">
          <div className="w-full px-4 md:px-8 mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src="/Logo.png"
                alt="UseYourMind Logo"
                className="h-10 w-auto object-contain hover:opacity-80 transition-opacity"
              />
            </Link>

            {/* Thanh tìm kiếm */}
            <div className="flex-1 w-full md:max-w-3xl relative">
              <input
                type="text"
                placeholder="Nhập tên laptop cần tìm..."
                className="w-full text-black px-4 py-2 rounded-full focus:outline-none shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Điều hướng (Navigation) */}
            <nav>
              <ul className="flex items-center gap-4">
                {/* HIỂN THỊ MENU TÀI KHOẢN (NẾU ĐÃ ĐĂNG NHẬP) */}
                {user ? (
                  <li className="relative group py-4 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600">
                        👤
                      </div>
                      <span className="font-medium hover:text-gray-200">
                        {user.username}
                      </span>
                    </div>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-0 w-48 bg-white text-black shadow-lg rounded-sm overflow-hidden hidden group-hover:block z-50 border">
                      <Link
                        to="/profile"
                        className="block px-4 py-3 text-sm hover:bg-gray-100 transition"
                      >
                        Tài Khoản Của Tôi
                      </Link>
                      <Link
                        to="/my-orders"
                        className="block px-4 py-3 text-sm hover:bg-gray-100 transition"
                      >
                        Đơn Mua
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition text-red-600"
                      >
                        Đăng Xuất
                      </button>
                    </div>
                  </li>
                ) : (
                  // HIỂN THỊ NÚT ĐĂNG NHẬP (NẾU CHƯA ĐĂNG NHẬP)
                  <li>
                    <Link to="/auth" className="hover:underline font-medium">
                      Đăng nhập
                    </Link>
                  </li>
                )}

                {/* HIỂN THỊ NÚT ADMIN (CHỈ KHI LÀ ADMIN) */}
                {user?.role === "admin" && (
                  <li>
                    <Link
                      to="/admin"
                      className="font-bold text-yellow-300 hover:text-white transition bg-red-800 px-3 py-1 rounded"
                    >
                      Admin Panel
                    </Link>
                  </li>
                )}

                {/* NÚT GIỎ HÀNG */}
                <li>
                  <Link
                    to="/cart"
                    className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg hover:bg-black/30 transition"
                  >
                    🛒 Giỏ hàng{" "}
                    <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-full text-xs font-bold">
                      {cart.reduce((sum, item) => sum + item.qty, 0)}
                    </span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* PHẦN RUỘT TRANG WEB (ROUTES) */}
        <main className="w-full px-4 md:px-8 mt-6">
          <Routes>
            <Route
              path="/"
              element={<Home addToCart={addToCart} searchTerm={searchTerm} />}
            />
            <Route
              path="/product/:id"
              element={<Detail addToCart={addToCart} />}
            />
            <Route
              path="/cart"
              element={
                <Cart
                  cart={cart}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              }
            />
            <Route path="/auth" element={<Auth setUser={setUser} />} />
            <Route
              path="/checkout"
              element={
                <Checkout cart={cart} user={user} clearCart={clearCart} />
              }
            />
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/profile"
              element={<Profile user={user} setUser={setUser} />}
            />
            <Route path="/my-orders" element={<MyOrders user={user} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
