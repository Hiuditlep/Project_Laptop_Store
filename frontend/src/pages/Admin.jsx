import { useState, useEffect } from "react";

export default function Admin() {
  // ==========================================
  // 1. KHỞI TẠO STATE (TRẠNG THÁI DỮ LIỆU)
  // ==========================================
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  // ==========================================
  // 2. CÁC HÀM GIAO TIẾP VỚI BACKEND (API CALLS)
  // ==========================================

  // Hàm lấy dữ liệu mới nhất từ server
  const fetchData = () => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));

    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  };

  // Tự động chạy fetchData() một lần duy nhất khi vừa mở trang Admin
  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // 3. CÁC HÀM XỬ LÝ SỰ KIỆN (TƯƠNG TÁC CỦA ADMIN)
  // ==========================================

  // Xóa tài khoản người dùng
  const handleDeleteUser = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });
      fetchData(); // Bắt buộc gọi lại fetchData để mảng users cập nhật giao diện mới
    }
  };

  // Đổi trạng thái đơn hàng (Chờ duyệt -> Đang giao,...)
  const handleUpdateStatus = async (id, newStatus) => {
    await fetch(`http://localhost:5000/api/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchData();
  };

  // Xóa vĩnh viễn đơn hàng
  const handleDeleteOrder = async (id) => {
    if (window.confirm("Xóa vĩnh viễn đơn hàng này?")) {
      await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "DELETE",
      });
      fetchData();
    }
  };

  // ==========================================
  // 4. HÀM HỖ TRỢ GIAO DIỆN (UI HELPERS)
  // ==========================================
  const getStatusColor = (status) => {
    if (status === "Đã giao") return "bg-green-100 text-green-800";
    if (status === "Đang giao") return "bg-blue-100 text-blue-800";
    if (status === "Đã hủy") return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  // ==========================================
  // 5. HIỂN THỊ GIAO DIỆN (RENDER)
  // ==========================================
  return (
    <div className="bg-white p-6 rounded-lg shadow-md min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-red-600 uppercase border-b pb-4">
        Bảng Điều Khiển Admin
      </h2>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* CỘT 1: QUẢN LÝ NGƯỜI DÙNG */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold text-lg">Tài khoản</h3>
            <span className="bg-red-600 px-3 py-1 rounded-full text-sm">
              {users.length}
            </span>
          </div>
          <div className="border border-t-0 rounded-b-lg p-4 bg-gray-50 h-[600px] overflow-y-auto">
            {users.length === 0 ? (
              <p className="text-gray-500 text-center mt-4">
                Chưa có người dùng nào.
              </p>
            ) : (
              <ul className="space-y-3">
                {users.map((u) => (
                  <li
                    key={u.id}
                    className="bg-white border p-3 rounded shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-gray-800">{u.username}</p>
                      <p className="text-xs text-gray-400">ID: {u.id}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm bg-red-50 px-2 py-1 rounded"
                    >
                      Xóa
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* CỘT 2: QUẢN LÝ ĐƠN HÀNG */}
        <div className="lg:col-span-2">
          <div className="bg-red-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold text-lg">Đơn hàng cần xử lý</h3>
            <span className="bg-white text-red-600 font-bold px-3 py-1 rounded-full text-sm">
              {orders.length}
            </span>
          </div>
          <div className="border border-t-0 rounded-b-lg p-4 bg-gray-50 h-[600px] overflow-y-auto space-y-4">
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center mt-4">
                Chưa có đơn hàng nào.
              </p>
            ) : (
              orders.map((o) => (
                <div
                  key={o.id}
                  className="bg-white border p-4 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-start border-b pb-3 mb-3">
                    <div>
                      <p className="font-bold text-lg text-blue-600">{o.id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(o.date).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(o.status || "Chờ duyệt")}`}
                    >
                      {o.status || "Chờ duyệt"}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 uppercase font-semibold">
                        Khách hàng
                      </p>
                      <p className="font-medium">{o.customerInfo.name}</p>
                      <p>{o.customerInfo.phone}</p>
                      <p className="text-sm">{o.customerInfo.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase font-semibold mb-1">
                        Sản phẩm
                      </p>
                      <ul className="text-sm space-y-1">
                        {o.items.map((item) => (
                          <li key={item.id} className="flex justify-between">
                            <span className="truncate w-32" title={item.name}>
                              {item.qty}x {item.name}
                            </span>
                            <span className="font-medium text-gray-700">
                              {(item.price * item.qty).toLocaleString("vi-VN")}{" "}
                              đ
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-3 rounded border">
                    <p className="font-bold text-red-600 text-lg mb-2 md:mb-0">
                      Tổng: {o.total.toLocaleString("vi-VN")} đ
                    </p>
                    <div className="flex gap-2 text-sm">
                      <select
                        value={o.status || "Chờ duyệt"}
                        onChange={(e) =>
                          handleUpdateStatus(o.id, e.target.value)
                        }
                        className="border rounded px-2 py-1 bg-white focus:outline-blue-500"
                      >
                        <option value="Chờ duyệt">Chờ duyệt</option>
                        <option value="Đang giao">Đang giao</option>
                        <option value="Đã giao">Đã giao</option>
                        <option value="Đã hủy">Đã hủy</option>
                      </select>
                      <button
                        onClick={() => handleDeleteOrder(o.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
