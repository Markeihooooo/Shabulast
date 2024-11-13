import React, { useState, useEffect } from "react";
import './Order.css';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // ฟังก์ชันดึงข้อมูลคำสั่งซื้อจาก API
    const fetchOrderData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/order-details/pending-orders`);
            if (!response.ok) {
                throw new Error("Failed to fetch data from API");
            }
            const data = await response.json();

            console.log(data); // ดูข้อมูลที่ได้รับจาก API

            // จัดกลุ่มรายการอาหารตาม order_id
            const groupedOrders = data.reduce((acc, order) => {
                // ตรวจสอบว่า order_id อยู่ในข้อมูลที่ได้รับแล้วหรือยัง
                if (!acc[order.order_id]) {
                    acc[order.order_id] = {
                        order_id: order.order_id,
                        table_name: order.table_name,
                        order_create_at: order.order_create_at,
                        order_status: order.order_status,  // เปลี่ยนเป็น `order_status` ตามข้อมูลจริง
                        items: []
                    };
                }
                acc[order.order_id].items.push({
                    category_item_name: order.category_item_name,
                    quantity: order.quantity
                });
                return acc;
            }, {});

            // กรองคำสั่งซื้อที่มีสถานะเป็น Completed ออก
            const filteredOrders = Object.values(groupedOrders).filter(order => order.order_status !== "Completed");

            // ตั้งค่า orders ด้วยข้อมูลที่กรองแล้ว
            setOrders(filteredOrders);
        } catch (error) {
            console.error("Error fetching order data:", error);
        }
        setLoading(false);
    };

    // ฟังก์ชันสำหรับเปลี่ยนสถานะคำสั่งซื้อจาก Pending เป็น Completed
    const updateOrderStatus = async (order_id) => {
        try {
            const response = await fetch(`http://localhost:3001/order-details/update-order-status/${order_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'Completed',
                }),
            });

            if (response.ok) {
                // หลังจากอัปเดตสถานะแล้ว ให้โหลดข้อมูลใหม่
                fetchOrderData();
            } else {
                throw new Error("Failed to update order status");
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    // ดึงข้อมูลคำสั่งซื้อเมื่อโหลด component ครั้งแรก
    useEffect(() => {
        fetchOrderData();
    }, []);

    return (
        <div className="order__main-container">
            <div className="order__sidebar">
                <button onClick={() => navigate('/')}>กลับสู่หน้าหลัก</button>
                <div className="order__icon-container">
                    <img src="https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-09-22-at-11.06.22-2.png" alt="Chef Icon" className="order__icon" />
                </div>
            </div>

            <div className="order__content">
                <div className="order__slidebar">
                    <h2>รายการสั่งซื้อทั้งหมด</h2>
                </div>

                <div className="order__mainbar">
                    {loading ? (
                        <p>กำลังโหลด...</p>
                    ) : orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order.order_id} className="order__item">
                                <p><strong>โต๊ะ:</strong> {order.table_name}</p>
                                <p><strong>รหัสคำสั่งซื้อ:</strong> {order.order_id}</p>
                                <p><strong>เวลาสั่งซื้อ:</strong> {new Date(order.order_create_at).toLocaleString()}</p>
                                <p><strong>สถานะ:</strong> {order.order_status}</p> {/* ใช้ order_status แทน order.status */}
                                <p><strong>รายการ:</strong></p> 
                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={index}>{item.category_item_name} ({item.quantity})</li>
                                    ))}
                                </ul>

                                {/* ปุ่มเปลี่ยนสถานะ */}
                                <button onClick={() => updateOrderStatus(order.order_id)} className="update-status-button">
                                    เปลี่ยนสถานะเป็น Completed
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>ไม่มีคำสั่งซื้อ</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
