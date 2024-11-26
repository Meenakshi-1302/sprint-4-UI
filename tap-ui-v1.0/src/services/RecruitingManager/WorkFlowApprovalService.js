import axios from "axios";

const BASE_URL = "http://localhost:8080"
const TAP_URL = "tap"
const GET_WORKFLOW_EMPLOYEE = "getWorkflowbyEmployeeId"
const GET_RECRUITMENT_PROCESS_LEVELS = "getRecruitmentProcessLevels"
const UPDATE_STATUS = "updateWorkFlow"


export const getAllWorkFlowByEmployeeId = (employeeId) =>{
    try{
        return axios.get(`${BASE_URL}/${TAP_URL}/${GET_WORKFLOW_EMPLOYEE}/${employeeId}`);
    } catch(error){
        return error;
    }
}

export const getRecruitmentProcessLevelByMrf = (mrfId) =>{
    try{
        return axios.get(`${BASE_URL}/${TAP_URL}/${GET_RECRUITMENT_PROCESS_LEVELS}/${mrfId}`);
    } catch(error){
        return error;
    }
}

export const updateWorkFlow = (workflowId, data) =>{
    try{
        return axios.patch(`${BASE_URL}/${TAP_URL}/${UPDATE_STATUS}/${workflowId}`, data)
    }catch(error){
        return error;
    }
}