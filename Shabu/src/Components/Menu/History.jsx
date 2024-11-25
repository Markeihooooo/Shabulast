
// import React, { useEffect, useState } from 'react';
// import { Button, Table } from "@radix-ui/themes";

// const History = () => {
//   const [tables, setTables] = useState([]);
//   const [filteredTables, setFilteredTables] = useState([]);
//   const [page, setPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10); // ตั้งค่าจำนวนรายการที่แสดงต่อหน้า
//   const [selectedMonth, setSelectedMonth] = useState('');
//   const [selectedYear, setSelectedYear] = useState('');

//   const getHistory = async () => {
//     try {
//       const response = await fetch('http://localhost:3001/history/get');
//       const data = await response.json();
//       setTables(data);
//       setFilteredTables(data);
//     } catch (error) {
//       console.error('Error fetching table data:', error);
//     }
//   };

//   const filterData = () => {
//     let filtered = [...tables];

//     if (selectedMonth) {
//       filtered = filtered.filter((table) => {
//         const tableDate = new Date(table.to_char);
//         return tableDate.getMonth() + 1 === parseInt(selectedMonth) && tableDate.getFullYear() === parseInt(selectedYear || new Date().getFullYear());
//       });
//     } else if (selectedYear) {
//       filtered = filtered.filter((table) => {
//         const tableDate = new Date(table.to_char);
//         return tableDate.getFullYear() === parseInt(selectedYear);
//       });
//     }

//     setFilteredTables(filtered);
//     setPage(1);
//   };

//   const calculateSum = () => {
//     const currentData = filteredTables.slice((page - 1) * itemsPerPage, page * itemsPerPage);
//     const totalPrice = currentData.reduce((sum, table) => sum + (table.customer_count * 299), 0);
//     const totalCustomerCount = currentData.reduce((sum, table) => sum + table.customer_count, 0);
//     return { totalPrice, totalCustomerCount };
//   };

//   const paginate = (pageNumber) => {
//     setPage(pageNumber);
//   };

//   useEffect(() => {
//     getHistory();
//   }, []);

//   const { totalPrice, totalCustomerCount } = calculateSum();

//   return (
//     <div className="container mx-auto p-6">
      
//       <h1 className="text-3xl font-semibold text-center mb-6">หน้าประวัติการสั่งอาหาร</h1>

//       {/* ตัวเลือกเลือกเดือนและปี */}
//       <div className="flex justify-center space-x-4 mb-6">
//         <select
//           onChange={(e) => setSelectedMonth(e.target.value)}
//           value={selectedMonth}
//           className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">เลือกเดือน</option>
//           {[...Array(12)].map((_, i) => (
//             <option key={i} value={i + 1}>
//               เดือน {i + 1}
//             </option>
//           ))}
//         </select>

//         <select
//           onChange={(e) => setSelectedYear(e.target.value)}
//           value={selectedYear}
//           className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">เลือกปี</option>
//           {['2023', '2024', '2025'].map((year) => (
//             <option key={year} value={year}>
//               ปี {year}
//             </option>
//           ))}
//         </select>

//         <Button
//           onClick={filterData}
//           className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
//         >
//           กรอง
//         </Button>
//       </div>

//       {/* ตัวเลือกจำนวนแถวที่แสดง */}
//       <div className="flex justify-end mb-4">
//         <select
//           onChange={(e) => {
//             setItemsPerPage(parseInt(e.target.value));
//             setPage(1); // รีเซ็ตไปหน้าแรกเมื่อเปลี่ยนจำนวนแถวที่แสดง
//           }}
//           value={itemsPerPage}
//           className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="10">10 แถว</option>
//           <option value="50">50 แถว</option>
//           <option value="100">100 แถว</option>
//         </select>
//       </div>

//       <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//         <Table.Root className="w-full text-center border border-gray-300">
//           <Table.Header className="bg-[#00337e] border-b border-gray-300">
//             <Table.Row>
//               <Table.ColumnHeaderCell style={{ color: '#ffffff', width: '10%' }} className="text-center border border-gray-300">
//                 ลําดับ
//               </Table.ColumnHeaderCell>
//               <Table.ColumnHeaderCell style={{ color: '#ffffff', width: '20%' }} className="text-center border border-gray-300">
//                 วันที่
//               </Table.ColumnHeaderCell>
//               <Table.ColumnHeaderCell style={{ color: '#ffffff', width: '5%' }} className="text-center border border-gray-300">
//                 จำนวนลูกค้า
//               </Table.ColumnHeaderCell>
//               <Table.ColumnHeaderCell style={{ color: '#ffffff', width: '10%' }} className="text-center border border-gray-300">
//                 ราคารวม
//               </Table.ColumnHeaderCell>
//             </Table.Row>
//           </Table.Header>
//           <Table.Body>
//             {filteredTables
//               .slice((page - 1) * itemsPerPage, page * itemsPerPage)
//               .map((table, index) => (
//                 <Table.Row key={index}>
//                   <Table.Cell className="border border-gray-300">{(page - 1) * itemsPerPage + index + 1}</Table.Cell>
//                   <Table.Cell className="border border-gray-300">{table.to_char}</Table.Cell>
//                   <Table.Cell className="border border-gray-300">{table.customer_count}</Table.Cell>
//                   <Table.Cell className="border border-gray-300">
//                     {new Intl.NumberFormat('th-TH', { style: 'decimal' }).format(table.customer_count * 299)}
//                   </Table.Cell>
//                 </Table.Row>
//               ))}
//           </Table.Body>
//         </Table.Root>
//       </div>

//       {/* แสดงผลรวม */}
//       <div className="flex justify-between mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
//         <p className="text-xl font-semibold text-gray-700">
//           ผลรวมราคารวม: <span className="text-green-600">{new Intl.NumberFormat('th-TH', { style: 'decimal' }).format(totalPrice)}</span>
//         </p>
//         <p className="text-xl font-semibold text-gray-700">
//           ผลรวมจำนวนลูกค้า: <span className="text-blue-600">{totalCustomerCount}</span>
//         </p>
//       </div>

//       {/* ปุ่มสำหรับแบ่งหน้า */}
//       <div className="flex justify-center mt-6 space-x-3">
//         {Array.from({ length: Math.ceil(filteredTables.length / itemsPerPage) }).map((_, index) => (
//           <Button
//             key={index}
//             onClick={() => paginate(index + 1)}
//             className={`px-4 py-2 rounded-lg border border-gray-300 ${page === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
//           >
//             {index + 1}
//           </Button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default History;


import React, { useEffect, useState } from 'react';
import { Button, Table } from "@radix-ui/themes";

const History = () => {
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const getHistory = async () => {
    try {
      const response = await fetch('http://localhost:3001/history/get');
      const data = await response.json();
      setTables(data);
      setFilteredTables(data);
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };

  const filterData = () => {
    let filtered = [...tables];

    if (selectedMonth) {
      filtered = filtered.filter((table) => {
        const tableDate = new Date(table.to_char);
        return tableDate.getMonth() + 1 === parseInt(selectedMonth) && tableDate.getFullYear() === parseInt(selectedYear || new Date().getFullYear());
      });
    } else if (selectedYear) {
      filtered = filtered.filter((table) => {
        const tableDate = new Date(table.to_char);
        return tableDate.getFullYear() === parseInt(selectedYear);
      });
    }

    setFilteredTables(filtered);
    setPage(1);
  };

  const calculateSum = () => {
    const currentData = filteredTables.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPrice = currentData.reduce((sum, table) => sum + (table.customer_count * 299), 0);
    const totalCustomerCount = currentData.reduce((sum, table) => sum + table.customer_count, 0);
    return { totalPrice, totalCustomerCount };
  };

  const paginate = (pageNumber) => {
    setPage(pageNumber);
  };

  useEffect(() => {
    getHistory();
  }, []);

  const { totalPrice, totalCustomerCount } = calculateSum();

  return (
    <div className="container mx-auto p-6">
      {/* ส่วนหัวและตัวกรองข้อมูลอยู่ด้านบนเสมอ */}
      <div className="sticky top-0 bg-white z-10 pb-4">
        <h1 className="text-3xl font-semibold text-center mb-6">หน้าประวัติการสั่งอาหาร</h1>

        <div className="flex justify-center space-x-4 mb-6">
          <select
            onChange={(e) => setSelectedMonth(e.target.value)}
            value={selectedMonth}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">เลือกเดือน</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                เดือน {i + 1}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => setSelectedYear(e.target.value)}
            value={selectedYear}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">เลือกปี</option>
            {['2023', '2024', '2025'].map((year) => (
              <option key={year} value={year}>
                ปี {year}
              </option>
            ))}
          </select>

          <Button
            onClick={filterData}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            กรอง
          </Button>
        </div>

        <div className="flex justify-end mb-4">
          <select
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setPage(1);
            }}
            value={itemsPerPage}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="10">10 แถว</option>
            <option value="50">50 แถว</option>
            <option value="100">100 แถว</option>
          </select>
        </div>
      </div>

      {/* ส่วนตารางที่มีการเลื่อน */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <div className="max-h-[400px] overflow-y-auto">
          <Table.Root className="w-full text-center border border-gray-300">
            <Table.Header className="sticky top-0 bg-[#00337e] border-b border-gray-300 h-10 items-center">
              <Table.Row>
                <Table.ColumnHeaderCell style={{ color: '#ffffff', width: '10%' }} className="text-center border border-gray-300">
                  ลําดับ
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={{ color: '#ffffff', width: '20%' }} className="text-center border border-gray-300">
                  วันที่
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={{ color: '#ffffff', width: '5%' }} className="text-center border border-gray-300">
                  จำนวนลูกค้า
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={{ color: '#ffffff', width: '10%' }} className="text-center border border-gray-300">
                  ราคารวม
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredTables
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map((table, index) => (
                  <Table.Row key={index}>
                    <Table.Cell className="border border-gray-300">{(page - 1) * itemsPerPage + index + 1}</Table.Cell>
                    <Table.Cell className="border border-gray-300">{table.to_char}</Table.Cell>
                    <Table.Cell className="border border-gray-300">{table.customer_count}</Table.Cell>
                    <Table.Cell className="border border-gray-300">
                      {new Intl.NumberFormat('th-TH', { style: 'decimal' }).format(table.customer_count * 299)}
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table.Root>
        </div>
      </div>

      {/* ส่วนแสดงผลรวมและปุ่มแบ่งหน้า */}
      <div className="sticky bottom-0 bg-white pt-4">
        <div className="flex justify-between p-4 bg-gray-100 rounded-lg shadow-md">
          <p className="text-xl font-semibold text-gray-700">
            ผลรวมราคารวม: <span className="text-green-600">{new Intl.NumberFormat('th-TH', { style: 'decimal' }).format(totalPrice)}</span>
          </p>
          <p className="text-xl font-semibold text-gray-700">
            ผลรวมจำนวนลูกค้า: <span className="text-blue-600">{totalCustomerCount}</span>
          </p>
        </div>

        <div className="flex justify-center mt-6 space-x-3">
          {Array.from({ length: Math.ceil(filteredTables.length / itemsPerPage) }).map((_, index) => (
            <Button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 rounded-lg border border-gray-300 ${page === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;