import axios from 'axios';

const BASE_URL = 'http://localhost:8080';
// const BASE_URL = 'http://192.168.62.101:8080';

 
export const ValidateLogin = async (email, password) => {


  try {
      const loginCredentials = {
          userEmail: email,
          passwordHash: password
      };


      const response = await axios.post(`${BASE_URL}/tap/login`, loginCredentials);
      return response.data;

  } 
    catch (error) {
      throw new Error(error.response?.data || error.message);
  }

};


