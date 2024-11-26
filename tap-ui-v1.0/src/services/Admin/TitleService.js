import axios from "axios";

export const getDashboardData = async () => {
  try {
    const response = await axios.get('http://localhost:3002/dashboardData');
    return response.data; // Return the whole response
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error; 
  }
};
