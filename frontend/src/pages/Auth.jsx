import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth({ setUser }) {
  // ==========================================
  // 1. KHỞI TẠO STATE & HOOKS
  // ==========================================
  // isLogin: Biến xác định đang ở chế độ Đăng nhập (true) hay Đăng ký (false)
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Hook dùng để chuyển hướng trang web sau khi đăng nhập thành công
  const navigate = useNavigate();

  // ==========================================
  // 2. HÀM XỬ LÝ GỬI FORM (SUBMIT)
  // ==========================================
  const handleSubmit = async (e) => {
    // Ngăn chặn hành vi load lại trang mặc định của form HTML
    e.preventDefault();

    // Xác định gọi API nào dựa vào trạng thái isLogin
    const endpoint = isLogin ? "/api/login" : "/api/register";

    // Gửi dữ liệu (username, password) xuống Backend
    const res = await fetch(`http://localhost:5000${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.success) {
      // Thông báo thành công
      alert(isLogin ? "Đăng nhập thành công!" : "Đăng ký thành công!");

      // Cập nhật state toàn cục để Header hiện tên user
      setUser(data.user);

      // Lưu thông tin vào bộ nhớ trình duyệt để F5 không bị mất đăng nhập
      localStorage.setItem("user", JSON.stringify(data.user));

      // Đẩy người dùng về trang chủ
      navigate("/");
    } else {
      // Thông báo lỗi (sai pass, trùng tên...)
      alert(data.message);
    }
  };

  // ==========================================
  // 3. HIỂN THỊ GIAO DIỆN (RENDER)
  // ==========================================
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {/* Toán tử 3 ngôi: Nếu isLogin là true thì hiện "Đăng Nhập", ngược lại hiện "Đăng Ký" */}
        {isLogin ? "Đăng Nhập" : "Đăng Ký"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Tên đăng nhập
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-2 rounded focus:outline-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mật khẩu</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded focus:outline-red-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 font-bold"
        >
          {isLogin ? "Đăng Nhập" : "Đăng Ký"}
        </button>
      </form>

      {/* Nút chuyển đổi qua lại giữa chế độ Đăng nhập và Đăng ký */}
      <p
        className="mt-4 text-center text-sm cursor-pointer text-blue-600 hover:underline"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Chưa có tài khoản? Đăng ký ngay"
          : "Đã có tài khoản? Đăng nhập"}
      </p>
    </div>
  );
}
