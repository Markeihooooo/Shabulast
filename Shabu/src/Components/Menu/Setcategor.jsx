
import React, { useState, useEffect } from 'react';
import { Button, Section, Table, Text } from "@radix-ui/themes";
import { MdModeEdit } from "react-icons/md";

import  itemsInCategory  from './SetItemIncategory';


const Setcategor = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);  // เก็บหน้าปัจจุบัน
  const [totalPages, setTotalPages] = useState(0);   // เก็บจำนวนหน้าทั้งหมด
  const [totalItems, setTotalItems] = useState(0);   // เก็บจำนวนข้อมูลทั้งหมด

  
  // useEffect สำหรับดึงข้อมูลหมวดหมู่
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://localhost:3001/category/get?page=${currentPage}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCategories(data.data);
        setTotalPages(data.totalPages); // รับจำนวนหน้าจาก API
        setTotalItems(data.data.length); // รับจำนวนข้อมูลที่แสดงในหน้านั้น
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [currentPage]);  // ทำการรีเฟรชทุกครั้งที่เปลี่ยนหน้าปัจจุบัน

  const handlePageChange = (page) => {
    setCurrentPage(page);  // เปลี่ยนหน้า
  };

  return (
    <div className="p-4 rounded-lg w-full text-xl" >
      {/* header */}
      <Section className="mb-4 p-4 bg-rose-100 text-center rounded-2xl">
        <Text className="text-red-900 p-2 text-center font-bold text-3xl">
          หมวดหมู่อาหาร
        </Text>
      </Section>

      {/* body */}
      <Section className="p-1 flex justify-center flex-col">
        <Table.Root className="w-full max-w-4xl text-center mt-4 mx-auto">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell className="border border-gray-300 w-1/12 p-2 bg-gray-200">ลำดับ</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border border-gray-300 p-2 w-8/12 bg-gray-200">ชื่อหมวดหมู่อาหาร</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border border-gray-300 w-1/12 p-2 bg-gray-200">แก้ไข</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border border-gray-300 w-2/12 p-2 bg-gray-200">สถานะ</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <Table.Row className="hover:bg-gray-100 transition-all" key={category.category_id}>
                  <Table.RowHeaderCell className="border border-gray-300  p-2">{(currentPage - 1) * 10 + index + 1}</Table.RowHeaderCell>
                  <Table.Cell className="border border-gray-300 text-left pl-3 w-8/">{category.category_name}</Table.Cell>
                  <Table.Cell className="border border-gray-300 ">
                    <Button className="flex items-center justify-center text-black p-2 hover:bg-gray-100 hover:text-blue-500 text-center">
                      <MdModeEdit size={24} />
                    </Button>
                  </Table.Cell>
                  <Table.Cell className="border border-gray-300 p-2 ">
                    <span className={category.status ? 'text-green-500' : 'text-red-500'}>
                      {category.status ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={4}>ไม่มีข้อมูลหมวดหมู่</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
        {/* ปุ่มเพิ่มรายการอยู่ตรงกลาง */}
        <div className="flex justify-center m-5 w-1/2 mx-auto">
          <Button className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition-colors">เพิ่มรายการหมวดหมู่อาหาร</Button>
        </div>
        {/* ปุ่ม Pagination */}
        {(totalItems >= 10 || currentPage > 1) && (
          <div className="flex justify-center mt-4 p-2">
            <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className='w-28 hover:bg-gray-200'>
              &lt;&lt;
            </Button>
            <Text className="mx-4">{currentPage}</Text>
            <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className='w-28 hover:bg-gray-200'>
              &gt;&gt;
            </Button>
          </div>
        )}
      </Section>

      {/* footer */}
      <Section className="flex justify-end space-x-4 mt-6">
        <Button
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors w-24"
          onClick={() => navigate('/items-in-category')} // ใช้ navigate เพื่อเปลี่ยนหน้า
        >
          ต่อไป
        </Button>
      </Section>
    </div>

      );
};

      export default Setcategor;
