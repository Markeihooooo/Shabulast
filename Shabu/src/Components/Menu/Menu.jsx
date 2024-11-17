import './Main.css';
import React from 'react';
import { Checkrole } from './MainindexJs.js';
import { useEffect, useState } from 'react';
const Menu = ({ toggleRegister, toggleReceiveCustomer , toggleSetcategor 
  ,togglePayment ,toggleHistory ,goToLogout,toggleItemsInCategory
}) => { // รับ props toggleRegister
  
  const goToOrder = () => {
    window.location.href = '/Order';
  };

  const [Role, setRole] = useState('');
    
    useEffect(() => {
      const token = localStorage.getItem('token');
      const getUserRole = async()=>{
        const userRole = await Checkrole(token);
        console.log("User Role:", userRole); // ตรวจสอบค่า role
        setRole(userRole);
      }
      getUserRole();
    },[]);
 
  
  return (
    <>
      
      <div className='container'>
        
        <img 
          src="https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-09-22-at-11.06.22-2.png"
          alt="Logo"
          className='mx-auto'
        />
       
        <input type='submit' onClick={goToOrder} value='ดูรายการสั่งอาหาร' />
        {Role === 'เจ้าของ' && (
        <>

        
        <input type='submit' onClick={toggleReceiveCustomer} value='รับลูกค้า' />
        <input type='submit' onClick={toggleSetcategor} value='จัดรายการอาหาร' />
        <input type='submit' onClick={togglePayment} value='ชำระเงินลูกค้า' />
        <input type='submit' onClick={toggleHistory} value='ประวัติรายการสั่ง' />
        <input type='submit' value='สมัครสมาชิก' onClick={toggleRegister} />    
        <input type='submit' onClick={toggleItemsInCategory} value='รายการเมนู' />
        </>
        )}
        {Role === 'พนักงานร้าน'&&(
          <>
          <input type='submit' onClick={toggleReceiveCustomer} value='รับลูกค้า' />
          <input type='submit' onClick={togglePayment} value='ชำระเงินลูกค้า' />
          <input type='submit' onClick={toggleHistory} value='ประวัติรายการสั่ง' />
          </>
        )}
        {Role === 'คนทำอาหาร'&&(
        <>
 
        <input type='submit' onClick={toggleHistory} value='ประวัติรายการสั่ง' />
        
        </>
)}

        

        <input type='submit' onClick={goToLogout} value='Logout' />
         
      </div>
    </>
  );
};

export default Menu;



