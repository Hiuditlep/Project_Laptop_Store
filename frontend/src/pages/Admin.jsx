import { useState, useEffect } from "react";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch dữ liệu từ Backend
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-red-600">
        TRANG QUẢN TRỊ ADMIN
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Cột Users */}
        <div>
          <h3 className="text-xl font-bold mb-4 bg-gray-200 p-2 rounded">
            Danh sách Người dùng ({users.length})
          </h3>
          <ul className="space-y-2">
            {users.map((u) => (
              <li
                key={u.id}
                className="border p-3 rounded flex justify-between"
              >
                <span className="font-bold">{u.username}</span>
                <span className="text-gray-500 text-sm">ID: {u.id}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột Orders */}
        <div>
          <h3 className="text-xl font-bold mb-4 bg-gray-200 p-2 rounded">
            Danh sách Đơn hàng ({orders.length})
          </h3>
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="border p-4 rounded shadow-sm">
                <p className="font-bold text-lg text-blue-600">
                  Mã đơn: {o.id}
                </p>
                <p>
                  <strong>Khách hàng:</strong> {o.customerInfo.name} -{" "}
                  {o.customerInfo.phone}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {o.customerInfo.address}
                </p>
                <p className="text-red-600 font-bold mt-2">
                  Tổng tiền: {o.total.toLocaleString("vi-VN")} đ
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
