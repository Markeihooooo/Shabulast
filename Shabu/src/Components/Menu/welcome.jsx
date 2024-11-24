import React from 'react'

const welcome = () => {
  return (
    
    <div className='w-full h-full flex flex-col justify-center items-center bg-[#c0392b]'>
         <h1 className='text-4xl font-bold mb-4'>
          ยินดีต้อนรับสู่ <span className='text-[#ff6347]'>Shabu Delight</span>
        </h1>
        <p className='text-lg max-w-lg mb-6'>
          สัมผัสรสชาติชาบูที่ยอดเยี่ยม พร้อมวัตถุดิบสดใหม่ น้ำซุปกลมกล่อม และบรรยากาศสุดผ่อนคลาย  
          เรารังสรรค์ประสบการณ์การทานชาบูที่คุณจะไม่มีวันลืม!
        </p>
        <img 
          className='w-64 h-64 rounded-full shadow-lg border-4 border-yellow-500 mb-6' 
          src='https://www.brandbuffet.in.th/wp-content/uploads/2021/08/Penguin-Eat-Shabu-5-696x696.jpg' 
          alt='Shabu Restaurant'
        />
       

    </div>
  )
}

export default welcome