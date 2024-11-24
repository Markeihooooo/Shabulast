const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/',(req,res)=>{
    res.send('Welcome to the API!');
});

router.get('/get', async (req, res) => {
    try {
      // query ฐานข้อมูลเพื่อดึงข้อมูลจากตาราง employee
      const result = await pool.query('SELECT bill_id,customer_count,TO_CHAR(create_at, \'YYYY-MM-DD\')FROM public."bill"');
      
      // ส่งข้อมูลที่ดึงได้กลับเป็น JSON
      res.status(200).json(result.rows);
      //console.log(result.rows); // พิมพ์ข้อมูลใน console
    } catch (error) {
      console.error('Error fetching employee:', error);
      res.status(500).json({ error: 'Internal Server Error' }); // ส่ง error ถ้ามีปัญหา
    }
  });



module.exports = router;