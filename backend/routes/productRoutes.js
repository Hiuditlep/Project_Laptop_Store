const express = require("express");
const router = express.Router();
let products = require("../data/products.json");

// API: Lấy danh sách sản phẩm (có hỗ trợ tìm kiếm)
router.get("/", (req, res) => {
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
router.get("/:id", (req, res) => {
  const product = products.find((p) => String(p.id) === String(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  }
});

// [ADMIN] Thêm sản phẩm mới
router.post("/", (req, res) => {
  const newProduct = {
    id: Date.now().toString(),
    ...req.body,
  };
  products.push(newProduct);
  res.json({ success: true, product: newProduct });
});

// [ADMIN] Xóa sản phẩm
router.delete("/:id", (req, res) => {
  products = products.filter((p) => String(p.id) !== String(req.params.id));
  res.json({ success: true, message: "Đã xóa sản phẩm" });
});

module.exports = router;
