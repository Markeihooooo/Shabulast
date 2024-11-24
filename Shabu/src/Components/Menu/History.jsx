
// import React, { useEffect, useState } from 'react';
// import { Button, Table } from "@radix-ui/themes";

// const History = () => {
//   const [tables, setTables] = useState([]);
//   const [filteredTables, setFilteredTables] = useState([]); // tables ที่กรองแล้ว
//   const [page, setPage] = useState(1); // หน้าที่แสดงข้อมูล
//   const [itemsPerPage] = useState(10); // จำนวนรายการที่แสดงต่อหน้า
//   const [selectedMonth, setSelectedMonth] = useState(''); // เลือกเดือน
//   const [selectedYear, setSelectedYear] = useState(''); // เลือกปี

//   const getHistory = async () => {
//     try {
//       const response = await fetch('http://localhost:3001/history/get');
//       const data = await response.json();
//       setTables(data);
//       setFilteredTables(data); // เริ่มต้นแสดงข้อมูลทั้งหมด
//     } catch (error) {
//       console.error('Error fetching table data:', error);
//     }
//   };

//   // ฟังก์ชันกรองข้อมูลตามเดือนหรือปีที่เลือก
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

//     setFilteredTables(filtered); // อัปเดตข้อมูลที่กรองแล้ว
//     setPage(1); // เมื่อกรองข้อมูลใหม่ ต้องรีเซ็ตหน้าเป็นหน้าแรก
//   };

//   // ฟังก์ชันคำนวณผลรวม
//   const calculateSum = () => {
//     const currentData = filteredTables.slice((page - 1) * itemsPerPage, page * itemsPerPage);
//     const totalPrice = currentData.reduce((sum, table) => sum + (table.customer_count * 299), 0);
//     const totalCustomerCount = currentData.reduce((sum, table) => sum + table.customer_count, 0);
//     return { totalPrice, totalCustomerCount };
//   };

//   // ฟังก์ชันแบ่งหน้า
//   const paginate = (pageNumber) => {
//     setPage(pageNumber);
//   };

//   useEffect(() => {
//     getHistory();
//   }, []);

//   const { totalPrice, totalCustomerCount } = calculateSum();

//   return (
//     <div className="container">
//       <h1>หน้าประวัติการสั่งอาหาร</h1>

//       {/* ตัวเลือกเลือกเดือนและปี */}
//       <div className="filter-buttons">
//         <select onChange={(e) => setSelectedMonth(e.target.value)} value={selectedMonth}>
//           <option value="">เลือกเดือน</option>
//           {[...Array(12)].map((_, i) => (
//             <option key={i} value={i + 1}>
//               เดือน {i + 1}
//             </option>
//           ))}
//         </select>

//         <select onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear}>
//           <option value="">เลือกปี</option>
//           {['2023', '2024', '2025'].map((year) => (
//             <option key={year} value={year}>
//               ปี {year}
//             </option>
//           ))}
//         </select>

//         <Button onClick={filterData}>กรอง</Button>
//       </div>

//       <div className="overflow-x-auto bg-white shadow-md rounded">
//         <Table.Root className="w-full text-center border border-gray-300">
//           <Table.Header className="bg-[#00337e] border-b border-gray-300">
//             <Table.Row>
//               <Table.ColumnHeaderCell
//                 style={{ color: '#ffffff', width: '10%' }}
//                 className="text-center border border-gray-300"
//               >
//                 ลําดับ
//               </Table.ColumnHeaderCell>
//               <Table.ColumnHeaderCell
//                 style={{ color: '#ffffff', width: '20%' }}
//                 className="text-center border border-gray-300"
//               >
//                 วันที่
//               </Table.ColumnHeaderCell>
//               <Table.ColumnHeaderCell
//                 style={{ color: '#ffffff', width: '10%' }}
//                 className="text-center border border-gray-300"
//               >
//                 จำนวนลูกค้า
//               </Table.ColumnHeaderCell>
//               <Table.ColumnHeaderCell
//                 style={{ color: '#ffffff', width: '10%' }}
//                 className="text-center border border-gray-300"
//               >
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
//       <div className="totals">
//         <p>ผลรวมราคารวม: {new Intl.NumberFormat('th-TH', { style: 'decimal' }).format(totalPrice)}</p>
//         <p>ผลรวมจำนวนลูกค้า: {totalCustomerCount}</p>
//       </div>

//       {/* ปุ่มสำหรับแบ่งหน้า */}
//       <div className="pagination">
//         {Array.from({ length: Math.ceil(filteredTables.length / itemsPerPage) }).map((_, index) => (
//           <Button key={index} onClick={() => paginate(index + 1)}>
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
  const [filteredTables, setFilteredTables] = useState([]); // tables ที่กรองแล้ว
  const [page, setPage] = useState(1); // หน้าที่แสดงข้อมูล
  const [itemsPerPage] = useState(10); // จำนวนรายการที่แสดงต่อหน้า
  const [selectedMonth, setSelectedMonth] = useState(''); // เลือกเดือน
  const [selectedYear, setSelectedYear] = useState(''); // เลือกปี

  const getHistory = async () => {
    try {
      const response = await fetch('http://localhost:3001/history/get');
      const data = await response.json();
      setTables(data);
      setFilteredTables(data); // เริ่มต้นแสดงข้อมูลทั้งหมด
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };

  // ฟังก์ชันกรองข้อมูลตามเดือนหรือปีที่เลือก
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

    setFilteredTables(filtered); // อัปเดตข้อมูลที่กรองแล้ว
    setPage(1); // เมื่อกรองข้อมูลใหม่ ต้องรีเซ็ตหน้าเป็นหน้าแรก
  };

  // ฟังก์ชันคำนวณผลรวม
  const calculateSum = () => {
    const currentData = filteredTables.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPrice = currentData.reduce((sum, table) => sum + (table.customer_count * 299), 0);
    const totalCustomerCount = currentData.reduce((sum, table) => sum + table.customer_count, 0);
    return { totalPrice, totalCustomerCount };
  };

  // ฟังก์ชันแบ่งหน้า
  const paginate = (pageNumber) => {
    setPage(pageNumber);
  };

  useEffect(() => {
    getHistory();
  }, []);

  const { totalPrice, totalCustomerCount } = calculateSum();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">หน้าประวัติการสั่งอาหาร</h1>

      {/* ตัวเลือกเลือกเดือนและปี */}
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

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <Table.Root className="w-full text-center border border-gray-300">
          <Table.Header className="bg-[#00337e] border-b border-gray-300">
            <Table.Row>
              <Table.ColumnHeaderCell
                style={{ color: '#ffffff', width: '10%' }}
                className="text-center border border-gray-300"
              >
                ลําดับ
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell
                style={{ color: '#ffffff', width: '20%' }}
                className="text-center border border-gray-300"
              >
                วันที่
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell
                style={{ color: '#ffffff', width: '5%' }}
                className="text-center border border-gray-300"
              >
                จำนวนลูกค้า
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell
                style={{ color: '#ffffff', width: '10%' }}
                className="text-center border border-gray-300"
              >
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

      {/* แสดงผลรวม */}
      <div className="flex justify-between mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <p className="text-xl font-semibold text-gray-700">
          ผลรวมราคารวม: <span className="text-green-600">{new Intl.NumberFormat('th-TH', { style: 'decimal' }).format(totalPrice)}</span>
        </p>
        <p className="text-xl font-semibold text-gray-700">
          ผลรวมจำนวนลูกค้า: <span className="text-blue-600">{totalCustomerCount}</span>
        </p>
      </div>

      {/* ปุ่มสำหรับแบ่งหน้า */}
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
  );
};

export default History;
