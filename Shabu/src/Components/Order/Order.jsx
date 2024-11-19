import React, { useState, useEffect } from 'react';
import './Order.css';

const Order = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedTable, setSelectedTable] = useState(1);
  const [orders, setOrders] = useState([]);

  const goToMain = () => {
    window.location.href = '/Mainmenu';
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleTableClick = (tableNumber) => {
    setSelectedTable(tableNumber);
    setSelectedOrder(null);
    fetchOrders(tableNumber);
  };

  const fetchOrders = async (tableNumber) => {
    try {
      const response = await fetch(`http://localhost:5000/order-details?bill_id=${tableNumber}`);
      const data = await response.json();
      setOrders(data); // set ข้อมูลคำสั่งซื้อที่ได้รับไปยัง state ของ orders
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ:', error);
    }
  };

  useEffect(() => {
    fetchOrders(selectedTable);
  }, [selectedTable]);

  return (
    <div className='main-container'>
      <div className='sidebar'>
        <input type='submit' onClick={goToMain} value='BackToMain' />
        <img src="https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-09-22-at-11.06.22-2.png" alt="Logo" />
        {[1, 2, 3, 4, 5].map(num => (
          <button key={num} onClick={() => handleTableClick(num)}>Table {num}</button>
        ))}
      </div>

      <div className="content">
        <div className="order__slidebar">
          <h2>Orders for Table {selectedTable}</h2>
          {orders.map(order => (
            <div
              key={order.order_id}
              className="order__item"
              onClick={() => handleOrderClick(order)}
            >
              Order #{order.order_id}
            </div>
          ))}
        </div>
        <div className="order__mainbar">
          <h1>Order Details</h1>
          {selectedOrder && (
            <div>
              <h2>Order #{selectedOrder.order_id}</h2>
              <p>Status: {selectedOrder.order_status}</p>
              <h3>Items:</h3>
              <ul>
                {selectedOrder.items.map((item, index) => (
                  <li key={index}>{item.category_item_name} (x{item.quantity})</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
