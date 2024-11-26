import axios from "axios";
 
const BASE_URL = "http://localhost:8080/tap";

const UPDATE_EMPLOYEE_URL = `${BASE_URL}/updateemployee`;


// Fetch all employees
export const getEmployees = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/getallemployee`);
        return response.data;  // Return the response data
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw error;  // Rethrow the error for handling in the component
    }
};
 
// Update an existing employee
export const updateEmployee = async (employeeId, employeeData) => {

    console.log("Updated employee : ", employeeData);
    console.log("Updated employee : ", employeeId);
    try {
      const response = await axios.put(`${UPDATE_EMPLOYEE_URL}/${employeeId}`, employeeData);  // API call to update a role
  
      // Log response data for debugging
      console.log('Employee updated successfully:', response.data);
  
 
      console.log(response);

      // Log response data for debugging
      console.log('Employee updated successfully:', response.data);
 
      // Assuming response.data contains the success message
      if (response.status === 200) {
        return response.data;  // Return success message from backend
      } else {
        throw new Error('Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;  // Rethrow error for handling in component
    }
  };

// Add a new employee
export const addEmployee = async (employeeData) => {
    try {
        const response = await axios.post(`${BASE_URL}/createemployee`, employeeData);
        return response.data;  // Return the created employee data
    } catch (error) {
        console.error("Error adding employee:", error);
        throw error;  // Rethrow the error to handle it in the calling code
    }
};
 
// Get employee by ID
export const getEmployeeById = async (employeeId) => {
    try {
        const response = await axios.get(`${BASE_URL}/getEmployeeById/${employeeId}`);
        return response.data;  // Return the employee data
    } catch (error) {
        console.error("Error fetching employee:", error);
        throw error;  // Rethrow the error for handling in the component
    }
};

// Fetch all departments
export const getAllDepartments = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/getalldepartments`);
        return response.data;
    } catch (error) {
        console.error("Error fetching departments:", error);
        throw error;
    }
};

// Fetch all managers
export const getAllManagers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/getallmanagers`);
        return response.data;
    } catch (error) {
        console.error("Error fetching managers:", error);
        throw error;
    }
};

export const getAllRoles = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/getallrole`);
        return response.data;
    } catch (error) {
        console.error("Error fetching managers:", error);
        throw error;
    }
};

// Fetch all location
export const getAllLocations = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/getallorganizationlocations`);
        return response.data;  // Return the array of location
    } catch (error) {
        console.error("Error fetching location:", error);
        throw error;  // Rethrow the error for handling in the component
    }
};

