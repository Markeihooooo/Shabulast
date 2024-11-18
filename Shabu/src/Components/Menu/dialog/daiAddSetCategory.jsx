import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogClose } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";

const MAX_CATEGORY_LENGTH = 100;

const CreateCategoryDialog = ({ isOpen, onClose, onSuccess }) => {
    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const resetForm = useCallback(() => {
        setCategoryName('');
        setError('');
        setSuccess('');
        setLoading(false);
    }, []);

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


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // ตรวจสอบความถูกต้องของข้อมูล
        const validationError = validateCategoryName(categoryName);
        if (validationError) {
            setError(validationError);
            return;
        }
    
        setError('');
        setSuccess('');
        setLoading(true);
    
        try {
            // const token = localStorage.getItem('authToken');
            // localStorage.setItem('Authorization', token);
            
            const token = localStorage.getItem('token');
            // หากไม่พบ token ใน localStorage ให้แสดงข้อความแจ้งเตือน
            if (!token) {
                setError('กรุณาเข้าสู่ระบบอีกครั้ง');
                setLoading(false); // รีเซ็ตสถานะ loading
                console.error('Token not found in localStorage');
                console.log(localStorage.getItem('token'));
                return;
            }
    
            // เรียก API เพื่อสร้างหมวดหมู่
            const response = await axios.post(
                'http://localhost:3001/category/create',
                { category_name: categoryName.trim() },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            // หาก API ส่ง token ใหม่กลับมา ให้บันทึกลงใน localStorage
            if (response.data?.token) {
                localStorage.setItem('token', response.data.token);
            }
    
            setSuccess('สร้างหมวดหมู่สำเร็จ');
    
            // เรียก callback หากกำหนดไว้
            if (onSuccess) {
                onSuccess(response.data.category);
            }
    
            // ปิด Dialog หลังจากสำเร็จ
            setTimeout(() => {
                handleClose();
            }, 1500);
        } catch (err) {
            const errorMessage =
                err.response?.data?.error ||
                err.response?.data?.message ||
                'เกิดข้อผิดพลาดในการเชื่อมต่อ';
                console.log(err);
                console.log(localStorage.getItem('token'));

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg z-50 w-[600px] ">
                <DialogTitle className="text-xl font-bold mb-4" aria-labelledby="dialog-title">
                    เพิ่มหมวดหมู่ใหม่
                </DialogTitle>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            ชื่อหมวดหมู่
                        </label>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={handleCategoryNameChange}
                            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                                ${error ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="กรอกชื่อหมวดหมู่"
                            maxLength={MAX_CATEGORY_LENGTH}
                            required
                            autoFocus
                            disabled={loading}
                        />
                        <p className="text-sm text-gray-500">
                            {categoryName.length}/{MAX_CATEGORY_LENGTH} ตัวอักษร
                        </p>
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

export default CreateCategoryDialog;