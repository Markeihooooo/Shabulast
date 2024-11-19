import React,{ useState }  from 'react';
import './Login.css'
import { useNavigate } from 'react-router-dom';
import { submitLogin } from './Login.js';


const Login = () => {

  
   const [username,setUsername] = useState('')
   const [password,setPassword] = useState('')
   const navigate = useNavigate();
  
  
  
  const handleLogin = async (event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า
    
    await submitLogin(username, password); // เรียกใช้งานฟังก์ชันล็อกอิน
  };

  return (
    <>
    <div className='container'>
    
    <div>
        <img className='mx-auto' src="https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-09-22-at-11.06.22-2.png" alt="Logo" />
    </div>

      <p>ยินดีต้อนรับสู่ร้านชาบู</p>
      <p>ลงชื่อเข้าใช้งาน</p>
      <input 
      type="text" 
      placeholder='Username' 
      value={username}
      onChange={(e)=>setUsername(e.target.value)}/>



      <input type='password' 
      placeholder='Password'
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
       />




      <input onClick={handleLogin} type='submit' value='Login' />
      

      


    </div>
    </>
  );
};

export default Login;
