import { ActionTypes } from "../contants/ActionTypes";
 
export const addClientRequirements = (requirement) => {
  return {
    type: ActionTypes.ADD_CLIENT_REQUIREMENTS,
    payload: requirement,
   
  };
};
export const SET_SUB_REQUIREMENT_IDS = 'SET_SUB_REQUIREMENT_IDS';
 
export const setSubRequirementIds = (ids) => ({
    type: SET_SUB_REQUIREMENT_IDS,
    payload: ids,
});