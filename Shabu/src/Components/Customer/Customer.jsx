import React, { useState, useEffect } from 'react';
import './Customer.css';

const CustomerPage = () => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [items, setItems] = useState([]);
  const [tablenumber, setTablenumber] = useState(null);
  const [countnumber, setCountnumber] = useState(null);
  const [uuid, setUuid] = useState('');
  const [token, setToken] = useState(null);
  // For Popup
  const [showPopup, setShowPopup] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://localhost:3001/category/get?page=${currentPage}`);
        const data = await response.json();
        if (data.data) {
          setCategories(data.data);
          setTotalPages(data.totalPages);
        } else {
          console.error('Invalid category data received');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [currentPage]);

  // Fetch items based on selected category
  useEffect(() => {
    if (!selectedCategoryId) {
      setItems([]); // หากไม่มีหมวดหมู่ที่เลือก รีเซ็ตรายการสินค้า
      return;
    }
  
    const fetchItems = async () => {
      setIsLoadingItems(true);
      setItems([]); // รีเซ็ตรายการสินค้าเพื่อแสดงสถานะที่ถูกต้องระหว่างการโหลด
      try {
        const response = await fetch(`http://localhost:3001/itemCategory/get/${selectedCategoryId}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          // กรองเฉพาะรายการที่มี category_item_balance เป็น true
          const filteredItems = data.filter(item => item.category_item_balance === true);
          setItems(filteredItems);
        } else {
          console.error('Invalid items data received');
          setItems([]); // หากไม่มีข้อมูล ให้ตั้งค่าเป็นอาร์เรย์ว่าง
        }
      } catch (error) {
        console.error('Error fetching items:', error);
        setItems([]); // หากเกิดข้อผิดพลาด ให้ตั้งค่าเป็นอาร์เรย์ว่าง
      } finally {
        setIsLoadingItems(false);
      }
    };
  
    fetchItems();
  }, [selectedCategoryId]);
  

  const handleCategoryClick = (categoryId, categoryName) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName);
    setItems([]);
  };

  // Get table number and count from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const table = searchParams.get('table');
    const count = searchParams.get('count');
    const token = searchParams.get('token');
    console.log('หมายเลขโต๊ะ:', table);
    console.log('จำนวนคน:', count);
    console.log('Token:', token);
    setTablenumber(table);
    setCountnumber(count);
    setToken(token);
  }, []);
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      const firstCategory = categories[0];
      setSelectedCategoryId(firstCategory.category_id);
      setSelectedCategoryName(firstCategory.category_name);
    }
  }, [categories]);
  

  const addItemToCart = async (categoryItemId, quantity, tableId) => {
    try {
      const response = await fetch('http://localhost:3001/Customer/createOrderWithItems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category_item_id: categoryItemId,
          quantity: quantity,
          table_id: tableId,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log('เพิ่มสินค้าในตะกร้าสำเร็จ:', result.message);
      } else {
        console.error('API error:', result.message);
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มสินค้า:', error);
    }
  };
  


  // Add item to cart and immediately call backend to update cart
  const addToCart = (item) => { 
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.category_item_id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.category_item_id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, id: item.category_item_id, quantity: 1 }];
      }
    });
  
    setIsCartOpen(true);
  
    // ส่งข้อมูลไปยัง API ทันที
    addItemToCart(tablenumber, item.category_item_id, 1); // ส่ง `tablenumber`, `category_item_id` และ `quantity`
  };

  // Update cart item quantity
  const updateItemQuantityInBackend = async (orderId, itemId, quantity) => {
    try {
      const response = await fetch('http://localhost:3001/Customer/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: orderId,
          category_item_id: itemId,
          quantity: quantity,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Quantity updated:', result.message);
      } else {
        console.error('API error:', result.message);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const getUuid = async (tablenumber) => {
    try {
      const response = await fetch(`http://localhost:3001/Customer/get/${tablenumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log('UUID:', result.table_id); // ใช้ result.table_id แทน
        setUuid(result.table_id); // เก็บ table_id ใน state uuid
      } else {
        console.error('API error:', result.error);
      }
    } catch (error) {
      console.error('Error getting UUID:', error);
    }
  };
  
  


  // Remove item from cart
  const removeItemFromBackend = async (orderId, itemId) => {
    try {
      const response = await fetch('http://localhost:3001/Customer/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: orderId,
          category_item_id: itemId,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Item removed:', result.message);
      } else {
        console.error('API error:', result.message);
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  // Update cart item quantity
  const updateQuantity = (itemId, delta) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity + delta }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0);
  
      const updatedItem = updatedCart.find((cartItem) => cartItem.id === itemId);
      if (updatedItem) {
        updateItemQuantityInBackend(tablenumber, itemId, updatedItem.quantity);
      } else if (delta < 0) {
        removeItemFromBackend(tablenumber, itemId);
      }
  
      return updatedCart;
    });
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    
  }, [cart]);

  useEffect(() => {
    getUuid(tablenumber);
  }, [tablenumber]);

  const handleCheckout = async () => {
    // ตรวจสอบและดึง UUID หากยังไม่มีค่า
    if (!uuid) {
      console.log('กำลังดึง UUID...');
      await getUuid(tablenumber);
    }
  
    const tableId = `${uuid}`; // ใช้ UUID ที่ได้จาก state
    const orderStatus = 'Pending'; // สถานะเริ่มต้น
    const cartItems = cart.map((item) => ({
      category_item_id: item.id,
      quantity: item.quantity,
    }));
  
    try {
      const response = await fetch('http://localhost:3001/Customer/createOrderWithItems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_id: tableId,
          status: orderStatus,
          items: cartItems,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log('ออร์เดอร์ถูกสร้างสำเร็จ:', result.order_id);
        setCart([]); // ล้างตะกร้าหลังจากทำการสั่งสำเร็จ
        setShowPopup(true);
      } else {
        console.error('API error:', result.message);
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการสั่งสินค้า:', error);
    }
  };
  

  // Close the popup and clear the cart
  const handleClosePopup = () => {
    setShowPopup(false);  // Close the popup
    setCart([]);  // Clear the cart after the order is placed
  };

  // Switch category pages
  const handleNextCategoryPage = () => {
    setSelectedCategoryId(null);
    setCurrentPage(prevPage => (prevPage < totalPages ? prevPage + 1 : 1));
  };

  return (
    <div>
      <div className="menu-container">
        <div className="category-sidebar">
          <div className="flex flex-col justify-center items-center space-x-4 p-4 bg-red-100">
            <img
              src="https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-09-22-at-11.06.22-2.png"
              alt="logo"
              className="w-20 h-20 object-contain"
            />
            <h2 className="text-xl font-extrabold text-red-700 tracking-wide">หมวดหมู่อาหาร</h2>
            <h3 className="text-s font-extrabold text-red-700 tracking-wide">โต๊ะที่: {tablenumber} </h3>
            <h3 className="text-s font-extrabold text-red-700 tracking-wide">จํานวนคน: {countnumber}</h3>
          </div>

          {categories.map((category) => (
            <button
              key={category.category_id}
              onClick={() => handleCategoryClick(category.category_id, category.category_name)}
              className={`px-6 py-3 mb-2 rounded-lg font-semibold text-sm transition-all duration-300 ease-in-out transform
                ${selectedCategoryId === category.category_id
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg'
                  : 'bg-red-400 text-white hover:bg-red-500 shadow-md'}`}
              disabled={!category.is_active}
            >
              {category.category_name}
            </button>
          ))}
          <button
            onClick={handleNextCategoryPage}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            ดูหมวดหมู่อื่น
          </button>
        </div>

        <div className="menu">
          <div>
            <div className="p-4 bg-red-100 flex justify-center items-center h-12">
              <h2 className="text-2xl font-bold">@ShabuShabu</h2>
            </div>
            <div className="p-4 bg-red-200 flex justify-center items-center h-2 mb-8">
              <h1>สินค้าหมวดหมู่ : {selectedCategoryName}</h1>
            </div>
          </div>
          {isLoadingItems ? (
            <div className="flex flex-col justify-center items-center h-[500px]">
              <p>กำลังโหลดสินค้า...</p>
            </div>
          ) : Array.isArray(items) && items.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-[500px]">
              <p>หมวดหมู่ {selectedCategoryName} ยังไม่มีรายการอาหาร</p>
              <p className="text-gray-500 text-center">กรุณาเลือกหมวดหมู่อื่น</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.category_item_id} className="p-4 bg-white rounded-lg shadow hover:shadow-lg relative">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.category_item_name}</h3>
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.category_item_name}
                      className="mt-2 rounded w-full h-40 object-contain"
                    />
                  )}
                  <button onClick={() => addToCart(item)} className="confirm-btn">
                    เพิ่มไปยังตะกร้า
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart */}
      <div className={`cart ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2 className="cart-title">ตะกร้าสินค้า</h2>
          <button onClick={() => setIsCartOpen(false)} className="close-btn">
            ปิด
          </button>
        </div>
        {cart.length === 0 ? (
          <p>ไม่มีสินค้าในตะกร้า</p>
        ) : (
          <div>
            {cart.map((item, index) => (
              <div key={index} className="cart-item relative">
                <button
                  onClick={() =>
                    setCart(prevCart => prevCart.filter(cartItem => cartItem.id !== item.id))
                  }
                  className="delete-btn absolute top-0 right-0"
                >
                  ลบ
                </button>
                <h3>{item.category_item_name}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <p>จำนวน: {item.quantity}</p>
                  <button onClick={() => updateQuantity(item.id, 1)} className="quantity-btn">
                    +
                  </button>
                </div>
              </div>
            ))}
            <div className="flex flex-col items-center mt-4">
              <button
                onClick={handleCheckout}
                className="checkout-btn"
                style={{ width: '80%' }}
              >
                สั่งอาหาร
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>สั่งอาหารสำเร็จแล้ว!</h3>
            <button onClick={handleClosePopup} className="popup-btn">
              ตกลง
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;