const express = require("express");
const router = express.Router();
const pool = require("../db");

// Lấy toàn bộ users (Admin)
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT user_id, user_id AS id, full_name, email, phone, address, role, created_at FROM users ORDER BY user_id ASC",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Đăng ký
router.post("/register", async (req, res) => {
  const { username, email, password, full_name, phone, address } = req.body;
  const rawInput = (email || username || "").trim();

  if (!rawInput || !password) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ email/tên đăng nhập và mật khẩu!",
    });
  }

  const finalEmail = rawInput.includes("@")
    ? rawInput
    : `${rawInput}@gmail.com`;

  try {
    const existCheck = await pool.query(
      "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
      [finalEmail],
    );

    if (existCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản hoặc email đã tồn tại!",
      });
    }

    const role =
      rawInput.toLowerCase() === "admin" ||
      finalEmail.toLowerCase() === "admin@gmail.com"
        ? "admin"
        : "user";

    const insertQuery = `
      INSERT INTO users (full_name, email, password_hash, phone, address, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING user_id, user_id AS id, full_name, email, phone, address, role;
    `;
    const { rows } = await pool.query(insertQuery, [
      full_name || rawInput,
      finalEmail,
      password,
      phone || "",
      address || "",
      role,
    ]);

    res.json({ success: true, user: { ...rows[0], username: rows[0].email } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  const { username, email, password } = req.body;
  const loginInput = (username || email || "").trim();

  try {
    const query = `
      SELECT user_id, user_id AS id, full_name, email, phone, address, role
      FROM users 
      WHERE (LOWER(email) = LOWER($1) OR LOWER(SPLIT_PART(email, '@', 1)) = LOWER($1))
      AND password_hash = $2
    `;
    const { rows } = await pool.query(query, [loginInput, password]);

    if (rows.length > 0) {
      const user = { ...rows[0], username: rows[0].email };
      res.json({ success: true, user });
    } else {
      res.status(401).json({
        success: false,
        message: "Tài khoản chưa đăng ký hoặc sai mật khẩu!",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Cập nhật hồ sơ
router.put("/:id", async (req, res) => {
  const { full_name, fullName, email, phone, address } = req.body;
  try {
    const updateQuery = `
      UPDATE users 
      SET full_name = COALESCE($1, full_name),
          email = COALESCE($2, email),
          phone = COALESCE($3, phone),
          address = COALESCE($4, address),
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $5
      RETURNING user_id, user_id AS id, full_name, email, phone, address, role;
    `;
    const { rows } = await pool.query(updateQuery, [
      full_name || fullName,
      email,
      phone,
      address,
      req.params.id,
    ]);

    if (rows.length > 0) {
      res.json({
        success: true,
        user: { ...rows[0], username: rows[0].email },
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Xóa user
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE user_id = $1", [req.params.id]);
    res.json({ success: true, message: "Đã xóa người dùng" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
