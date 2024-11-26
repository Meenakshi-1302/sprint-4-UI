// import axios from 'axios';
 
// // Define your base API URL
// const BASE_API_URL = 'http://localhost:8080/tap'; // Your specified API base URL
 
// // Endpoint for adding a new admin role
// const ADD_ROLE_URL = `${BASE_API_URL}/createrole`; // Updated to the correct endpoint
 
// // Function to add a new admin role
// export const addAdminRole = async (role) => {
//   try {
//     const response = await axios.post(ADD_ROLE_URL, role); // Use the new URL
//     return response.data;
//   } catch (error) {
//     console.error('Error adding admin role:', error);
//     throw error; // Rethrow the error for handling in the component
//   }
// };
 
// // Function to fetch existing admin roles
// export const getAdminRoles = async () => {
//   try {
//     const response = await axios.get(`${BASE_API_URL}/getallrole`); // Ensure this is the correct endpoint
//     return response.data; // Return the response data
//   } catch (error) {
//     console.error('Error fetching admin roles:', error);
//     throw error; // Rethrow the error for handling in the component
//   }
// };
 
import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080/tap';  // Base URL for your API

// Define your API endpoints
const ADD_ROLE_URL = `${BASE_API_URL}/createrole`; // Add role endpoint
const GET_ROLE_BY_ID_URL = `${BASE_API_URL}/getrolebyid`; // Get role by ID endpoint
const GET_ALL_ROLES_URL = `${BASE_API_URL}/getallrole`; // Get all roles endpoint
const UPDATE_ROLE_URL = `${BASE_API_URL}/updaterole`; // Update role endpoint

// Function to add a new admin role
export const addAdminRole = async (role) => {
  try {
    const response = await axios.post(ADD_ROLE_URL, role);  // API call to add a role
    return response.data;
  } catch (error) {
    console.error('Error adding admin role:', error);
    throw error; // Rethrow error for handling in component
  }
};

// Function to fetch all admin roles
export const getAdminRoles = async () => {
  try {
    const response = await axios.get(GET_ALL_ROLES_URL);  // API call to get all roles
    return response.data;
  } catch (error) {
    console.error('Error fetching admin roles:', error);
    throw error; // Rethrow error for handling in component
  }
};
export const getRoleById = async (roleId) => {
  console.log("Fetching data for roleId:", roleId); // Debug log
  try {
    const response = await axios.get(`${GET_ROLE_BY_ID_URL}/${roleId}`); // Dynamically insert roleId
    console.log("Role data fetched:", response.data); // Debug log for fetched data
    return response.data; // Return the role data
  } catch (error) {
    console.error('Error fetching role by ID:', error);
    throw error; // Rethrow error to handle it in the component
  }
};

// Function to update an existing admin role
export const updateAdminRole = async (roleId, roleData) => {
  try {
    const response = await axios.put(`${UPDATE_ROLE_URL}/${roleId}`, roleData);  // API call to update a role

    // Log response data for debugging
    console.log('Role updated successfully:', response.data);

    // Assuming response.data contains the success message
    if (response.status === 200) {
      return response.data;  // Return success message from backend
    } else {
      throw new Error('Failed to update role');
    }
  } catch (error) {
    console.error('Error updating admin role:', error);
    throw error;  // Rethrow error for handling in component
  }
};

