import { useState, useEffect } from "react";

export default function Admin() {
  // ==========================================
  // 1. STATE & HOOKS
  // ==========================================
  const [activeTab, setActiveTab] = useState("orders"); // Quản lý Tab đang mở
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  // State cho Form thêm sản phẩm
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    price: "",
    stock_quantity: "",
    category: "",
  });

  // ==========================================
  // 2. GỌI API LẤY DỮ LIỆU
  // ==========================================
  const fetchData = () => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // 3. CÁC HÀM XỬ LÝ SẢN PHẨM (CRUD)
  // ==========================================
  const handleAddProduct = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newProduct,
        price: Number(newProduct.price),
        stock_quantity: Number(newProduct.stock_quantity),
        image: "https://placehold.co/400x300?text=New+Laptop", // Ảnh mặc định
      }),
    });
    alert("Thêm sản phẩm thành công!");
    setNewProduct({
      name: "",
      brand: "",
      price: "",
      stock_quantity: "",
      category: "",
    }); // Reset form
    fetchData(); // Tải lại danh sách
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Xóa vĩnh viễn sản phẩm này?")) {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      fetchData();
    }
  };

  // Các hàm cũ (Xóa User, Sửa Status Order...)
  const handleDeleteUser = async (id) => {
    if (window.confirm("Xóa người dùng này?")) {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });
      fetchData();
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    await fetch(`http://localhost:5000/api/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchData();
  };

  // ==========================================
  // 4. HIỂN THỊ GIAO DIỆN
  // ==========================================
  return (
    <div className="bg-white p-6 rounded-lg shadow-md min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-red-600 uppercase border-b pb-4">
        Bảng Điều Khiển Admin
      </h2>

      {/* THANH CHUYỂN TAB */}
      <div className="flex gap-4 mb-6 border-b pb-2">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 font-bold rounded ${activeTab === "orders" ? "bg-red-600 text-white" : "bg-gray-200"}`}
        >
          📦 Quản lý Đơn hàng ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 font-bold rounded ${activeTab === "products" ? "bg-red-600 text-white" : "bg-gray-200"}`}
        >
          💻 Quản lý Sản phẩm ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 font-bold rounded ${activeTab === "users" ? "bg-red-600 text-white" : "bg-gray-200"}`}
        >
          👤 Quản lý Khách hàng ({users.length})
        </button>
      </div>

      {/* NỘI DUNG TAB ĐƠN HÀNG */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-gray-50 border p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-blue-600">{o.id}</p>
                <p>
                  Khách: {o.customerInfo.name} | Tổng:{" "}
                  {o.total.toLocaleString("vi-VN")} đ
                </p>
              </div>
              <select
                value={o.status || "Chờ duyệt"}
                onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                className="border p-2 rounded"
              >
                <option value="Chờ duyệt">Chờ duyệt</option>
                <option value="Đang giao">Đang giao</option>
                <option value="Đã giao">Đã giao</option>
              </select>
            </div>
          ))}
        </div>
      )}

      {/* NỘI DUNG TAB SẢN PHẨM */}
      {activeTab === "products" && (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Form thêm sản phẩm */}
          <form
            onSubmit={handleAddProduct}
            className="md:col-span-1 bg-gray-50 p-4 rounded border h-fit"
          >
            <h3 className="font-bold mb-4">Thêm Laptop Mới</h3>
            <input
              type="text"
              placeholder="Tên Laptop"
              required
              className="w-full mb-3 p-2 border rounded"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Thương hiệu (Asus, Dell...)"
              required
              className="w-full mb-3 p-2 border rounded"
              value={newProduct.brand}
              onChange={(e) =>
                setNewProduct({ ...newProduct, brand: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phân khúc (Gaming, Office...)"
              required
              className="w-full mb-3 p-2 border rounded"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Giá tiền (VNĐ)"
              required
              className="w-full mb-3 p-2 border rounded"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Số lượng kho"
              required
              className="w-full mb-3 p-2 border rounded"
              value={newProduct.stock_quantity}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock_quantity: e.target.value })
              }
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-2 rounded"
            >
              THÊM SẢN PHẨM
            </button>
          </form>

          {/* Danh sách sản phẩm */}
          <div className="md:col-span-2 space-y-3 max-h-[600px] overflow-y-auto">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center bg-white p-3 border rounded"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={p.image}
                    className="w-16 h-16 object-contain"
                    alt=""
                  />
                  <div>
                    <p className="font-bold">{p.name}</p>
                    <p className="text-sm text-gray-500">
                      Giá: {p.price.toLocaleString("vi-VN")} đ | Kho:{" "}
                      {p.stock_quantity}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded font-bold"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NỘI DUNG TAB KHÁCH HÀNG */}
      {activeTab === "users" && (
        <ul className="space-y-3">
          {users.map((u) => (
            <li
              key={u.id}
              className="bg-gray-50 border p-3 rounded flex justify-between items-center"
            >
              <span className="font-bold">
                {u.username} (ID: {u.id})
              </span>
              <button
                onClick={() => handleDeleteUser(u.id)}
                className="text-red-500 bg-red-100 px-3 py-1 rounded"
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
