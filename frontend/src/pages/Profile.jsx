
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Profile({ user, setUser }) {
  const [fullName, setFullName] = useState(
    user?.full_name || user?.fullName || "",
  );
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || user.fullName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-5xl mb-4">👤</div>
          <h2 className="text-xl font-bold text-gray-800">
            Bạn chưa đăng nhập
          </h2>
          <p className="text-gray-500 mt-2">
            Vui lòng đăng nhập để quản lý hồ sơ.
          </p>
          <Link
            to="/auth"
            className="inline-block mt-5 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (saving) return;

    const updatedData = {
      full_name: fullName,
      email,
      phone,
      address,
    };

    setSaving(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${user.id || user.user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        },
      );

      const data = await res.json();

      if (data.success) {
        const newUserObj = { ...user, ...data.user };
        setUser(newUserObj);
        localStorage.setItem("user", JSON.stringify(newUserObj));
        alert("Cập nhật hồ sơ thành công!");
      } else {
        alert(data.message || "Không thể cập nhật hồ sơ.");
      }
    } catch (error) {
      console.error("Lỗi cập nhật hồ sơ:", error);
      alert("Không thể kết nối đến máy chủ. Vui lòng thử lại!");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 " +
    "text-sm text-gray-800 bg-white outline-none transition " +
    "placeholder:text-gray-400 " +
    "focus:border-red-400 focus:ring-4 focus:ring-red-50";

  const labelClass =
    "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">

        {/* SIDEBAR */}
        <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit">
          <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
            <div className="w-12 h-12 shrink-0 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-xl">
              👤
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-gray-800 truncate">
                {user.username || user.email}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Tài khoản của tôi
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">
              Tài khoản
            </p>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-semibold">
              <span>👤</span>
              <span>Hồ sơ</span>
            </div>

            <Link
              to="/my-orders"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-red-600 transition"
            >
              <span>📦</span>
              <span>Đơn hàng của tôi</span>
            </Link>
          </div>
        </aside>

        {/* PROFILE */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* HEADER */}
          <div className="px-6 sm:px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-red-500 rounded-full"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Hồ sơ của tôi
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Quản lý thông tin cá nhân và tài khoản
                </p>
              </div>
            </div>
          </div>

          {/* AVATAR */}
          <div className="flex flex-col sm:flex-row items-center gap-5 px-6 sm:px-8 py-7 bg-gray-50/70 border-b border-gray-100">
            <div className="w-24 h-24 shrink-0 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-4xl">
              👤
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-bold text-gray-800">
                {fullName || user.username || "Người dùng"}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {email}
              </p>

              <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Tài khoản đang hoạt động
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="p-6 sm:p-8">
            <div className="max-w-2xl">

              <div className="mb-7">
                <h2 className="text-base font-bold text-gray-800">
                  Thông tin cá nhân
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Cập nhật thông tin để thuận tiện khi đặt hàng
                </p>
              </div>

              <div className="space-y-5">

                {/* USERNAME */}
                <div>
                  <label className={labelClass}>
                    Tên đăng nhập
                  </label>

                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-500 text-sm">
                    <span>🔒</span>
                    <span>{user.username || user.email}</span>
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    Tên đăng nhập không thể thay đổi.
                  </p>
                </div>

                {/* FULL NAME */}
                <div>
                  <label className={labelClass}>
                    Họ và tên
                  </label>

                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập họ và tên"
                    className={inputClass}
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className={labelClass}>
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                    className={inputClass}
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className={labelClass}>
                    Số điện thoại
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại"
                    className={inputClass}
                  />
                </div>

                {/* ADDRESS */}
                <div>
                  <label className={labelClass}>
                    Địa chỉ
                  </label>

                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ nhận hàng"
                    className={inputClass}
                  />
                </div>

                {/* SAVE */}
                <div className="pt-5 border-t border-gray-100 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-red-500 hover:bg-red-600 active:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white px-7 py-3 rounded-xl font-semibold text-sm transition shadow-sm"
                  >
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
