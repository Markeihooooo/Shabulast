import React, { useState, useEffect, useCallback } from 'react';
import { Button, Section, Table, Text } from "@radix-ui/themes";
import { MdModeEdit, MdAdd } from "react-icons/md";
import axios from 'axios';
import { Loader2 } from "lucide-react";

import CreateCategoryDialog from './dialog/daiAddSetCategory';
import EditCategoryDialog from './dialog/daiEditSetCategory';

const ITEMS_PER_PAGE = 10;

const Setcategor = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await axios.get(`http://localhost:3001/category/get`, {
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE
        }
      });

      setCategories(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Dialog handlers
  const handleOpenCreateDialog = () => {
    setIsDialogOpen(true);
    setIsEditDialogOpen(false); // ปิด Edit Dialog เมื่อเปิด Create Dialog
  };

  const handleCloseCreateDialog = () => setIsDialogOpen(false);

  const handleOpenEditDialog = (category) => {
    setSelectedCategory(category); // ส่งข้อมูลหมวดหมู่ที่เลือก
    setIsEditDialogOpen(true); // เปิด dialog สำหรับแก้ไข
    setIsDialogOpen(false); // ปิด Create Dialog
  };

  const handleCloseEditDialog = () => {
    setSelectedCategory(null); // รีเซ็ตข้อมูลหมวดหมู่
    setIsEditDialogOpen(false); // ปิด dialog
  };

  const handleCreateSuccess = () => {
    fetchCategories();
    handleCloseCreateDialog();
  };

  const handleEditSuccess = () => {
    fetchCategories();
    handleCloseEditDialog();
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 rounded-lg">
      {/* Header */}
      <Section className="mb-6 p-6 bg-gradient-to-r from-rose-100 to-red-100 rounded-xl shadow-sm">
        <Text className="text-red-900 text-center font-bold text-3xl">
          หมวดหมู่อาหาร
        </Text>
      </Section>

      {/* Main Content */}
      <Section className="p-1 flex justify-center flex-col">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4 max-w-4xl mx-auto w-full">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden w-12/12">
          <Table.Root className="w-full text-center">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="bg-gray-50 p-3 font-medium text-gray-700 w-24">ลำดับ</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="bg-gray-50 p-3 font-medium text-gray-700">ชื่อหมวดหมู่อาหาร</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="bg-gray-50 p-3 font-medium text-gray-700 w-24">แก้ไข</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="bg-gray-50 p-3 font-medium text-gray-700 w-32">สถานะ</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={4} className="p-8 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      กำลังโหลดข้อมูล...
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : categories.length > 0 ? (
                categories.map((category, index) => (
                  <Table.Row key={category.category_id} className="hover:bg-gray-50 transition-colors duration-150">
                    <Table.Cell className="p-3 border-t border-gray-100">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </Table.Cell>
                    <Table.Cell className="p-3 border-t border-gray-100 text-left">
                      {category.category_name}
                    </Table.Cell>
                    <Table.Cell className="p-3 border-t border-gray-100">
                      <Button
                        className="text-gray-600 hover:text-orange-600 hover:bg-transparent transition-colors"
                        onClick={() => handleOpenEditDialog(category)}
                      >
                        <MdModeEdit size={20} />
                      </Button>
                    </Table.Cell>
                    <Table.Cell className="p-3 border-t border-gray-100">
                      <span className={`px-3 py-1 rounded-full text-sm ${category.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {category.is_active ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={4} className="p-8 text-center text-gray-500">
                    ไม่พบข้อมูลหมวดหมู่
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </div>

        {/* Add Category Button */}
        <div className="flex justify-start mb-4 max-w-4xl mx-auto w-full mt-4">
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2"
            onClick={handleOpenCreateDialog}
          >
            <MdAdd size={20} />
            เพิ่มหมวดหมู่อาหาร
          </Button>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="px-4 py-2 rounded-lg disabled:opacity-50"
            >
              ก่อนหน้า
            </Button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`w-10 h-10 rounded-lg ${currentPage === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  disabled={isLoading}
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="px-4 py-2 rounded-lg disabled:opacity-50"
            >
              ถัดไป
            </Button>
          </div>
        )}
      </Section>

      {/* Dialogs */}
      <CreateCategoryDialog
        isOpen={isDialogOpen}
        onClose={handleCloseCreateDialog}
        onSuccess={handleCreateSuccess}
      />

      {selectedCategory && (
        <EditCategoryDialog
          open={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          category={selectedCategory}
          onCategoryUpdated={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default Setcategor;
