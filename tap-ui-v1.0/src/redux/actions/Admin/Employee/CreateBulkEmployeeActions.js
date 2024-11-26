import { ActionTypes } from '../../../contants/ActionTypes';
import BulkEmployeeDataUploadService from '../../../../services/Admin/Employee/CreateBulkEmployeeService';

export const uploadEmployeeData = (formData) => {
    return async (dispatch) => {
      try {
        // Make the API call to upload the CSV file
        const response = await BulkEmployeeDataUploadService.uploadCSV(formData);
  
        console.log("Raw response:", response); // Log the raw response to verify
  
        // Check if the response has the expected structure
        if (response && response.response) {
          const { inserted, skipped, failed } = response.response;
  
          // Dispatch to Redux
          dispatch({
            type: ActionTypes.UPLOAD_EMPLOYEE_DATA,
            payload: {
              inserted,
              skipped,
              failed,
              totalProcessed: response.response.totalProcessed,
            },
          });
  
          // Return the data so it can be used in the component
          return response.response;
        } else {
          throw new Error('No data received from server');
        }
      } catch (error) {
        console.error('Error uploading employee data:', error);
        // Optionally, handle errors as needed
        throw error; // Throw error so that the `.catch()` in component can handle it
      }
    };
  };
  