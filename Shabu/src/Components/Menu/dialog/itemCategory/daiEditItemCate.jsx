import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogClose } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";

const MAX_CATEGORY_LENGTH = 100;

const EditItemCategoryDialog = ({ isOpen, onClose, onSuccess, categoryId, category_item_id }) => {
    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [balance, setBalance] = useState(0);
    const [imagePreview, setImagePreview] = useState(null);

    const resetForm = useCallback(() => {
        setCategoryName('');
        setError('');
        setSuccess('');
        setLoading(false);
        setSelectedFile(null);
        setBalance(0);
        setImagePreview(null);
    }, []);

    // แก้ไขส่วน useEffect เพื่อแสดงข้อมูลเดิม
    useEffect(() => {
        if (categoryId && category_item_id) {
            setLoading(true);
            axios.get(`http://localhost:3001/itemCategory/get/${categoryId}/${category_item_id}`)
                .then(response => {
                    const categoryItem = response.data;

                    // ตั้งค่าข้อมูลที่ได้จาก API
                    setCategoryName(categoryItem.category_item_name || '');
                    setBalance(categoryItem.category_item_balance ? 1 : 0);
                    if (categoryItem.image_url) {
                        setImagePreview(categoryItem.image_url);
                    }
                })
                .catch(error => {
                    setError('ไม่สามารถดึงข้อมูลได้');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [categoryId, category_item_id]);

    const handleClose = useCallback(() => {
        resetForm();
        onClose();
    }, [onClose, resetForm]);

    const validateCategoryName = (name) => {
        if (!name.trim()) {
            return 'กรุณากรอกชื่อหมวดหมู่';
        }
        if (name.trim().length > MAX_CATEGORY_LENGTH) {
            return `ชื่อหมวดหมู่ต้องไม่เกิน ${MAX_CATEGORY_LENGTH} ตัวอักษร`;
        }
        return '';
    };

    const handleCategoryNameChange = (e) => {
        const value = e.target.value;
        setCategoryName(value);
        if (error) setError('');
        if (success) setSuccess('');
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleBalanceChange = (e) => {
        setBalance(e.target.checked ? 1 : 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateCategoryName(categoryName);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('กรุณาเข้าสู่ระบบอีกครั้ง');
            }

            const formData = new FormData();
            formData.append('category_item_name', categoryName.trim());
            formData.append('category_id', categoryId);
            // แก้ไขการส่งค่า balance
            formData.append('category_item_balance', balance === 1);
            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            const response = await axios.patch(
                `http://localhost:3001/itemCategory/update/${category_item_id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data?.token) {
                localStorage.setItem('token', response.data.token);
            }

            setSuccess('แก้ไขหมวดหมู่สำเร็จ');
            if (onSuccess) {
                onSuccess(response.data.category);
            }

            setTimeout(() => {
                handleClose();
            }, 1500);
        } catch (err) {
            const errorMessage =
                err.response?.data?.error ||
                err.response?.data?.message ||
                (err.response ? 'เกิดข้อผิดพลาดในคำขอ' : 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg z-50 w-[600px]">
                <DialogTitle className="text-xl font-bold mb-4" aria-labelledby="dialog-title">
                    แก้ไขรายการอาหารในหมวดหมู่
                </DialogTitle>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            ชื่อรายการอาหาร
                        </label>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={handleCategoryNameChange}
                            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                                ${error ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="กรุณากรอกชื่อหมวดหมู่"
                            maxLength={MAX_CATEGORY_LENGTH}
                            required
                            autoFocus
                            disabled={loading}
                        />

                        <p className="text-sm text-gray-500">
                            {categoryName.length}/{MAX_CATEGORY_LENGTH} ตัวอักษร
                        </p>
                    </div>
                    <div>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={balance === 1}
                                onChange={handleBalanceChange}
                                disabled={loading}
                            />
                            <span>
                                รายการอาหาร {categoryName} สินค้า
                                <span className={balance === 1 ? 'text-green-600' : 'text-red-600'}>
                                    {balance === 1 ? 'พร้อมจำหน่าย' : 'ไม่พร้อมจำหน่าย'}
                                </span>
                            </span>
                        </label>

                    </div>
                    <div>
                        <label>เลือกรูปภาพสินค้าใหม่ : </label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ marginTop: "8px" }}
                        />
                        {imagePreview && (
                            <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className='w-auto h-44 object-cover'
                                />
                            </div>
                        )}
                    </div>
                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 p-2 rounded">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="text-sm text-green-500 bg-green-50 p-2 rounded">
                            {success}
                        </p>
                    )}

                    <div className="flex justify-between gap-2 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex m-3 px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors "
                            disabled={loading}
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex m-3 px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    กำลังบันทึก...
                                </span>
                            ) : (
                                'บันทึก'
                            )}
                        </button>
                    </div>
                </form>

                <DialogClose asChild>
                    <button
                        className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        onClick={handleClose}
                    >
                        ✕
                    </button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default EditItemCategoryDialog;