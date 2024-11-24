// CreateCustomer.js

// ฟังก์ชันสำหรับสร้างโต๊ะใหม่
export const createTable = async (tableNumber, customerCount, status, token) => {
    try {
      const response = await fetch('http://localhost:3001/tablecustomer/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ table_number: tableNumber, customer_count: customerCount, status_table: status, check_token: token }), // ส่งข้อมูลให้ตรงกับที่ API ต้องการ
      });
      if (!response.ok) {
        throw new Error('Failed to create table');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating table:', error);
      return { success: false, message: 'ไม่สามารถสร้างโต๊ะได้' };
    }
  };
  
  // ฟังก์ชันสำหรับอัปเดตข้อมูลโต๊ะ
  export const updateTable = async (tableNumber, customerCount, status, token) => {
    try {
      const response = await fetch(`http://localhost:3001/tablecustomer/table/${tableNumber}`, {
        method: 'PATCH', // ใช้ PATCH แทน PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ table_number: tableNumber, customer_count: customerCount, status_table: status, check_token: token }), // ส่งข้อมูลให้ตรงกับที่ API ต้องการ
      });
      if (!response.ok) {
        throw new Error('Failed to update table');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating table:', error);
      return { success: false, message: 'ไม่สามารถอัปเดตโต๊ะได้' };
    }
  };
  