import axios from "axios";

//this is an example service file
// Recruiting Manager
const BASE_URL = "http://localhost:8080";
const RECRUITING_MANAGER = "api/recruitingManager";

// get mrf by id - tap/mrf/getMrf/{id}
export const getMrfsResponse = (rmId) => {
    try {
        return axios.get(`${BASE_URL}/${RECRUITING_MANAGER}/allMrfs/${rmId}`);
    } catch (error) {
        return error;
    }
};

export const getMrfsVendorResponse = () => {
    try {
        return axios.get(`${BASE_URL}/${RECRUITING_MANAGER}/fetch/allMrfVendors`);
    } catch (error) {
        return error;
    }
};

export const postMrfsVendorAssign = (mrfVendor) => {
    try {
        return axios.post(`${BASE_URL}/${RECRUITING_MANAGER}/assignMrfs/vendor`, mrfVendor);
    } catch (error) {
        return error;
    }
};

export const getSingleMrf = (mrfId) => {
    try {
        return axios.get(`${BASE_URL}/tap/mrf/getMrf/${mrfId}`);
    } catch (error) {
        return error;
    }
};

export const getAllRecruitersAssignedRecruitingManager = (rmId) => {
    try {        
        return axios.get(`http://localhost:8080/api/recruitingManager/${rmId}`)
    } catch (error) {
        return error;
    }    
}

export const getEmployeeByUserId = (rmId) => {
    try {        
        return axios.get(`http://localhost:8080/tap/login-credentials/${rmId}`)
    } catch (error) {
        return error;
    }        
}

export const assignMrfToRecruiter = (mrfRecruitId, recId) => {
    const data = {
        mrfRecruitingManagerId: mrfRecruitId,
        recruiterId: recId,
        recruiterAssignedStatus:"Assigned"
    }
    try {
        console.log(data);        
        return axios.post(`${BASE_URL}/${RECRUITING_MANAGER}/assignMrfs/recruiter`,data);
    } catch (error) {
        return error;
    }
};

const JSON_SERVER = "http://localhost:4040"

export const getALLMrfAssignedForRM = () => {
    try {
        return axios.get(`${JSON_SERVER}/MrfsRM`);
    } catch (error) {
        return error;
    }
};