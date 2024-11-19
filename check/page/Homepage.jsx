import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../components/jsx/style.css';
import { Testmarkeiho } from "./Homepage.js";

const Homepage = () => {
  const [telNo, settelno]  = useState('');
 const havdleinputchange = (event)=>{
  settelno(event.target.value);
 }
 const handinvfriend = ()=>{
  Testmarkeiho(telNo);
 }
  const navigate = useNavigate();
  const goToLogin = () => {
    navigate('login'); // Navigate to login page
  };
  const gotoshop = () => {
    navigate('home'); // Navigate to login page
  };


  return (
    <div>
      <div className="container"> 
        <div>
        <img src="https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-09-22-at-11.06.22-2.png" alt="Logo" />
        </div>
        <div className="wellcome">
            <h1>ยินดีต้อนรับ</h1>
            <h3>กรุณาเลือกโต๊ะ</h3> 
            
            <form>
            
            <select className="Tableselect">
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            </select>
            
            <input  onClick={gotoshop}  className='' type="submit" value={"Select Table"} />
            <hr/>
            <label>หรือนำรหัสมาเข้าสู่โต๊ะของคุณ <br/></label>
            <label>รหัสเข้าโต๊ะเพื่อน</label>
            <input
            type="text"
            name="telNo"
            placeholder="กรุณากรอกรหัสเพื่อเข้าสู่โต๊ะ"
            value={telNo}
            onChange={havdleinputchange} // เรียกใช้เมื่อมีการพิมพ์
            />

            <input  onClick={handinvfriend}   className='' type="submit" value={"เข้าโต๊ะโดยใช้รหัส"} />
            
            </form>
            {/* ////////////////////////////////////////////////////////////////////////////// */}
            <hr/>
            <br/>
            <input  onClick={goToLogin}  className='Admin' type="submit" value={"Admin Only"} />
    </div>

      </div>
      
    </div>
  );
};

export default Homepage;