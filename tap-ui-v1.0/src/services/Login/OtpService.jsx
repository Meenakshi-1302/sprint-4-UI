import axios from 'axios';

const BASE_URL = 'http://localhost:8080';
// const BASE_URL = 'http://192.168.62.101:8080';


export const ValidateOtp = async (otp, email) => {
    
    try {
      const url = `${BASE_URL}/tap/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;
      
      const response = await axios.post(url);
      console.log(response.data)
      return response.data;

  } catch (error) {
      throw new Error(error.response?.data || error.message);
  }
};


 