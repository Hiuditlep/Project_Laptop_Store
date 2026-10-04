import { useState, useEffect } from "react";

export default function Profile({ user, setUser }) {
  // Khởi tạo state cho các ô nhập liệu, lấy dữ liệu cũ nếu có
  const [fullName, setFullName] = useState(
    user?.fullName || "Nguyễn Minh Hiếu",
  );
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  if (!user) return <div className="text-center mt-10">Vui lòng đăng nhập</div>;

  // Hàm xử lý khi bấm nút Lưu
  const handleSave = async () => {
    const res = await fetch(`http://localhost:5000/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, phone }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Cập nhật hồ sơ thành công!");
      // Cập nhật lại state toàn cục và Local Storage để web nhớ thông tin mới
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } else {
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm max-w-4xl mx-auto mt-6">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Hồ Sơ Của Tôi</h2>
        <p className="text-sm text-gray-500">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="flex items-center">
            <label className="w-32 text-gray-500 text-sm text-right pr-4">
              Tên đăng nhập
            </label>
            <span className="font-medium text-gray-800">{user.username}</span>
          </div>

          <div className="flex items-center">
            <label className="w-32 text-gray-500 text-sm text-right pr-4">
              Tên
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border px-3 py-2 rounded flex-1 focus:outline-none focus:border-red-400"
            />
          </div>

          <div className="flex items-center">
            <label className="w-32 text-gray-500 text-sm text-right pr-4">
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border px-3 py-2 rounded flex-1 focus:outline-none focus:border-red-400"
            />
          </div>

          <div className="flex items-center">
            <label className="w-32 text-gray-500 text-sm text-right pr-4">
              Số điện thoại
            </label>
            <input
              type="tel"
              placeholder="Nhập số điện thoại..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border px-3 py-2 rounded flex-1 focus:outline-none focus:border-red-400"
            />
          </div>

          <div className="pl-32 pt-4">
            <button
              onClick={handleSave}
              className="bg-red-500 text-white px-8 py-2 rounded hover:bg-red-600 transition"
            >
              Lưu
            </button>
          </div>
        </div>

        <div className="w-full md:w-64 md:border-l flex flex-col items-center justify-start pt-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full mb-4 flex items-center justify-center border text-gray-400 text-3xl">
            👤
          </div>
          <button className="border border-gray-300 px-4 py-1.5 bg-white shadow-sm rounded text-sm hover:bg-gray-50">
            Chọn Ảnh
          </button>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Dụng lượng file tối đa 1 MB
            <br />
            Định dạng: .JPEG, .PNG
          </p>
        </div>
      </div>
    </div>
  );
}
