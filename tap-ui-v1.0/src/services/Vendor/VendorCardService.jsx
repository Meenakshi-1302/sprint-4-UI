import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/vendors'; // Replace with your actual API base URL

// Function to get assigned MRF count
export const getAssignedMrfCount = async (vendorId) => {
    const response = await axios.get(`${BASE_URL}/assignedMrfCount/${vendorId}`);
    return response.data; // Adjust according to your response structure
};

// Function to get completed MRF count
export const getCompletedMrfCount = async (vendorId) => {
    const response = await axios.get(`${BASE_URL}/completedMrfCount/${vendorId}`);
    return response.data; // Adjust according to your response structure
};

// Function to get total MRF count
export const getAllMrfCount = async (vendorId) => {
    const response = await axios.get(`${BASE_URL}/allMrfCount/${vendorId}`);
    return response.data; // Adjust according to your response structure
};