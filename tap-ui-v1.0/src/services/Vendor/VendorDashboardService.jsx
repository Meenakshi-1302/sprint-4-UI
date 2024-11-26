import axios from "axios"

const BASE_URL = 'http://localhost:8080/api/vendors';

export const getTotalCandidates = async (vendorId) => {
    try {
      const response = await axios.get(`${BASE_URL}/candidateCountByVendorId`,{
        params: {
            vendorId: vendorId
        }
      });
      console.log(response.data);
      return response.data;
       // This should be a count; adjust based on the API response.
    } catch (error) {
      console.error('Error fetching total candidates', error);
      throw error; 
    }
  };

  export const getHiredCandidates = async (vendorId) => {
    try {
      const response = await axios.get(`${BASE_URL}/hiredcandidatecountbyVendorId`, {
        params: {
            vendorId: vendorId
        }
      });
      console.log(response.data);
      return response.data; // This should be a count; adjust based on the API response.
    } catch (error) {
      console.error('Error fetching hired candidates', error);
      throw error; 
    }
  };

  export const getJoinedCandidates = async (vendorId) => {
    try {
      const response = await axios.get(`${BASE_URL}/joinedcandidatecountbyVendorId`, {
        params: {
            vendorId: vendorId
        }
      });
      console.log(response.data);
      return response.data; // This should be a count; adjust based on the API response.
    } catch (error) {
      console.error('Error fetching hired candidates', error);
      throw error; 
    }
  };

