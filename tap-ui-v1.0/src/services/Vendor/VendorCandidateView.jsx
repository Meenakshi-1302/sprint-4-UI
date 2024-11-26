import axios from 'axios';
 
const API_URL = 'http://localhost:8080/api/vendors'; // URL to your backend API
 
export const getVendorAddedCandidatesDataByMRF = async (vendorId, mrfId) => {
  try {
    const response = await axios.get(API_URL+ "/getallcandidatebyMrfAndVendorId", {
      params: {
          mrfId: mrfId,
          vendorId: vendorId
      }
  });
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates data:', error);
    throw error; // Rethrow the error to handle it in the component
  }
};


export const getVendorAllAddedCandidatesData = async (vendorId) => {
  try {
    const response = await axios.get(API_URL+ "/getAllCandidatesByVendorId", {
      params: {
          vendorId: vendorId
      }
  });
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates data:', error);
    throw error; // Rethrow the error to handle it in the component
  }
};