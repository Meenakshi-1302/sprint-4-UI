import axios from 'axios';

const VENDOR_API_URL = 'http://localhost:8080/api/recruitingManager/fetch/allMrfVendors';
const RECRUITER_API_URL = 'http://localhost:8080/api/recruitingManager/fetch/allrecruiters';

export const fetchMrfVendors = async () => {
    try {
        const response = await axios.get(VENDOR_API_URL); 
        return response.data; 
    } catch (error) {
        throw new Error(`Error fetching MRF vendors: ${error.message}`);
    }
};

export const fetchAllRecruiters = async () => {
    try {
        const response = await axios.get(RECRUITER_API_URL);
        return response.data; 
    } catch (error) {
        throw new Error(`Error fetching recruiters: ${error.message}`);
    }
};

export const fetchVendorDetails = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/vendors/${id}`);
        if (response.status === 200) {
            return response.data; 
        } else {
            throw new Error('Error fetching vendor details, status: ' + response.status); 
        }
    } catch (error) {
        throw new Error(`Error fetching vendor details for ID ${id}: ${error.message}`);
    }
};