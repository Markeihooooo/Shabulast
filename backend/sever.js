// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const pool = require('./db'); // นำเข้า Pool จาก db.js
// const LoginRouter = require('./routes/Login');
// const orderRoutes = require('./routes/Order');  // นำเข้า orderRoutes จากไฟล์ Order.js
// const CategoryRouter = require('./routes/Category');
// const ItemCategoryRouter = require('./routes/ItemCategory');
// const CustomerRouter = require('./routes/Customer')

// const bodyParser = require('body-parser');


// const TableCustomer = require('./routes/TableCustomer');
// const PaymentRouter = require('./routes/Payment');
// const billRouter = require('./routes/Payment'); // ตัวอย่างเส้นทางไฟล์

// const path = require('path');  // เพิ่มการ import โมดูล path
// const History = require ('./routes/History');


// dotenv.config();

// const app = express();

// // กำหนดให้ Express สามารถเข้าถึงไฟล์ในโฟลเดอร์ public ได้
// app.use('/public', express.static(path.join(__dirname, 'public')));


// app.use(express.json({ limit: '10mb' })); // เพิ่มขีดจำกัดการรับ JSON ที่ 10MB
// app.use(express.urlencoded({ limit: '10mb', extended: true })); // เพิ่มขีดจำกัดการรับ URL-encoded form data ที่ 10MB
// // ใช้ Router สำหรับจัดการเส้นทางที่เกี่ยวข้องกับตะกร้า


// // app.use(express.static(path.join(__dirname, 'public')));



// app.use(cors());

// // // ใช้ cors ในทุกคำขอ
// // app.use(cors());


// // หรือถ้าคุณต้องการกำหนด CORS เฉพาะ เช่น ให้อนุญาตแค่บางโดเมน
// app.use(cors({
//   origin: 'http://localhost:5173',  // กำหนดให้อนุญาตเฉพาะจาก frontend ที่รันที่ 5173
// }));


// // Middleware
// app.use(express.json());
// // ใช้ CORS middleware
// app.use(cors());

// // ตัวอย่าง Route
// app.get('/', (req, res) => {
//   res.send('Welcome to the API!');
// });

// app.use('/login', LoginRouter);

// // ใช้ route ที่เชื่อมโยงกับ /order-details
// app.use('/order-details', orderRoutes);  // เชื่อมโยงเส้นทาง /order-details กับ orderRoutes
// app.use('/category', CategoryRouter);
// app.use('/itemCategory', ItemCategoryRouter);

// app.use('/Customer',CustomerRouter);

// app.use('/tableCustomer', TableCustomer);
// app.use('/history', History);
// // เชื่อมต่อ routes
// app.use('/tablecustomer', TableCustomerRouter);
// app.use('/api/payment', PaymentRouter);
// app.use('/api/bill', billRouter);


// // เริ่มเซิร์ฟเวอร์
// app.listen(3001, () => {
//   console.log(`Server running on port 3001`);
// });
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db'); // นำเข้า Pool จาก db.js
const LoginRouter = require('./routes/Login');
const orderRoutes = require('./routes/Order');  // นำเข้า orderRoutes จากไฟล์ Order.js
const CategoryRouter = require('./routes/Category');
const ItemCategoryRouter = require('./routes/ItemCategory');
const CustomerRouter = require('./routes/Customer')

const bodyParser = require('body-parser');


const TableCustomer = require('./routes/TableCustomer');
const PaymentRouter = require('./routes/Payment');
const billRouter = require('./routes/Payment'); // ตัวอย่างเส้นทางไฟล์

const path = require('path');  // เพิ่มการ import โมดูล path
const History = require ('./routes/History');


dotenv.config();

const app = express();

// กำหนดให้ Express สามารถเข้าถึงไฟล์ในโฟลเดอร์ public ได้
app.use('/public', express.static(path.join(__dirname, 'public')));


app.use(express.json({ limit: '10mb' })); // เพิ่มขีดจำกัดการรับ JSON ที่ 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true })); // เพิ่มขีดจำกัดการรับ URL-encoded form data ที่ 10MB
// ใช้ Router สำหรับจัดการเส้นทางที่เกี่ยวข้องกับตะกร้า


// app.use(express.static(path.join(__dirname, 'public')));



app.use(cors());

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

app.use('/Customer',CustomerRouter);

app.use('/tableCustomer', TableCustomer);
app.use('/history', History);
// เชื่อมต่อ routes
app.use('/api/payment', PaymentRouter);
app.use('/api/bill', billRouter);


// เริ่มเซิร์ฟเวอร์
app.listen(3001, () => {
  console.log(`Server running on port 3001`);
});