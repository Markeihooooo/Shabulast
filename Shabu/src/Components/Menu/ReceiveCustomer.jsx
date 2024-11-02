// import React from 'react'

// const ReceiveCustomer = () => {
//   const goToLogout = () => {
//     window.location.href = '/Customer';
//   };

//   return (
//   <>
//   <div className='container'>

//  <input type='text' placeholder='จำนวนลูกค้า' />
//   <input type='submit' onClick={goToLogout} value='ตกลง' />


//   </div>    
//   </>
//   )
// }

// export default ReceiveCustomer

import React, { useState } from 'react';
import { QRCode } from 'react-qr-code';




const ReceiveCustomer = () => {
  const [tableNumber, setTableNumber] = useState('');
  const [customerCount, setCustomerCount] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handleGenerateQRCode = () => {
    const url = `/CustomerPage?table=${tableNumber}&count=${customerCount}`;
    setQrCodeUrl(url);
  };

  return (
    <>
      <div className='container'>
        <select onChange={(e) => setTableNumber(e.target.value)} value={tableNumber}
          className='mx-auto w-auto text-center border border-gray-300 rounded-md px-2 py-1 mb-2 bg-indigo-500
          '>
          <option value=''>เลือกโต๊ะ</option>
          <option value='1'>โต๊ะ 1</option>
          <option value='2'>โต๊ะ 2</option>
          <option value='3'>โต๊ะ 3</option>
          <option value='4'>โต๊ะ 4</option>
          <option value='5'>โต๊ะ 5</option>
        </select>
        <label>จำนวนลูกค้า</label>
        <input className='mx-auto w-auto text-center border border-gray-300 rounded-md px-2 py-1
        bg-indigo-500 mb-2'
          type='number'
          
          value={customerCount}
          onChange={(e) => setCustomerCount(e.target.value)}
        />
        <label>คน</label>
        <input type='submit' onClick={handleGenerateQRCode} value='สร้าง QR Code' />

        {qrCodeUrl && (
          <div>
            <h3>QR Code สำหรับลูกค้า:</h3>
            <QRCode value={window.location.origin + qrCodeUrl} />
          </div>
        )}
      </div>
    </>
  );
};

export default ReceiveCustomer;
