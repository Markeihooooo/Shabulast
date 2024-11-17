import React, { useState, useEffect } from 'react';
import './Order.css';

const Order = () => {
    const [orders, setOrders] = useState([]); // เก็บข้อมูลคำสั่งซื้อที่ดึงมาจาก API
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedTable, setSelectedTable] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/pending-orders');
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data); // ตั้งค่า orders ด้วยข้อมูลที่ได้จาก API
                } else {
                    console.error('Error fetching orders:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลคำสั่งซื้อเมื่อ component ถูก mount
    }, []);

    const goToMain = () => {
        window.location.href = '/Mainmenu';
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    const handleTableClick = (tableNumber) => {
        setSelectedTable(tableNumber);
        setSelectedOrder(null);
    };

    // กรองคำสั่งซื้อโดยใช้ table ที่เลือก
    const filteredOrders = orders.filter(order => order.table_id === selectedTable && order.status !== 'Completed');

    return (
        <div className='main-container'>
            <div className='sidebar'>
                <input type='submit' onClick={goToMain} value='BackToMain' />
                <img src="https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-09-22-at-11.06.22-2.png" alt="Logo" />
                {[1, 2, 3, 4, 5].map(tableNumber => (
                    <button key={tableNumber} onClick={() => handleTableClick(tableNumber)}>Table {tableNumber}</button>
                ))}
            </div>

            <div className="content">
                <div className="order__slidebar">
                    <h2>Orders for Table {selectedTable}</h2>
                    {filteredOrders.map((order) => (
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
                            <p>Status: {selectedOrder.status}</p>
                            <h3>Items:</h3>
                            <ul>
                                {selectedOrder.items ? (
                                    selectedOrder.items.map((item, index) => (
                                        <li key={index}>{item.category_item_name} - Quantity: {item.quantity}</li>
                                    ))
                                ) : (
                                    <li>No items available.</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Order;
