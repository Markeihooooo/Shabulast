const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const LoginRouter = require('./routes/Login');

dotenv.config();

const app = express();

// ตั้งค่า CORS ที่นี่
app.use(cors({ origin: 'http://localhost:5173' }));

// Middleware
app.use(express.json());

// PostgreSQL Database Connection
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'localhost',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// ตัวอย่าง Route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.use('/login', LoginRouter);

// เริ่มเซิร์ฟเวอร์
app.listen(3001, () => {
  console.log(`Server running on port 3001`);
});

// ส่วนที่เหลือของโค้ด...
