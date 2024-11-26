import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080/tap';
const UPLOAD_URL = `${BASE_API_URL}/createbulkemployee`; // Endpoint for uploading employee data

const uploadCSV = async (data) => {
  try {
    const response = await axios.post(UPLOAD_URL, data, {
      headers: {
        'Content-Type': 'application/json', // Set content type to JSON
      },
    });

    // Make sure the response contains the expected structure
    console.log('API response:', response.data);  // Log the response for debugging
    
    return response.data; // Return the response data (which should have `response` containing the actual data)
  } catch (error) {
    console.error('Error uploading employee data:', error);
    throw error; // Rethrow the error to be handled by the action creator or component
  }
};

export default {
  uploadCSV,
};
