// import React, { useState, useEffect } from 'react';
// import QRCode from 'react-qr-code';
// import { createTable, updateTable } from '../ReceiveCustomer/TableCustomer.js'; // นำเข้าฟังก์ชัน

// const ReceiveCustomer = () => {
//   const [table_number, setTableNumber] = useState('');
//   const [customer_count, setCustomerCount] = useState('');
//   const [qrCodeUrl, setQrCodeUrl] = useState('');
//   const [error, setError] = useState('');
//   const [tables, setTables] = useState([]); // เก็บข้อมูลโต๊ะที่ได้จากฐานข้อมูล

//   // ดึงข้อมูลโต๊ะจากฐานข้อมูล
//   useEffect(() => {
//     const fetchTables = async () => {
//       try {
//         const response = await fetch('http://localhost:3001/tablecustomer/get');
//         const data = await response.json();
//         setTables(data); // เก็บข้อมูลโต๊ะจากฐานข้อมูล
//       } catch (error) {
//         console.error('Error fetching table data:', error);
//       }
//     };

//     fetchTables();
//   }, []);

//   const handleGenerateQRCode = async () => {
//     if (!table_number || !customer_count || customer_count <= 0) {
//       setError('กรุณาเลือกโต๊ะและกรอกจำนวนลูกค้าที่ถูกต้อง');
//       return;
//     }
//     setError('');

//     const url = `/Customer?table=${table_number}&count=${customer_count}&token=${generateToken(table_number, customer_count)}`;
//     setQrCodeUrl(url);
//   };

//   const generateToken = (table, count) => {
//     return btoa(`${table}-${count}-${Date.now()}`);
//   };

//   const handleCreateOrUpdateTable = async (e) => {
//     e.preventDefault();

//     if (table_number === '' || customer_count === '') {
//       setError('กรุณากรอกข้อมูลให้ครบ');
//       return;
//     }

//     // ตรวจสอบว่าโต๊ะมีอยู่ในฐานข้อมูลหรือยัง
//     const existingTable = tables.find(table => table.table_number === Number(table_number));
//     const token = generateToken(table_number, customer_count);
//     const status_table = true;
//     const tableNumber = Number(table_number);
//     const customerCount = Number(customer_count);

//     let result;
//     if (existingTable) {
//       // ถ้าโต๊ะมีอยู่แล้วให้ทำการอัปเดต
//       result = await updateTable(tableNumber, customerCount, status_table, token);
//     } else {
//       // ถ้าโต๊ะไม่มีในฐานข้อมูลให้สร้าง
//       result = await createTable(tableNumber, customerCount, status_table, token);
//     }

//     // แจ้งผลการทำงาน
//     if (result.success) {
//       alert(result.message);
//     } else {
//       alert(result.message);
//     }

//     // สร้าง QR code หลังจากการสร้างหรืออัปเดตโต๊ะ
//     handleGenerateQRCode();
//   };

//   return (
//     <div className="grid place-items-center min-h-screen">
//       <div className="container mx-auto max-w-md p-4 bg-gray-100 shadow-md">
//         <h1 className="text-lg font-bold mb-4">รับลูกค้า</h1>

//         {/* แสดงปุ่มโต๊ะ */}
//         <div className="mb-4">
//           <label className="block mb-2">เลือกโต๊ะ</label>
//           <div className="grid grid-cols-3 gap-4">
//             {[1, 2, 3, 4, 5].map((num) => {
//               const tableStatus = tables.some(table => table.table_number === num)
//                 ? 'bg-yellow-500' // โต๊ะมีข้อมูลแล้ว
//                 : 'bg-green-500'; // โต๊ะว่าง

//               return (
//                 <button
//                   key={num}
//                   className={`w-full py-2 rounded-md text-white ${tableStatus}`}
//                   onClick={() => setTableNumber(num)}
//                 >
//                   โต๊ะ {num}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* จำนวนลูกค้า */}
//         <div className="mb-4">
//           <label className="block mb-2">จำนวนลูกค้า</label>
//           <input
//             type="number"
//             className="w-full border rounded-md px-2 py-1"
//             value={customer_count}
//             onChange={(e) => setCustomerCount(e.target.value)}
//             min="1"
//           />
//         </div>

//         {/* ปุ่มสร้างหรือแก้ไขข้อมูล */}
//         <button
//           onClick={handleCreateOrUpdateTable}
//           className="bg-blue-500 text-white py-1 px-4 rounded-md"
//         >
//           {tables.some(table => table.table_number === Number(table_number)) ? 'แก้ไขข้อมูล' : 'สร้าง QR Code'}
//         </button>

//         {error && <p className="text-red-500 mt-2">{error}</p>}

//         {/* แสดง QR Code */}
//         {qrCodeUrl && (
//           <div className="mt-4">
//             <h3 className="font-bold mb-2">QR Code สำหรับลูกค้า:</h3>
//             <QRCode className="mx-auto" value={qrCodeUrl} />
//             <p className="mt-2">
//               <a href={qrCodeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
//                 เปิดลิงก์สำหรับลูกค้า
//               </a>
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReceiveCustomer;
import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { createTable, updateTable } from '../ReceiveCustomer/TableCustomer.js';

const ReceiveCustomer = () => {
  const [table_number, setTableNumber] = useState('');
  const [customer_count, setCustomerCount] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('http://localhost:3001/tablecustomer/get');
        const data = await response.json();
        setTables(data);
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };

    fetchTables();
  }, []);

  const handleGenerateQRCode = async () => {
    if (!table_number || !customer_count || customer_count <= 0) {
      setError('กรุณาเลือกโต๊ะและกรอกจำนวนลูกค้าที่ถูกต้อง');
      return;
    }
    setError('');

    const url = `/Customer?table=${table_number}&count=${customer_count}&token=${generateToken(table_number, customer_count)}`;
    setQrCodeUrl(url);
  };

  const generateToken = (table, count) => {
    return btoa(`${table}-${count}-${Date.now()}`);
  };

  const handleTableClick = (num) => {
    setTableNumber(num);
    const existingTable = tables.find(table => table.table_number === num);
    
    if (existingTable) {
      // ถ้าเป็นโต๊ะที่มีข้อมูลแล้ว
      setCustomerCount(existingTable.customer_count.toString());
      const url = `/Customer?table=${num}&count=${existingTable.customer_count}&token=${existingTable.token}`;
      setQrCodeUrl(url);
    } else {
      // ถ้าเป็นโต๊ะว่าง
      setCustomerCount('');
      setQrCodeUrl('');
    }
  };

  const handleCreateOrUpdateTable = async (e) => {
    e.preventDefault();

    if (table_number === '' || customer_count === '') {
      setError('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    const existingTable = tables.find(table => table.table_number === Number(table_number));
    const token = generateToken(table_number, customer_count);
    const status_table = true;
    const tableNumber = Number(table_number);
    const customerCount = Number(customer_count);

    let result;
    if (existingTable) {
      result = await updateTable(tableNumber, customerCount, status_table, token);
    } else {
      result = await createTable(tableNumber, customerCount, status_table, token);
    }

    if (result.success) {
      alert(result.message);
      // อัพเดทข้อมูลโต๊ะหลังจากสร้างหรือแก้ไข
      const response = await fetch('http://localhost:3001/tablecustomer/get');
      const data = await response.json();
      setTables(data);
    } else {
      alert(result.message);
    }

    handleGenerateQRCode();
  };

  return (
    <div className="grid place-items-center min-h-screen">
      <div className="container mx-auto max-w-md p-4 bg-gray-100 shadow-md">
        <h1 className="text-lg font-bold mb-4">รับลูกค้า</h1>

        <div className="mb-4">
          <label className="block mb-2">เลือกโต๊ะ</label>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((num) => {
              const tableStatus = tables.some(table => table.table_number === num)
                ? 'bg-yellow-500'
                : 'bg-green-500';

              return (
                <button
                  key={num}
                  className={`w-full py-2 rounded-md text-white ${tableStatus}`}
                  onClick={() => handleTableClick(num)}
                >
                  โต๊ะ {num}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">จำนวนลูกค้า</label>
          <input
            type="number"
            className="w-full border rounded-md px-2 py-1"
            value={customer_count}
            onChange={(e) => setCustomerCount(e.target.value)}
            min="1"
          />
        </div>

        <button
          onClick={handleCreateOrUpdateTable}
          className="bg-blue-500 text-white py-1 px-4 rounded-md"
        >
          {tables.some(table => table.table_number === Number(table_number)) ? 'แก้ไขข้อมูล' : 'สร้าง QR Code'}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {qrCodeUrl && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">QR Code สำหรับลูกค้า:</h3>
            <QRCode className="mx-auto" value={qrCodeUrl} />
            <p className="mt-2">
              <a href={qrCodeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                เปิดลิงก์สำหรับลูกค้า
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiveCustomer;