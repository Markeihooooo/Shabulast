export const Checkrole = async (username) => {
    try{
        const response = await fetch(`http://localhost:3001/login/role/${username}`);
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.role;
    }catch(error){
        console.error('Error fetching role:', error);
        return null;
    }
};

