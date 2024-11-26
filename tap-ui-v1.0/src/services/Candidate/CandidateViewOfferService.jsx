import axios from 'axios';

const BASE_URL = 'http://localhost:8080/tap/';

export const getOfferLetterByCandidateId = async (candidateId) => {
    try {
        const response = await axios.get(`${BASE_URL}getOfferLetterByCandidateId/${candidateId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching offer letter:', error);
        throw error;
    }
};

export const acceptOffer = async ({ offerId, candidateId,reason }) => {
    try {
        const response = await axios.patch(`http://localhost:8080/candidates/acceptOffer`, null, {
            params: {
                offerId,
                candidateId,
                reason

                
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error accepting the offer:", error);
        throw error;
    }
};