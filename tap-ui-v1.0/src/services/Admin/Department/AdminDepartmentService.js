import axios from 'axios';
 
// Define the API base URL
const BASE_API_URL = 'http://localhost:8080/tap';
// const BASE_API_URL = 'http://192.168.62.101:8080/tap'; // Replace with your actual API URL
 
// Endpoint for fetching departments
const GET_DEPARTMENTS_URL = `${BASE_API_URL}/getalldepartment`;
// Endpoint for adding a department
const ADD_DEPARTMENT_URL = `${BASE_API_URL}/createdepartment`; // Update with your correct API endpoint for creating departments
const UPDATE_DEPARTMENT_URL = `${BASE_API_URL}/updatedepartment`; // Replace with your actual API endpoint for departments
 
// Function to update an existing department by ID
export const updateDepartment = async (departmentId, departmentData) => {
  try {
    console.log('Updating department with ID:', departmentId);
    console.log('Department Data:', departmentData);
 
    // Send PUT request with the department ID in the URL and department data in the body
    const response = await axios.put(`${UPDATE_DEPARTMENT_URL}/${departmentId}`, departmentData);  // PUT request to update department
 
    // Log the response data for debugging
    console.log('Department updated successfully:', response.data);
 
    // Check if the response status is 200 (success) and return the updated department data
    if (response.status === 200) {
      return response.data; // Return the updated department data
    } else {
      throw new Error('Failed to update department');
    }
  } catch (error) {
    console.error('Error updating department:', error);
    throw error; // Re-throw the error to be handled in the component
  }
};
 
export const getAdminDepartments = async () => {
  try {
    const response = await axios.get(GET_DEPARTMENTS_URL); // API call to get departments
    return response.data; // Return department data
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error; // Throw error to be handled in the component
  }
};
 
// Function to add a new department
export const addDepartment = async (department) => {
  try {
    console.log(department);
    const response = await axios.post(ADD_DEPARTMENT_URL, department); // Post request to create a new department
    return response.data; // Return the newly created department data
  } catch (error) {
    console.error('Error adding department:', error);
    throw error; // Throw error to be handled in the component
  }
};