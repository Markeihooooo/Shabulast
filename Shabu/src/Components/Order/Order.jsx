import React, { useState, useEffect } from "react";
import './Order.css';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
    const [orders, setOrders] = useState([]); // เก็บรายการคำสั่งซื้อ
    const [loading, setLoading] = useState(false); // สถานะการโหลดข้อมูล
    const navigate = useNavigate(); // สำหรับการนำทางไปหน้าหลัก

    // ฟังก์ชันดึงข้อมูลคำสั่งซื้อจาก API
    const fetchOrderData = async () => {
        setLoading(true); // เริ่มโหลด
        try {
            const response = await fetch(`http://localhost:3001/order-details/pending-orders`);
            if (!response.ok) {
                throw new Error("Failed to fetch data from API");
            }
            const data = await response.json();
            console.log('Received data:', data); // ตรวจสอบข้อมูลที่ได้รับ
            setOrders(data); // ตั้งค่า orders ด้วยข้อมูลที่ได้รับจาก API
        } catch (error) {
            console.error("Error fetching order data:", error); // แสดงข้อผิดพลาดหากไม่สามารถดึงข้อมูลได้
        }
        setLoading(false); // หยุดการโหลด
    };

    // ดึงข้อมูลคำสั่งซื้อเมื่อ component โหลดครั้งแรก
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
                        <p>กำลังโหลด...</p> // แสดงข้อความขณะโหลด
                    ) : orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={`${order.order_id}-${order.order_item_id}`} className="order__item">
                                <p><strong>โต๊ะ:</strong> {order.table_name}</p>
                                <p><strong>รหัสคำสั่งซื้อ:</strong> {order.order_id}</p>
                                <p><strong>เวลาสั่งซื้อ:</strong> {new Date(order.order_create_at).toLocaleString()}</p>
                                <p><strong>สถานะ:</strong> {order.status}</p>
                                <p><strong>รายการ:</strong>
                                    {order.category_item_name} ({order.quantity})
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>ไม่มีคำสั่งซื้อ</p> // หากไม่มีคำสั่งซื้อ
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
