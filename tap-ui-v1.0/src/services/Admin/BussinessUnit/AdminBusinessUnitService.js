import axios from 'axios';
 
const BASE_API_URL = 'http://localhost:8080/tap';
const ADD_BUSSINESS_UNIT_URL = `${BASE_API_URL}/createbusinessunit`;
const GET_BUSSINESS_UNITS_URL = `${BASE_API_URL}/getallbusinessunit`;
const UPDATE_BUSSINESS_UNIT_URL = `${BASE_API_URL}/updatebusinessunit`;  // New endpoint for updating business units
const GET_ALL_INTERVIEW_URL = `${BASE_API_URL}/getallinterview`;

// Add Business Unit service
export const addBussinessUnit = async (bussinessUnit) => {
    console.log("Service Hit: Adding Business Unit!");
    try {
        const response = await axios.post(ADD_BUSSINESS_UNIT_URL, bussinessUnit);
        console.log("Business unit added:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding business unit:', error);
        throw new Error('Failed to add business unit. Please try again later.');
    }
};
 
// Get all Business Units
export const getBussinessUnits = async () => {
    try {
        const response = await axios.get(GET_BUSSINESS_UNITS_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching business units:', error);
        throw new Error('Failed to fetch business units. Please try again later.');
    }
};
 
// Update Business Unit service
export const updateBussinessUnit = async (id, updatedData) => {
    console.log("Service Hit: Updating Business Unit!", id, updatedData);
    try {
        const response = await axios.put(`${UPDATE_BUSSINESS_UNIT_URL}/${id}`, updatedData);
        console.log("Business unit updated:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating business unit:', error);
        throw new Error('Failed to update business unit. Please try again later.');
    }
};


export const getAllInterviews = async () => {
    try {
        const response = await axios.get(GET_ALL_INTERVIEW_URL);
        console.log("Fetched all interviews:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching interviews:', error);
        throw new Error('Failed to fetch interviews. Please try again later.');
    }
};