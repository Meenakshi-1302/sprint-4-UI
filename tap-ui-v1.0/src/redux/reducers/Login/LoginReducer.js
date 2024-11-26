import { ActionTypes } from '../../contants/ActionTypes';
 
const initialState = {
    user: null,
    isLoggedIn: false,
    error: null,
    loading: false,
    successMessage: null,
};
 
const LoginReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.LOGIN_START:
            return { ...state, loading: true, error: null };
        case ActionTypes.LOGIN_SUCCESS:
            return { ...state, loading: false, user: action.payload, isLoggedIn: true, error: null };
        case ActionTypes.LOGIN_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ActionTypes.SET_SUCCESS_MESSAGE:
            return { ...state, successMessage: action.payload };
        case ActionTypes.RESET_LOGIN_MESSAGES: // Reset messages
            return { ...state, successMessage: null, error: null };
        default:
            return state;
    }
};
 
export default LoginReducer;