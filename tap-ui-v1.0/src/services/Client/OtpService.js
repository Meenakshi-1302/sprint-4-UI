import axios from 'axios';

const API_URL = 'http://localhost:8080/client/verify-otp'; // Your specified API URL for OTP-related actions

// Function to send a new OTP
export const sendOtp = async () => {
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    await axios.post(API_URL, { otp: generatedOtp });
    console.log(`Generated OTP: ${generatedOtp}`);
    return generatedOtp; // You might want to return the generated OTP for testing purposes
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error; // Rethrow the error for handling in the component
  }
};

// Function to verify the OTP
export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(API_URL + `?otp=${otp}&clientEmail=${email}`);

    return response.data; // Return the list of OTPs from the server
  } catch (error) {
    console.error('Error fetching OTPs:', error);
    throw error; // Rethrow the error for handling in the component
  }
};
