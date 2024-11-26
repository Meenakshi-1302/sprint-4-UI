import axios from "axios";

const BASE_URL = "http://localhost:8080";
const TAP_URL = "tap"
const GET_ALL_OFFER_BYRM = "getAllOffersByRMId";


export const getAllOfferByRm = (employeeId) => {
    try{
        return axios.get(`${BASE_URL}/${TAP_URL}/${GET_ALL_OFFER_BYRM}/${employeeId}`);
    }
    catch(error){
        return error;
    }
}