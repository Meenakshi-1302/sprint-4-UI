import { ActionTypes } from "../contants/ActionTypes";



const initialState = {
  title: "",
};

export const TitleReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_APPLICATION_TITLE:
      return {
        ...state,
        title: payload,
      };
    default:
      return state;
  }
};
