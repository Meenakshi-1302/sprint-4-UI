// reducers/RequirementReducer.js
 
import { ActionTypes } from '../contants/ActionTypes'; // Ensure the path is correct
import { SET_SUB_REQUIREMENT_IDS } from '../actions/RequirementActions'; // Ensure the path is correct
 
const initialState = {
    requirements: [],
    clients: [],
    subRequirementIds: [],
};
 
export const RequirementReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.ADD_CLIENT_REQUIREMENTS:
            return {
                ...state,
                requirements: [...state.requirements, action.payload],
            };
        case SET_SUB_REQUIREMENT_IDS:
            return {
                ...state,
                subRequirementIds: action.payload,
            };
        // You can add more case statements for other actions...
        default:
            return state;
    }
};