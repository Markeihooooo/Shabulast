const express = require('express');
const router = express.Router();
const pool = require('../db'); // สมมติว่ามีการตั้งค่าการเชื่อมต่อฐานข้อมูลไว้ที่ไฟล์ db.js

// Router เพื่อดึงข้อมูล Category_item ตาม category_id
router.get('/get/:category_id', async (req, res) => {
    const { category_id } = req.params;

    try {
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

        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});
// router.post('/create', async (req, res) => {
//     const { category_id, category_item_name, category_item_balance, image_url } = req.body;

//     // ตรวจสอบข้อมูลที่ได้รับจาก body
//     if (!category_id || !category_item_name || !category_item_balance || !image_url) {
//         return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ' });        
//     }

//     try {
//         const query = `
//             INSERT INTO Category_item (category_id, category_item_name, category_item_balance, image_url)
//             VALUES ($1, $2, $3, $4)
//             RETURNING category_item_id, category_item_name, category_item_balance, image_url
//         `;

//         const values = [category_id, category_item_name, category_item_balance, image_url];
//         const { rows } = await pool.query(query, values);

//         res.status(201).json(rows[0]);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ error: 'Server error' });
//     }
// });


module.exports = router;
