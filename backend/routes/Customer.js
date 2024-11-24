const express = require('express');
const router = express.Router();
const pool = require('../db');  // เชื่อมต่อกับฐานข้อมูล PostgreSQL

// Route สำหรับเพิ่มสินค้าไปที่ตะกร้า
// เพิ่มข้อมูลลงในตาราง Order_item
router.post('/add', async (req, res) => {
    const { category_item_id, quantity, order_id } = req.body;

    console.log('ข้อมูลที่ได้รับ:', { category_item_id, quantity, order_id });

    // ตรวจสอบข้อมูลที่ส่งมา
    if (!category_item_id || !quantity || !order_id || quantity <= 0) {
        return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วนหรือจำนวนสินค้าผิดปกติ' });
    }

    try {
        const query = `
            INSERT INTO Order_item (category_item_id, quantity, order_id)
            VALUES ($1, $2, $3)
            RETURNING order_item_id
        `;
        const values = [category_item_id, quantity, order_id];
        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            res.status(201).json({
                message: 'เพิ่มข้อมูล Order_item สำเร็จ',
                order_item_id: result.rows[0].order_item_id,
            });
        } else {
            res.status(500).json({ message: 'ไม่สามารถเพิ่มข้อมูลลงใน Order_item ได้' });
        }
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล:', err.stack);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล',
            error: err.message,
        });
    }
});

module.exports = router;
