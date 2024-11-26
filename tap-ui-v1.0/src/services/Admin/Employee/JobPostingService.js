import axios from 'axios';
 
// Define the base URL for the API
const BASE_API_URL = 'http://localhost:8080/tap';
const GET_ALL_JOB_POSTINGS_URL = `${BASE_API_URL}/jobposting`;
 
// Get All Job Postings service
export const getAllJobPostings = async () => {
    console.log("Service Hit: Fetching all job postings!");
    try {
        const response = await axios.get(GET_ALL_JOB_POSTINGS_URL);
        console.log("Job postings retrieved:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching job postings:', error);
        throw new Error('Failed to fetch job postings. Please try again later.');
    }
};
