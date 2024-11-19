import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@radix-ui/react-dialog';
import { Button, TextField } from "@radix-ui/themes";
import { Text } from '@radix-ui/themes';

const CreateCategoryItemDialog = ({ open, onClose, categoryId, token, onItemCreated }) => {
    const [formData, setFormData] = useState({
        category_item_name: '',
        category_item_balance: '',
        image_url: null // แก้ไขให้เป็น null แทนการใช้ base64
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image_url: file // เก็บไฟล์โดยตรง
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formDataToSend = new FormData();
        formDataToSend.append('category_item_name', formData.category_item_name);
        formDataToSend.append('category_item_balance', formData.category_item_balance);

        // ตรวจสอบว่าเลือกไฟล์หรือไม่
        if (formData.image_url) {
            formDataToSend.append('image_url', formData.image_url); // ใช้ชื่อฟิลด์ image_url
        }

        try {
            const response = await fetch(`http://localhost:3001/itemCategory/create/${categoryId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend // ส่งข้อมูลแบบ FormData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'เกิดข้อผิดพลาดในการเพิ่มรายการ');
            }

            onItemCreated && onItemCreated(data.categoryItem);
            onClose();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogTitle>เพิ่มรายการอาหารใหม่</DialogTitle>

                {error && (
                    <div className="text-red-600 p-2 border border-red-500 rounded">
                        <strong>ข้อผิดพลาด:</strong> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid w-full gap-1.5">
                        <Text htmlFor="category_item_name">ชื่อรายการอาหาร</Text>
                        <input
                            id="category_item_name"
                            name="category_item_name"
                            value={formData.category_item_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="grid w-full gap-1.5">
                        <Text htmlFor="category_item_balance">จำนวนคงเหลือ</Text>
                        <input
                            id="category_item_balance"
                            name="category_item_balance"
                            type="number"
                            value={formData.category_item_balance}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="grid w-full gap-1.5">
                        <Text htmlFor="image_url">เลือกรูปภาพ</Text>
                        <input
                            id="image_url"
                            name="image_url"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                        />
                        {formData.image_url && (
                            <img src={URL.createObjectURL(formData.image_url)} alt="Preview" className="mt-2" width={100} />
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateCategoryItemDialog;

// import React, { useState } from 'react';

// const CreateCategoryItemDialog = ({ open, onClose, categoryId, token, onItemCreated }) => {
//     const [formData, setFormData] = useState({
//         category_item_name: '',
//         category_item_balance: '',
//         image_url: ''
//     });
//     const [imageFile, setImageFile] = useState(null);  // สร้าง state สำหรับไฟล์รูป
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];  // รับไฟล์ที่เลือก
//         setImageFile(file);  // เก็บไฟล์ใน state
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         const formDataToSend = new FormData();
//         formDataToSend.append('category_item_name', formData.category_item_name);
//         formDataToSend.append('category_item_balance', formData.category_item_balance);
//         formDataToSend.append('image', imageFile);  // เพิ่มไฟล์รูปภาพไปใน FormData

//         try {
//             const response = await fetch(`http://localhost:3001/itemCategory/create/${categoryId}`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: formDataToSend
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.error || 'เกิดข้อผิดพลาดในการเพิ่มรายการ');
//             }

//             onItemCreated && onItemCreated(data.categoryItem);
//             onClose();
//         } catch (error) {
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Dialog open={open} onOpenChange={onClose}>
//             <DialogContent className="sm:max-w-md">
//                 <DialogTitle>เพิ่มรายการอาหารใหม่</DialogTitle>

//                 {error && <div className="text-red-600">{error}</div>}

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="grid w-full gap-1.5">
//                         <Label htmlFor="category_item_name">ชื่อรายการอาหาร</Label>
//                         <Input
//                             id="category_item_name"
//                             name="category_item_name"
//                             value={formData.category_item_name}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>

//                     <div className="grid w-full gap-1.5">
//                         <Label htmlFor="category_item_balance">จำนวนคงเหลือ</Label>
//                         <Input
//                             id="category_item_balance"
//                             name="category_item_balance"
//                             type="number"
//                             value={formData.category_item_balance}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>

//                     <div className="grid w-full gap-1.5">
//                         <Label htmlFor="image">เลือกรูปภาพ</Label>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleFileChange}
//                             className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             disabled={loading}
//                         />
//                     </div>

//                     <div className="flex justify-end gap-2">
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={onClose}
//                             disabled={loading}
//                         >
//                             ยกเลิก
//                         </Button>
//                         <Button
//                             type="submit"
//                             disabled={loading}
//                         >
//                             {loading ? 'กำลังบันทึก...' : 'บันทึก'}
//                         </Button>
//                     </div>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default CreateCategoryItemDialog;

