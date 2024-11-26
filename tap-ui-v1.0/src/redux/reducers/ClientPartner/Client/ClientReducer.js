// import { ActionTypes } from "../../contants/ActionTypes"; // Ensure the path is correct

// const initialState = {
//   users: [], // This should be an array
// };

// export const userReducer = (state = initialState, { type, payload }) => {
//   switch (type) {
//     case ActionTypes.ADD_USER:
//       return {
//         ...state,
//         users: [...state.users, payload],
//       };
//     case ActionTypes.SET_USERS:
//       return {
//         ...state,
//         users: payload, // Ensure payload is an array
//       };
//     default:
//       return state;
//   }
// };


import { ActionTypes } from "../../../contants/ActionTypes";

const initialState = {
  users: [],
};

export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.ADD_USER:
      return {
        ...state,
        users: [...state.users, payload],
      };
    case ActionTypes.SET_USERS:
      return {
        ...state,
        users: payload,
      };
    default:
      return state;
  }
};

