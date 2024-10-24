// db.js
const { Pool } = require('pg');

// สร้าง Pool สำหรับเชื่อมต่อฐานข้อมูล
const pool = new Pool({
  user: 'your_db_user', // ใช้ค่าที่ตั้งใน Docker Compose
  host: 'localhost', // ถ้าใช้ Docker Desktop บน macOS หรือ Windows ใช้ localhost
  database: 'postgres', // ใช้ค่าที่ตั้งใน Docker Compose
  password: 'your_password', // ใช้ค่าที่ตั้งใน Docker Compose
  port: 5432, // พอร์ตที่ใช้เชื่อมต่อ
});

module.exports = pool; // ส่งออก pool