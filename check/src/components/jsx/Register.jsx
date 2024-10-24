import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleRegister } from '../function/registerfunction';
import Swal from 'sweetalert2';

const Register = () => {
  const [userName, setUserName] = useState('');
  const [userPass, setUserPass] = useState('');
  const [telNo, setTelNo] = useState('');
  const navigate = useNavigate();

  const onRegister = async (event) => {
    event.preventDefault(); // Prevent page refresh

    try {
      // Call the handleRegister function to send user data
      await handleRegister(userName, userPass, telNo);
      Swal.fire({
        title: 'สำเร็จ!',
        text: 'คุณได้สมัครสมาชิกเรียบร้อยแล้ว',
        icon: 'success',
        confirmButtonText: 'ตกลง'
      }).then(() => {
        navigate('/'); // Navigate to login page
      });
    } catch (error) {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'มีปัญหาในการสมัครสมาชิก',
        icon: 'error',
        confirmButtonText: 'ลองอีกครั้ง'
      });
    }
  };

  const goToLogin = () => {
    navigate('/login'); // Navigate to login page
  };

  return (
    <div className="container">
      <div>
        <input onClick={goToLogin} className='back' type="submit" value={"<"} />
      </div>
      <div>
        <img
          src="https://img5.pic.in.th/file/secure-sv1/Screenshot-2567-09-22-at-11.06.22-2.png"
          alt="Logo"
        />
      </div>
      <div><h1>Register for Order <br />Menu</h1></div>
      <form onSubmit={onRegister}>
        <div>
          <input
            type="text"
            placeholder="ID"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={userPass}
            onChange={(e) => setUserPass(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Phone Number"
            value={telNo}
            onChange={(e) => setTelNo(e.target.value)}
            required
          />
        </div>
        <div>
          <input type="submit" value="Register" />
        </div>
      </form>
    </div>
  );
};

export default Register;