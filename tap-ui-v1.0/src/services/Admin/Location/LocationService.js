import axios from 'axios';
 
const BASE_API_URL = 'http://localhost:8080/tap';  // Replace with your actual base API URL
const ADD_LOCATION_URL = `${BASE_API_URL}/organizationlocation`; // Adjust endpoint as needed
const GET_LOCATIONS_URL = `${BASE_API_URL}/getallorganizationlocations`; // Adjust endpoint as needed
const UPDATE_LOCATION_URL = `${BASE_API_URL}/updateorganizationlocation`;
 
// Service to add a location
export const addLocation = async (location) => {
  try {
    const response = await axios.post(ADD_LOCATION_URL, location); // Post the location data
    return response.data;  // Return the added location data from the response
  } catch (error) {
    console.error('Error adding location:', error);
    throw new Error('Failed to add location. Please try again later.');  // Provide a more user-friendly error
  }
};
 
// Service to get all locations
export const getLocations = async () => {
  try {
    const response = await axios.get(GET_LOCATIONS_URL);  
    console.log(response.data);  // Log response for debugging purposes
    return response.data;  // Return data from the response
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw new Error('Failed to fetch locations. Please try again later.');  // Provide a user-friendly error
  }
};
 
export const updateLocation = async (locationId, locationData) => {
  try {
    const response = await axios.put(`${UPDATE_LOCATION_URL}/${locationId}`, locationData);
    return response.data;
  } catch (error) {
    console.error('Error updating location:', error);
    throw new Error('Failed to update location. Please try again later.');
  }
};