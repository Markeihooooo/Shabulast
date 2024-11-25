const express = require('express');
const router = express.Router();
const pool = require('../db'); // สมมติว่ามีการตั้งค่าการเชื่อมต่อฐานข้อมูลไว้ที่ไฟล์ db.js
const jwt = require('jsonwebtoken');
const path = require('path');

const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/imgItemCategory'); // กำหนดโฟลเดอร์สำหรับเก็บไฟล์
    },
    filename: (req, file, cb) => {
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
        const filename = `${formattedDate}-${file.originalname}`;
        cb(null, filename); // ตั้งชื่อไฟล์ใหม่
    }
});


const upload = multer({ storage });

// Secret key สำหรับการสร้าง JWT
const secret = "Test@4%#$6*";



//-------------------------------------------------------------------------------------------------------4 router
// ตั้งค่า Multer สำหรับการอัพโหลดไฟล์

// ตั้งค่า Multer สำหรับการอัพโหลดไฟล์
// const upload = multer({
//     limits: { fileSize: 10 * 1024 * 1024 },  // ขนาดไฟล์สูงสุด 10MB
//     storage: multer.diskStorage({
//         destination: (req, file, cb) => {
//             cb(null, path.join(__dirname, 'public', 'imgItemCategory')); // กำหนดที่อยู่สำหรับการเก็บไฟล์
//         },
//         filename: (req, file, cb) => {
//             cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ใหม่
//         }
//     }),
//     fileFilter: (req, file, cb) => {
//         // ตรวจสอบชื่อฟิลด์ว่าเป็น "image_url" หรือไม่
//         if (file.fieldname !== 'image_url') {
//             return cb(new Error('Unexpected field')); // หากไม่ตรงกับที่คาดหวัง ให้โยนข้อผิดพลาด
//         }

//         // ตรวจสอบชนิดของไฟล์ (อนุญาตเฉพาะ .jpg, .png)
//         const filetypes = /jpg|jpeg|png/;
//         const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // ตรวจสอบนามสกุลไฟล์
//         const mimetype = filetypes.test(file.mimetype); // ตรวจสอบประเภทไฟล์

//         if (extname && mimetype) {
//             return cb(null, true); // หากไฟล์เป็นชนิดที่อนุญาตให้ผ่าน
//         } else {
//             return cb(new Error('Only jpg, jpeg, and png files are allowed')); // หากไม่ใช่ไฟล์ที่อนุญาตให้โยนข้อผิดพลาด
//         }
//     }
// });

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


// API สำหรับสร้างข้อมูลในฐานข้อมูล พร้อมอัปโหลดรูปภาพ
router.post('/create', upload.single('image'), async (req, res) => {
    const { category_item_name, category_id } = req.body;

    const image = req.file; // ไฟล์ที่อัปโหลด
    if (!image) {
        return res.status(400).json({ message: 'Image file is required.' });
    }

    if (!category_id || !category_item_name) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const imageUrl = `http://localhost:3001/public/imgItemCategory/${image.filename}`;

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
            'INSERT INTO public."category_item" (category_id, category_item_name, image_url, create_by) VALUES ($1, $2, $3, $4) RETURNING *',
            [category_id, category_item_name, imageUrl, emp_ID]
        );

        res.status(201).json({ message: 'สร้างไอเท็มหมวดหมู่สำเร็จ', categoryItem: result.rows[0] });
    } catch (error) {
        console.error('Error inserting data into Category_item:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

router.patch('/update/:category_item_id', upload.single('image'), async (req, res) => {
    const { category_item_name, category_item_balance, category_id } = req.body;
    const image = req.file; // ไฟล์ที่อัปโหลด
    const imageUrl = image ? `http://localhost:3001/public/imgItemCategory/${image.filename}` : null; // Path ของรูปภาพ (ถ้ามี)

    if (!category_id || !category_item_name) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
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

        const { category_item_id } = req.params; // รับค่า id จาก URL

        // ตรวจสอบว่าหมวดหมู่ไอเท็มมีอยู่จริง
        const categoryItem = await pool.query(
            'SELECT * FROM public."category_item" WHERE category_item_id = $1',
            [category_item_id]
        );

        if (categoryItem.rows.length === 0) {
            return res.status(404).json({ error: 'ไม่พบหมวดหมู่ไอเท็ม' });
        }

        // ตรวจสอบว่า category_item_name ซ้ำใน category เดียวกันหรือไม่
        const checkCategoryItem = await pool.query(
            'SELECT * FROM public."category_item" WHERE category_id = $1 AND category_item_name = $2 AND category_item_id != $3',
            [category_id, category_item_name, category_item_id]
        );

        if (checkCategoryItem.rows.length > 0) {
            return res.status(400).json({ error: 'หมวดหมู่ไอเท็มนี้มีอยู่แล้ว' });
        }

        // แปลงค่า category_item_balance ให้เป็น Boolean
        const categoryItemBalanceBoolean =
            category_item_balance === 'true' ? true : category_item_balance === 'false' ? false : null;

        if (categoryItemBalanceBoolean === null) {
            return res.status(400).json({ error: 'category_item_balance ต้องเป็น true หรือ false' });
        }

        // อัปเดตข้อมูลในตาราง Category Item
        const updateQuery = `
            UPDATE public."category_item" 
            SET 
                category_item_name = $1,
                category_item_balance = $2,
                image_url = COALESCE($3, image_url), -- ถ้าไม่มีรูปใหม่ ให้ใช้รูปเดิม
                update_by = $4,
                update_at = CURRENT_TIMESTAMP
            WHERE category_item_id = $5
            RETURNING *;
        `;
        const updatedItem = await pool.query(updateQuery, [
            category_item_name.trim(),
            categoryItemBalanceBoolean, // ใช้ค่า Boolean ที่แปลงแล้ว
            imageUrl,
            emp_ID,
            category_item_id
        ]);

        res.status(200).json({ message: 'อัปเดตไอเท็มหมวดหมู่สำเร็จ', categoryItem: updatedItem.rows[0] });
    } catch (error) {
        console.error('Error updating data in Category_item:', error);
        res.status(500).json({ message: 'Internal server error', error });
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


// API เพื่อดึงข้อมูลจาก categoryId และ category_item_id
router.get('/get/:categoryId/:categoryItemId', async (req, res) => {
    const { categoryId, categoryItemId } = req.params;  // ดึงค่าจาก URL params

    try {
        // SQL Query สำหรับดึงข้อมูลจากตาราง Category_item
        const query = `
    SELECT ci.category_item_id, ci.category_item_name, ci.category_item_balance, ci.image_url, ci.category_id,
            c.category_name, e.username AS created_by, e2.username AS updated_by  -- ใช้ username แทน emp_name
        FROM Category_item ci
        LEFT JOIN Category c ON ci.category_id = c.category_id
        LEFT JOIN Employee e ON ci.create_by = e.emp_ID
        LEFT JOIN Employee e2 ON ci.update_by = e2.emp_ID
        WHERE ci.category_id = $1 AND ci.category_item_id = $2
    `;


        // การ execute query และการเชื่อมต่อกับฐานข้อมูล
        const { rows } = await pool.query(query, [categoryId, categoryItemId]);

        // หากไม่พบข้อมูล
        if (rows.length === 0) {
            return res.status(404).json({ error: 'ไม่พบข้อมูลรายการอาหารในหมวดหมู่ที่ต้องการ' });
        }

        // ส่งข้อมูลที่ดึงได้กลับไปที่ client
        return res.json(rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
});

module.exports = router;
