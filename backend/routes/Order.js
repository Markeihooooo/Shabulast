const express = require('express');
const router = express.Router();
const pool = require('../db'); // เชื่อมต่อกับฐานข้อมูล PostgreSQL

/* กำหนด route สำหรับ /order-details
   ในไฟล์ routes ของคุณ เช่น routes/Order.js */
router.get('/pending-orders', async (req, res) => {
    try {
        const query = `
            SELECT 
    OrderInfo.order_id,
    OrderInfo.create_at AS order_create_at,
    TableInfo.table_id,
    TableInfo.table_name, -- เพิ่ม table_name
    Order_item.order_item_id,
    Order_item.quantity,
    Category_item.category_item_name,
    OrderInfo.status AS order_status -- เพิ่มสถานะคำสั่งซื้อ
FROM OrderInfo  
JOIN TableInfo ON OrderInfo.order_id = TableInfo.order_id
JOIN Order_item ON OrderInfo.order_id = Order_item.order_id
JOIN Category_item ON Order_item.category_item_id = Category_item.category_item_id;

            
        `;
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching pending orders:', error.message);
        res.status(500).json({ error: 'Error fetching pending orders', details: error.message });
    }
});

router.put('/update-order-status/:order_id', async (req, res) => {
    const { order_id } = req.params;  // รับค่า order_id จาก URL
    try {
        const query = `
            UPDATE OrderInfo
            SET status = 'Completed'
            WHERE order_id = $1
            RETURNING *;  
        `;
        const { rows } = await pool.query(query, [order_id]);  // ทำการอัพเดตในฐานข้อมูล
        if (rows.length === 0) {
            console.error(`Order with ID ${order_id} not found`);
            return res.status(404).json({ error: 'Order not found' });
        }
        console.log(`Order ID ${order_id} updated to Completed`);
        res.json({ message: 'Order status updated to Completed', order: rows[0] });
    } catch (error) {
        console.error('Error updating order status:', error.message);
        res.status(500).json({ error: 'Error updating order status', details: error.message });
    }
});

// ส่งออก router
module.exports = router;
