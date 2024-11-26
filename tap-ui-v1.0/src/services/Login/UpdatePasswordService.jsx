import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

 
export const updatePasswordAPI = async (email, password) => {


  try {
      const UpdatePasswordRequest = {
          email: email,
          newPassword: password
      };

      const response = await axios.put(`${BASE_URL}/tap/updatepassword`, UpdatePasswordRequest);
      console.log(response);
      return response;

  } 
    catch (error) {
      throw new Error(error.response?.data || error.message);
  }

};


