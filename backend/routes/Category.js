// routes/Category.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

// Secret key สำหรับการสร้าง JWT
const secret = "Test@4%#$6*";

// กำหนดเส้นทาง (route) ในการรับคำขอ HTTP แบบ GET ที่ endpoint '/category'
// โดยใช้ async function เพื่อรองรับการทำงานแบบ asynchronous
// Ensure your route handler is an async function
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
    const { category_name } = req.body;

    // ตรวจสอบข้อมูลที่ได้รับจาก body
    if (!category_name) {
        return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ' });
    }
    try {
        // รับ token จาก header Authorization
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Token is missing or invalid' });
        }

        // ตรวจสอบ token และดึงข้อมูลผู้ใช้
        try {
            const decoded = jwt.verify(token, secret);
            const create_by = decoded.emp_id; // ดึง employeeid จาก decoded token

            if (!create_by) {
                return res.status(400).json({ error: 'Invalid user' });
            }

            // ตรวจสอบว่า category_name นี้มีอยู่ในฐานข้อมูลแล้วหรือไม่
            const checkCategory = await pool.query(
                'SELECT * FROM public."category" WHERE category_name = $1',
                [category_name]
            );

            if (checkCategory.rows.length > 0) {
                return res.status(400).json({ error: 'หมวดหมู่นี้มีอยู่แล้ว' });
            }

            // ทำการคิวรีเพื่อเพิ่มข้อมูลใหม่ในตาราง "category"
            const result = await pool.query(
                'INSERT INTO public."category" (category_name, create_by) VALUES ($1, $2) RETURNING *',
                [category_name, create_by]
            );

            // ส่งผลลัพธ์กลับ
            res.status(201).json({ message: 'สร้างหมวดหมู่สำเร็จ', category: result.rows[0] });

        } catch (error) {
            console.error("Invalid token", error);
            return res.status(401).json({ error: 'Token is invalid or expired' });
        }

    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// กำหนดเส้นทาง (route) สำหรับรับคำขอ HTTP แบบ PATCH ที่ endpoint '/update/:id'
// โดย :id เป็นตัวแปรที่รับค่า id ของหมวดหมู่ที่ต้องการอัปเดต
router.patch('/update/:id', async (req, res) => {
    try {
        // ดึงค่า id จาก URL parameter (:id) ที่ส่งมา
        const { id } = req.params;

        // ดึงค่า category_name, update_by จาก body ของคำขอที่ส่งเข้ามา
        const { category_name, update_by } = req.body;

        // ตรวจสอบว่ามีค่า category_name และ update_by ถูกส่งมาในคำขอหรือไม่
        if (!category_name) {
            return res.status(400).json({ error: 'Category name is required' });
        }
        if (!update_by) {
            return res.status(400).json({ error: 'Update by user ID is required' });
        }

        // ทำการคิวรีเพื่ออัปเดตข้อมูลในตาราง "Category" ใน schema "public"
        // โดยอัปเดต category_name, update_by และ update_at
        const result = await pool.query(
            `UPDATE public."Category" 
            SET category_name = $1, 
                update_by = $2, 
                update_at = CURRENT_TIMESTAMP 
            WHERE category_id = $3 
             RETURNING *`,
            [category_name, update_by, id]
        );

        // ตรวจสอบว่ามี row ถูกอัปเดตหรือไม่
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // ส่งผลลัพธ์ของ row ที่ถูกอัปเดตแล้วกลับไปยังผู้เรียกใช้งานในรูปแบบ JSON
        res.json(result.rows[0]);

    } catch (error) {
        // หากเกิดข้อผิดพลาดในระหว่างการอัปเดตข้อมูลหรือประมวลผล
        console.error('Error updating category:', error);

        // ส่งสถานะ HTTP 500 (Internal Server Error) และส่งข้อความ error กลับไปในรูปแบบ JSON
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// กำหนดเส้นทาง (route) สำหรับรับคำขอ HTTP แบบ DELETE ที่ endpoint '/delete/:id'
// โดย :id เป็นตัวแปรที่รับค่า id ของหมวดหมู่ที่ต้องการลบ
router.delete('/delete/:id', async (req, res) => {

    try {
        // ดึงค่า id จาก URL parameter (:id) ที่ส่งมา
        const { id } = req.params;

        // ทำการคิวรีเพื่อลบข้อมูลจากตาราง "category" ใน schema "public"
        // ลบเฉพาะ row ที่มี category_id ตรงกับ id ที่ส่งมา
        const result = await pool.query('DELETE FROM public."category" WHERE category_id = $1 RETURNING *', [id]);

        // ตรวจสอบว่ามี row ถูกลบหรือไม่
        if (result.rowCount === 0) {
            // หากไม่มี row ที่ถูกลบ (เช่น ไม่มี category_id ที่ตรงกับ id ที่ส่งมา)
            // ส่งสถานะ 404 (Not Found) พร้อมข้อความ error
            return res.status(404).json({ error: 'Category not found' });
        }

        // ส่งสถานะ HTTP 200 และข้อความยืนยันว่าลบข้อมูลเรียบร้อย
        res.status(200).json({ message: 'Category deleted successfully' });

    } catch (error) {
        // หากเกิดข้อผิดพลาดในระหว่างการลบข้อมูลหรือประมวลผล
        // แสดง error ใน console เพื่อให้ผู้พัฒนาสามารถดูข้อผิดพลาดที่เกิดขึ้น
        console.error('Error deleting category:', error);

        // ส่งสถานะ HTTP 500 (Internal Server Error) และส่งข้อความ error กลับไปในรูปแบบ JSON
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