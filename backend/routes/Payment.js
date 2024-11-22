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

    // ฟังก์ชันเพิ่มข้อมูลในตาราง Bill
    router.post('/add-bill', async (req, res) => {
        const { token, create_by } = req.body; // รับ token และข้อมูลผู้สร้าง (create_by)
    
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
    
        const tableInfoQuery = `SELECT table_id FROM TableInfo WHERE table_name = $1`;
        const tableInfoResult = await db.query(tableInfoQuery, [table_number]);
        
        if (tableInfoResult.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Table not found' });
        }
    
        const table_id = tableInfoResult.rows[0].table_id;
    
        // เพิ่มข้อมูลลงในตาราง Bill
        const insertQuery = `
            INSERT INTO Bill (customer_count, table_id, create_by)
            VALUES ($1, $2, $3)
            RETURNING bill_id
        `;
    
        const result = await db.query(insertQuery, [customer_count, table_id, create_by || null]);
    
        res.json({ success: true, message: 'Bill added successfully', bill_id: result.rows[0].bill_id });
        } catch (error) {
        console.error('Error processing bill:', error);
        res.status(500).json({ success: false, message: 'Database error occurred' });
        }
    });

    module.exports = router;
