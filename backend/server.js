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
// Mock Data lưu tạm trong RAM (sẽ reset khi tắt server)
let users = [];
let orders = [];

// API Đăng ký
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  const exists = users.find((u) => u.username === username);
  if (exists)
    return res
      .status(400)
      .json({ success: false, message: "Tài khoản đã tồn tại!" });

  const newUser = { id: Date.now(), username, password };
  users.push(newUser);
  res.json({
    success: true,
    user: { id: newUser.id, username: newUser.username },
  });
});

// API Đăng nhập
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (user) {
    res.json({ success: true, user: { id: user.id, username: user.username } });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" });
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
  };
  orders.push(newOrder);
  res.json({ success: true, orderId: newOrder.id });
});
const PORT = process.env.PORT || 5000;

// API Lấy danh sách Users (Dành cho Admin)
app.get("/api/users", (req, res) => {
  res.json(users);
});

// API Lấy danh sách Đơn hàng (Dành cho Admin)
app.get("/api/orders", (req, res) => {
  res.json(orders);
});
app.listen(PORT, () => {
  console.log(`Backend đang chạy tại: http://localhost:${PORT}`);
});
