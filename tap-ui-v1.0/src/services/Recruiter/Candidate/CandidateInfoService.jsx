import axios from "axios";

export const getOfferApprovalByCandidateIdAndMrfId = async (candidateId, mrfId) => {
    try {
        const response = await axios.get(`http://localhost:8080/tap/getOfferApprovalByCandidateIdAndMrfId`, {
            params: { candidateId, mrfId }
        });
        return response;
    } catch (error) {
        console.error('Error fetching offer approval:', error);
        throw error;
    }
};
 
export const getCandidateById = async (candidateId) => {
    try {
        const response = await axios.get(`http://localhost:8080/candidates/get/${candidateId}`);
        return response;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
}

export const getApprovalLevel = async (mrfId) => {
    try {
        const response = await axios.get(`http://localhost:8080/tap/getApproverLevel/${mrfId}`);
        return response;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
}

export const getAllCandidates = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/candidates/all`);
        return response.data; // Returning the data directly
    } catch (error) {
        console.error('Error fetching all candidates:', error);
        throw error;
    }
}