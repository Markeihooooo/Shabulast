import './Main.css';
import React from 'react';


const Menu = ({ toggleRegister, toggleReceiveCustomer , toggleSetcategor 
  ,togglePayment ,toggleHistory ,goToLogout
}) => { // รับ props toggleRegister
  
  const goToOrder = () => {
    window.location.href = '/Order';
  };

 
  
  return (
    <>
      
      <div className='container'>
        
        <img 
          src="https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-09-22-at-11.06.22-2.png"
          alt="Logo"
          className='mx-auto'
        />
       
        <input type='submit' onClick={goToOrder} value='ดูรายการสั่งอาหาร' />
        <hr />
        <input type='submit' onClick={toggleReceiveCustomer} value='รับลูกค้า' />
        
        <input type='submit' onClick={toggleSetcategor} value='จัดรายการอาหาร' />

        <input type='submit' onClick={togglePayment} value='ชำระเงินลูกค้า' />

        <input type='submit' onClick={toggleHistory} value='ประวัติรายการสั่ง' />

        <input type='submit' value='สมัครสมาชิก' onClick={toggleRegister} /> {/* เรียก toggleRegister เมื่อกดปุ่ม */}

        <input type='submit' onClick={goToLogout} value='Logout' />
      </div>
    </>
  );
};

export default Menu;



// import './Main.css';
// import React from 'react';

// const Menu = ({ toggleRegister, toggleReceiveCustomer, toggleSetcategor, togglePayment, toggleHistory, goToLogout }) => {
//   const role = localStorage.getItem('role'); // ดึง role จาก localStorage
  
//   const goToOrder = () => {
//     window.location.href = '/Order';
//   };

//   return (
//     <>
//       <div className='container'>
//         <img 
//           src="https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-09-22-at-11.06.22-2.png"
//           alt="Logo"
//         />
       
//         <input type='submit' onClick={goToOrder} value='ดูรายการสั่งอาหาร' />
//         <hr />
        
//         {/* แสดงปุ่มเฉพาะผู้ใช้ที่มี role เป็น 'admin' */}
//         {role === 'admin' && (
//           <>
//             <input type='submit' onClick={toggleReceiveCustomer} value='รับลูกค้า' />
//             <input type='submit' onClick={toggleSetcategor} value='จัดรายการอาหาร' />
//             <input type='submit' onClick={togglePayment} value='ชำระเงินลูกค้า' />
//           </>
//         )}
        
//         <input type='submit' onClick={toggleHistory} value='ประวัติรายการสั่ง' />

//         {role === 'admin' && (
//           <input type='submit' value='สมัครสมาชิก' onClick={toggleRegister} />
//         )}

//         <input type='submit' onClick={goToLogout} value='Logout' />
//       </div>
//     </>
//   );
// };

// export default Menu;