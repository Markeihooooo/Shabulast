import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login/Login.jsx';
import Register from './Components/Register/Register.jsx';
import './App.css';
import Menu from './Components/Menu/Menu.jsx';
import MainIndex from './Components/Menu/MainIndex.jsx';
import Order from './Components/Order/Order.jsx';
import Customer from './Components/Customer/Customer.jsx';
import SetItemIncategory from './Components/Menu/SetItemIncategory.jsx';

function App() {
  const [isLoggedIn, setIsLoggedin] = useState(false); // สถานะล็อคอิน

  const handleLogin = (token) => {
    localStorage.setItem('token', token); // เก็บ token ใน localStorage
    setIsLoggedin(true); // อัปเดตสถานะล็อกอิน
  };
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null; // ตรวจสอบ token
  };

  return (
    <Router>
      <div className="app">
        <main>
          <Routes>
            <Route
              path="/"
              element={isAuthenticated() ? <Navigate to="/Mainmenu" /> : <Login handleLogin={handleLogin} />}
            />
            <Route path="/Mainmenu" 
            element={isAuthenticated() ? <MainIndex /> : <Navigate to="/" />}
            />


            <Route path="/register" element={<Register />} />
            
            <Route path="/Menu" element={<Menu  />} />
            <Route path="/Order" element={<Order />} />
            <Route path="/Customer" element={<Customer />} />

            <Route path="/itemsCategory" element={<SetItemIncategory />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
