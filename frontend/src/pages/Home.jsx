import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home({ addToCart, searchTerm }) {
  const [products, setProducts] = useState([]);
  // Thêm state để lưu danh mục đang được chọn (Mặc định là "All" - Tất cả)
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch(`http://localhost:5000/api/products?search=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [searchTerm]);

  // ==========================================
  // XỬ LÝ LOGIC LỌC SẢN PHẨM
  // ==========================================
  // 1. Tự động trích xuất các danh mục (Category) có trong data
  // Dùng Set để loại bỏ các danh mục bị trùng lặp
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // 2. Lọc ra danh sách laptop hiển thị dựa trên nút đang bấm
  const displayedProducts = products.filter((item) => {
    if (activeCategory === "All") return true;
    return item.category === activeCategory;
  });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold uppercase text-gray-800 border-b-2 border-red-600 inline-block pb-1">
          Laptop Nổi Bật
        </h2>

        {/* THANH NÚT BẤM BỘ LỌC DANH MỤC */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                activeCategory === cat
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-red-600 hover:text-red-600"
              }`}
            >
              {cat === "All" ? "Tất cả" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* HIỂN THỊ DANH SÁCH ĐÃ ĐƯỢC LỌC */}
      {displayedProducts.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white rounded border">
          Không tìm thấy sản phẩm nào phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {displayedProducts.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden border border-gray-100"
            >
              <Link to={`/product/${item.id}`} className="p-3 flex-1 block">
                <div className="bg-white flex justify-center items-center h-40 mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full object-contain transition-transform hover:scale-105"
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 hover:text-red-600">
                    {item.name}
                  </h3>
                  <div className="mt-2 text-[11px] md:text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block mb-2">
                    RAM {item.ram} | SSD {item.ssd}
                  </div>
                  <p className="text-red-600 font-bold text-base md:text-lg">
                    {item.price.toLocaleString("vi-VN")} ₫
                  </p>
                </div>
              </Link>

              <div className="p-3 pt-0 mt-auto">
                <button
                  onClick={() => addToCart(item)}
                  disabled={item.stock_quantity <= 0}
                  className={`w-full font-medium py-1.5 rounded transition-colors text-sm uppercase ${
                    item.stock_quantity > 0
                      ? "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {item.stock_quantity > 0 ? "Thêm vào giỏ" : "Hết hàng"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
