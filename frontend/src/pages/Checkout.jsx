import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout({ cart, user, clearCart }) {
  // ==========================================
  // 1. KHỞI TẠO HOOKS & STATE
  // ==========================================
  const navigate = useNavigate(); // Hook dùng để chuyển hướng trang

  // State lưu trữ thông tin giao hàng của khách
  const [info, setInfo] = useState({ name: "", phone: "", address: "" });

  // ==========================================
  // 2. TÍNH TOÁN DỮ LIỆU (LOGIC)
  // ==========================================
  // Nếu giỏ hàng trống thì dừng lại, không render form thanh toán
  if (cart.length === 0) {
    return <div className="text-center mt-10 text-xl">Giỏ hàng trống!</div>;
  }

  // Tính tổng tiền đơn hàng
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // ==========================================
  // 3. HÀM XỬ LÝ ĐẶT HÀNG (SUBMIT FORM)
  // ==========================================
  const handleOrder = async (e) => {
    e.preventDefault(); // Chặn hành vi load lại trang khi bấm submit form

    // Kiểm tra bảo mật: Khách vãng lai chưa đăng nhập thì đuổi sang trang Auth
    if (!user) {
      alert("Vui lòng đăng nhập để đặt hàng!");
      navigate("/auth");
      return; // Kết thúc hàm sớm, không chạy phần fetch bên dưới
    }

    // Đóng gói dữ liệu gửi xuống Backend
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        customerInfo: info,
        items: cart,
        total,
      }),
    });

    const data = await res.json();

    // Nếu Backend báo lưu thành công
    if (data.success) {
      alert(`Đặt hàng thành công! Mã đơn: ${data.orderId}`);
      clearCart(); // Gọi hàm xóa sạch giỏ hàng
      navigate("/"); // Đẩy khách về lại trang chủ
    }
  };

  // ==========================================
  // 4. HIỂN THỊ GIAO DIỆN (RENDER)
  // ==========================================
  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 mt-6">
      {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN GIAO HÀNG */}
      <form
        onSubmit={handleOrder}
        className="flex-1 bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">
          Thông tin giao hàng
        </h2>

        <input
          type="text"
          placeholder="Họ tên"
          required
          className="w-full border p-2 mb-4 rounded focus:outline-green-500"
          onChange={(e) => setInfo({ ...info, name: e.target.value })}
        />

        <input
          type="text"
          placeholder="Số điện thoại"
          required
          className="w-full border p-2 mb-4 rounded focus:outline-green-500"
          onChange={(e) => setInfo({ ...info, phone: e.target.value })}
        />

        <textarea
          placeholder="Địa chỉ chi tiết"
          required
          className="w-full border p-2 mb-4 rounded focus:outline-green-500"
          onChange={(e) => setInfo({ ...info, address: e.target.value })}
        ></textarea>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
        >
          XÁC NHẬN ĐẶT HÀNG
        </button>
      </form>

      {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
      <div className="md:w-1/3 bg-gray-50 p-6 rounded-lg border h-fit">
        <h3 className="font-bold text-lg mb-4">Tóm tắt đơn hàng</h3>

        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between text-sm mb-2 pb-2 border-b"
          >
            <span className="truncate pr-2">
              {item.qty}x {item.name}
            </span>
            <span className="font-bold whitespace-nowrap">
              {(item.price * item.qty).toLocaleString("vi-VN")} đ
            </span>
          </div>
        ))}

        <div className="flex justify-between font-bold text-xl mt-4 text-red-600">
          <span>Tổng:</span>
          <span>{total.toLocaleString("vi-VN")} đ</span>
        </div>
      </div>
    </div>
  );
}
