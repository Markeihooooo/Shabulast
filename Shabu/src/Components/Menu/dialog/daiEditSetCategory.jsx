import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogClose } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";
import { Button, FormControlLabel, Checkbox, TextField } from '@mui/material';
const MAX_CATEGORY_LENGTH = 100;

const EditCategoryDialog = ({ open, onClose, category, onCategoryUpdated }) => {
    const [categoryName, setCategoryName] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const resetForm = useCallback(() => {
        setCategoryName('');
        setIsActive(false);
        setError('');
        setSuccess('');
        setLoading(false);
    }, []);

    const handleClose = useCallback(() => {
        resetForm();
        onClose();
    }, [onClose, resetForm]);

    useEffect(() => {
        if (category) {
            setCategoryName(category.category_name);
            setIsActive(category.is_active);
        }
    }, [category]);

    const handleSave = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            //const token = localStorage.getItem('token');
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `http://localhost:3001/category/update/${category.category_id}`,
                { category_name: categoryName, is_active: isActive.toString() },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess('อัปเดตหมวดหมู่สำเร็จ');
            onCategoryUpdated(response.data.category);
            //setTimeout(handleClose, 1500);
        } catch (error) {
            setError('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg z-50 w-[600px] ">
                <DialogTitle className="text-xl font-bold mb-4" aria-labelledby="dialog-title">
                    แก้ไขหมวดหมู่
                </DialogTitle>

                <form className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            ชื่อหมวดหมู่ใหม่ที่ต้องการ
                        </label>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
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

                    <FormControlLabel
                        control={<Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
                        label="สถานะใช้งาน"
                        className='text-sm font-medium text-gray-700'
                    />

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

export default EditCategoryDialog;
