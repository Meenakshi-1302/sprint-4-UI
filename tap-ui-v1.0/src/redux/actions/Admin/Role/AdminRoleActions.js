

import { ActionTypes } from "../../../contants/ActionTypes";
import { getAdminRoles } from '../../../../services/Admin/Role/AdminRoleService'; // Import the service to fetch roles


export const setAdminRolesAction = (roles) => {
  return {
    type: ActionTypes.SET_ADMIN_ROLES,
    payload: roles,
  };
};

export const addAdminRoleAction = (role) => {
  return {
    type: ActionTypes.ADD_ADMIN_ROLE,
    payload: role,
  };
};

export const fetchAdminRoles = () => {
  return async (dispatch) => {
    try {
      const roles = await getAdminRoles(); // Fetching roles from JSON server
      dispatch(setAdminRolesAction(roles));
    } catch (error) {
      console.error('Error fetching admin roles:', error);
      // Optionally, handle errors - e.g., dispatching an error action
    }
  };
};