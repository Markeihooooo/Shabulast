const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // ใช้ PostgreSQL client
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // โหลดตัวแปรสิ่งแวดล้อมจาก .env

const app = express();

const secret = "Test@4%#$6*"; // Secret key สำหรับการสร้าง JWT

// ตั้งค่า CORS
app.use(cors());
app.use(express.json()); // ใช้เพื่อจัดการกับข้อมูล JSON ใน request body

// สร้างการเชื่อมต่อกับ PostgreSQL
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'localhost', // หรือชื่อโดเมนของฐานข้อมูล
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// ตรวจสอบการเชื่อมต่อกับฐานข้อมูล
pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

// Endpoint สำหรับหน้าแรก
app.get('/', (req, res) => {
  res.send('Hello World');
});

// ดึงข้อมูล users ทั้งหมดจากตาราง employee
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public."employee"');
    res.json(result.rows); 
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Endpoint สำหรับการลงทะเบียน
app.post('/register', async (req, res) => {
  const { username, password, tel_no, role } = req.body;
  
  if (!username || !password || !tel_no) {
    return res.status(400).json({ error: 'Please provide all required fields: username, password, and tel_no.' });
  }

  try {
    // Ensure the password is a string
    if (typeof password !== 'string') {
      return res.status(400).json({ error: 'Password must be a valid string.' });
    }

    const passwordHash = await bcrypt.hash(password, 12); // hash the password with 12 salt rounds
    await pool.query(
      'INSERT INTO public."employee" (username, password, tel_no, role) VALUES ($1, $2, $3, $4)', 
      [username, passwordHash, tel_no, role || 'admin']
    );
    res.status(201).json({ message: 'Employee registered successfully!' });
  } catch (error) {
    console.error('Error registering employee:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Endpoint สำหรับการเข้าสู่ระบบ
app.post('/login', async (req, res) => {
  const { user_name, user_pass } = req.body;

  if (!user_name || !user_pass) {
    return res.status(400).json({ error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
  }

  try {
    const result = await pool.query('SELECT * FROM public."employee" WHERE username = $1', [user_name]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(user_pass, user.password); // ตรวจสอบรหัสผ่านที่ถูกต้อง

    if (!passwordMatch) {
      return res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    const token = jwt.sign({ user_id: user.id, role: user.role }, secret, { expiresIn: '1d' });
    res.status(200).json({ message: 'Login successful!', token, role: user.role }); // ส่ง role กลับไปด้วย
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล' });
  }
});

// เริ่มต้นเซิร์ฟเวอร์ที่พอร์ต 3001
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});