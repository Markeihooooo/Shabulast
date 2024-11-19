import axios from 'axios';

// Function for user registration
export const handleRegister = async (userName, userPass, telNo) => {
  try {
    console.log('Registering with:', { userName, userPass, telNo }); // Check values sent to API
    const response = await axios.post('http://localhost:3001/register', {
      username: userName,
      password: userPass,
      tel_no: telNo, // Include phone number in request
      role: 'user', // Default role set to 'admin'
    });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response ? error.response.data : error.message);
    throw new Error('Registration failed');
  }
};