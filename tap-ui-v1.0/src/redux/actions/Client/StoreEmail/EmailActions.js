import { ActionTypes } from "../../../contants/ActionTypes";

export const setEmail = (email) => {
  localStorage.setItem('email', email);
  return {
    
    type: ActionTypes.SET_EMAIL,
    payload: email,
  };
};