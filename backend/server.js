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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend đang chạy tại: http://localhost:${PORT}`);
});
