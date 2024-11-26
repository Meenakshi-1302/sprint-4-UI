import { ActionTypes } from "../../../contants/ActionTypes";
 
const initialState = {
    bussinessUnits: [],  // Ensure the bussinessUnits state is always an empty array by default
};
 
export const BussinessUnitReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_BUSSINESS_UNITS:
            return {
                ...state,
                bussinessUnits: payload, // Correctly updating the bussinessUnits
            };
        case ActionTypes.ADD_BUSSINESS_UNIT:
            return {
                ...state,
                bussinessUnits: [...state.bussinessUnits, payload], // Adding new bussiness unit to the state
            };
        default:
            return state;
    }
};