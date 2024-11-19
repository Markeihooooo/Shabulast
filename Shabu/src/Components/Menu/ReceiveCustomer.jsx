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

  const handlePrintQRCode = () => {
    const qrCodeElement = document.getElementById('qrcode');
    if (!qrCodeElement) return;
    const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>พิมพ์ QR Code</title>
        <style>
          @page {
            size: 80mm 150mm; /* กำหนดขนาดใบเสร็จ (กว้าง x สูง) */
            margin: 10mm;
          }
          body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }
          .qrcode-container {
            text-align: center;
            margin: 20px 0;
            padding: 10px;
            
          }
          .receipt-info {
            margin-top: 10px;
            font-size: 14px;
          }
            .receipt-intro {
            margin-top: 10px;
            font-size: 28px;
          }
        </style>
      </head>
      <body>
        <div class="qrcode-container">
        <div class="receipt-intro">ลูกค้าโต๊ะ ${tableNumber} <br>จำนวน ${customerCount} คน</div>
        <div class="receipt-info">สแกนเพื่อสั่งอาหาร</div>
          ${qrCodeElement.outerHTML}
           <div class="receipt-info">ราคาต่อหัว 299 บาท</div>
           <div class="receipt-info">รวมเป็นเงินทั้งหมด ${customerCount * 299} บาท</div>
          <div class="receipt-info">ขอบคุณที่ใช้บริการ</div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
};
  

  return (
    <div className="grid place-items-center min-h-screen">
    <div className="container mx-auto max-w-md p-4 bg-gray-100 shadow-md">
      <h1 className="text-lg font-bold mb-4">รับลูกค้า</h1>
      <div className="mb-4">
        <label className="block mb-2">เลือกโต๊ะ</label>
        <select
          onChange={(e) => setTableNumber(e.target.value)}
          value={tableNumber}
          className="w-full border rounded-md px-2 py-1"
        >
          <option value="" disabled>-- เลือกโต๊ะ --</option>
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
          <QRCode id='qrcode' className='mx-auto' value={qrCodeUrl} />
          <p className="mt-2">
            <a href={qrCodeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              เปิดลิงก์สำหรับลูกค้า
            </a>
          </p>
          <button className="bg-green-500 text-white py-1 px-4 rounded-md mt-4"
          onClick={handlePrintQRCode}>พิมพ์ใบเสร็จ</button>  
        </div>
        
      )}
      
    </div>
    </div>
  );
};

export default ReceiveCustomer;
