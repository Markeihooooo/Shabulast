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
    const { status } = req.body; // รับค่า status จาก body ของคำขอ

    // ตรวจสอบว่ามีค่า status ถูกส่งมาหรือไม่ และเป็นค่าที่อนุญาตให้เปลี่ยนได้
    if (!status || (status !== 'Completed' && status !== 'Canceled')) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
        const query = `
            UPDATE OrderInfo
            SET status = $1
            WHERE order_id = $2
            RETURNING *;
        `;
        const { rows } = await pool.query(query, [status, order_id]);  // ใช้ค่า status ที่ส่งมาจากคำขอ

        if (rows.length === 0) {
            console.error(`Order with ID ${order_id} not found`);
            return res.status(404).json({ error: 'Order not found' });
        }

        console.log(`Order ID ${order_id} updated to ${status}`);
        res.json({ message: `Order status updated to ${status}`, order: rows[0] });
    } catch (error) {
        console.error('Error updating order status:', error.message);
        res.status(500).json({ error: 'Error updating order status', details: error.message });
    }
});

// ส่งออก router
module.exports = router;
