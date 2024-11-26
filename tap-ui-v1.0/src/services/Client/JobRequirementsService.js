import axios from 'axios';

const BASE_URL = 'http://localhost:8080/tap/api'; // Updated BASE_URL for the new API

export const fetchRequirements = async (clientId) => {
  try {
    const response = await axios.get(`${BASE_URL}/requirement-by-client/${clientId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching requirements:', error);
    throw error;
  }
};

export const updateRequirement = async (requirementData) => {
  try {
    const response = await axios.put(`${BASE_URL}/update`, requirementData);
    return response.data;
  } catch (error) {
    console.error('Error updating requirement:', error);
    throw error;
  }
};

export const deleteRequirement = async (requirementId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete/${requirementId}`);
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error deleting requirement:', error);
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/roles`);
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

// Save job requirements to the backend
export const saveJobRequirements = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/requirement`, data); // Directly sending the formatted data
    return response.data;
  } catch (error) {
    console.error('Error saving job requirements:', error);
    throw error;
  }
};

// This function includes updates based on overall job requirement structure for the update call.
export const updateJobRequirements = async (requirementId, jobRequirementsData) => {
  try {
    const response = await axios.put(`${BASE_URL}/update`, jobRequirementsData); // Sending data for update
    return response.data;
  } catch (error) {
    console.error('Error updating job requirements:', error);
    throw error;
  }
};