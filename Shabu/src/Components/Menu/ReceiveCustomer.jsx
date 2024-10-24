import React from 'react'

const ReceiveCustomer = () => {
  const goToLogout = () => {
    window.location.href = '/Customer';
  };

  return (
  <>
  <div className='container'>

 <input type='text' placeholder='จำนวนลูกค้า' />
  <input type='submit' onClick={goToLogout} value='ตกลง' />


  </div>    
  </>
  )
}

export default ReceiveCustomer

// import React, { useState } from 'react';
// import QRCode from 'qrcode.react';

// const ReceiveCustomer = () => {
//   const [tableNumber, setTableNumber] = useState('');
//   const [customerCount, setCustomerCount] = useState(0);
//   const [qrCodeUrl, setQrCodeUrl] = useState('');

//   const handleGenerateQRCode = () => {
//     const url = `/CustomerPage?table=${tableNumber}&count=${customerCount}`;
//     setQrCodeUrl(url);
//   };

//   return (
//     <>
//       <div className='container'>
//         <select onChange={(e) => setTableNumber(e.target.value)} value={tableNumber}>
//           <option value=''>เลือกโต๊ะ</option>
//           <option value='1'>โต๊ะ 1</option>
//           <option value='2'>โต๊ะ 2</option>
//           <option value='3'>โต๊ะ 3</option>
//           <option value='4'>โต๊ะ 4</option>
//           <option value='5'>โต๊ะ 5</option>
//         </select>

//         <input
//           type='number'
//           placeholder='จำนวนลูกค้า'
//           value={customerCount}
//           onChange={(e) => setCustomerCount(e.target.value)}
//         />
//         <input type='submit' onClick={handleGenerateQRCode} value='สร้าง QR Code' />

//         {qrCodeUrl && (
//           <div>
//             <h3>QR Code สำหรับลูกค้า:</h3>
//             <QRCode value={window.location.origin + qrCodeUrl} />
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default ReceiveCustomer;
