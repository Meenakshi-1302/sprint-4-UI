import axios from 'axios';
 
const BASE_URL = 'http://localhost:8080/candidates/'; // Change this as needed for your upload API
 
// Service function to upload candidate documents
export const uploadCandidateDocuments = async (candidateId, documents) => {
    const payload = {
        candidateId: candidateId,
        documents: documents.map(doc => ({
            name: doc.name,
        })),
    };
 
    try {
        const response = await axios.post(`${BASE_URL}/uploadDocuments/{candidateId}`, payload, {
            onUploadProgress: (progressEvent) => {
                // You can handle progress event here if required
            },
        });
        return response.data; // Processed server response here
    } catch (error) {
        console.error('Error uploading documents:', error);
        throw error; // Bubble up the error
    }
};


// import axios from 'axios';

// const BASE_URL = 'http://localhost:8080/candidates/'; // Adjust this according to your actual API URL

// // Service function to upload candidate documents
// export const uploadCandidateDocuments = async (formData, setUploadProgress) => {
//     try {
//         const response = await axios.post(`${BASE_URL}upload`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//             onUploadProgress: (progressEvent) => {
//                 // Calculate the progress percentage
//                 const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                 setUploadProgress(percentCompleted);
//             },
//         });
//         return response.data; // Processed server response here
//     } catch (error) {
//         console.error('Error uploading documents:', error);
//         throw error; // Bubble up the error
//     } 
// };