const express = require('express');
const router = express.Router();  // กำหนดตัวแปร router ให้ถูกต้อง
const pool = require('../db'); // เชื่อมต่อกับฐานข้อมูล PostgreSQL

// กำหนด route สำหรับ /order-details
router.get('/', async (req, res) => {
  const billId = req.query.bill_id; // รับค่า bill_id จาก URL
  try {
    const query = `
      SELECT 
        Bill.bill_id,
        Bill.customer_count,
        Bill.payment_status,
        Bill.create_at AS bill_create_at,
        Bill.checkout,
        Employee.username AS created_by,
        TableInfo.table_id,
        OrderInfo.order_id,
        OrderInfo.status AS order_status,
        OrderInfo.create_at AS order_create_at,
        Order_item.order_item_id,
        Order_item.quantity,
        Category_item.category_item_name,
        Category_item.category_item_balance,
        Category.category_name
      FROM Bill
      LEFT JOIN TableInfo ON Bill.table_id = TableInfo.table_id
      LEFT JOIN Employee ON Bill.create_by = Employee.emp_ID
      LEFT JOIN OrderInfo ON TableInfo.order_id = OrderInfo.order_id
      LEFT JOIN Order_item ON OrderInfo.order_id = Order_item.order_id
      LEFT JOIN Category_item ON Order_item.category_item_id = Category_item.category_item_id
      LEFT JOIN Category ON Category_item.category_id = Category.category_id
      WHERE Bill.bill_id = $1;
    `;
    const { rows } = await pool.query(query, [billId]);
    res.json(rows);  // ส่งผลลัพธ์กลับเป็น JSON
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).send('Error fetching order details');
  }
});

// ส่งออก router
module.exports = router;
