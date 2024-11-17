import './Main.css';
import Menu from './Menu.jsx'; // ทำการ import Menu
import Register from '../Register/Register.jsx';
import { useEffect, useState } from 'react';
import ReceiveCs from '../Menu/ReceiveCustomer.jsx';
import Welcome from './welcome.jsx'
import Setcategor from './Setcategor.jsx';
import Payment from './Payment.jsx'
import History from './History.jsx'
import SetItemIncategory from './SetItemIncategory.jsx'
import { Checkrole } from './MainindexJs.js';


  const MainIndex = () => {
  
    const goToLogout = () => {
      localStorage.removeItem('token'); // ลบ token ออกจาก localStorage
      window.location.href = '/'; // เปลี่ยนเส้นทางไปยังหน้า Login
    };
    
    const [activeComponent, setActiveComponent] = useState('welcome');
    
    const toggleRegister=()=>{
      setActiveComponent(prevstate=>(prevstate ==='register' ? '' : 'register'));
    }
    const toggleReceiveCustomer=()=>{
      setActiveComponent(prevstate=>(prevstate ==='receiveCustomer' ? 'welcome' : 'receiveCustomer'));
    }
    const toggleSetcategor=()=>{
      setActiveComponent(prevstate=>(prevstate ==='Setcategor'? 'welcome':'Setcategor'));
    }
    const togglePayment=()=>{
      setActiveComponent(prevstate=>(prevstate ==='Payment'? 'welcome':'Payment'));
    }
    const toggleHistory=()=>{
      setActiveComponent(prevstate=>(prevstate ==='History'? 'welcome':'History'));
    }
    const toggleItemsInCategory=()=>{
      setActiveComponent(prevstate=>(prevstate ==='SetItemIncategory'? 'welcome':'SetItemIncategory'));
    }
    
    const [Role, setRole] = useState('');
    
    useEffect(() => {
      const token = localStorage.getItem('token');
      const getUserRole = async()=>{
        const userRole = await Checkrole(token);
        setRole(userRole);
      }
      getUserRole();
    },[]);
    
    
  return (
    <>
      <div className='main-container'>

        
      <div className='sidebar'>
                    {/* แสดงปุ่มต่างๆ ตาม role ของผู้ใช้ */}
                    {Role === 'เจ้าของ' && (
                        <Menu 
                            toggleRegister={toggleRegister} 
                            toggleReceiveCustomer={toggleReceiveCustomer}  
                            toggleSetcategor={toggleSetcategor} 
                            togglePayment={togglePayment}
                            toggleHistory={toggleHistory}  
                            goToLogout={goToLogout}
                            toggleItemsInCategory={toggleItemsInCategory}
                        />
                    )}
                    {Role === 'พนักงานร้าน' && (
                        <Menu 
                            toggleReceiveCustomer={toggleReceiveCustomer}  
                            togglePayment={togglePayment}
                            toggleHistory={toggleHistory}  
                            goToLogout={goToLogout}
                        />
                    )}
                    {Role === 'คนทำอาหาร'&&(

                      <Menu
                      toggleHistory={toggleHistory}  
                      goToLogout={goToLogout}
                      />
                    )}
                </div>
        

        <div className='content'>
          
         {activeComponent === 'register' && <Register />}
         {activeComponent === 'receiveCustomer' && <ReceiveCs />}
         {activeComponent === 'welcome' && <Welcome />}
         {activeComponent === 'Setcategor' && <Setcategor />}
         {activeComponent === 'Payment' && <Payment />}
         {activeComponent === 'History'&&<History />}
         {activeComponent === 'SetItemIncategory' && <SetItemIncategory />}
        </div>
      </div>
    </>
  );
};

export default MainIndex;