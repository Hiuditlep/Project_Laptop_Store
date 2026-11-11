
const { Pool } = require("pg");
const path = require("path");
const dotenv = require("dotenv");

// Đọc file môi trường trong backend trước
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

// Đọc thêm file môi trường ở thư mục gốc nếu có
dotenv.config({
  path: path.resolve(__dirname, "../.env.local"),
});

dotenv.config({
  path: path.resolve(__dirname, ".env.local"),
});

// Lấy chuỗi kết nối Neon PostgreSQL
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "Lỗi: Không tìm thấy DATABASE_URL. Hãy kiểm tra file backend/.env"
  );
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Kiểm tra kết nối database
pool.connect((err, client, release) => {
  if (err) {
    console.error("Lỗi kết nối Neon Database:", err.message);
    return;
  }

  console.log("Đã kết nối thành công tới Neon PostgreSQL!");
  release();
});

module.exports = pool;
  