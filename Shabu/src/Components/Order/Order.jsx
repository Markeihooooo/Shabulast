import React from 'react'

import './Order.css';
const Order = () => {
    const goToMain =()=>{
        window.location.href='/Mainmenu'
    }
  return (
    <>
      <div className='main-container'>
        
        <div className='sidebar'>
          <input type='submit' onClick={goToMain} value='BackToMain' />
          <img src="https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-09-22-at-11.06.22-2.png" alt="Logo" />
          <button>Table 1 </button>
          <button>Table 2 </button>
          <button>Table 3 </button>
          <button>Table 4 </button>
          <button>Table 5 </button>
          
        </div>

      <div className="content">
        <div className="order__slidebar">
          <div className="order__item"></div>
          <div className="order__item"></div>
          <div className="order__item"></div>
          <div className="order__item"></div>
          <div className="order__item"></div>
          <div className="order__item"></div>

        </div>
      <div className="order__mainbar"><h1>Down</h1></div>
      </div>
   </div>
    </>
  )
}

export default Order