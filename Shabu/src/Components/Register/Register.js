export const registerUser = async (username, password,phonenumber,role) => {
    try{
        const response = await fetch('http://localhost:3001/login/create',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                username,
                password,
                phonenumber,
                role,
            }),
        });
        const data = await response.json();

        if(response.ok){
            return {success:true, message:data.message};
        }else{
        return {success:false,message:data.error};}
    }catch(error){
        return {success:false,message:'มีบางอย่างผิดพลาด กรุณาลองใหม่อีักครั้ง'};
    }
}