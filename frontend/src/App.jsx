import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";

function App() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // Khởi tạo user từ localStorage nếu đã đăng nhập trước đó
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null,
  );

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem)
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      return [...prevCart, { ...product, qty: 1 }];
    });
    alert("Đã thêm vào giỏ hàng!");
  };

  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + amount) }
          : item,
      ),
    );
  };

  const removeFromCart = (id) =>
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));

  const clearCart = () => setCart([]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 font-sans w-full">
        <header className="bg-red-600 text-white p-3 shadow-md sticky top-0 z-50 w-full">
          <div className="w-full px-4 md:px-8 mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="flex items-center">
              <img
                src="/Logo.png"
                alt="UseYourMind Logo"
                className="h-10 w-auto object-contain hover:opacity-80 transition-opacity"
              />
            </Link>

            <div className="flex-1 w-full md:max-w-3xl relative">
              <input
                type="text"
                placeholder="Nhập tên laptop cần tìm..."
                className="w-full text-black px-4 py-2 rounded-full focus:outline-none shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <nav>
              <ul className="flex items-center gap-4">
                {user ? (
                  // Sử dụng class 'group' của Tailwind để làm menu trỏ chuột
                  <li className="relative group py-4 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600">
                        👤
                      </div>
                      <span className="font-medium hover:text-gray-200">
                        {user.username}
                      </span>
                    </div>

                    {/* Khối Dropdown (Mặc định ẩn, hover vào thẻ li sẽ hiện) */}
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
                  <li>
                    <Link to="/auth" className="hover:underline font-medium">
                      Đăng nhập
                    </Link>
                  </li>
                )}

                {/* NÚT ADMIN ĐÃ ĐƯỢC THÊM VÀO ĐÂY */}
                {/* CHỈ HIỂN THỊ NÚT ADMIN KHI ROLE LÀ ADMIN */}
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

            {/* ROUTE ADMIN ĐÃ ĐƯỢC THÊM VÀO ĐÂY */}
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
