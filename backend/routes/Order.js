const express = require('express');
const router = express.Router();
const pool = require('../db'); // เชื่อมต่อกับฐานข้อมูล PostgreSQL

// กำหนด route สำหรับ /order-details
// ในไฟล์ routes ของคุณ เช่น routes/Order.js
router.get('/pending-orders', async (req, res) => {
    try {
        const query = `
            SELECT 
                OrderInfo.order_id,
                OrderInfo.create_at AS order_create_at,
                TableInfo.table_id,
                Order_item.order_item_id,
                Order_item.quantity,
                Category_item.category_item_name
            FROM OrderInfo
            JOIN TableInfo ON OrderInfo.order_id = TableInfo.order_id
            JOIN Order_item ON OrderInfo.order_id = Order_item.order_id
            JOIN Category_item ON Order_item.category_item_id = Category_item.category_item_id
            WHERE OrderInfo.status != 'Completed';
        `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching pending orders:', error.message);
        res.status(500).json({ error: 'Error fetching pending orders', details: error.message });
    }
});


// ส่งออก router
module.exports = router;
