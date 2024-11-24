import React from 'react'
import './Register.css'
import { useState } from 'react'
import { registerUser } from './Register'
const Register = () => {
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [phone_number,setphone_number]= useState('')
  const [role,setRole] = useState('')

  const handleRegister = async (e)=>{
    e.preventDefault();
    if(username=='' || !password || !phone_number || !role){
      setError('กรุณากรอกข้อมูลให้ครบ');
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    const result = await registerUser(username,password,phone_number,role);
    if(result.success){
      alert(result.message);
    }else{
      
      alert(result.message);
     
    }
  }
  
  const goToMain = () => {
    window.location.href = '/Mainmenu';
  }
  return (
    <>
    <div className='container'>
     
      
      <div>
        <img className='mx-auto'
          src="https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-09-22-at-11.06.22-2.png"
          alt="Logo"
        />
      </div>
      <div>
        <p>สมัครสมาชิก สำหรับ พนักงาน</p>
        
        <input type="text" placeholder='Username' value={username} onChange={(e)=>setUsername(e.target.value)} />
        <input type='password' placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)} />
        
        <input type='text' placeholder='phone_number' value={phone_number} onChange={(e)=>setphone_number(e.target.value)} />
        <div>
          
          <select className="Roleselect"
          value={role} 
          onChange = {(e)=>setRole(e.target.value)} >
            
            <option value="" disabled>กรุณาเลือกตำแหน่ง</option>
            <option value="พนักงาน">พนักงานร้าน</option>
            <option value="คนทำอาหาร">คนทำอาหาร</option>
           
            
          </select>
          </div>
        <input type='submit' value='Register' onClick={handleRegister}  />
      </div>
      
      </div>
    
    </>
  )
}

export default Register