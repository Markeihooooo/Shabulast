const express = require('express');
const router = express.Router();
const db = require('../db'); // สมมติว่า db คือไฟล์ที่เชื่อมต่อฐานข้อมูล

// ฟังก์ชันยืนยันการชำระเงินและลบข้อมูลลูกค้าหลังการชำระเงิน
router.post('/confirm-payment', async (req, res) => {
    const { table_number } = req.body; // รับค่าจาก request

    // ตรวจสอบว่า table_number มีค่า
    if (!table_number) {
        return res.status(400).json({ success: false, message: 'Table number is required' });
    }

    // Query สำหรับลบข้อมูลใน customer_count
    const deleteQuery = 'DELETE FROM customer_count WHERE table_number = $1';

    try {
        // ลบ row ที่มี table_number ตรงกัน
        const result = await db.query(deleteQuery, [table_number]);

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

// ฟังก์ชันเพิ่มข้อมูลในตาราง Bill
router.post('/add-bill', async (req, res) => {
    const { token, create_by } = req.body;

    if (!token) {
        return res.status(400).json({ success: false, message: 'Token is required' });
    }

    try {
        // ถอดรหัส token
        const decodedToken = atob(token);
        const [table_number, customer_count, timestamp] = decodedToken.split('-');

        if (!table_number || !customer_count || !timestamp) {
            return res.status(400).json({ success: false, message: 'Invalid token format' });
        }

        // ค้นหา table_id
        const tableInfoQuery = `SELECT table_id FROM TableInfo WHERE table_name = $1`;
        const tableInfoResult = await db.query(tableInfoQuery, [table_number]);

        if (tableInfoResult.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Table not found' });
        }

        const table_id = tableInfoResult.rows[0].table_id;

        // เพิ่มข้อมูลใน Bill พร้อมทั้งเพิ่มเวลาการสร้างบิล (create_at)
        const insertQuery = `
            INSERT INTO Bill (customer_count, table_id, create_by, create_at)
            VALUES ($1, $2, $3, NOW())  -- ใช้ NOW() เพื่อบันทึกเวลาปัจจุบัน
            RETURNING bill_id
        `;

        const insertResult = await db.query(insertQuery, [customer_count, table_id, create_by]);

        const bill_id = insertResult.rows[0].bill_id;

        // อัปเดตสถานะการชำระเงินและเวลาออกจากร้าน (checkout)
        const updateQuery = `
            UPDATE Bill
            SET payment_status = $1,
                checkout = $2,
                update_by = $3,
                update_at = NOW()  -- ใช้ NOW() เพื่อบันทึกเวลาปัจจุบันในการอัปเดต
            WHERE bill_id = $4
            RETURNING *
        `;
        
        const updateResult = await db.query(updateQuery, [
            true,                // payment_status
            new Date(),          // checkout
            create_by,           // update_by (ใช้ employee_id ที่ส่งมา)
            bill_id,             // bill_id ที่จะอัปเดต
        ]);

        res.json({ success: true, message: 'Bill added and updated successfully', bill_id: bill_id });
    } catch (error) {
        console.error('Error processing bill:', error);
        res.status(500).json({ success: false, message: 'Database error occurred' });
    }
});



module.exports = router;
