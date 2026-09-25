import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Detail({ addToCart }) {
  const { id } = useParams(); // Lấy ID từ thanh URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded-lg border"
        />
      </div>
      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
        <p className="text-gray-500 mb-2">
          Thương hiệu: <span className="font-bold">{product.brand}</span>
        </p>
        <p className="text-red-600 text-3xl font-bold mb-6">
          {product.price.toLocaleString("vi-VN")} đ
        </p>

        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="font-bold mb-2">Cấu hình chi tiết:</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>CPU:</strong> {product.cpu}
            </li>
            <li>
              <strong>RAM:</strong> {product.ram}
            </li>
            <li>
              <strong>SSD:</strong> {product.ssd}
            </li>
            <li>
              <strong>Danh mục:</strong> {product.category}
            </li>
          </ul>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
          >
            THÊM VÀO GIỎ
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
