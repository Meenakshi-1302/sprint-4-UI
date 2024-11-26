
import { ActionTypes } from "../../../contants/ActionTypes";

const initialState = {
  departments: [],  // Make sure this is initialized as an empty array
};

export const AdminDepartmentReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_ADMIN_DEPARTMENTS:
      return {
        ...state,
        departments: payload,  // Set fetched departments
      };
    case ActionTypes.ADD_ADMIN_DEPARTMENT:
      return {
        ...state,
        departments: [...state.departments, payload],  // Add new department
      };
    default:
      return state;
  }
};
