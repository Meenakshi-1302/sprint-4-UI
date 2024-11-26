import axios from "axios";

const API_URL = "http://localhost:8080/user/password/recovery/";

export const sendOtp = async (email) => {
  try {
    const response = await axios.post(`${API_URL}send-otp`, null, {
      params: { email },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const verifyOtp = async (otp, email) => {
  try {
    const response = await axios.post(
      `${API_URL}forgot-password-verify-otp`,
      null,
      {
        params: {
          otp,
          email,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching email!", error);
    throw error;
  }
};

export const updatePassword = async (email, newPassword) => {
  try {
    const response = await axios.put(
      `${API_URL}forgot-password-update`,
      { 
        email, 
        password: newPassword 
      },
      { 
        headers: { 
          "Content-Type": "application/json" 
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating password!", error);
    throw error;
  }
};
