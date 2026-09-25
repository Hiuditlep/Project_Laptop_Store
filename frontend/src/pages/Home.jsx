import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home({ addToCart, searchTerm }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products?search=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [searchTerm]);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 uppercase text-gray-800 border-b-2 border-red-600 inline-block pb-1">
        Laptop Nổi Bật
      </h2>

      {/* Responsive Grid: 2 cột (Mobile) -> 3 cột (Tablet) -> 5 cột (Desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {products.map((item) => (
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
                {/* Font chữ được thu nhỏ, gọn gàng hơn */}
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
              {/* Nút mỏng, hiện đại hơn */}
              <button
                onClick={() => addToCart(item)}
                className="w-full border border-red-600 text-red-600 font-medium py-1.5 rounded hover:bg-red-600 hover:text-white transition-colors text-sm"
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
