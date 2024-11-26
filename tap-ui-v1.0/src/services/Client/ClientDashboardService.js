import axios from 'axios';

const BASE_URL = 'http://localhost:8080/tap/api';
// Function to fetch job requirements count
export const getJobRequirements = async (clientId) => {
  try {
    const response = await axios.get(`${BASE_URL}/requirementCount/${clientId}`);
    return response.data; // This should be a count; adjust based on the API response.
  } catch (error) {
    console.error('Error fetching job requirements:', error);
    throw error; 
  }
};

// Function to fetch shortlisted count
export const getShortlistedCount = async (clientId) => {
  try {
    const response = await axios.get(`${BASE_URL}/shortListedCount/${clientId}`);
    return response.data; // This should be a count.
  } catch (error) {
    console.error('Error fetching shortlisted count:', error);
    throw error; 
  }
};

// Function to fetch the candidates (array of candidates)
export const getCandidates = async (clientId) => {
  try {
    const response = await axios.get(`${BASE_URL}/hiredCandidate/${clientId}`);
    return response.data; // This should be an array of candidates.
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error; 
  }
};

export const fetchRequirements = async (clientId) => {
  try {
    const response = await axios.get(BASE_URL+`/allRequirements/${clientId}`);
    return response.data;
  } catch (error) {
    throw error; 
  }
};


