import React, { useState, useEffect } from 'react';
import './Customer.css';

const CustomerPage = () => {

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOrderSuccessPopup, setShowOrderSuccessPopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [items, setItems] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);



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
  }, [currentPage]); // Removed selectedCategoryId dependency
  

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
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName);
    // ไม่ต้องล้าง items ตรงนี้
  };
  
  

  useEffect(() => {
    console.log("Current Page:", currentPage);
    console.log("Selected Category ID:", selectedCategoryId);
  }, [currentPage, selectedCategoryId]);
  

  const updateCart = (item, delta) => {
    setCart(prevCart => {
      const itemInCart = prevCart.find(cartItem => cartItem.id === item.id);
      if (itemInCart) {
        const newQuantity = itemInCart.quantity + delta;
        return newQuantity > 0
          ? prevCart.map(cartItem =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: newQuantity }
              : cartItem
          )
          : prevCart.filter(cartItem => cartItem.id !== item.id);
      } else if (delta > 0) {
        return [...prevCart, { ...item, quantity: 1 }];
      }
      return prevCart;
    });
  };

  const addToCart = (item) => {
    updateCart(item, 1);
    setIsCartOpen(true);
  };

  const handleCheckout = () => {
    setShowOrderSuccessPopup(true);
    setIsCartOpen(false);
  };

  const handlePayment = () => {
    setShowPaymentPopup(true);
  };

  const handleCallStaff = () => {
    setPaymentRequest(true);
    setShowConfirmationPopup(true);
    setShowPaymentPopup(false);
  };

  const closeConfirmationPopup = () => {
    setShowConfirmationPopup(false);
  };

  /// ฟังก์ชันสำหรับการเปลี่ยนหน้า
  const handleNextCategoryPage = () => {
    setSelectedCategoryId(null); // Clear selected category
    setCurrentPage(prevPage => (prevPage < totalPages ? prevPage + 1 : 1));
  };
  

  return (
    <div>
      <div className="menu-container">
        <div className="category-sidebar">
          <div className="flex flex-col justify-center items-center space-x-4 p-4 bg-red-100">
            <img src="https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-09-22-at-11.06.22-2.png" alt="" className="w-20 h-20 object-contain" />
            <h2 className="text-xl font-extrabold text-red-700 tracking-wide">หมวดหมู่อาหาร</h2>
          </div>

          {categories.map((category) => (
            <button
              key={category.category_id}
              onClick={() => handleCategoryClick(category.category_id, category.category_name)}
              className={`px-6 py-3 mb-2 rounded-lg font-semibold text-sm transition-all duration-300 ease-in-out transform 
              ${selectedCategoryId === category.category_id
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg'  // ปุ่มที่เลือก
                  : 'bg-red-400 text-white hover:bg-red-500 shadow-md'}    // ปุ่มที่ไม่ได้เลือก
            hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
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
            <div className="p-4 bg-red-100  flex justify-center items-center h-12">
              <h2 className="text-2xl font-bold">@ShabuShabu</h2>
            </div>
            <div className="p-4 bg-red-200  flex justify-center items-center h-2 mb-8">
              <h1>สินค้าหมวดหมู่ : {selectedCategoryName}</h1>
            </div>
          </div>
          {Array.isArray(items) && items.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-[500px]">
              <p>หมวดหมู่ {selectedCategoryName} ยังไม่มีรายการอาหาร<br /></p>   
              <p className="text-gray-500 text-center">บอกว่าไม่มีรายการไปสั่งอย่างอื่น!!!!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.category_item_id}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-lg relative"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.category_item_name}
                  </h3>
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.category_item_name}
                      className="mt-2 rounded w-full h-40 object-contain"
                    />
                  )}
                  <button onClick={() => addToCart(item)} className="confirm-btn">เพิ่มไปยังตะกร้า</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart */}
      <div className={`cart ${isCartOpen ? 'open' : ''}`}>
        <button onClick={() => setIsCartOpen(false)} className="close-btn">ปิด</button>
        <h2 className="cart-title">ตะกร้าสินค้า</h2>
        {cart.length === 0 ? (
          <p>ไม่มีสินค้าในตะกร้า</p>
        ) : (
          <div>
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <h3>{item.category_item_name}</h3>
                <p>จำนวน: {item.quantity}</p>
                <button onClick={() => updateCart(item, -1)}>-</button>
                <button onClick={() => updateCart(item, 1)}>+</button>
              </div>
            ))}
            <button onClick={handleCheckout} className="checkout-btn">ชำระเงิน</button>
          </div>
        )}
      </div>

      {/* Order Success Popup */}
      {showOrderSuccessPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>สั่งอาหารสำเร็จ</h3>
            <button onClick={handlePayment} className="payment-btn">ชำระเงิน</button>
            <button onClick={() => setShowOrderSuccessPopup(false)} className="close-btn">ปิด</button>
          </div>
        </div>
      )}

      {/* Payment Popup */}
      {showPaymentPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>กรุณาชำระเงิน</h3>
            <button onClick={handleCallStaff} className="call-staff-btn">เรียกพนักงาน</button>
            <button onClick={() => setShowPaymentPopup(false)} className="close-btn">ปิด</button>
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {showConfirmationPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>กำลังเรียกพนักงาน...</h3>
            <button onClick={closeConfirmationPopup} className="close-btn">ปิด</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;
