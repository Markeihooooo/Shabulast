const express = require('express');
const router = express.Router();
const pool = require('../db'); // สมมติว่ามีการตั้งค่าการเชื่อมต่อฐานข้อมูลไว้ที่ไฟล์ db.js
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');


// Secret key สำหรับการสร้าง JWT
const secret = "Test@4%#$6*";

// ตั้งค่า Multer สำหรับการอัพโหลดไฟล์

// ตั้งค่า Multer สำหรับการอัพโหลดไฟล์
const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 },  // ขนาดไฟล์สูงสุด 10MB
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, 'public', 'imgItemCategory')); // กำหนดที่อยู่สำหรับการเก็บไฟล์
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ใหม่
        }
    }),
    fileFilter: (req, file, cb) => {
        // ตรวจสอบชื่อฟิลด์ว่าเป็น "image_url" หรือไม่
        if (file.fieldname !== 'image_url') {
            return cb(new Error('Unexpected field')); // หากไม่ตรงกับที่คาดหวัง ให้โยนข้อผิดพลาด
        }

        // ตรวจสอบชนิดของไฟล์ (อนุญาตเฉพาะ .jpg, .png)
        const filetypes = /jpg|jpeg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // ตรวจสอบนามสกุลไฟล์
        const mimetype = filetypes.test(file.mimetype); // ตรวจสอบประเภทไฟล์

        if (extname && mimetype) {
            return cb(null, true); // หากไฟล์เป็นชนิดที่อนุญาตให้ผ่าน
        } else {
            return cb(new Error('Only jpg, jpeg, and png files are allowed')); // หากไม่ใช่ไฟล์ที่อนุญาตให้โยนข้อผิดพลาด
        }
    }
});

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

// router.post('/create/:category_id', async (req, res) => {
//     const { category_id } = req.params;
//     const { category_item_name, category_item_balance } = req.body;
//     const image_url = req.file ? `/imgItemCategory/${req.file.filename}` : '';  // รูปภาพจะถูกอัพโหลดไปยัง public/imgItemCategory และ URL จะถูกเก็บในฐานข้อมูล


//     // ตรวจสอบว่าได้รับข้อมูลครบถ้วน
//     if (!category_id || !category_item_name || category_item_balance == null || !image_url) {
//         return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
//     }

//     try {
//         // รับค่า token จาก header Authorization
//         const token = req.header('Authorization')?.replace('Bearer ', '');

//         if (!token) {
//             return res.status(401).json({ error: 'Token is missing or invalid' });
//         }

//         // Decode token
//         const decoded = jwt.verify(token, secret);
//         console.log('Decoded token:', decoded);

//         // ดึง emp_ID จาก decoded token
//         const { emp_ID } = decoded;
//         if (!emp_ID) {
//             return res.status(400).json({ error: 'Invalid token - No emp_ID found' });
//         }

//         // ตรวจสอบว่า category_item_name นี้มีอยู่ใน category ที่ระบุในฐานข้อมูลหรือไม่
//         const checkCategoryItem = await pool.query(
//             'SELECT * FROM public."category_item" WHERE category_id = $1 AND category_item_name = $2',
//             [category_id, category_item_name]
//         );

//         if (checkCategoryItem.rows.length > 0) {
//             return res.status(400).json({ error: 'หมวดหมู่ไอเท็มนี้มีอยู่แล้ว' });
//         }

//         // เพิ่มข้อมูลใหม่ในตาราง Category Item พร้อม emp_ID ใน create_by
//         const result = await pool.query(
//             'INSERT INTO public."category_item" (category_id, category_item_name, category_item_balance, image_url, create_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
//             [category_id, category_item_name, category_item_balance, image_url, emp_ID]
//         );

//         res.status(201).json({ message: 'สร้างไอเท็มหมวดหมู่สำเร็จ', categoryItem: result.rows[0] });

//     } catch (error) {
//         console.error('Error creating category item:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// router.patch('/update/:category_item_id', async (req, res) => {
//     const { category_item_id } = req.params;
//     const { category_item_name, category_item_balance, image_url } = req.body;

//     // ตรวจสอบว่าได้รับข้อมูลครบถ้วน
//     if (!category_item_name || category_item_balance == null || !image_url) {
//         return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
//     }

//     try {
//         // รับค่า token จาก header Authorization
//         const token = req.header('Authorization')?.replace('Bearer ', '');

//         if (!token) {
//             return res.status(401).json({ error: 'Token is missing or invalid' });
//         }

//         // Decode token
//         const decoded = jwt.verify(token, secret);
//         console.log('Decoded token:', decoded);

//         // ดึง emp_ID จาก decoded token
//         const { emp_ID } = decoded;
//         if (!emp_ID) {
//             return res.status(400).json({ error: 'Invalid token - No emp_ID found' });
//         }

//         // ตรวจสอบว่า category_item_id นี้มีอยู่ในฐานข้อมูลหรือไม่
//         const checkCategoryItem = await pool.query(
//             'SELECT * FROM public."category_item" WHERE category_item_id = $1',
//             [category_item_id]
//         );

//         if (checkCategoryItem.rows.length === 0) {
//             return res.status(404).json({ error: 'ไอเท็มหมวดหมู่นี้ไม่พบในฐานข้อมูล' });
//         }

//         // ตรวจสอบว่า category_item_name นี้มีอยู่ใน category ที่ระบุในฐานข้อมูลหรือไม่
//         const checkCategoryItemName = await pool.query(
//             'SELECT * FROM public."category_item" WHERE category_id = $1 AND category_item_name = $2',
//             [category_item_id, category_item_name]
//         );

//         if (checkCategoryItemName.rows.length > 0) {
//             return res.status(400).json({ error: 'หมวดหมู่ไอเท็มนี้มีอยู่แล้ว' });
//         }

//         // อัปเดตข้อมูลในตาราง Category Item
//         const result = await pool.query(
//             'UPDATE public."category_item" SET category_item_name = $1, category_item_balance = $2, image_url = $3, update_by = $4 ,update_at = CURRENT_TIMESTAMP WHERE category_item_id = $5 RETURNING *',
//             [category_item_name, category_item_balance, image_url, emp_ID, category_item_id]
//         );

//         res.status(200).json({ message: 'อัพเดทไอเท็มหมวดหมู่สำเร็จ', categoryItem: result.rows[0] });

//     } catch (error) {
//         console.error('Error updating category item:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// ลบไอเท็มในหมวดหมู่ออกไป        

router.post('/create/:category_id', upload.single('image_url'), async (req, res) => {
    const { category_id } = req.params;
    const { category_item_name, category_item_balance } = req.body;

    // ตรวจสอบว่าไฟล์ถูกอัพโหลดหรือไม่
    if (!req.file) {
        return res.status(400).json({ error: 'กรุณาเลือกไฟล์รูปภาพ' });
    }

    const image_url = `/imgItemCategory/${req.file.filename}`;  // รูปภาพจะถูกบันทึกใน public/imgItemCategory

    // ตรวจสอบข้อมูลที่ส่งเข้ามาว่าครบถ้วนหรือไม่
    if (!category_item_name || category_item_balance == null) {
        return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    try {
        // ตรวจสอบว่า category_id มีอยู่ในฐานข้อมูลหรือไม่
        const categoryResult = await pool.query(
            'SELECT * FROM public."category_item" WHERE category_id = $1',
            [category_id]
        );

        if (categoryResult.rows.length === 0) {
            return res.status(404).json({ error: 'ไม่พบหมวดหมู่ในฐานข้อมูล' });
        }

        // ดำเนินการสร้างไอเท็มในหมวดหมู่
        const result = await pool.query(
            'INSERT INTO public."category_item" (category_id, category_item_name, category_item_balance, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [category_id, category_item_name, category_item_balance, image_url]
        );

        res.status(201).json({ message: 'สร้างไอเท็มหมวดหมู่สำเร็จ', categoryItem: result.rows[0] });
    } catch (error) {
        console.error('Error in creating category item:', error);  // เพิ่ม log ข้อผิดพลาด
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Router สำหรับอัพเดทข้อมูล Category Item
router.patch('/update/:category_item_id', upload.single('image'), async (req, res) => {
    const { category_item_id } = req.params;
    const { category_item_name, category_item_balance } = req.body;
    const image_url = req.file ? `/imgItemCategory/${req.file.filename}` : req.body.image_url; // ถ้ามีไฟล์ใหม่อัพเดทหรือใช้ค่าเก่า

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
