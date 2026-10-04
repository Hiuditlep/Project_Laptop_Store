const express = require("express");
const cors = require("cors");
let products = require("./data/products.json");

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. MOCK DATABASE (DỮ LIỆU TẠM TRÊN RAM)
// ==========================================
let users = [{ id: 1, username: "admin", password: "123456", role: "admin" }];
let orders = [];

// ==========================================
// 2. NHÓM API SẢN PHẨM (PUBLIC)
// ==========================================
// API: Lấy danh sách sản phẩm (có hỗ trợ tìm kiếm)
app.get("/api/products", (req, res) => {
  const searchQuery = req.query.search;
  if (searchQuery) {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    return res.json(filtered);
  }
  res.json(products);
});

// API: Lấy chi tiết 1 sản phẩm theo ID
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  }
});

// ==========================================
// 3. NHÓM API XÁC THỰC (AUTHENTICATION)
// ==========================================
// API: Đăng ký tài khoản mới (Mặc định role 'user')
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  const exists = users.find((u) => u.username === username);

  if (exists) {
    return res
      .status(400)
      .json({ success: false, message: "Tài khoản đã tồn tại!" });
  }

  const newUser = { id: Date.now(), username, password, role: "user" };
  users.push(newUser);
  res.json({
    success: true,
    user: { id: newUser.id, username: newUser.username, role: newUser.role },
  });
});

// API: Đăng nhập
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
    res.json({
      success: true,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" });
  }
});

// ==========================================
// 4. NHÓM API KHÁCH HÀNG (USER / CUSTOMER)
// ==========================================
// API: Cập nhật thông tin cá nhân (Hồ sơ)
app.put("/api/users/:id", (req, res) => {
  const { fullName, email, phone } = req.body;
  const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));

  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], fullName, email, phone };
    res.json({ success: true, user: users[userIndex] });
  } else {
    res
      .status(404)
      .json({ success: false, message: "Không tìm thấy người dùng" });
  }
});

// API: Khách hàng Đặt hàng (Checkout)
app.post("/api/orders", (req, res) => {
  const { userId, customerInfo, items, total } = req.body;
  const newOrder = {
    id: `ORD-${Date.now()}`,
    userId,
    customerInfo,
    items,
    total,
    date: new Date(),
    status: "Chờ duyệt",
  };
  orders.push(newOrder);
  res.json({ success: true, orderId: newOrder.id });
});

// API: Lấy danh sách đơn hàng của một người dùng cụ thể
app.get("/api/orders/user/:userId", (req, res) => {
  const userOrders = orders.filter((o) => o.userId == req.params.userId);
  res.json(userOrders);
});

// ==========================================
// 5. NHÓM API QUẢN TRỊ VIÊN (ADMIN)
// ==========================================
// API: Xem toàn bộ danh sách người dùng
app.get("/api/users", (req, res) => {
  res.json(users);
});

// API: Admin xóa người dùng
app.delete("/api/users/:id", (req, res) => {
  users = users.filter((u) => u.id !== parseInt(req.params.id));
  res.json({ success: true, message: "Đã xóa người dùng" });
});

// [ADMIN] Thêm sản phẩm mới
app.post("/api/products", (req, res) => {
  const newProduct = {
    id: Date.now().toString(), // Tạo ID tự động
    ...req.body,
  };
  products.push(newProduct);
  res.json({ success: true, product: newProduct });
});

// [ADMIN] Xóa sản phẩm
app.delete("/api/products/:id", (req, res) => {
  products = products.filter((p) => p.id !== req.params.id);
  res.json({ success: true, message: "Đã xóa sản phẩm" });
});

// API: Xem toàn bộ danh sách đơn hàng
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// API: Admin cập nhật trạng thái đơn hàng
app.put("/api/orders/:id/status", (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (order) {
    order.status = req.body.status;
    res.json({ success: true });
  } else {
    res
      .status(404)
      .json({ success: false, message: "Không tìm thấy đơn hàng" });
  }
});

// API: Admin xóa đơn hàng
app.delete("/api/orders/:id", (req, res) => {
  orders = orders.filter((o) => o.id !== req.params.id);
  res.json({ success: true, message: "Đã xóa đơn hàng" });
});

// ==========================================
// 6. KHỞI ĐỘNG SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend đang chạy tại: http://localhost:${PORT}`);
});
