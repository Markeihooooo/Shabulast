export const createTable = async (table_number,customer_count,status_table,check_token) => {
try{
    const response = await fetch('http://localhost:3001/tablecustomer/create',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            table_number,
            customer_count,
            status_table,
            check_token,
        }),
    });
    const data =await response.json();
    if(response.ok){
        return {success:true,message:data.message};
    }else{
        return {success:false,message:data.error};}
    }catch(error){
        return {success:false,message:'มีีบางอย่างผิดพลาด'};
    }
}