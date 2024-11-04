import React, { useState } from 'react';
import './Order.css';

const Order = () => {
  const [selectedOrder, setSelectedOrder] = useState(null); // State สำหรับเก็บข้อมูลคำสั่งซื้อที่เลือก
  const [selectedTable, setSelectedTable] = useState(1); // State สำหรับเก็บโต๊ะที่เลือก

  const goToMain = () => {
    window.location.href = '/Mainmenu';
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order); // อัปเดตสถานะด้วยข้อมูลคำสั่งซื้อที่ถูกคลิก
  };

  const handleTableClick = (tableNumber) => {
    setSelectedTable(tableNumber); // อัปเดตโต๊ะที่เลือก
    setSelectedOrder(null); // รีเซ็ตคำสั่งซื้อที่เลือกเมื่อเปลี่ยนโต๊ะ
  };

  // ตัวอย่างข้อมูลคำสั่งซื้อ
  const orders = [
    { table: 1, id: 101, items: ['Pizza5555', 'Salad'], status: 'Pending' },
    { table: 1, id: 102, items: ['Pasta', 'Drink'], status: 'Confirmed' },
    { table: 1, id: 103, items: ['Burger', 'Fries'], status: 'Completed' },
    { table: 2, id: 104, items: ['Pizza', 'Salad'], status: 'Pending' },
    { table: 2, id: 105, items: ['Pasta', 'Drink'], status: 'Confirmed' },
    { table: 2, id: 106, items: ['Burger', 'Fries'], status: 'Completed' },
    { table: 3, id: 104, items: ['Pizza', 'Salad'], status: 'Pending' },
    { table: 3, id: 105, items: ['Pasta', 'Drink'], status: 'Confirmed' },
    { table: 3, id: 106, items: ['Burger', 'Fries'], status: 'Completed' },
    { table: 4, id: 104, items: ['Pizza', 'Salad'], status: 'Pending' },
    { table: 4, id: 105, items: ['Pasta', 'Drink'], status: 'Confirmed' },
    { table: 4, id: 106, items: ['Burger', 'Fries'], status: 'Completed' },
    { table: 5, id: 104, items: ['Pizza', 'Salad'], status: 'Pending' },
    { table: 5, id: 105, items: ['Pasta', 'Drink'], status: 'Confirmed' },
    { table: 5, id: 106, items: ['Burger', 'Fries'], status: 'Completed' },
  ];

  // กรองคำสั่งซื้อโดยใช้ table ที่เลือก
  const filteredOrders = orders.filter(order => order.table === selectedTable && order.status !== 'Completed');

  return (
    <>
      <div className='main-container'>
        <div className='sidebar'>
          <input type='submit' onClick={goToMain} value='BackToMain' />
          <img src="https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-09-22-at-11.06.22-2.png" alt="Logo" />
          <button onClick={() => handleTableClick(1)}>Table 1</button>
          <button onClick={() => handleTableClick(2)}>Table 2</button>
          <button onClick={() => handleTableClick(3)}>Table 3</button>
          <button onClick={() => handleTableClick(4)}>Table 4</button>
          <button onClick={() => handleTableClick(5)}>Table 5</button>
        </div>

        <div className="content">
          <div className="order__slidebar">
            <h2>Orders for Table {selectedTable}</h2>
            {filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className="order__item" 
                onClick={() => handleOrderClick(order)} // เรียกฟังก์ชันเมื่อคลิก
              >
                Order #{order.id}
              </div>
            ))}
          </div>
          <div className="order__mainbar">
            <h1>Order Details</h1>
            {selectedOrder && (
              <div>
                <h2>Order #{selectedOrder.id}</h2>
                <p>Status: {selectedOrder.status}</p>
                <h3>Items:</h3>
                <ul>
                  {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, index) => (
                      <li key={index}>{item}</li> // แสดงรายการอาหารเป็น list
                    ))
                  ) : (
                    <li>No items available.</li> // แสดงข้อความเมื่อไม่มีรายการอาหาร
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
