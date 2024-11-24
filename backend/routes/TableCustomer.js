const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.send('Welcome to the API!');
  });


  router.get('/get', async (req, res) => {
    try {
      // query ฐานข้อมูลเพื่อดึงข้อมูลจากตาราง employee
      const result = await pool.query('SELECT * FROM public."customer_count"');
      
      // ส่งข้อมูลที่ดึงได้กลับเป็น JSON
      res.status(200).json(result.rows);
      //console.log(result.rows); // พิมพ์ข้อมูลใน console
    } catch (error) {
      console.error('Error fetching employee:', error);
      res.status(500).json({ error: 'Internal Server Error' }); // ส่ง error ถ้ามีปัญหา
    }
  });

  router.post('/create',async (req,res)=>{
    const {table_number,customer_count,status_table,check_token}=req.body
    if(!table_number || !customer_count || !status_table || !check_token)
        return res.status(400)
        .json({error:"กรุณากรอกข้อมูลให้ครบ"})
    try{
        if((typeof table_number !== 'number') || (typeof customer_count !== 'number') || (typeof status_table !== 'boolean') || (typeof check_token !== 'string'))
        return res.status(400)
        .json({error:"error ตรงนี้ นะ"})
        await 
        pool.query('INSERT INTO public."customer_count"(table_number,customer_count,status_table,check_token)VALUES($1,$2,$3,$4)',
        [table_number,customer_count,status_table,check_token]);
        res.status(201).json({message:"สร้างข้อมูลสําเร็จ"});
    } catch(error){
        console.error('Error insert',error);
        res.status(500).json({error:"มีบางอย่างผิดพลาด"})
    }
  })

  router.patch('/table/:table_number',async(req,res)=>{
    try{
      const {table_number}=req.params;
      const {customer_count,status_table,check_token}=req.body;
      const result = await pool.query('SELECT * FROM public."customer_count" WHERE table_number =$1',[table_number]);
        if(result.rows.length ===0){
          return res.status(404).json({error:"ไม่พบโต๊ะ"});}
          const oldData=result.rows[0];
          const newCustomer = customer_count || oldData.customer_count;
          const newStatus_table = status_table || oldData.status_table;
          const newToken = check_token || oldData.check_token;
          await pool.query('UPDATE public."customer_count" SET customer_count=$1,status_table=$2,check_token=$3 WHERE table_number=$4',
            [newCustomer,newStatus_table,newToken,table_number]
          );
          res.status(200).json({message:"แก้ไขสำเร็จ"})
        }catch(error){
          console.error('ERROR Update',error);
          res.status(500).json({error:`มีบางอย่างผิดพลาด`})
        }
  })

  router.delete('/table/:table_number',async(req,res)=>{
    try{
      const {table_number}=req.params;
      const result = await pool.query('SELECT * FROM public."customer_count" WHERE table_number=$1',[table_number]);
    if (result.rows.length===0){
      return res.status(404).json({error:"ไม่พบเลขโต๊ะ"});
      
    }
    await pool.query('DELETE FROM public."customer_count" WHERE table_number=$1',[table_number]);
    res.status(200).json({message:'ลบโต๊ะไปแล้วเด้อ'});
    console.log(`ลบโต๊ะไปละเด้อ`);
    }catch(error){
      console.error("ลบไม่สำเร็จ",error)
      res.status(500).json({error:'ลบไม่สำเร็จ'})
    }
    
  });

module.exports = router;