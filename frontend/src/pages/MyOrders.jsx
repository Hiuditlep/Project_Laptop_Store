import { useState, useEffect } from "react";

export default function MyOrders({ user }) {
  // ==========================================
  // 1. KHỞI TẠO STATE
  // ==========================================
  // Chứa danh sách các đơn hàng của riêng người dùng này
  const [orders, setOrders] = useState([]);

  // ==========================================
  // 2. GỌI API LẤY LỊCH SỬ ĐƠN HÀNG
  // ==========================================
  useEffect(() => {
    // Chỉ gọi API khi biến user có dữ liệu (khách đã đăng nhập)
    if (user) {
      fetch(`http://localhost:5000/api/orders/user/${user.id}`)
        .then((res) => res.json())
        .then((data) => setOrders(data));
    }
  }, [user]); // Chạy lại hàm fetch nếu thông tin user thay đổi (ví dụ: đổi tài khoản)

  // ==========================================
  // 3. BẢO VỆ ROUTE (CHƯA ĐĂNG NHẬP)
  // ==========================================
  // Nếu chưa đăng nhập, chặn không cho render phần giao diện phía dưới
  if (!user) {
    return (
      <div className="text-center mt-20 text-xl text-gray-500">
        Vui lòng đăng nhập để xem đơn hàng
      </div>
    );
  }

  // ==========================================
  // 4. HIỂN THỊ GIAO DIỆN (RENDER)
  // ==========================================
  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-gray-800">
        Đơn Mua Của Tôi
      </h2>

      {orders.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-lg shadow-sm text-gray-500 border">
          Bạn chưa có đơn hàng nào.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Vòng lặp 1: Duyệt qua từng đơn hàng */}
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white p-0 rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Tiêu đề đơn hàng (Mã đơn + Trạng thái) */}
              <div className="flex justify-between items-center border-b p-4 bg-gray-50">
                <span className="font-semibold text-gray-800">
                  Mã đơn: <span className="text-blue-600">{o.id}</span>
                </span>
                <span className="text-red-500 font-bold uppercase text-sm tracking-wide">
                  {o.status || "Chờ duyệt"}
                </span>
              </div>

              {/* Vòng lặp 2: Duyệt qua các sản phẩm bên trong 1 đơn hàng */}
              <div className="p-4 space-y-4">
                {o.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex gap-4 items-center w-3/4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-contain border rounded p-1"
                      />
                      <div>
                        <p className="font-medium text-gray-800 line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500 font-semibold mt-1">
                          Số lượng: x{item.qty}
                        </p>
                      </div>
                    </div>
                    <span className="text-red-600 font-medium whitespace-nowrap">
                      {(item.price * item.qty).toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                ))}
              </div>

              {/* Tổng kết thành tiền của đơn hàng */}
              <div className="border-t p-4 flex justify-end items-center gap-4 bg-red-50/50">
                <span className="text-gray-600 font-medium">Thành tiền:</span>
                <span className="text-2xl font-bold text-red-600">
                  {o.total.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
