import axios from "axios";

export const addUser = async (formData) => {
  try {
    console.log(formData);
    const response = await axios.post('http://localhost:8080/tap/clients', formData);
   
    return response.data;
  } catch (error) {

    if (error.response) {

      console.error('Error response data:', error.response.data);
      console.error('Error status:', error.response.status);
      throw new Error(`Error: ${error.response.data.message || 'Unknown error occurred'}`);
    } else if (error.request) {

      console.error('No response received:', error.request);
      throw new Error('Error: No response received from server');
    } else {

      console.error('Error:', error.message);
      throw new Error(`Error: ${error.message}`);
    }
  }
};

export const getUsers = async () => {
  const url = `http://localhost:8080/tap/clients`; 
  return axios.get(url);
};
