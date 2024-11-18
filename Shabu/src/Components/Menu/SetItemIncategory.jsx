import React, { useState, useEffect } from 'react';
import { Button } from "@radix-ui/themes";
import { Edit, Trash2, Plus } from 'lucide-react';
import {  Section, Text } from "@radix-ui/themes";


const SetItemIncategory = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [items, setItems] = useState([]);

  // Fetch categories with pagination
  useEffect(() => {
    if (!selectedCategoryId) {
      const fetchCategories = async () => {
        try {
          const response = await fetch(`http://localhost:3001/category/get?page=${currentPage}`);
          const data = await response.json();
          setCategories(data.data);
          setTotalPages(data.totalPages);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      fetchCategories();
    }
  }, [currentPage, selectedCategoryId]);

  // Fetch items for a selected category
  useEffect(() => {
    if (selectedCategoryId) {
      const fetchItems = async () => {
        try {
          const response = await fetch(`http://localhost:3001/itemCategory/get/${selectedCategoryId}`);
          if (!response.ok) {
            console.error("Failed to fetch items:", response.statusText);
            return;
          }
          const data = await response.json();
          setItems(data);
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      };
      fetchItems();
    }
  }, [selectedCategoryId]);

  // Handle category selection
  const handleCategoryClick = (categoryId, categoryName) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName);
    setItems([]);
  };

  // Handle back to categories list
  const handleBackToCategories = () => {
    setSelectedCategoryId(null);
    setItems([]);
  };

  return (
    <div className="p-6 ">
      <Section className="mb-6 p-6 bg-gradient-to-r from-rose-100 to-red-100 rounded-xl shadow-sm">
        <Text className="text-red-900 text-center font-bold text-3xl">
          รายการอาหาร
        </Text>
      </Section>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          เลือกหมวดหมู่  &nbsp;&nbsp;
          <span className='text-gray-500 text-sm'>ในหน้า {currentPage} จาก {totalPages} หน้า</span>
        </h2>
        <div className="flex flex-wrap gap-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.category_id}
              onClick={() => handleCategoryClick(category.category_id, category.category_name)}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md transform
                ${selectedCategoryId === category.category_id
                  ? 'bg-red-600 text-white'
                  : category.is_active
                  ? 'bg-blue-500 text-white hover:bg-blue-600' // ปุ่มที่มี is_active เป็น true จะเป็นสีฟ้าอ่อน
                  : 'bg-gray-400 text-gray-700 hover:bg-gray-500' // ปุ่มอื่น ๆ จะเป็นสีเทา
                }`}
            >
              {category.category_name}
            </button>
          ))}
        </div>

      </div>

      {selectedCategoryId && (
        <div className="mt-6">
          <div className="justify-start flex flex-col mb-4">  
            <h2 className="text-2xl font-semibold text-gray-700">
              รายการอาหารในหมวดหมู่ {selectedCategoryName}
            </h2>

          </div>

          {items.length === 0 ? (
            <p className="text-gray-500 text-center">ไม่มีข้อมูลรายการอาหารในหมวดหมู่นี้</p>
          ) : (
            <div className="max-h-[600px] overflow-y-auto">
              <div className="grid grid-cols-3 gap-4">
                {items.map((item) => (
                  <div
                    key={item.category_item_id}
                    className="p-4 bg-white rounded-lg shadow hover:shadow-lg relative"
                  >
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button className="text-blue-500 hover:text-blue-600  hover:bg-transparent mr-3 ">
                        <Edit size={26} />
                      </button>
                      <button className="text-red-500 hover:text-red-600  hover:bg-transparent ">
                        <Trash2 size={26} />
                      </button>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      ชื่อรายการ <br />{item.category_item_name}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Balance: {item.category_item_balance}
                    </p>
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.category_item_name}
                        className="mt-2 rounded w-full h-40 object-contain"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              className="bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center py-2 px-5 text-lg w-max"
            >
              <Plus size={20} />
              &nbsp; เพิ่มรายการอาหารในหมวดหมู่ : {selectedCategoryName}
            </Button>
            <Button
              onClick={handleBackToCategories}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              เลือกดูหมวดหมู่เพิ่มเติม จากหน้าอื่น
            </Button>
          </div>
        </div>
      )}

      {!selectedCategoryId && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded"
          >
            &lt;&lt;
          </Button>
          <span className="mx-4 text-lg">{`${currentPage} จาก ${totalPages}`}</span>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded"
          >
            &gt;&gt;
          </Button>
        </div>
      )}
    </div>
  );
};

export default SetItemIncategory;