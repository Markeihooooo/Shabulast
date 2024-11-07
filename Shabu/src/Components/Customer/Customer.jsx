// CustomerPage.js
import React, { useState } from 'react';
import './Customer.css';

const CustomerPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("เนื้อสัตว์");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("menu");

  const categories = ["เนื้อสัตว์", "อาหารทะเล", "ผัก", "ของทานเล่น", "อื่นๆ", "เครื่องดื่ม"];
  const items = [
    { id: 1, name: 'หมู', category: 'เนื้อสัตว์' },
    { id: 2, name: 'เนื้อวัว', category: 'เนื้อสัตว์' },
    { id: 3, name: 'กุ้ง', category: 'อาหารทะเล' },
    { id: 4, name: 'ปลาหมึก', category: 'อาหารทะเล' },
    { id: 5, name: 'ผักโขม', category: 'ผัก' },
    { id: 6, name: 'ผักกาด', category: 'ผัก' },
    { id: 7, name: 'เฟรนช์ฟรายส์', category: 'ของทานเล่น' },
    { id: 8, name: 'เกี๊ยวซ่า', category: 'ของทานเล่น' },
    { id: 9, name: 'น้ำอัดลม', category: 'เครื่องดื่ม' },
    { id: 10, name: 'ชาเขียว', category: 'เครื่องดื่ม' },
  ];

  const filteredItems = items.filter(item => item.category === selectedCategory);

  const updateCart = (item, delta) => {
    setCart(prevCart => {
      const itemInCart = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (itemInCart) {
        const newQuantity = itemInCart.quantity + delta;
        return newQuantity > 0
          ? prevCart.map(cartItem => 
              cartItem.id === item.id 
                ? { ...cartItem, quantity: newQuantity } 
                : cartItem
            )
          : prevCart.filter(cartItem => cartItem.id !== item.id);
      } else if (delta > 0) {
        return [...prevCart, { ...item, quantity: 1 }];
      }
      return prevCart;
    });
  };

  const addToCart = (item) => {
    updateCart(item, 1);
    setIsCartOpen(true);
  };

  const increaseQuantity = (item) => updateCart(item, 1);
  const decreaseQuantity = (item) => updateCart(item, -1);

  const handleCheckout = () => {
    setCurrentPage("checkout");
    setIsCartOpen(false);
  };

  const handlePayment = () => {
    setCurrentPage("thankYou");
  };

  return (
    <div>
      <div className="menu-container">
        <div className="category-sidebar">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${category === selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="menu">
          <h2>{selectedCategory}</h2>
          {filteredItems.map((item) => (
            <div key={item.id} className="menu-item">
              <p>{item.name}</p>
              <div className="quantity-controls">
                <button onClick={() => decreaseQuantity(item)} className="quantity-btn">-</button>
                <span>{cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}</span>
                <button onClick={() => increaseQuantity(item)} className="quantity-btn">+</button>
              </div>
              <button onClick={() => addToCart(item)} className="confirm-btn">ยืนยัน</button>
            </div>
          ))}
        </div>
      </div>

      <div className={`cart ${isCartOpen ? 'open' : ''}`}>
        <h2>ตะกร้าสินค้า</h2>
        {cart.map((item, index) => (
          <div key={index} className="cart-item">
            <p>{item.name}</p>
            <div className="quantity-controls">
              <button onClick={() => decreaseQuantity(item)} className="quantity-btn">-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQuantity(item)} className="quantity-btn">+</button>
            </div>
          </div>
        ))}
        <button onClick={handleCheckout} className="checkout-btn">ชำระเงิน</button>
        <button onClick={() => setIsCartOpen(false)} className="close-cart-btn">ปิด</button>
      </div>

      {currentPage === "checkout" && (
        <div className="payment">
          <h2>ชำระเงิน</h2>
          <button onClick={handlePayment} className="call-staff-btn">เรียกพนักงานเพื่อชำระเงิน</button>
          <button onClick={() => setCurrentPage("menu")} className="back-btn">กลับไปยังเมนู</button>
        </div>
      )}

      {currentPage === "thankYou" && (
        <div className="thank-you">
          <h2>ขอบคุณ!</h2>
          <p>ขอบคุณที่ใช้บริการร้านของเรา!</p>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;
