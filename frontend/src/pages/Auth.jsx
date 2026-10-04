import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true); // Trạng thái chuyển đổi Đăng nhập / Đăng ký
  const [showPassword, setShowPassword] = useState(false); // Trạng thái ẩn/hiện mật khẩu
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tùy chỉnh API ở đây khi bạn nối với Backend
    const url = isLogin
      ? "http://localhost:5000/api/users/login"
      : "http://localhost:5000/api/users/register";

    try {
      // Giả lập luồng đăng nhập thành công để test giao diện
      alert(isLogin ? "Đăng nhập thành công!" : "Đăng ký thành công!");
      const mockUser = { id: Date.now(), username: username, role: "user" };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));

      // navigate(-1) giúp quay lại đúng trang trước đó (vd: đang xem laptop thì quay lại laptop)
      navigate(-1);
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center px-4 py-8">
      <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg w-full max-w-[450px] border border-gray-100">
        {/* Tiêu đề theo chuẩn thiết kế mới */}
        <div className="mb-8">
          <p className="text-red-600 font-bold text-xs tracking-[0.15em] uppercase mb-2">
            Mừng bạn trở lại
          </p>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </h2>
          <p className="text-gray-500 text-sm">
            {isLogin
              ? "Đăng nhập để tiếp tục với tài khoản của bạn."
              : "Tạo tài khoản mới để mua sắm dễ dàng hơn."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Tên đăng nhập */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">
              Tên đăng nhập
            </label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập của bạn"
              required
              className="w-full px-4 py-3 rounded border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Input Mật khẩu */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">
              Mật khẩu
            </label>
            <input
              // Toggle type dựa vào state showPassword
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              required
              className="w-full px-4 py-3 rounded border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Checkbox Hiện mật khẩu */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-password"
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 cursor-pointer accent-red-600"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <label
              htmlFor="show-password"
              className="ml-2 text-sm text-gray-600 cursor-pointer select-none hover:text-gray-900 transition-colors"
            >
              Hiện mật khẩu
            </label>
          </div>

          {/* Nút Submit đỏ */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700 transition duration-200 mt-2 text-sm uppercase tracking-wide"
          >
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        {/* Chuyển đổi form Đăng nhập / Đăng ký */}
        <div className="mt-8 text-center text-sm text-gray-600">
          {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-red-600 hover:text-red-800 underline transition-colors"
          >
            {isLogin ? "Đăng ký" : "Đăng nhập"}
          </button>
        </div>
      </div>
    </div>
  );
}
