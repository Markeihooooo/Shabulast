const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const LoginRouter = require('./routes/Login');
const orderRoutes = require('./routes/Order');  // นำเข้า orderRoutes จากไฟล์ Order.js

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// ตัวอย่าง Route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.use('/login', LoginRouter);

// ใช้ route ที่เชื่อมโยงกับ /order-details
app.use('/order-details', orderRoutes);  // เชื่อมโยงเส้นทาง /order-details กับ orderRoutes

// เริ่มเซิร์ฟเวอร์
app.listen(3001, () => {
  console.log(`Server running on port 3001`);
});
