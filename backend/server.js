const express = require("express");
const cors = require("cors");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
// Import các modules Router
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ==========================================
// ĐỊNH TUYẾN (ROUTES)
// ==========================================
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// ==========================================
// KHỞI ĐỘNG SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend đang chạy tại: http://localhost:${PORT}`);
});

// Cấu hình Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Laptop Store API",
      version: "1.0.0",
      description: "Tài liệu API cho đồ án Cửa hàng bán Laptop",
    },
    servers: [
      { url: "http://localhost:5000" }, // Đổi thành link web sau khi deploy
    ],
  },
  // NẾU CODE BẠN ĐỂ TRONG THƯ MỤC routes, HÃY GIỮ NGUYÊN DÒNG DƯỚI ĐÂY
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
