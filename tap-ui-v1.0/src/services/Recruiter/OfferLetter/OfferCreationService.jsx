import axios from "axios";

export const getSelectedCandidatesByMrfId = async (mrfId) => {
    try {
        const response = await axios.get(`http://localhost:8080/mrfCandidates/selectedcandidate/${mrfId}`);
        return response;
    } catch (error) {
        console.error('Error fetching selected candidate data:', error);
        throw error;
    }
}

export const getOfferLetterByCandidateId = async (candidateId) => {
    try {
        const response = await axios.get(`http://localhost:8080/tap/getOfferLetterByCandidateId/${candidateId}`);
        return response;
    } catch (error) {
        console.error('Error fetching candidate offer letter data:', error);
        throw error;
    }
}

export const getMrfByMrfId = async (mrfId) => {
    try {
        const response = await axios.get(`http://localhost:8080/tap/mrf/getMrf/${mrfId}`);
        return response;
    } catch (error) {
        console.error('Error fetching mrf data:', error);
        throw error;
    }
}