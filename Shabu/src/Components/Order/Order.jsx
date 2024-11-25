import React, { useState, useEffect } from "react";
import './Order.css';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const navigate = useNavigate();

    // โหลดคำสั่งซื้อทั้งหมดหรือกรองตามโต๊ะ
    const fetchOrderData = async (tableName = null) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/order-details/pending-orders`);
            if (!response.ok) {
                throw new Error("Failed to fetch data from API");
            }
            const data = await response.json();
    
            // จัดกลุ่มคำสั่งซื้อ
            const groupedOrders = data.reduce((acc, order) => {
                if (!acc[order.order_id]) {
                    acc[order.order_id] = {
                        order_id: order.order_id,
                        table_name: order.table_name,
                        order_create_at: order.order_create_at,
                        order_status: order.order_status,
                        items: []
                    };
                }
                acc[order.order_id].items.push({
                    category_item_name: order.category_item_name,
                    quantity: order.quantity
                });
                return acc;
            }, {});
    
            let filteredOrders = Object.values(groupedOrders).filter(order => 
                order.order_status !== "Completed" && order.order_status !== "Canceled"
            );
    
            // กรองตามโต๊ะถ้ามีการเลือกโต๊ะ
            if (tableName) {
                filteredOrders = filteredOrders.filter(order => order.table_name === tableName);
            }
    
            setOrders(filteredOrders);
            setSelectedOrder(filteredOrders.length > 0 ? filteredOrders[0] : null); // เลือกคำสั่งซื้อแรกหรือ null
        } catch (error) {
            console.error("Error fetching order data:", error);
        }
        setLoading(false);
    };

    // อัปเดตสถานะคำสั่งซื้อ
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
                fetchOrderData(selectedTable); // โหลดข้อมูลใหม่
            } else {
                throw new Error("Failed to update order status");
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    // ยกเลิกคำสั่งซื้อ
    const cancelOrder = async (order_id) => {
        try {
            const response = await fetch(`http://localhost:3001/order-details/update-order-status/${order_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'Canceled',
                }),
            });

            if (response.ok) {
                fetchOrderData(selectedTable); // โหลดข้อมูลใหม่
            } else {
                throw new Error("Failed to cancel order");
            }
        } catch (error) {
            console.error("Error canceling order:", error);
        }
    };

    // เลือกคำสั่งซื้อ
    const handleOrderClick = (order) => {
        // ถ้าเลือกคำสั่งซื้อแล้ว จะไม่ทำการคลิกซ้ำอีก
        if (selectedOrder && selectedOrder.order_id === order.order_id) {
            return; // หยุดการทำงานถ้าคำสั่งซื้อที่เลือกอยู่แล้ว
        } else {
            setSelectedOrder(order); // เลือกคำสั่งซื้อใหม่
        }
    };
    

    // เลือกโต๊ะ
    const handleTableClick = (tableName) => {
        setSelectedTable(tableName);
        fetchOrderData(tableName);
    };
    
    // ฟังก์ชันตรวจสอบว่าเกิน 10 นาทีหรือยัง
    const isOrderOlderThan10Minutes = (order_create_at) => {
        const orderTime = new Date(order_create_at).getTime();
        const currentTime = Date.now();
        const timeDifference = currentTime - orderTime;
    
        return timeDifference > 10 * 60 * 1000; // 10 นาที = 10 * 60 * 1000 มิลลิวินาที
    };

    // ฟังก์ชันเลือกสีพื้นหลังตามเวลา
    const getOrderBackgroundColor = (order_create_at) => {
        return isOrderOlderThan10Minutes(order_create_at) ? 'yellow' : 'white';
    };

    useEffect(() => {
        fetchOrderData();
    }, []);

    return (
        <div className="order__main-container">
            <div className="order__sidebar">
                <button onClick={() => navigate('/')}>กลับสู่หน้าหลัก</button>
                <div className="order__icon-container">
                    <img src="https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-09-22-at-11.06.22-2.png" alt="Chef Icon" className="order__icon" />
                    <div className="order__table-buttons">
                        <button onClick={() => handleTableClick('1')}>Table 1</button>
                        <button onClick={() => handleTableClick('2')}>Table 2</button>
                        <button onClick={() => handleTableClick('3')}>Table 3</button>
                        <button onClick={() => handleTableClick('4')}>Table 4</button>
                        <button onClick={() => handleTableClick('5')}>Table 5</button>
                    </div>
                </div>
            </div>

            <div className="order__content">
                <div className="order__slidebar">
                    {orders.length === 0 ? (
                        <p>ไม่มีคำสั่งซื้อ</p>
                    ) : (
                        orders.map((order) => (
                            <div
                                key={order.order_id}
                                className={`order__item ${selectedOrder && selectedOrder.order_id === order.order_id ? 'selected' : ''}`}
                                onClick={() => handleOrderClick(order)}
                                style={{ backgroundColor: getOrderBackgroundColor(order.order_create_at) }} // เปลี่ยนสีพื้นหลัง
                            >
                                Order #{order.order_id}
                            </div>
                        ))
                    )}
                </div>

                <div className="order__mainbar">
                    {loading ? (
                        <p>กำลังโหลด...</p>
                    ) : selectedOrder ? (
                        <div className="order__item">
                            <p><strong>โต๊ะ:</strong> {selectedOrder.table_name}</p>
                            <p><strong>รหัสคำสั่งซื้อ:</strong> {selectedOrder.order_id}</p>
                            <p><strong>เวลาสั่งซื้อ:</strong> {new Date(selectedOrder.order_create_at).toLocaleString()}</p>
                            <p><strong>สถานะ:</strong> {selectedOrder.order_status}</p>
                            <p><strong>รายการ:</strong></p>
                            <ul>
                                {selectedOrder.items.map((item, index) => (
                                    <li key={index}>{item.category_item_name} ({item.quantity})</li>
                                ))}
                            </ul>
                            <button onClick={() => updateOrderStatus(selectedOrder.order_id)} className="update-status-button">
                                เปลี่ยนสถานะเป็น Completed
                            </button>
                            <button onClick={() => cancelOrder(selectedOrder.order_id)} className="cancel-order-button">
                                ยกเลิกคำสั่งซื้อ
                            </button>
                        </div>
                    ) : (
                        <p>ไม่มีคำสั่งซื้อที่เลือก</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
