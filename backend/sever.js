const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const LoginRouter = require('./routes/Login');
const orderRoutes = require('./routes/Order');  // นำเข้า orderRoutes จากไฟล์ Order.js
const CategoryRouter = require('./routes/Category');

dotenv.config();

const app = express();

// ใช้ cors ในทุกคำขอ
app.use(cors());

// หรือถ้าคุณต้องการกำหนด CORS เฉพาะ เช่น ให้อนุญาตแค่บางโดเมน
app.use(cors({
  origin: 'http://localhost:5173',  // กำหนดให้อนุญาตเฉพาะจาก frontend ที่รันที่ 5173
}));


// Middleware
app.use(express.json());

// ตัวอย่าง Route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.use('/login', LoginRouter);

// ใช้ route ที่เชื่อมโยงกับ /order-details
app.use('/order-details', orderRoutes);  // เชื่อมโยงเส้นทาง /order-details กับ orderRoutes
app.use('/category',CategoryRouter);


// เริ่มเซิร์ฟเวอร์
app.listen(3001, () => {
  console.log(`Server running on port 3001`);
});
