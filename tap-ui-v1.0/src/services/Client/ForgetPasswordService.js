import axios from 'axios';
 
const API_URL = 'http://localhost:8080/client/forgot-password-send-otp/'; // Your specified API URL for fetching roles
 
export const getForgetpassword = async (trimmedEmail) => {
  try {
    const response = await axios.post(API_URL + trimmedEmail);
    return response.data;
  } catch (error) {
    console.error('Error fetching reset password:', error);
    throw error; // Rethrow the error for handling in the component
  }
};