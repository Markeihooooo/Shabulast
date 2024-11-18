// import React, { useState } from 'react';
// import { QRCode } from 'react-qr-code';




// const ReceiveCustomer = () => {
//   const [tableNumber, setTableNumber] = useState('');
//   const [customerCount, setCustomerCount] = useState(0);
//   const [qrCodeUrl, setQrCodeUrl] = useState('');

//   const handleGenerateQRCode = () => {
//     const url = `/Customer?table=${tableNumber}&count=${customerCount}`;
//     setQrCodeUrl(url);
//   };

//   return (
//     <>
//       <div className='container'>
//         <select onChange={(e) => setTableNumber(e.target.value)} value={tableNumber}
//           className='mx-auto w-auto text-center border border-gray-300 rounded-md px-2 py-1 mb-2 bg-indigo-500
//           '>
//           <option value=''>เลือกโต๊ะ</option>
//           <option value='1'>โต๊ะ 1</option>
//           <option value='2'>โต๊ะ 2</option>
//           <option value='3'>โต๊ะ 3</option>
//           <option value='4'>โต๊ะ 4</option>
//           <option value='5'>โต๊ะ 5</option>
//         </select>
//         <label>จำนวนลูกค้า</label>
//         <input className='mx-auto w-auto text-center border border-gray-300 rounded-md px-2 py-1
//         bg-indigo-500 mb-2'
//           type='number'
          
//           value={customerCount}
//           onChange={(e) => setCustomerCount(e.target.value)}
//         />
//         <label>คน</label>
//         <input type='submit' onClick={handleGenerateQRCode} value='สร้าง QR Code' />

//         {qrCodeUrl && (
//           <div>
//             <h3>QR Code สำหรับลูกค้า:</h3>
//             <QRCode value={qrCodeUrl} />
//             <a href={qrCodeUrl}>สำหรับลูกค้า</a>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default ReceiveCustomer;
import React, { useState } from 'react';
import QRCode from 'react-qr-code';

const ReceiveCustomer = () => {
  const [tableNumber, setTableNumber] = useState('');
  const [customerCount, setCustomerCount] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');

  const handleGenerateQRCode = async () => {
    // Validation
    if (!tableNumber || !customerCount || customerCount <= 0) {
      setError('กรุณาเลือกโต๊ะและกรอกจำนวนลูกค้าที่ถูกต้อง');
      return;
    }
    setError('');

    // Generate URL with server token (simulate here)
    const url = `/Customer?table=${tableNumber}&count=${customerCount}&token=${generateToken(
      tableNumber,
      customerCount
    )}`;

    setQrCodeUrl(url);
  };

  const generateToken = (table, count) => {
    // Example token generator (replace with server logic)
    return btoa(`${table}-${count}-${Date.now()}`);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-lg font-bold mb-4">รับลูกค้า</h1>
      <div className="mb-4">
        <label className="block mb-2">เลือกโต๊ะ</label>
        <select
          onChange={(e) => setTableNumber(e.target.value)}
          value={tableNumber}
          className="w-full border rounded-md px-2 py-1"
        >
          <option value="">-- เลือกโต๊ะ --</option>
          <option value="1">โต๊ะ 1</option>
          <option value="2">โต๊ะ 2</option>
          <option value="3">โต๊ะ 3</option>
          <option value="4">โต๊ะ 4</option>
          <option value="5">โต๊ะ 5</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">จำนวนลูกค้า</label>
        <input
          type="number"
          className="w-full border rounded-md px-2 py-1"
          value={customerCount}
          onChange={(e) => setCustomerCount(e.target.value)}
          min="1"
        />
      </div>
      <button
        onClick={handleGenerateQRCode}
        className="bg-blue-500 text-white py-1 px-4 rounded-md"
      >
        สร้าง QR Code
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {qrCodeUrl && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">QR Code สำหรับลูกค้า:</h3>
          <QRCode value={qrCodeUrl} />
          <p className="mt-2">
            <a href={qrCodeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              เปิดลิงก์สำหรับลูกค้า
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ReceiveCustomer;
