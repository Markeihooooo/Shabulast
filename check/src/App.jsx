import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/jsx/Login.jsx';  
import Register from './components/jsx/Register.jsx';
import Home from './components/jsx/Home.jsx';
import Test from './components/jsx/test.jsx';
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/admin" element={<Test />} />

      </Routes>
    </Router>
  );
}

export default App;