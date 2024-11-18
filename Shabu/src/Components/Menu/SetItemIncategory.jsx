// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const SetItemIncategory = () => {
//     const [categories, setCategories] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState(null);
//     const [items, setItems] = useState([]);

//     // Fetch categories from API
//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const response = await axios.get('/api/get?page=1'); // Adjust API endpoint
//                 setCategories(response.data.data);
//             } catch (error) {
//                 console.error('Error fetching categories:', error);
//             }
//         };

//         fetchCategories();
//     }, []);

//     // Fetch items for selected category
//     useEffect(() => {
//         // if (selectedCategory) {
//         //     const fetchItems = async () => {
//         //         try {
//         //             const response = await axios.get(`/api/get/${selectedCategory}`);
//         //             setItems(response.data);
//         //         } catch (error) {
//         //             console.error('Error fetching items:', error);
//         //         }
//         //     };

//         //     fetchItems();
//         // }
//     }, [selectedCategory]);

//     return (
//         <div className="min-h-screen bg-gray-100 p-6">
//             {/* Header */}
//             <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
//                 Category Viewer
//             </h1>

//             {/* Category Buttons */}
//             <div className="mb-6">
//                 <h2 className="text-2xl font-semibold text-gray-700 mb-4">
//                     Categories
//                 </h2>
//                 <div className="flex flex-wrap gap-4">
//                     {categories.map(category => (
//                         <button
//                             key={category.category_id}
//                             onClick={() => setSelectedCategory(category.category_id)}
//                             className={`px-4 py-2 rounded-lg ${
//                                 selectedCategory === category.category_id
//                                     ? 'bg-blue-600 text-white'
//                                     : 'bg-blue-500 text-white hover:bg-blue-600'
//                             }`}
//                         >
//                             {category.category_name}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Items List */}
//             {selectedCategory && (
//                 <div className="mt-6">
//                     <h2 className="text-2xl font-semibold text-gray-700 mb-4">
//                         Items in Selected Category
//                     </h2>
//                     {items.length === 0 ? (
//                         <p className="text-gray-500">No items found for this category.</p>
//                     ) : (
//                         <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                             {items.map(item => (
//                                 <li
//                                     key={item.category_item_id}
//                                     className="p-4 bg-white rounded-lg shadow hover:shadow-lg"
//                                 >
//                                     <h3 className="text-xl font-bold text-gray-800">
//                                         {item.category_item_name}
//                                     </h3>
//                                     <p className="text-gray-600">
//                                         Balance: {item.category_item_balance}
//                                     </p>
//                                     {item.image_url && (
//                                         <img
//                                             src={item.image_url}
//                                             alt={item.category_item_name}
//                                             className="mt-2 rounded"
//                                         />
//                                     )}
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };
import React, { useState, useEffect } from 'react';
import { Button, Text } from "@radix-ui/themes";

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
          const response = await fetch(`http://localhost:3001/category/get/${selectedCategoryId}`);
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
  };

  // Handle back to categories list
  const handleBackToCategories = () => {
    setSelectedCategoryId(null);
    setItems([]);
  };

  return (
    <div className="bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
        รายการอาหาร
      </h1>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          เลือกหมวดหมู่
        </h2>
        <div className="flex flex-wrap gap-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.category_id}
              onClick={() => handleCategoryClick(category.category_id, category.category_name)}
              className={`px-4 py-2 rounded-lg ${selectedCategoryId === category.category_id
                ? 'bg-blue-600 text-white'
                : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
              {category.category_name}
            </button>
          ))}
        </div>
      </div>

      {selectedCategoryId && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            รายการอาหารในหมวดหมู่ {selectedCategoryName}
          </h2>
          {items.length === 0 ? (
            <p className="text-gray-500">ไม่มีข้อมูลรายการอาหารในหมวดหมู่นี้</p>  
          ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item) => (
              <li
                key={item.category_item_id}
                className="p-4 bg-white rounded-lg shadow hover:shadow-lg"
              >
                <h3 className="text-xl font-bold text-gray-800">
                  {item.category_item_name}
                </h3>
                <p className="text-gray-600">
                  Balance: {item.category_item_balance}
                </p>
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.category_item_name}
                    className="mt-2 rounded"
                  />
                )}
              </li>
            ))}
          </ul>
          )}
          <Button onClick={handleBackToCategories} className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            เลือกหมวดหมู่ใหม่
          </Button>
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
