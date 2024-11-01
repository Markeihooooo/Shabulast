import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';

export const submitLogin = async (username,password)=>{
    if(!username || !password){
        Swal.fire({
            title: 'Error!',
            text: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน',
            icon: 'error',
            confirmButtonText: 'ตกลง'
          });
          console.log("Username:", username);
          console.log("Password:", password);
          return;
    }
    try{
        const response = await fetch('http://localhost:3001/login/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                username: username, // ส่ง username และ password
                password: password
            })
        });
        const data = await response.json();
        if(response.ok){
            Swal.fire({
                title: `สำเร็จ!`,
                text: 'คุณเข้าสู่ระบบเรียบร้อยแล้ว',
                icon: 'success',
                confirmButtonText: 'ตกลง'
              }).then(() => {
                  localStorage.setItem('token',data.token);
                  
                  window.location.href = '/Mainmenu';

                  if(data.role === 'เจ้าของ')

                  {console.log('เจ้าของ')}
                  else if (data.role === 'พนักงาน')
                  {console.log('พนักงาน')}
                  else {
                      console.log('อะไรไม่รู้')
                  }
                });
        }else{
            Swal.fire({
                title: 'Error!',
                text: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
                icon: 'error',
                confirmButtonText: 'ตกลง'
              });
        } console.log(data)
    }catch(error){
        console.log(error);
        console.log("Username:", username);
          console.log("Password:", password);
        Swal.fire({
            title: 'Error!',
            text: 'มีปัญหาในการเข้าสู่ระบบ',
            icon: 'error',
            confirmButtonText: 'ตกลง'
          });
    }
}
                
