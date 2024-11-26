import axios from 'axios';
 
const API_URL = 'http://localhost:3001/candidates'; // URL to your backend API
 
export const getCandidatesData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates data:', error);
    throw error; // Rethrow the error to handle it in the component
  }
};