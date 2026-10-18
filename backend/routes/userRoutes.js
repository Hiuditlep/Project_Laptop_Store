const express = require("express");
const router = express.Router();

// Dữ liệu tạm User
let users = [
  {
    id: "1",
    username: "admin",
    email: "admin@gmail.com",
    password: "123456",
    full_name: "Quản trị viên",
    phone: "0900000000",
    address: "Hồ Chí Minh",
    role: "admin",
  },
];

// API: Xem toàn bộ danh sách người dùng (Admin)
router.get("/", (req, res) => {
  res.json(users);
});

// [AUTH] Đăng ký tài khoản (Hứng đủ các trường theo DB: full_name, phone, address)
router.post("/register", (req, res) => {
  const { username, password, full_name, phone, address } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!",
    });
  }

  // 1. Kiểm tra tài khoản đã tồn tại chưa
  const userExists = users.find(
    (u) =>
      u.username?.toLowerCase() === username.toLowerCase() ||
      u.email?.toLowerCase() === username.toLowerCase(),
  );

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "Tài khoản hoặc email đã tồn tại! Vui lòng đăng nhập.",
    });
  }

  // 2. Lưu đầy đủ thông tin vào mảng users
  const isUserAdmin = username.toLowerCase() === "admin";
  const newUser = {
    id: Date.now().toString(),
    username: username,
    email: username.includes("@") ? username : `${username}@gmail.com`,
    password: password,
    full_name: full_name || username,
    phone: phone || "",
    address: address || "",
    role: isUserAdmin ? "admin" : "user",
  };

  users.push(newUser);
  res.json({ success: true, user: newUser });
});

// [AUTH] Đăng nhập
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra tên đăng nhập hoặc email và mật khẩu
  const user = users.find(
    (u) =>
      (u.username?.toLowerCase() === username?.toLowerCase() ||
        u.email?.toLowerCase() === username?.toLowerCase()) &&
      u.password === password,
  );

  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({
      success: false,
      message: "Tài khoản chưa đăng ký hoặc sai mật khẩu!",
    });
  }
});

// API: Cập nhật thông tin cá nhân (Hồ sơ)
router.put("/:id", (req, res) => {
  const { full_name, fullName, email, phone, address } = req.body;
  const userIndex = users.findIndex(
    (u) => String(u.id) === String(req.params.id),
  );

  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      full_name: full_name || fullName || users[userIndex].full_name,
      email: email || users[userIndex].email,
      phone: phone !== undefined ? phone : users[userIndex].phone,
      address: address !== undefined ? address : users[userIndex].address,
    };
    res.json({ success: true, user: users[userIndex] });
  } else {
    res
      .status(404)
      .json({ success: false, message: "Không tìm thấy người dùng" });
  }
});

// API: Admin xóa người dùng
router.delete("/:id", (req, res) => {
  users = users.filter((u) => String(u.id) !== String(req.params.id));
  res.json({ success: true, message: "Đã xóa người dùng" });
});

module.exports = router;
