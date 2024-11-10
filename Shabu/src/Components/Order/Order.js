import React, { useState, useEffect } from "react";
import './Order.css';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
    const [selectedTable, setSelectedTable] = useState(1);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchOrderData = async (tableId) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/orders?tableId=${tableId}`);
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching order data:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrderData(selectedTable);
    }, [selectedTable]);

    return (
        <div className="order__main-container">
            <div className="order__sidebar">
                <button onClick={() => navigate('/')}>กลับสู่หน้าหลัก</button>
                <div className="order__icon-container">
                    <img src="path/to/icon.png" alt="Chef Icon" className="order__icon" />
                </div>
                <ul className="order__table-list">
                    {[1, 2, 3, 4, 5].map((table) => (
                        <li
                            key={table}
                            onClick={() => setSelectedTable(table)}
                            className={`order__table-item ${selectedTable === table ? 'active' : ''}`}
                        >
                            โต๊ะ {table}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="order__content">
                <div className="order__slidebar">
                    <h2>รายการสั่งซื้อของโต๊ะ {selectedTable}</h2>
                </div>

                <div className="order__mainbar">
                    {loading ? (
                        <p>กำลังโหลด...</p>
                    ) : orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order.order_id} className="order__item">
                                <p><strong>รหัสคำสั่งซื้อ:</strong> {order.order_id}</p>
                                <p><strong>สถานะ:</strong> {order.status}</p>
                                <p><strong>รายการ:</strong> {order.items.map((item) => item.name).join(", ")}</p>
                            </div>
                        ))
                    ) : (
                        <p>ไม่มีคำสั่งซื้อสำหรับโต๊ะนี้</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
