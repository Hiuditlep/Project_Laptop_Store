const express = require("express");
const cors = require("cors");
let products = require("./data/products.json");

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. MOCK DATABASE (DỮ LIỆU TẠM TRÊN RAM)
// ==========================================
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
  const product = products.find((p) => String(p.id) === String(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  }
});

// ==========================================
// 3. NHÓM API XÁC THỰC (AUTHENTICATION)
// ==========================================
// [AUTH] Đăng ký tài khoản (Hứng đủ các trường theo DB: full_name, phone, address)
app.post("/api/users/register", (req, res) => {
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
app.post("/api/users/login", (req, res) => {
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

// ==========================================
// 4. NHÓM API KHÁCH HÀNG (USER / CUSTOMER)
// ==========================================
// API: Cập nhật thông tin cá nhân (Hồ sơ)
app.put("/api/users/:id", (req, res) => {
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

// API: Khách hàng Đặt hàng (Checkout) - Đầy đủ tương thích và an toàn tuyệt đối
app.post("/api/orders", (req, res) => {
  const {
    userId,
    user_id,
    full_name,
    customerInfo,
    phone,
    shipping_address,
    address,
    note,
    total_amount,
    total,
    items,
  } = req.body;

  // 1. Linh hoạt trích xuất thông tin (hỗ trợ cả form mới lẫn form cũ)
  const finalName =
    full_name || customerInfo?.name || customerInfo?.fullName || "Khách hàng";
  const finalPhone = phone || customerInfo?.phone || "";
  const finalAddress =
    shipping_address || address || customerInfo?.address || "";
  const finalNote = note || customerInfo?.note || "";
  const finalTotal = Number(total_amount || total || 0);
  const finalUserId = userId || user_id || "guest";

  // 2. Kiểm tra dữ liệu bắt buộc
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Giỏ hàng của bạn đang trống!",
    });
  }

  if (!finalPhone || !finalAddress) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ số điện thoại và địa chỉ nhận hàng!",
    });
  }

  const newOrderId = `ORD-${Date.now()}`;

  // 3. Chuẩn hóa đơn hàng: Chứa đồng thời cả field cũ lẫn field mới
  const newOrder = {
    id: newOrderId,
    order_id: newOrderId,
    userId: finalUserId,
    user_id: finalUserId,
    customerInfo: {
      name: finalName,
      phone: finalPhone,
      address: finalAddress,
      note: finalNote,
    },
    shipping_address: finalAddress,
    phone: finalPhone,
    total: finalTotal,
    total_amount: finalTotal,
    status: "Chờ duyệt",
    created_at: new Date().toISOString(),
    items: items.map((it) => ({
      product_id: it.product_id || it.id,
      name: it.name || "Sản phẩm",
      image_url: it.image_url || it.image || "",
      quantity: Number(it.quantity || it.qty || 1),
      unit_price: Number(it.unit_price || it.price_vnd || it.price || 0),
      subtotal:
        Number(it.quantity || it.qty || 1) *
        Number(it.unit_price || it.price_vnd || it.price || 0),
    })),
  };

  orders.unshift(newOrder); // Đưa đơn mới lên đầu danh sách

  return res.json({
    success: true,
    message: "Tạo đơn hàng thành công!",
    orderId: newOrderId,
    order: newOrder,
  });
});

// API: Lấy danh sách đơn hàng của một người dùng cụ thể
app.get("/api/orders/user/:userId", (req, res) => {
  const userOrders = orders.filter(
    (o) => String(o.userId) === String(req.params.userId),
  );
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
  users = users.filter((u) => String(u.id) !== String(req.params.id));
  res.json({ success: true, message: "Đã xóa người dùng" });
});

// [ADMIN] Thêm sản phẩm mới
app.post("/api/products", (req, res) => {
  const newProduct = {
    id: Date.now().toString(),
    ...req.body,
  };
  products.push(newProduct);
  res.json({ success: true, product: newProduct });
});

// [ADMIN] Xóa sản phẩm
app.delete("/api/products/:id", (req, res) => {
  products = products.filter((p) => String(p.id) !== String(req.params.id));
  res.json({ success: true, message: "Đã xóa sản phẩm" });
});

// API: Xem toàn bộ danh sách đơn hàng
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// API: Admin cập nhật trạng thái đơn hàng
app.put("/api/orders/:id/status", (req, res) => {
  const { status } = req.body;
  const order = orders.find((o) => o.id === req.params.id);

  if (order) {
    order.status = status;
    res.json({ success: true, order });
  } else {
    res
      .status(404)
      .json({ success: false, message: "Không tìm thấy đơn hàng" });
  }
});

// [ADMIN] Xóa đơn hàng vĩnh viễn
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
