import axios from 'axios';


const BASE_URL = 'http://localhost:8080/tap/api';  


export const createClient = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/clients`, {});
    console.log(response.data);
    return response.data; 
  } catch (error) {
    throw error; 
  }
};

// Function to create a new requirement
export const createRequirement = async (requirement) => {
  try {
    const response = await axios.post(`${BASE_URL}/requirement`, requirement);
    return response.data; // Return the created requirement data
  } catch (error) {
    throw error; // Re-throw the error for handling in the component
  }
};