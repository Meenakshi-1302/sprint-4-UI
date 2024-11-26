import axios from 'axios';
 
const BASE_URL = 'http://localhost:8080/tap';
// const BASE_URL = 'http://192.168.62.101:8080';

export const getAllDepartments = async () => {
    const response = await axios.get(BASE_URL+'/getalldepartment');
    return response.data; 
};