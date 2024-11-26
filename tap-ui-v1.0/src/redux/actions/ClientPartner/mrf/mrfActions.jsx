
import axios from 'axios';
export const ActionTypes = {
    SET_MRF_DATA: 'SET_MRF_DATA',
    SUBMIT_MRF_FORM: 'SUBMIT_MRF_FORM',
  };
  
  export const setMRFData = (data) => ({
    type: ActionTypes.SET_MRF_DATA,
    payload: data,
  });
  

  