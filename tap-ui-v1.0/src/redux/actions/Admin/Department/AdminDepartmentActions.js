import { ActionTypes } from "../../../contants/ActionTypes";
import { getAdminDepartments, addDepartment, updateDepartment } from '../../../../services/Admin/Department/AdminDepartmentService'; // Service to fetch, add, and update departments
 
// Action to set departments in Redux
export const setAdminDepartmentsAction = (departments) => {
  return {
    type: ActionTypes.SET_ADMIN_DEPARTMENTS,
    payload: departments,
  };
};
 
// Action to update an existing department
export const updateDepartmentAction = (departmentId, departmentData) => {
  return async (dispatch) => {
    try {
      // Call API to update the department
      const updatedDepartment = await updateDepartment(departmentId, departmentData);
 
      // Dispatch action to update department in Redux store
      dispatch({
        type: ActionTypes.UPDATE_ADMIN_DEPARTMENT,
        payload: updatedDepartment,  // The updated department
      });
 
      // Optionally, refetch departments or update the list if necessary
      // dispatch(fetchAdminDepartments()); // Uncomment if you need to refetch the department list
    } catch (error) {
      console.error('Error updating department:', error);
      // Optionally, dispatch an error action if needed
    }
  };
};
 
// Action to add a new department and update Redux store
export const addAdminDepartmentAction = (department) => {
  return async (dispatch) => {
    try {
      // Make API call to add the department
      const addedDepartment = await addDepartment(department);
 
      // Optionally, you can also dispatch an action to update the state immediately after adding the department
      dispatch({
        type: ActionTypes.ADD_ADMIN_DEPARTMENT,
        payload: addedDepartment,  // New department added
      });
 
      // You can also fetch the updated list of departments (if needed)
      dispatch(fetchAdminDepartments());
    } catch (error) {
      console.error('Error adding department:', error);
      // Optionally, dispatch an error action if needed
    }
  };
};
 
// Action to fetch all departments from API
export const fetchAdminDepartments = () => {
  return async (dispatch) => {
    try {
      const departments = await getAdminDepartments(); // Fetching departments from API
      dispatch(setAdminDepartmentsAction(departments)); // Dispatch the action to set departments
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };
};