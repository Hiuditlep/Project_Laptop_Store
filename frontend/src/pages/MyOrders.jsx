import { useState, useEffect } from "react";

export default function MyOrders({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/orders/user/${user.id}`)
        .then((res) => res.json())
        .then((data) => setOrders(data));
    }
  }, [user]);

  if (!user) return <div className="text-center mt-10">Vui lòng đăng nhập</div>;

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6">Đơn Mua Của Tôi</h2>

      {orders.length === 0 ? (
        <div className="bg-white p-10 text-center rounded shadow-sm text-gray-500">
          Chưa có đơn hàng.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white p-5 rounded shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <span className="font-medium text-gray-800">
                  Mã đơn: {o.id}
                </span>
                <span className="text-red-500 font-medium uppercase text-sm tracking-wide">
                  {o.status || "Chờ duyệt"}
                </span>
              </div>

              <div className="space-y-3">
                {o.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-contain border"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">x{item.qty}</p>
                      </div>
                    </div>
                    <span className="text-red-500 font-medium">
                      {(item.price * item.qty).toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-4 flex justify-end items-center gap-4">
                <span className="text-gray-600">Thành tiền:</span>
                <span className="text-2xl font-bold text-red-500">
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
