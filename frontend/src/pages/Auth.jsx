import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/login" : "/api/register";

    const res = await fetch(`http://localhost:5000${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.success) {
      alert(isLogin ? "Đăng nhập thành công!" : "Đăng ký thành công!");
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user)); // Lưu vào trình duyệt
      navigate("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
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
