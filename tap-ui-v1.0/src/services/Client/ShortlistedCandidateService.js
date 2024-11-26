// services/ClientTableService.js
import axios from 'axios';
 
// Define the API endpoint URL
const API_URL = 'http://localhost:8080/tap/api/short-listed-requirement/'; // Replace with your actual API URL
 
// Function to fetch shortlisted candidates data
export const getShortListedCandidatesData = async (requirementId) => {
  try {
    const response = await axios.get(API_URL+`${requirementId}`); // Send GET request to the API
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error fetching candidates data:', error);
    throw error; // Throw error to handle it in the component
  }
};