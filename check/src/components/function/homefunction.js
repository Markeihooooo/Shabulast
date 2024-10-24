import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// ฟังก์ชันนำไปยังหน้า Register
export const useGoToRegister = () => {
  const navigate = useNavigate();
  return () => navigate('/register'); // เปลี่ยนเส้นทางไปหน้า Register
};

// ฟังก์ชันสำหรับการ login
export const submitLogin = async (userName, userPass) => {
  if (!userName || !userPass) {
    Swal.fire({
      title: 'Error!',
      text: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน',
      icon: 'error',
      confirmButtonText: 'ตกลง'
    });
    return;
  }

  try {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_name: userName, user_pass: userPass }),
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        title: 'สำเร็จ!',
        text: 'คุณเข้าสู่ระบบเรียบร้อยแล้ว',
        icon: 'success',
        confirmButtonText: 'ตกลง'
      }).then(() => {
        localStorage.setItem('token', data.token);

        // เปลี่ยนเส้นทางตาม role
        if (data.role === 'admin') {
          window.location.href = '/admin'; // เปลี่ยนไปยังหน้า admin
        } else {
          window.location.href = '/home'; // เปลี่ยนไปยังหน้า user
        }
      });
    } else {
      Swal.fire({
        title: 'Error!',
        text: data.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
    }
  } catch (error) {
    Swal.fire({
      title: 'Error!',
      text: 'เกิดข้อผิดพลาดในระบบ',
      icon: 'error',
      confirmButtonText: 'ตกลง'
    });
  }
};