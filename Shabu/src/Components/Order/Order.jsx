import React, { useState, useEffect } from "react";
import './Order.css';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);  // State to store the selected order
    const [selectedTable, setSelectedTable] = useState(null);   // State to store the selected table
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrderData(); // โหลดคำสั่งซื้อทั้งหมดเมื่อหน้าแรกโหลด
    }, []);
    
    // อัปเดตฟังก์ชัน fetchOrderData หลังจากกรองคำสั่งซื้อแล้ว
    const fetchOrderData = async (tableName = null) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/order-details/pending-orders`);
            if (!response.ok) {
                throw new Error("Failed to fetch data from API");
            }
            const data = await response.json();
    
            console.log("Fetched order data:", data); // ตรวจสอบข้อมูลที่ได้รับจาก API
    
            // การจัดกลุ่มคำสั่งซื้อ
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
    
            let filteredOrders = Object.values(groupedOrders).filter(order => order.order_status !== "Completed" && order.order_status !== "Canceled");
    
            // ถ้ามีการเลือกโต๊ะ ให้กรองคำสั่งซื้อที่ตรงกับ table_name
            if (tableName) {
                filteredOrders = filteredOrders.filter(order => order.table_name === tableName);
            }
    
            console.log("Filtered orders:", filteredOrders); // ตรวจสอบคำสั่งซื้อหลังจากกรอง
    
            setOrders(filteredOrders);
    
            // ถ้ามีคำสั่งซื้ออย่างน้อยหนึ่งคำสั่ง ให้เลือกคำสั่งซื้อแรก
            if (filteredOrders.length > 0) {
                setSelectedOrder(filteredOrders); // เลือกคำสั่งซื้อทั้งหมดในกรณีนี้
            } else {
                setSelectedOrder([]); // ถ้าไม่มีคำสั่งซื้อในโต๊ะที่เลือก ให้เซต selectedOrder เป็นอาเรย์ว่าง
            }
    
            console.log("Selected Order after fetch:", selectedOrder); // ตรวจสอบค่า selectedOrder หลังจากอัปเดต
        } catch (error) {
            console.error("Error fetching order data:", error);
        }
        setLoading(false);
    };

    // ฟังก์ชันเพื่ออัพเดทสถานะคำสั่งซื้อ
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
                fetchOrderData(selectedTable); // Reload data after status change
            } else {
                throw new Error("Failed to update order status");
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    // ฟังก์ชันเพื่อยกเลิกคำสั่งซื้อ
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
                fetchOrderData(selectedTable); // Reload data after canceling order
            } else {
                throw new Error("Failed to cancel order");
            }
        } catch (error) {
            console.error("Error canceling order:", error);
        }
    };

    // ฟังก์ชันจัดการการคลิกที่คำสั่งซื้อ
    const handleOrderClick = (order) => {
        // ถ้าคำสั่งซื้อนั้นถูกเลือกอยู่แล้ว
        if (selectedOrder && selectedOrder.order_id === order.order_id) {
            // คลิกซ้ำจะยกเลิกการเลือก
            setSelectedOrder(null);
        } else {
            // ถ้าไม่, ให้เลือกคำสั่งซื้อนั้น
            setSelectedOrder(order);
        }
    };

    // ฟังก์ชันจัดการการคลิกที่โต๊ะ
    const handleTableClick = (tableName) => {
        setSelectedTable(tableName); // Set the selected table
        console.log(`Fetching orders for table: ${tableName}`);  // Debug: ตรวจสอบว่าเลือกโต๊ะไหน
        fetchOrderData(tableName); // Fetch orders for the selected table
    };

    // เรียกฟังก์ชันโหลดคำสั่งซื้อทั้งหมดในครั้งแรก
    useEffect(() => {
        fetchOrderData(); // โหลดคำสั่งซื้อทั้งหมดเมื่อหน้าแรกโหลด
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
                    {orders.length === 0 ? ( // ตรวจสอบว่าไม่มีคำสั่งซื้อ
                        <p>ไม่มีคำสั่งซื้อ</p>
                    ) : (
                        orders
                            .filter(order => order.order_status !== 'Completed') // กรองคำสั่งซื้อที่ไม่ใช่ "Completed"
                            .map((order) => (
                                <div
                                    key={order.order_id}
                                    className="order__item"
                                    onClick={() => handleOrderClick(order)} // เรียกฟังก์ชันเมื่อคลิก
                                >
                                    Order #{order.order_id}
                                </div>
                            ))
                    )}
                </div>

                <div className="order__mainbar">
                    {loading ? (
                        <p>กำลังโหลด...</p>
                    ) : selectedOrder && Array.isArray(selectedOrder) && selectedOrder.length > 0 ? (  // ตรวจสอบว่า selectedOrder เป็นอาเรย์และไม่ว่าง
                        selectedOrder.map((order) => (
                            <div className="order__item" key={order.order_id}>
                                <p><strong>โต๊ะ:</strong> {order.table_name}</p>
                                <p><strong>รหัสคำสั่งซื้อ:</strong> {order.order_id}</p>
                                <p><strong>เวลาสั่งซื้อ:</strong> {new Date(order.order_create_at).toLocaleString()}</p>
                                <p><strong>สถานะ:</strong> {order.order_status}</p>
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
                                <button onClick={() => cancelOrder(order.order_id)} className="cancel-order-button">
                                    ยกเลิกคำสั่งซื้อ
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>ไม่มีคำสั่งซื้อที่เลือก</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
