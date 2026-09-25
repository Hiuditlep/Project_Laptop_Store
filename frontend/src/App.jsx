import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Cart from "./pages/Cart";

function App() {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
    alert("Đã thêm vào giỏ hàng!");
  };

  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + amount;
          return { ...item, qty: newQty > 0 ? newQty : 1 };
        }
        return item;
      }),
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  return (
    <BrowserRouter>
      {/* Container tổng bao trọn 100% chiều rộng */}
      <div className="min-h-screen bg-gray-100 font-sans w-full">
        {/* Header tràn viền */}
        <header className="bg-red-600 text-white p-3 shadow-md sticky top-0 z-50 w-full">
          <div className="w-full px-4 md:px-8 mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Tên Website mới */}
            <Link to="/" className="text-2xl font-black italic tracking-wider">
              UseYourMind
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
              <span className="absolute right-4 top-2 text-gray-500 cursor-pointer">
                🔍
              </span>
            </div>

            <nav>
              <ul className="flex items-center">
                <li>
                  <Link
                    to="/cart"
                    className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg hover:bg-black/30 transition"
                  >
                    🛒 Giỏ hàng
                    <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-full text-xs font-bold">
                      {cart.reduce((sum, item) => sum + item.qty, 0)}
                    </span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Nội dung chính (Main) tràn viền */}
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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
