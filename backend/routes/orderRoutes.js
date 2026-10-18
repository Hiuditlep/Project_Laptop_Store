const express = require("express");
const router = express.Router();

// Dữ liệu tạm Orders
let orders = [];

// API: Xem toàn bộ danh sách đơn hàng (Admin)
router.get("/", (req, res) => {
  res.json(orders);
});

// API: Lấy danh sách đơn hàng của một người dùng cụ thể
router.get("/user/:userId", (req, res) => {
  const userOrders = orders.filter(
    (o) => String(o.userId) === String(req.params.userId),
  );
  res.json(userOrders);
});

// API: Khách hàng Đặt hàng (Checkout) - Đầy đủ tương thích và an toàn tuyệt đối
router.post("/", (req, res) => {
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

// API: Admin cập nhật trạng thái đơn hàng
router.put("/:id/status", (req, res) => {
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
router.delete("/:id", (req, res) => {
  orders = orders.filter((o) => o.id !== req.params.id);
  res.json({ success: true, message: "Đã xóa đơn hàng" });
});

module.exports = router;
