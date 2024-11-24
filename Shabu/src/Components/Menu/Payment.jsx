import React, { useState, useEffect } from 'react';

const Payment = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // ดึงข้อมูลโต๊ะทั้งหมดเมื่อคอมโพเนนต์โหลด
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

  // ฟังก์ชันในการสร้าง Token
  const generateToken = (table_number, customer_count) => {
    return btoa(`${table_number}-${customer_count}-${Date.now()}`);
  };

  // ฟังก์ชันในการจัดการเลือกโต๊ะ
  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setTotalPrice(table.customer_count * 299); // สมมติราคาต่อหัวคือ 299 บาท
  };

  // ฟังก์ชันยืนยันการชำระเงิน
  const handleConfirmPayment = async () => {
  if (!selectedTable) return;

  const token = generateToken(selectedTable.table_number, selectedTable.customer_count);

  try {
    const response = await fetch('http://localhost:3001/api/payment/confirm-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        table_number: selectedTable.table_number,
        customer_count: selectedTable.customer_count,
        token: token,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error:', data);
      return;
    }

    if (data.success) {
      alert('ยืนยันการชำระเงินสำเร็จ');
      // รีเฟรชข้อมูลโต๊ะ
      const refreshResponse = await fetch('http://localhost:3001/tablecustomer/get');
      const refreshedData = await refreshResponse.json();
      setTables(refreshedData);
      setSelectedTable(null);
      setTotalPrice(0);
    } else {
      alert(data.message || 'เกิดข้อผิดพลาดในการยืนยันการชำระเงิน');
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    alert('เกิดข้อผิดพลาดในการยืนยันการชำระเงิน');
  }
};

  // ฟังก์ชันพิมพ์ใบเสร็จ
  const handlePrintReceipt = () => {
    if (!selectedTable) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>ใบเสร็จการชำระเงิน</title>
            <style>
              @page { size: 80mm 150mm; margin: 5mm; }
              body { display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: Arial, sans-serif; }
              .receipt-container { text-align: center; margin: 10px 0; padding: 10px; }
              .receipt-info { margin-top: 5px; font-size: 12px; }
              .receipt-intro { margin-top: 5px; font-size: 18px; }
              img { width: 80px; height: 80px; }
            </style>
          </head>
          <body>
            <div class="receipt-container">
              <img src="https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-09-22-at-11.06.22-2.png" alt="Logo" />
              <div class="receipt-intro">
                ลูกค้าโต๊ะ ${selectedTable.table_number} <br>จำนวน ${selectedTable.customer_count} คน
              </div>
              <div class="receipt-info">ราคาต่อหัว 299 บาท</div>
              <div class="receipt-info">รวมเป็นเงินทั้งหมด ${totalPrice} บาท</div>
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
        <h1 className="text-lg font-bold mb-4">หน้าคิดเงิน (Admin)</h1>
        <div className="mb-4">
          <label className="block mb-2">เลือกโต๊ะ</label>
          <div className="grid grid-cols-3 gap-4">
            {tables.map((table) => {
              const tableStatus = table.status_table ? 'bg-yellow-500' : 'bg-green-500';
              return (
                <button
                  key={table.table_number}
                  className={`w-full py-2 rounded-md text-white ${tableStatus}`}
                  onClick={() => handleTableSelect(table)}
                >
                  โต๊ะ {table.table_number}
                </button>
              );
            })}
          </div>
        </div>

        {selectedTable ? (
          <div className="mt-4">
            <h2 className="text-md font-semibold mb-2">รายละเอียดการชำระเงิน</h2>
            <p>โต๊ะ: {selectedTable.table_number}</p>
            <p>จำนวนลูกค้า: {selectedTable.customer_count} คน</p>
            <p>ราคาต่อหัว: 299 บาท</p>
            <p>ราคารวมทั้งหมด: {totalPrice} บาท</p>
            <button onClick={handleConfirmPayment} className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4 mr-2">
              ยืนยันการชำระเงิน
            </button>
            <button onClick={handlePrintReceipt} className="bg-green-500 text-white py-2 px-4 rounded-md mt-4">
              พิมพ์ใบเสร็จ
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Payment;
