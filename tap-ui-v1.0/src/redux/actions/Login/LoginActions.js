import { ActionTypes } from '../../contants/ActionTypes';
import { validateLogin } from '../../../services/LoginService';
import { LOGIN_MESSAGES } from '../../../constants/LoginConstant';
 
// Async action to handle login
export const login = (email, password) => async (dispatch) => {
    // Reset previous messages
    dispatch({ type: ActionTypes.RESET_LOGIN_MESSAGES });
 
    dispatch({ type: ActionTypes.LOGIN_START });
 
    try {
        const user = await validateLogin(email, password);
        dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: user });
        dispatch({ type: ActionTypes.SET_SUCCESS_MESSAGE, payload: LOGIN_MESSAGES.SUCCESS });
    } catch (error) {
        dispatch({ type: ActionTypes.LOGIN_FAILURE, payload: error.message });
    }
};