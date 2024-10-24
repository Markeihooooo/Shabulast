const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cors = require('cors');


router.use(cors());
router.use(express.json());



const secret = "Test@4%#$6*"; // Secret key สำหรับการสร้าง JWT
// ตัวอย่าง GET request สำหรับดึงข้อมูลพนักงาน
router.get('/employees', async (req, res) => {
  try {
    // query ฐานข้อมูลเพื่อดึงข้อมูลจากตาราง employees
    const result = await pool.query('SELECT * FROM public."employees"');
    
    // ส่งข้อมูลที่ดึงได้กลับเป็น JSON
    res.status(200).json(result.rows);
    console.log(result.rows); // พิมพ์ข้อมูลใน console
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal Server Error' }); // ส่ง error ถ้ามีปัญหา
  }
});

router.post('/create',async(req,res)=>{
  const {username,password,phonenumber,role}=req.body;
  if (!username,!password,!phonenumber,!role) {
    return res.status(400)
    .json({error:"กรุณากรอกข้อมูลให้ครบ"})}
    try{
      if (typeof password !== 'string'){
        return res.status(400)
        .json({error:"รหัสผ่านต้องประกอบไปด้วยตัวอักษร"})
      }
      if (password.length < 6){
        return res.status(400).json ({error:"รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร"});
    }
    const passwordHash = await bcrypt.hash(password,10);
    await pool.query(
      'INSERT INTO public."employees"(username,password,phonenumber,role) VALUES($1,$2,$3,$4)',
      [username,passwordHash,phonenumber,role]
    );
    res.status(201).json({message:"สมัครสมาชิกสําเร็จ"});
  } 
  catch(error){
    console.error('ERROR Register:',error);
    res.status(500).json({error:"มีบางอย่างผิดพลาด"});
  }
});




  //เปลี่ยนข้อมูล
  router.patch('/employees/:employeeid',async(req,res)=>{
    try{
      const {employeeid}=req.params;
      const {username,password,phonenumber,role}=req.body;
      const result = await pool.query('SELECT * FROM public."employees" WHERE employeeid = $1',[employeeid]);
      if (result.rows.length === 0){
        return res.status(404).json({error:"ไม่พบพนักงาน"});}
      const oldData=result.rows[0];
      const newUsername = username || oldData.username;
      const newPassword = password || oldData.password;
      const newPhonenumber = phonenumber || oldData.phonenumber;
      const newRole = role || oldData.role;
      await pool.query(
        'UPDATE public."employees" SET username=$1,password=$2,phonenumber=$3,role=$4 WHERE employeeid=$5',
        [newUsername,newPassword,newPhonenumber,newRole,employeeid]
      );
      res.status(200).json({message:"แก้ไขข้อมูลพนักงานสําเร็จ"});
      
   }catch(error){
      console.error('ERROR Update:',error);
      res.status(500).json({error:"มีบางอย่างผิดพลาด"});
    }

  })


// login 
router.post ('/login',async (req,res)=>{
  const {username,password}=req.body;
  
  if (!username || !password){
    return res.status(400).json({error:"กรุณากรอกข้อมูลให้ครบ"});
  }
  try{
    const result = await pool.query('SELECT * FROM public."employees" WHERE username = $1',[username]);
    if (result.rows.length === 0){
      return res.status(404).json({error:"ไม่พบพนักงาน"});}
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password,user.password);
      if (!passwordMatch){
        return res.status(401).json({error:"รหัสผ่านไม่ถูกต้อง"});
      }
      const token = jwt.sign({employeeid:user.employeeid,role:user.role},secret,{expiresIn:"1d"});
      res.status(200).json({message:"เข้าสู่ระบบสําเร็จ",token,role:user.role});
  }catch(error){
    console.error('ERROR Login:',error);
    res.status(500).json({error:"มีบางอย่างผิดพลาด"});
  }
})


// ดึกข้อมูล role

 router.get('/role/:token', async (req, res) => {
   try{
    const token = req.params.token;
    const decode = await jwt.verify(token, secret);
    const role = decode.role;
    res.status(200).json({ role });
}catch(error){
  console.error('Error fetching role:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}}
)
module.exports = router;