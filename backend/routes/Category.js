// routes/Category.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

// Secret key สำหรับการสร้าง JWT
const secret = "Test@4%#$6*";

// กำหนดเส้นทาง (route) ในการรับคำขอ HTTP แบบ GET ที่ endpoint '/category'
// โดยใช้ async function เพื่อรองรับการทำงานแบบ asynchronous
router.get('/get', async (req, res) => {
    const page = parseInt(req.query.page) || 1;  // Default page is 1
    const itemsPerPage = 10;  // Items per page
    const offset = (page - 1) * itemsPerPage;  // Calculate offset for pagination

    try {
        // Query to get categories
        const result = await pool.query(
            `SELECT * FROM public."category" LIMIT $1 OFFSET $2`,
            [itemsPerPage, offset]
        );

        // Query to get total items for pagination
        const totalResult = await pool.query('SELECT COUNT(*) FROM public."category"');
        const totalItems = parseInt(totalResult.rows[0].count);

        // Calculate total pages
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Return data and pagination details
        res.json({ data: result.rows, totalPages });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// กำหนดเส้นทาง (route) ในการรับคำขอ HTTP แบบ POST ที่ endpoint '/category'
// โดยใช้ async function เพื่อรองรับการทำงานแบบ asynchronous
router.post('/create', async (req, res) => {
    const { category_name } = req.body; // รับค่า category_name จาก body

    // ตรวจสอบว่า category_name ถูกส่งมาหรือไม่
    if (!category_name) {
        return res.status(400).json({ error: 'กรุณากรอกชื่อหมวดหมู่' });
    }

    try {
        // รับค่า token จาก header Authorization
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Token is missing or invalid' });
        }

        // Decode token
        const decoded = jwt.verify(token, secret);
        console.log('Decoded token:', decoded);

        // ดึง emp_ID จาก decoded token
        const { emp_ID } = decoded;
        if (!emp_ID) {
            return res.status(400).json({ error: 'Invalid token - No emp_ID found' });
        }

        // ตรวจสอบว่า category_name นี้มีอยู่ในฐานข้อมูลหรือไม่
        const checkCategory = await pool.query(
            'SELECT * FROM public."category" WHERE category_name = $1',
            [category_name]
        );

        if (checkCategory.rows.length > 0) {
            return res.status(400).json({ error: 'หมวดหมู่นี้มีอยู่แล้ว' });
        }

        // เพิ่มข้อมูลใหม่ในตาราง Category พร้อม emp_ID ใน create_by
        const result = await pool.query(
            'INSERT INTO public."category" (category_name, create_by) VALUES ($1, $2) RETURNING *',
            [category_name, emp_ID]
        );

        res.status(201).json({ message: 'สร้างหมวดหมู่สำเร็จ', category: result.rows[0] });

    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// กำหนดเส้นทาง (route) สำหรับรับคำขอ HTTP แบบ PATCH ที่ endpoint '/update/:id'
// โดย :id เป็นตัวแปรที่รับค่า id ของหมวดหมู่ที่ต้องการอัปเดต
router.patch('/update/:id', async (req, res) => {
    const { category_name, is_active } = req.body; // รับค่า category_name จาก body

    // ตรวจสอบว่า category_name ถูกส่งมาหรือไม่
    if (!category_name) {
        return res.status(400).json({ error: 'กรุณากรอกชื่อหมวดหมู่' });
    }

    try {
        // รับค่า token จาก header Authorization
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Token is missing or invalid' });
        }

        // Decode token
        const decoded = jwt.verify(token, secret);
        console.log('Decoded token:', decoded);

        // ดึง emp_ID จาก decoded token
        const { emp_ID } = decoded;
        if (!emp_ID) {
            return res.status(400).json({ error: 'Invalid token - No emp_ID found' });
        }

        const { id } = req.params; // รับค่า id จาก URL

        // ตรวจสอบว่า category_id นี้มีอยู่ในฐานข้อมูลหรือไม่
        const checkCategory = await pool.query(
            'SELECT * FROM public."category" WHERE category_id = $1',
            [id]
        );

        if (checkCategory.rows.length === 0) {
            return res.status(404).json({ error: 'หมวดหมู่นี้ไม่พบในฐานข้อมูล' });
        }

        // แปลง is_active เป็น boolean ถ้าเป็น string
        const activeStatus = is_active === "true" ? true : is_active === "false" ? false : is_active;

        // อัปเดตข้อมูลหมวดหมู่ พร้อมกับค่า status
        const result = await pool.query(
            'UPDATE public."category" SET category_name = $1, update_by = $2, update_at = CURRENT_TIMESTAMP, is_active = $3 WHERE category_id = $4 RETURNING *',
            [category_name, emp_ID, activeStatus, id]
        );

        res.status(200).json({ message: 'อัพเดทรายการหมวดหมู่สำเร็จ', category: result.rows[0] });

    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// กำหนดเส้นทาง (route) สำหรับรับคำขอ HTTP แบบ DELETE ที่ endpoint '/delete/:id'
// โดย :id เป็นตัวแปรที่รับค่า id ของหมวดหมู่ที่ต้องการลบ
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params; // รับค่า id จาก URL

        // ตรวจสอบว่า category_id นี้มีอยู่ในฐานข้อมูลหรือไม่
        const checkCategory = await pool.query(
            'SELECT * FROM public."category" WHERE category_id = $1',
            [id]
        );

        if (checkCategory.rows.length === 0) {
            return res.status(404).json({ error: 'ไม่พบหมวดหมู่นี้ในฐานข้อมูล' });
        }

        // หากมี category_id ให้ลบข้อมูล
        await pool.query('DELETE FROM public."category" WHERE category_id = $1', [id]);

        res.status(200).json({ message: 'ลบหมวดหมู่สำเร็จ' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;

// const express = require('express');
// const jwt = require('jsonwebtoken');
// const pool = require('../db'); // เชื่อมต่อกับฐานข้อมูล
// const secret = process.env.JWT_SECRET; // เก็บ secret สำหรับ JWT ใน environment variables
// const router = express.Router();

// // Middleware ตรวจสอบ token
// const authenticateToken = (req, res, next) => {
//     const token = req.header('Authorization')?.split(' ')[1];  // แยก token ออกจาก "Bearer"

//     if (!token) {
//         return res.status(401).json({ error: "กรุณาเข้าสู่ระบบก่อน" });
//     }

//     jwt.verify(token, secret, (err, user) => {
//         if (err) {
//             return res.status(403).json({ error: "ไม่สามารถยืนยันตัวตนได้" });
//         }
//         req.user = user;  // เก็บข้อมูลผู้ใช้ใน req.user
//         next();
//     });
// };

// // GET all categories
// router.get('/gat', authenticateToken, async (req, res) => {
//     try {
//         const result = await pool.query(
//             'SELECT * FROM public."category" WHERE status = true ORDER BY category_id'
//         );
//         res.status(200).json(result.rows);
//     } catch (error) {
//         console.error('Error fetching categories:', error);
//         res.status(500).json({ error: 'มีบางอย่างผิดพลาด' });
//     }
// });

// // GET category by ID
// router.get('/:id', authenticateToken, async (req, res) => {
//     try {
//         const { id } = req.params;
//         const result = await pool.query(
//             'SELECT * FROM public."category" WHERE category_id = $1 AND status = true',
//             [id]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: 'ไม่พบหมวดหมู่นี้' });
//         }

//         res.status(200).json(result.rows[0]);
//     } catch (error) {
//         console.error('Error fetching category:', error);
//         res.status(500).json({ error: 'มีบางอย่างผิดพลาด' });
//     }
// });

// // CREATE new category
// router.post('/create-category', async (req, res) => {
//     const { category_name } = req.body;
//     const token = req.header('Authorization')?.split(' ')[1]; // รับ token จาก header

//     if (!category_name) {
//         return res.status(400).json({ error: "กรุณากรอกชื่อหมวดหมู่" });
//     }

//     if (!token) {
//         return res.status(401).json({ error: "กรุณากรอกข้อมูลให้ครบ" });
//     }

//     try {
//         // ตรวจสอบ token
//         const decoded = jwt.verify(token, secret);
//         const employeeid = decoded.employeeid;

//         // สร้างหมวดหมู่ใหม่และเก็บ employeeid ใน create_by
//         const createAt = new Date().toISOString();
//         const result = await pool.query(
//             'INSERT INTO public."category" (category_name, status, create_by, create_at) VALUES ($1, $2, $3, $4) RETURNING *',
//             [category_name, true, employeeid, createAt]
//         );

//         const newCategory = result.rows[0];

//         // ส่งข้อมูลกลับไปให้ผู้ใช้
//         res.status(201).json({
//             message: "สร้างหมวดหมู่สำเร็จ",
//             category: result.rows[0]
//         });
//     } catch (error) {
//         console.error('ERROR Create Category:', error);
//         res.status(500).json({ error: "มีบางอย่างผิดพลาดในการสร้างหมวดหมู่" });
//     }
// });
// // UPDATE category
// router.patch('/update/:id', authenticateToken, async (req, res) => {
//     const { id } = req.params;
//     const { category_name, status } = req.body;

//     try {
//         const checkCategory = await pool.query(
//             'SELECT * FROM public."category" WHERE category_id = $1',
//             [id]
//         );

//         if (checkCategory.rows.length === 0) {
//             return res.status(404).json({ error: 'ไม่พบหมวดหมู่นี้' });
//         }

//         const oldData = checkCategory.rows[0];
//         const newCategoryName = category_name || oldData.category_name;
//         const newStatus = status !== undefined ? status : oldData.status;

//         const result = await pool.query(
//             'UPDATE public."category" SET category_name = $1, status = $2, update_by = $3, update_at = CURRENT_TIMESTAMP WHERE category_id = $4 RETURNING *',
//             [newCategoryName, newStatus, req.user.employeeid, id]
//         );

//         res.status(200).json({
//             message: 'อัพเดทหมวดหมู่สำเร็จ',
//             category: result.rows[0]
//         });
//     } catch (error) {
//         console.error('Error updating category:', error);
//         res.status(500).json({ error: 'มีบางอย่างผิดพลาด' });
//     }
// });

// // DELETE category (Soft delete by updating status)
// router.delete('/:id', authenticateToken, async (req, res) => {
//     const { id } = req.params;

//     try {
//         const result = await pool.query(
//             'UPDATE public."category" SET status = false, update_by = $1, update_at = CURRENT_TIMESTAMP WHERE category_id = $2 RETURNING *',
//             [req.user.employeeid, id]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: 'ไม่พบหมวดหมู่นี้' });
//         }

//         res.status(200).json({
//             message: 'ลบหมวดหมู่สำเร็จ',
//             category: result.rows[0]
//         });
//     } catch (error) {
//         console.error('Error deleting category:', error);
//         res.status(500).json({ error: 'มีบางอย่างผิดพลาด' });
//     }
// });

// module.exports = router;