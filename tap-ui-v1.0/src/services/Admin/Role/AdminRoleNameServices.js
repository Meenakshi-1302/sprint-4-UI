import axios from 'axios';

const API_URL = 'http://localhost:3002/roles'; // Your specified API URL for fetching roles

export const getRoles = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error; // Rethrow the error for handling in the component
  }
};