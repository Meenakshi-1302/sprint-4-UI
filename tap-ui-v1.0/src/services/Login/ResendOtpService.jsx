import React from 'react';
import axios from 'axios';


// const BASE_URL = 'http://localhost:8080';
const BASE_URL = 'http://192.168.62.101:8080';

export const ResendOtp = async (email) => {
  try {
      const url = `${BASE_URL}/tap/resend-otp?email=${encodeURIComponent(email)}`;
      
      const response = await axios.post(url);
      console.log(response.data);
    //   return response.data;

  } catch (error) {
      throw new Error(error.response?.data || error.message);
  }
};


 