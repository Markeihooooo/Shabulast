// src/components/Cart.jsx
import React, { useState } from 'react';

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]); // รายการสินค้าในกระเป๋า

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button onClick={toggleCart}>🛒 Cart</button>
      {isOpen && (
        <div className="cart-slide">
          <h2>Your Cart</h2>
          <ul>
            {items.length === 0 ? (
              <li>No items in cart</li>
            ) : (
              items.map((item, index) => <li key={index}>{item.name}</li>)
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Cart;
