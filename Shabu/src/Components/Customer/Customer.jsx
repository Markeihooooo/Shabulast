// import React from 'react';
// import { useSearchParams } from 'react-router-dom';

// const Customer = () => {
//   const [searchParams] = useSearchParams();
//   const tableNumber = searchParams.get('table');
//   const customerCount = searchParams.get('count');

//   return (
//     <>
//     <h1> คุณอยู่โต๊ะที่ {tableNumber} จำนวนลูกค้าทั้งหมด {customerCount} คน</h1>
//     </>
//   )
// }

// export default Customer

import React from 'react';
import { useLocation } from 'react-router-dom';

const Customer = () => {
  const location = useLocation();
  const { table, count } = location.state || {}; // Destructure the passed state

  return (
    <>
      <h1>คุณอยู่โต๊ะที่ {table} จำนวนลูกค้าทั้งหมด {count} คน</h1>
    </>
  );
};

export default Customer;


