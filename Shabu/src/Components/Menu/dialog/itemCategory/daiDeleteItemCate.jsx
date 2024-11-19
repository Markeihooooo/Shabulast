import React, { useState } from 'react';
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogClose } from "@radix-ui/react-dialog";
import { Button } from "@radix-ui/themes";
import axios from 'axios';

const DeleteItemDialog = ({
    item,
    onDeleteConfirm,
    onClose

}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setLoading(true);
        setError('');

        try {
            await axios.delete(`http://localhost:3001/itemCategory/delete/${item.category_item_id}`);
            onDeleteConfirm(item.category_item_id);
            onClose();
        } catch (error) {
            setError('เกิดข้อผิดพลาดในการลบรายการ');
            console.error('Error deleting item:', error);
            setLoading(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg z-50 w-[600px] h-[230px]">
                <DialogTitle className="text-xl font-bold mb-4" aria-labelledby="dialog-title">
                    ลบรายการ
                </DialogTitle>

                <p className="mb-6 text-black">
                    คุณแน่ใจว่าต้องการลบรายการ <br /> <span className='font-bold text-red-500'>{item.category_item_name}</span> หรือไม่?
                </p>

                {error && (
                    <div className="text-red-500 mb-4">{error}</div>
                )}

                <div className="flex justify-between ">
                    <Button
                        onClick={onClose}
                        className="flex m-3 px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors "
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex m-3 px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        {loading ? 'กำลังลบ...' : 'ยืนยัน'}
                    </Button>
                </div>
                <DialogClose >
                    <button
                        className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        ✕
                    </button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteItemDialog;