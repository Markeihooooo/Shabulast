import React, { useState, useEffect } from 'react';
import { Button } from "@radix-ui/themes";
import { Edit, Trash2, Plus } from 'lucide-react';
import { Section, Text } from "@radix-ui/themes";

import DeleteItemDialog from './dialog/itemCategory/daiDeleteItemCate';
import CreateCategoryItemDialog from './dialog/itemCategory/daiAddItemCate';
import EditItemCategoryDialog from './dialog/itemCategory/daiEditItemCate';

const SetItemIncategory = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [items, setItems] = useState([]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogAddOpen, setIsDialogCreateOpen] = useState(false);


  // Fetch categories with pagination
  useEffect(() => {
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
  }, [currentPage]);

  // Fetch items for a selected category
  useEffect(() => {
    if (selectedCategoryId) {
      const fetchItems = async () => {
        try {
          const response = await fetch(`http://localhost:3001/itemCategory/get/${selectedCategoryId}`);
          const data = await response.json();
          setItems(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      };
      fetchItems();
    }
  }, [selectedCategoryId]);

  // Handle category selection
  const handleCategoryClick = (categoryId, categoryName) => {
    if (selectedCategoryId === categoryId) {
      // รีเซ็ต state ถ้าหมวดหมู่เดิมถูกกด
      setSelectedCategoryId(null);
      setItems([]);
      setTimeout(() => {
        // ตั้งค่าใหม่หลังรีเซ็ตเพื่อบังคับ re-render
        setSelectedCategoryId(categoryId);
        setSelectedCategoryName(categoryName);
      }, 0); // ใช้ timeout เพื่อให้ React ทันจับการเปลี่ยนแปลง
    } else {
      // หากหมวดหมู่ใหม่ถูกกด
      setSelectedCategoryId(categoryId);
      setSelectedCategoryName(categoryName);
      setItems([]); // Clear items
    }
  };
  

  // Open delete dialog
  const openDeleteDialog = (item) => {
    setItemToDelete(item);  // Set item to be deleted
    setDeleteDialogOpen(true);  // Open the dialog
  };

  //open edit dialog
  const openEditDialog = (item) => {
    setItemToDelete(null); // รีเซ็ตค่าเดิมก่อน
    setTimeout(() => {
      setItemToDelete(item); // ตั้งค่ารายการใหม่
      setIsDialogOpen(true); // เปิด dialog
    }, 0); // ใช้ timeout เพื่อให้ state เปลี่ยนแปลงทันที
  };
  
  // Close delete dialog
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);  // Close the dialog
    setItemToDelete(null);  // Clear selected item
  };

  // Handle back to categories list
  const handleBackToCategories = () => {
    setSelectedCategoryId(null);
    setItems([]);  // Clear items
  };

  const handleItemDelete = async (itemId) => {
    try {
      await fetch(`http://localhost:3001/itemCategory/delete/${itemId}`, {
        method: 'DELETE',
      });

      setItems((prevItems) => prevItems.filter(item => item.category_item_id !== itemId));

      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  //-----------------------------------------------
  const handleCloseCreateDialog = () => setIsDialogCreateOpen(false);

  const handleCreateSuccess = () => {
    const fetchItems = async () => {
      if (selectedCategoryId) {
        try {
          const response = await fetch(`http://localhost:3001/itemCategory/get/${selectedCategoryId}`);
          const data = await response.json();
          setItems(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      }
    };

    fetchItems();
    handleCloseCreateDialog();
  };

  const handleOpenCreateDialog = () => {
    setIsDialogCreateOpen(true);
  };
  //---------------------------------------------------------
  const handleCloseEditDialog = () => setIsDialogOpen(false);

  const handleEditSuccess = () => {
    const fetchItems = async () => {
      if (selectedCategoryId) {
        try {
          const response = await fetch(`http://localhost:3001/itemCategory/get/${selectedCategoryId}`);
          const data = await response.json();
          setItems(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      }
    };
    fetchItems();
    handleCloseEditDialog();
  };

  return (
    <div className="p-6 ">
      <Section className="mb-6 p-6 bg-gradient-to-r from-rose-100 to-red-100 rounded-xl shadow-sm justify-center text-center items-center">
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
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : category.is_active
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-400 text-gray-700 hover:bg-gray-500'
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

          {Array.isArray(items) && items.length === 0 ? (
            <p className="text-gray-500 text-center">ไม่มีข้อมูลรายการอาหารในหมวดหมู่นี้</p>
          ) : (
            <div className="max-h-[600px] overflow-y-auto">
              <div className="grid grid-cols-3 gap-4 ">
                {Array.isArray(items) && items.map((item) => (
                  <div
                    key={item.category_item_id}
                    className="p-4 bg-white rounded-lg shadow hover:shadow-lg relative border-2 border-gray-200"
                  >
                    <div className="absolute top-2 right-2 flex gap-2 ">
                      <button className="text-blue-500 hover:text-blue-600 mr-3 hover:bg-transparent transform hover:scale-125 transition-transform duration-200"
                        onClick={() => openEditDialog(item)}>
                        <Edit size={26} />
                      </button>
                      <button className="text-red-500 hover:text-red-600 hover:bg-transparent transform hover:scale-125 transition-transform duration-200"
                        onClick={() => openDeleteDialog(item)} >
                        <Trash2 size={26} />
                      </button>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      ชื่อรายการ <br />{item.category_item_name}
                    </h3>
                    <p className={`px-3 py-1 rounded-full text-sm ${item.category_item_balance ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      สถานะ : {item.category_item_balance ? 'มีของ' : 'ไม่มีของ'}
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
              onClick={handleOpenCreateDialog}
            >
              <Plus size={20} />
              &nbsp; เพิ่มรายการอาหารในหมวดหมู่ : {selectedCategoryName}
            </Button>

            
              <Button
                onClick={handleBackToCategories}
                className="bg-green-400 text-black p-2 rounded hover:bg-green-600 hover:text-white transition-all duration-200"
              >
                🍥 เลือกดูหมวดหมู่เพิ่มเติม จากหน้าอื่น
              </Button>
            
          </div>
        </div>
      )}

      {!selectedCategoryId  && (
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

      {deleteDialogOpen && itemToDelete && (
        <DeleteItemDialog
          item={itemToDelete}
          onDeleteConfirm={handleItemDelete}
          onClose={closeDeleteDialog}
        />
      )}

      {/* Dialogs */}
      <CreateCategoryItemDialog
        isOpen={isDialogAddOpen}
        onClose={handleCloseCreateDialog}
        onSuccess={handleCreateSuccess}
        categoryId={selectedCategoryId} // ส่ง categoryId ไป
      />


      {/* Dialogs */}
      <EditItemCategoryDialog
        isOpen={isDialogOpen}
        onClose={handleCloseEditDialog}
        onSuccess={handleEditSuccess}
        categoryId={selectedCategoryId} // ส่ง categoryId ไป
        category_item_id={itemToDelete?.category_item_id}

      />

    </div>
  );
};

export default SetItemIncategory;
