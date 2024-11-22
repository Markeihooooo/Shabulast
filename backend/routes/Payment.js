const express = require('express');
const router = express.Router();
const db = require('../db'); // สมมติว่า db คือไฟล์ที่เชื่อมต่อฐานข้อมูล

// ฟังก์ชันยืนยันการชำระเงินและลบข้อมูลลูกค้าหลังการชำระเงิน
router.post('/confirm-payment', async (req, res) => {
    const { table_number } = req.body;  // รับค่าจาก request

    // ตรวจสอบว่า table_number มีค่า
    if (!table_number) {
      return res.status(400).json({ success: false, message: 'Table number is required' });
    }
    
    // เปลี่ยนชื่อตารางเป็น customer_count
    const query = 'DELETE FROM customer_count WHERE table_number = $1';
    
    try {
      // ลบ row ที่มี table_number ตรงกัน
      const result = await db.query(query, [table_number]);

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Table not found' });
      }

      // ถ้าการลบสำเร็จ
      res.json({ success: true, message: 'Customer data deleted successfully' });
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ success: false, message: 'Database error occurred' });
    }
});

module.exports = router;
