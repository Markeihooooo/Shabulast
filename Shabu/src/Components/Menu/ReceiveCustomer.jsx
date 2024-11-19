
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReceiveCustomer = () => {
  const [tableNumber, setTableNumber] = useState('');
  const [customerCount, setCustomerCount] = useState(0);
  const navigate = useNavigate();

  const handleNavigateToCustomer = () => {
    navigate('/Customer', { state: { table: tableNumber, count: customerCount } });
  };

  return (
    <div className='container'>
      <select
        onChange={(e) => setTableNumber(e.target.value)}
        value={tableNumber}
        className='mx-auto w-auto text-center border border-gray-300 rounded-md px-2 py-1 mb-2 bg-indigo-500'
      >
        <option value=''>เลือกโต๊ะ</option>
        {[...Array(5)].map((_, i) => (
          <option key={i + 1} value={i + 1}>{`โต๊ะ ${i + 1}`}</option>
        ))}
      </select>
      
      <label>จำนวนลูกค้า</label>
      <input
        className='mx-auto w-auto text-center border border-gray-300 rounded-md px-2 py-1 bg-indigo-500 mb-2'
        type='number'
        value={customerCount}
        onChange={(e) => setCustomerCount(Number(e.target.value))}
      />
      <label>คน</label>
      
      <button className='mx-auto w-auto text-center border border-gray-300 rounded-md px-2 py-1 bg-indigo-500 mb-2'
       onClick={handleNavigateToCustomer}>ไปที่หน้า Customer</button>
    </div>
  );
};

export default ReceiveCustomer;
