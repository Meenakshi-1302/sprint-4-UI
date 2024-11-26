import axios from "axios";

const BASE_URL = "http://localhost:8080";
const RECRUITING_MANAGER = "api/recruitingManager";

export const addCandidateByRecruitingManager=(formDataToSubmit)=>{
    try{
      const response =  axios.post(`${BASE_URL}/${RECRUITING_MANAGER}/add-candidate`,formDataToSubmit);
      return response;
    }
    catch(error){
        console.log(error);
   return error
    }
}

export const getCandidatesAddedByRecruitingManager =(sourceId) => {
  try {
      return axios.get(`${BASE_URL}/${RECRUITING_MANAGER}/referral/${sourceId}`);
  } catch (error) {
      return error;
  }
};