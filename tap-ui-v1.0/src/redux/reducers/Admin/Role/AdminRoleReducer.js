

// import { ActionTypes } from "../../../contants/ActionTypes";

// const initialState = {
//   roles: [], 
// };

// export const AdminRoleReducer = (state = initialState, { type, payload }) => {
//   switch (type) {
//     case ActionTypes.SET_ADMIN_ROLES:
//       return {
//         ...state,
//         roles: payload, // Set the fetched roles in the state
//       };
//     case ActionTypes.ADD_ADMIN_ROLE:
//       return {
//         ...state,
//         roles: [...state.roles, payload], // Add new role to the state
//       };
//     default:
//       return state;
//   }
// };

import { ActionTypes } from "../../../contants/ActionTypes";

const initialState = {
  roles: [], 
};

export const AdminRoleReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_ADMIN_ROLES:
      return {
        ...state,
        roles: payload, // Set the fetched roles in the state
      };
    case ActionTypes.ADD_ADMIN_ROLE:
      return {
        ...state,
        roles: [...state.roles, payload], // Add new role to the state
      };
    default:
      return state;
  }
};
