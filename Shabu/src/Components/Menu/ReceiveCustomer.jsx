

import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { createTable, updateTable } from '../ReceiveCustomer/TableCustomer.js';

import Payment from './Payment';


import Swal from 'sweetalert2';

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



  const fetchTables = async () => {
    try {
      const response = await fetch('http://localhost:3001/tablecustomer/get');
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };
  useEffect(() => {
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

    const generateToken = (table_number, customer_count) => {
    return btoa(`${table_number}-${customer_count}-${Date.now()}`);
  };

  const handleTableClick = (num) => {
    setTableNumber(num);
    const existingTable = tables.find((table) => table.table_number === num);

    if (existingTable) {
      setCustomerCount(existingTable.customer_count.toString());
      const url = `/Customer?table=${num}&count=${existingTable.customer_count}&token=${existingTable.token}`;
      setQrCodeUrl(url);
    } else {
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

    const existingTable = tables.find((table) => table.table_number === Number(table_number));
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
      //alert(result.message);
     
      setTables(data);
    } else {
      Swal.fire({
        title: `สำเร็จ!`,
        text: `${result.message}`,
        icon: 'success',
        confirmButtonText: 'ตกลง'
      });
      //alert(result.message);
    }
    fetchTables();
    handleGenerateQRCode();
  };

  const handlePrintQRCode = () => {
    const qrCodeElement = document.getElementById('qrcode');
    if (!qrCodeElement) {
      console.log("ไม่พบ QR Code Element");
      alert("ไม่พบ QR Code สำหรับพิมพ์");
      return;
    }

    const tableNumber = table_number;
    const customerCount = customer_count;



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
              size: 80mm 150mm; 
              margin: 5mm;
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
              margin: 10px 0;
              padding: 10px;
            }
            .receipt-info {
              margin-top: 5px;
              font-size: 12px;
            }
            .receipt-intro {
              margin-top: 5px;
              font-size: 18px;
            }
            img {
              width: 80px;
              height: 80px;
            }

          </style>
        </head>
        <body>
          <div class="qrcode-container">
          <img 
          src="https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-09-22-at-11.06.22-2.png"
          alt="Logo"

        />
            <div class="receipt-intro">
              ลูกค้าโต๊ะ ${tableNumber} <br>จำนวน ${customerCount} คน
            </div>
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
          <div className="grid grid-cols-3 gap-4 ">
            {[1, 2, 3, 4, 5].map((num) => {
              const tableStatus = tables.some((table) => table.table_number === num)
                ? 'bg-yellow-500'
                : 'bg-green-500 focus:ring focus:ring-black-900 ';

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
          <label className="block mb-2">ตอนนี้เลือกโต๊ะหมายเลข <span className='font-bold text-red-500'>{table_number}</span></label>
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
          {tables.some((table) => table.table_number === Number(table_number)) ? 'แก้ไขข้อมูล' : 'สร้าง QR Code'}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {qrCodeUrl && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">QR Code สำหรับลูกค้า:</h3>
            <QRCode id='qrcode' className="mx-auto" value={qrCodeUrl} />
            <p className="mt-2">
              <a href={qrCodeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                เปิดลิงก์สำหรับลูกค้า
              </a>
            </p>
            <button
              onClick={handlePrintQRCode} // เปลี่ยนจาก handlePrintReceipt เป็น handlePrintQRCode
              className="bg-green-500 text-white py-1 px-4 rounded-md mt-4"
            >
              พิมพ์ใบเสร็จ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiveCustomer;
