import axios from 'axios';
 
const USER_API_URL = 'http://localhost:8080/api/vendors/vendorResetPassword'; // Adjust user ID as needed
 
 
export const updatePassword = async (oldPassword,newPassword) => {
  try {
    const response = await axios.put(USER_API_URL, null ,
      {
        params:
        {
          newPassword: newPassword,
          email:"senathipathik@gmail.com",
          oldPassword:oldPassword
        }
      });
   
    console.log(response.data);
    return response.data; // Return the updated user data if needed
  } catch (error) {
    console.error('Error updating password:', error);
    throw error; // Rethrow the error for handling in the component
  }
};