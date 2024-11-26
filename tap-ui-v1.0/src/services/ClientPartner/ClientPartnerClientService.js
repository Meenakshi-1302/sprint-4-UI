import axios from "axios";
 
const BASE_URL = "http://localhost:8080";
const CLIENT_API = "/tap/clients";
const REQUIREMENT_API = "/tap/api/allRequirements"; // New endpoint for requirements
const REQUIREMENT_FILLED_COUNT_API = "/tap/mrf/requirement-filled-count"; // Assuming the endpoint for filled count
const GET_ALL_MRF_API = "/tap/mrf/getAllMrf";
 
// Fetch all clients
export const getAllClients = async () => {
    try {
        const response = await axios.get(`${BASE_URL}${CLIENT_API}`);
        return response.data; // return the data directly
    } catch (error) {
        console.error("Error fetching clients:", error);
        throw error; // rethrow the error for handling at the calling site
    }
};
 
// Fetch all requirements
export const getAllRequirements = async () => {
    try {
        const response = await axios.get(`${BASE_URL}${REQUIREMENT_API}`);
        return response.data; // return the data directly
    } catch (error) {
        console.error("Error fetching requirements:", error);
        throw error;
    }
};
 
// Fetch filled count for a specific requirement
export const getRequirementFilledCount = async (requirementId) => {
    try {
        const response = await axios.get(`${BASE_URL}${REQUIREMENT_FILLED_COUNT_API}/${requirementId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching filled count for requirement ID ${requirementId}:`, error);
        throw error;
    }
};
 
// Fetch all MRF data
export const getAllMrf = async () => {
    try {
        const response = await axios.get(`${BASE_URL}${GET_ALL_MRF_API}`);
        return response.data;  
    } catch (error) {
        console.error("Error fetching MRF data:", error);
        throw error;  
    }
};