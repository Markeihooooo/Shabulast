const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db'); // นำเข้า Pool จาก db.js
const LoginRouter = require('./routes/Login');
const orderRoutes = require('./routes/Order');  // นำเข้า orderRoutes จากไฟล์ Order.js
const CategoryRouter = require('./routes/Category');
const ItemCategoryRouter = require('./routes/ItemCategory');


const path = require('path'); // เพิ่มการ import โมดูล path
const bodyParser = require('body-parser');



dotenv.config();

const app = express();

// กำหนดให้ Express สามารถเข้าถึงไฟล์ในโฟลเดอร์ public ได้
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.json({ limit: '10mb' })); // เพิ่มขีดจำกัดการรับ JSON ที่ 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true })); // เพิ่มขีดจำกัดการรับ URL-encoded form data ที่ 10MB


// app.use(express.static(path.join(__dirname, 'public')));


// // ใช้ cors ในทุกคำขอ
// app.use(cors());

// หรือถ้าคุณต้องการกำหนด CORS เฉพาะ เช่น ให้อนุญาตแค่บางโดเมน
app.use(cors({
  origin: 'http://localhost:5173',  // กำหนดให้อนุญาตเฉพาะจาก frontend ที่รันที่ 5173
}));


// Middleware
app.use(express.json());
// ใช้ CORS middleware
app.use(cors());

// ตัวอย่าง Route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.use('/login', LoginRouter);

// ใช้ route ที่เชื่อมโยงกับ /order-details
app.use('/order-details', orderRoutes);  // เชื่อมโยงเส้นทาง /order-details กับ orderRoutes
app.use('/category', CategoryRouter);
app.use('/itemCategory', ItemCategoryRouter);


// เริ่มเซิร์ฟเวอร์
app.listen(3001, () => {
  console.log(`Server running on port 3001`);
});
