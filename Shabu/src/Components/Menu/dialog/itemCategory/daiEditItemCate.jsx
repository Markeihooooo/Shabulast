import React, { useState } from 'react';

const UpdateCategoryItemModal = () => {
    const [categoryItemName, setCategoryItemName] = useState('');
    const [categoryItemBalance, setCategoryItemBalance] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [categoryItemId, setCategoryItemId] = useState('1'); // ตัวอย่างการกำหนด category_item_id
    const [modalOpen, setModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // ฟังก์ชันเปิดและปิด Modal
    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    // ฟังก์ชันส่งข้อมูลไปยัง API
    const handleSubmit = async (event) => {
        event.preventDefault();

        // ตรวจสอบข้อมูลที่กรอก
        if (!categoryItemName || categoryItemBalance === '' || !imageUrl) {
            setErrorMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        const token = 'your-jwt-token-here'; // ใส่ token ที่ได้จากการล็อกอิน

        try {
            const response = await fetch(`/update/${categoryItemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    category_item_name: categoryItemName,
                    category_item_balance: categoryItemBalance,
                    image_url: imageUrl,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('อัพเดทไอเท็มหมวดหมู่สำเร็จ');
                setErrorMessage('');
                // รีเซ็ตฟอร์ม
                setCategoryItemName('');
                setCategoryItemBalance('');
                setImageUrl('');
                setModalOpen(false);
            } else {
                setErrorMessage(data.error || 'เกิดข้อผิดพลาด');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
            setSuccessMessage('');
        }
    };

    return (
        <div>
            <button onClick={toggleModal}>อัปเดตไอเท็มหมวดหมู่</button>

            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={toggleModal}>&times;</span>
                        <h2>อัปเดตข้อมูลไอเท็มหมวดหมู่</h2>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="category_item_name">ชื่อไอเท็มหมวดหมู่:</label>
                            <input
                                type="text"
                                id="category_item_name"
                                value={categoryItemName}
                                onChange={(e) => setCategoryItemName(e.target.value)}
                            />
                            <br />

                            <label htmlFor="category_item_balance">จำนวน:</label>
                            <input
                                type="number"
                                id="category_item_balance"
                                value={categoryItemBalance}
                                onChange={(e) => setCategoryItemBalance(e.target.value)}
                            />
                            <br />

                            <label htmlFor="image_url">ลิงก์ภาพ:</label>
                            <input
                                type="url"
                                id="image_url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                            <br />

                            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
                            
                            <button type="submit">อัปเดต</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateCategoryItemModal;
