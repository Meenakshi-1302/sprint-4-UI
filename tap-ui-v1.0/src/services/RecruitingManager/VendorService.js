import axios from "axios";

//this is an Vendor service file
const BASE_URL = "http://localhost:8080"
const VENDOR_URL = "api/vendors";

// this method will add new vendor 
// it will accept vendor DTO, params- email and Organization name
export const postNewVendor = (vendorDetails) => {
    try {
        return axios.post(`${BASE_URL}/${VENDOR_URL}`, vendorDetails);
    } catch (error) {
        return error;
    }
};
export const putUpdateVendor = (vendorId, updateVendor) => {
    try {
        return axios.put(`${BASE_URL}/${VENDOR_URL}/${vendorId}`, updateVendor);
    } catch (error) {
        return error;
    }
};
export const getAllVendor = () => {
    try {
        return axios.get(`${BASE_URL}/${VENDOR_URL}/allVendor`);
    } catch (error) {
        return error;
    }
};
export const getSingleVendor = (id) => {
    try {
        return axios.get(`${BASE_URL}/${VENDOR_URL}/${id}`);
    } catch (error) {
        return error;
    }
};
export const deleteVendorById = (id) => {
    try {
        return axios.delete(`${BASE_URL}/${VENDOR_URL}/${id}`);
    } catch (error) {
        return error;
    }
};



