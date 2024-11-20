
import React, { useEffect, useState } from 'react';

const Gettable = ({ setTables }) => {
  useEffect(() => {
    const fetchTable = async () => {
      try {
        const response = await fetch('http://localhost:3001/tablecustomer/get');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        console.log('ข้อมูลที่ได้จาก API:', data); // data คือข้อมูลจริงที่ได้จาก API
        setTables(data); // ส่งข้อมูลโต๊ะไปยัง component หลัก
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchTable();
  }, [setTables]);

  return null;
};

export default Gettable;
