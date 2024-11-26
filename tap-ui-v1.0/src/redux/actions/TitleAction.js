import { ActionTypes } from "../contants/ActionTypes";




export const setTitleAction = (title) => {
  return {
    type: ActionTypes.SET_APPLICATION_TITLE,
    payload: title,
  };
};
