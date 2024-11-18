const express = require('express');
const router = express.Router();
const pool = require('../db'); // สมมติว่ามีการตั้งค่าการเชื่อมต่อฐานข้อมูลไว้ที่ไฟล์ db.js
const jwt = require('jsonwebtoken');

// Secret key สำหรับการสร้าง JWT
const secret = "Test@4%#$6*";
// Router เพื่อดึงข้อมูล Category_item ตาม category_id
router.get('/get/:category_id', async (req, res) => {
    const { category_id } = req.params;

    // ตรวจสอบว่า category_id มีค่าหรือไม่ และเป็นตัวเลขที่ถูกต้อง
    if (!category_id || isNaN(category_id)) {
        return res.status(400).json({ message: 'Invalid or missing category_id' });
    }

    try {
        // สร้าง SQL query เพื่อดึงข้อมูล Category_item โดยกรองตาม category_id
        const query = `
            SELECT 
                category_item_id,
                category_item_name,
                category_item_balance,
                image_url
            FROM Category_item
            WHERE category_id = $1
        `;
        
        const { rows } = await pool.query(query, [category_id]);

        // ตรวจสอบว่าพบข้อมูลหรือไม่
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No items found for this category' });
        }

        // ส่งข้อมูลที่ดึงมาให้กับผู้ใช้
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/create/:category_id', async (req, res) => {
    const { category_id } = req.params;
    const {  category_item_name, category_item_balance, image_url } = req.body;

    // ตรวจสอบว่าได้รับข้อมูลครบถ้วน
    if (!category_id || !category_item_name || category_item_balance == null || !image_url) {
        return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
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

        // ตรวจสอบว่า category_item_name นี้มีอยู่ใน category ที่ระบุในฐานข้อมูลหรือไม่
        const checkCategoryItem = await pool.query(
            'SELECT * FROM public."category_item" WHERE category_id = $1 AND category_item_name = $2',
            [category_id, category_item_name]
        );

        if (checkCategoryItem.rows.length > 0) {
            return res.status(400).json({ error: 'หมวดหมู่ไอเท็มนี้มีอยู่แล้ว' });
        }

        // เพิ่มข้อมูลใหม่ในตาราง Category Item พร้อม emp_ID ใน create_by
        const result = await pool.query(
            'INSERT INTO public."category_item" (category_id, category_item_name, category_item_balance, image_url, create_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [category_id, category_item_name, category_item_balance, image_url, emp_ID]
        );

        res.status(201).json({ message: 'สร้างไอเท็มหมวดหมู่สำเร็จ', categoryItem: result.rows[0] });

    } catch (error) {
        console.error('Error creating category item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.patch('/update/:category_item_id', async (req, res) => {
    const { category_item_id } = req.params;
    const { category_item_name, category_item_balance, image_url } = req.body;

    // ตรวจสอบว่าได้รับข้อมูลครบถ้วน
    if (!category_item_name || category_item_balance == null || !image_url) {
        return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
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

        // ตรวจสอบว่า category_item_id นี้มีอยู่ในฐานข้อมูลหรือไม่
        const checkCategoryItem = await pool.query(
            'SELECT * FROM public."category_item" WHERE category_item_id = $1',
            [category_item_id]
        );

        if (checkCategoryItem.rows.length === 0) {
            return res.status(404).json({ error: 'ไอเท็มหมวดหมู่นี้ไม่พบในฐานข้อมูล' });
        }

        // ตรวจสอบว่า category_item_name นี้มีอยู่ใน category ที่ระบุในฐานข้อมูลหรือไม่
        const checkCategoryItemName = await pool.query(
            'SELECT * FROM public."category_item" WHERE category_id = $1 AND category_item_name = $2',
            [category_item_id, category_item_name]
        );

        if (checkCategoryItemName.rows.length > 0) {
            return res.status(400).json({ error: 'หมวดหมู่ไอเท็มนี้มีอยู่แล้ว' });
        }

        // อัปเดตข้อมูลในตาราง Category Item
        const result = await pool.query(
            'UPDATE public."category_item" SET category_item_name = $1, category_item_balance = $2, image_url = $3, update_by = $4 ,update_at = CURRENT_TIMESTAMP WHERE category_item_id = $5 RETURNING *',
            [category_item_name, category_item_balance, image_url, emp_ID, category_item_id]
        );

        res.status(200).json({ message: 'อัพเดทไอเท็มหมวดหมู่สำเร็จ', categoryItem: result.rows[0] });

    } catch (error) {
        console.error('Error updating category item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}); 

// ลบไอเท็มในหมวดหมู่ออกไป        
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params; // รับค่า id จาก URL

        // ตรวจสอบว่า category_id นี้มีอยู่ในฐานข้อมูลหรือไม่
        const checkCategory = await pool.query(
            'SELECT * FROM public."category_item" WHERE category_item_id = $1',
            [id]
        );

        if (checkCategory.rows.length === 0) {
            return res.status(404).json({ error: 'ไม่พบหมวดหมู่นี้ในฐานข้อมูล' });
        }

        // หากมี category_id ให้ลบข้อมูล
        await pool.query('DELETE FROM public."category_item" WHERE category_item_id = $1', [id]);

        res.status(200).json({ message: 'ลบหมวดหมู่สำเร็จ' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;
