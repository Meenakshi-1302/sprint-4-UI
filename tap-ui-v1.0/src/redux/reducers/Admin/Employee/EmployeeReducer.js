import { ActionTypes } from '../../../contants/ActionTypes';

const initialState = {
    employees: [],
    locations: [],
    departments: [],
    jobTitles: [],
    managingAuthorities: []
};

const EmployeeReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SET_EMPLOYEES:
            return { ...state, employees: action.payload };
        case ActionTypes.SET_LOCATIONS:
            return { ...state, locations: action.payload };
        case ActionTypes.SET_DEPARTMENTS:
            return { ...state, departments: action.payload };
        case ActionTypes.SET_JOB_TITLES:
            return { ...state, jobTitles: action.payload };
        case ActionTypes.SET_MANAGING_AUTHORITIES:
            return { ...state, managingAuthorities: action.payload };
        case ActionTypes.ADD_EMPLOYEE:
            return { ...state, employees: [...state.employees, action.payload] };
        default:
            return state;
    }
};

export default EmployeeReducer;



