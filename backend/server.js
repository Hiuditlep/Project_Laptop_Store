const express = require("express");
const cors = require("cors");
const products = require("./data/products.json");

const app = express();
app.use(cors());
app.use(express.json());

// API Lấy danh sách sản phẩm (có hỗ trợ tìm kiếm)
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

// API Lấy chi tiết 1 sản phẩm theo ID
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  }
});

// ==========================================
// MOCK DATA CÓ SẴN TÀI KHOẢN ADMIN
// ==========================================
let users = [{ id: 1, username: "admin", password: "123456", role: "admin" }];
let orders = [];

// API Đăng ký
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  const exists = users.find((u) => u.username === username);
  if (exists)
    return res
      .status(400)
      .json({ success: false, message: "Tài khoản đã tồn tại!" });

  // Gắn mặc định role là 'user' cho khách hàng mới đăng ký
  const newUser = { id: Date.now(), username, password, role: "user" };
  users.push(newUser);
  res.json({
    success: true,
    user: { id: newUser.id, username: newUser.username, role: newUser.role },
  });
});

// API Đăng nhập
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (user) {
    // Trả về thêm thông tin role để Frontend biết ai là admin
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

// API Cập nhật thông tin cá nhân
app.put("/api/users/:id", (req, res) => {
  const { fullName, email, phone } = req.body;
  // Tìm user đang cần sửa
  const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));

  if (userIndex !== -1) {
    // Cập nhật thông tin mới vào mảng
    users[userIndex] = { ...users[userIndex], fullName, email, phone };
    res.json({ success: true, user: users[userIndex] });
  } else {
    res
      .status(404)
      .json({ success: false, message: "Không tìm thấy người dùng" });
  }
});

// API Đặt hàng (Checkout)
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

// API Lấy danh sách đơn hàng của 1 Khách hàng cụ thể
app.get("/api/orders/user/:userId", (req, res) => {
  // Lọc trong mảng orders những đơn có userId khớp với người đang request
  const userOrders = orders.filter((o) => o.userId == req.params.userId);
  res.json(userOrders);
});
const PORT = process.env.PORT || 5000;

// ==========================================
// CÁC API DÀNH CHO ADMIN
// ==========================================

// [ADMIN] Lấy danh sách Users
app.get("/api/users", (req, res) => {
  res.json(users);
});

// [ADMIN] Lấy danh sách Đơn hàng
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// [ADMIN] Xóa người dùng
app.delete("/api/users/:id", (req, res) => {
  users = users.filter((u) => u.id !== parseInt(req.params.id));
  res.json({ success: true, message: "Đã xóa người dùng" });
});

// [ADMIN] Cập nhật trạng thái đơn hàng
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

// [ADMIN] Xóa đơn hàng
app.delete("/api/orders/:id", (req, res) => {
  orders = orders.filter((o) => o.id !== req.params.id);
  res.json({ success: true, message: "Đã xóa đơn hàng" });
});

app.listen(PORT, () => {
  console.log(`Backend đang chạy tại: http://localhost:${PORT}`);
});
