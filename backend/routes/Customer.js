const express = require('express');
const router = express.Router();
const pool = require('../db');  // เชื่อมต่อกับฐานข้อมูล PostgreSQL

// Route สำหรับเพิ่มสินค้าไปที่ตะกร้า
// เพิ่มข้อมูลลงในตาราง Order_item
// router.post('/add', async (req, res) => {
//     const { category_item_id, quantity, order_id } = req.body;

//     console.log('ข้อมูลที่ได้รับ:', { category_item_id, quantity, order_id });

//     // ตรวจสอบข้อมูลที่ส่งมา
//     if (!category_item_id || !quantity || !order_id || quantity <= 0) {
//         return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วนหรือจำนวนสินค้าผิดปกติ' });
//     }

//     try {
//         const query = `
//             INSERT INTO Order_item (category_item_id, quantity, order_id)
//             VALUES ($1, $2, $3)
//             RETURNING order_item_id
//         `;
//         const values = [category_item_id, quantity, order_id];
//         const result = await pool.query(query, values);

//         if (result.rows.length > 0) {
//             res.status(201).json({
//                 message: 'เพิ่มข้อมูล Order_item สำเร็จ',
//                 order_item_id: result.rows[0].order_item_id,
//             });
//         } else {
//             res.status(500).json({ message: 'ไม่สามารถเพิ่มข้อมูลลงใน Order_item ได้' });
//         }
//     } catch (err) {
//         console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล:', err.stack);
//         res.status(500).json({
//             message: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล',
//             error: err.message,
//         });
//     }
// });
router.post('/createOrderWithItems', async (req, res) => {
    const { table_id, status, items } = req.body;

    console.log('ข้อมูลที่ได้รับ:', { table_id, status, items });

    if (!table_id || !status || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วนหรือไม่มีรายการสินค้า' });
    }

    const client = await pool.connect(); // เริ่ม transaction
    try {
        await client.query('BEGIN');

        // 1. สร้าง order ใน OrderInfo
        const orderInfoQuery = `
        INSERT INTO OrderInfo (status, table_id)
        VALUES ($1, $2)
        RETURNING order_id
      `;
        const orderInfoResult = await client.query(orderInfoQuery, [status, table_id]);
        const orderId = orderInfoResult.rows[0].order_id;

        console.log('สร้าง OrderInfo สำเร็จ, order_id:', orderId);

        // 2. เพิ่มสินค้าใน Order_item
        const orderItemsQuery = `
        INSERT INTO Order_item (category_item_id, quantity, order_id)
        VALUES ($1, $2, $3)
      `;
        for (const item of items) {
            const { category_item_id, quantity } = item;
            if (!category_item_id || quantity <= 0) {
                throw new Error('ข้อมูลสินค้าไม่ถูกต้อง');
            }
            await client.query(orderItemsQuery, [category_item_id, quantity, orderId]);
        }

        await client.query('COMMIT'); // Commit transaction

        res.status(201).json({
            message: 'สร้างออร์เดอร์พร้อมสินค้าเรียบร้อย',
            order_id: orderId,
        });
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction
        console.error('เกิดข้อผิดพลาด:', err.stack);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการสร้างออร์เดอร์',
            error: err.message,
        });
    } finally {
        client.release();
    }
});

module.exports = router;
