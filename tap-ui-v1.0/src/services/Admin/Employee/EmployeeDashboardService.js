import axios from 'axios';
 
export const getEmployeeDashboardData = async () => {
  try {
    const response = await axios.get('http://localhost:3002/employeeDashboard'); // New API endpoint for employee data
    return response.data; // Return the whole response
  } catch (error) {
    console.error('Error fetching employee dashboard data:', error);
    throw error;
  }
};