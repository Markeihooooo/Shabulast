import React, { useState } from 'react';
import './style.css';
import { useGoToRegister, submitLogin } from '../function/homefunction'; 
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [userPass, setUserPass] = useState('');
  const goToRegister = useGoToRegister();
  const navigate = useNavigate();

  const goToLogin=()=>{
    navigate('/');
  }
  const handleLogin = async (event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า

    await submitLogin(userName, userPass); // เรียกใช้งานฟังก์ชันล็อกอิน
  };

  return (
    
    <div className="container">
        <input  onClick={goToLogin}  className='back' type="submit" value={"<"} />
      <div>
        <img src="https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-09-22-at-11.06.22-2.png" alt="Logo" />
      </div>
      <h1 className="welcome">ยินดีต้อนรับสู่ร้านชาบู</h1>
      <form onSubmit={handleLogin}>
        <div>
          <input 
            type="text" 
            placeholder="ID" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
          />
        </div>
        <div>
          <input 
            type="password" 
            placeholder="Password" 
            value={userPass} 
            onChange={(e) => setUserPass(e.target.value)} 
          />
        </div>
        <div>
          <input type="submit" value="Login" />
        </div>
      </form>
      <div>
        <input onClick={goToRegister} type="submit" value="Register" />
      </div>
    </div>
  );
};

export default Login;