import axios from 'axios';
 
// Base URL for your API
const API_BASE_URL = 'http://localhost:8080/tap/mrf';
 
export const getAllMrfData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getAllMrf`);
        return response.data; // Return the fetched data
    } catch (error) {
        console.error('Error fetching MRF data:', error);
        throw error; // Rethrow the error for further handling
    }
};