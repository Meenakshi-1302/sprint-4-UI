import axios from 'axios';
 
const API_URL = 'http://localhost:8080/client/update-forgot-password'; // Your specified API URL for resetting the password
 
export const updateForgotPassword = async (email,newPassword) => {
  try {
    const response = await axios.post(API_URL,{
        clientEmail:email,
        password:newPassword
    });
    return response.data; // Assuming the response contains relevant data
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error; // Rethrow the error for handling in the component
  }
};