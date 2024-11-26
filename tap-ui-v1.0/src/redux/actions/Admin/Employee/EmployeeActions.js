import { getEmployees, getLocations, getDepartments, getJobTitles, getManagingAuthorities, addEmployee } from '../../../../services/Admin/Employee/EmployeeService';
import { ActionTypes } from '../../../contants/ActionTypes';
import { updateEmployee } from '../../../../services/Admin/Employee/EmployeeService'; // This is the service function to update an employee
 
// Action to edit an existing employee
// src/redux/actions/Admin/Employee/EmployeeActions.js
 
// Action to edit an existing employee
export const setAdminRolesAction = (roles) => {
    return {
      type: ActionTypes.SET_ADMIN_ROLES,
      payload: roles,
    };
  };

export const editEmployee = (employeeId, employeeData) => async (dispatch) => {
    try {
        // Call the service to update the employee (sending PUT request)
        const updatedEmployee = await updateEmployee(employeeId, employeeData);
 
        // Dispatch action to update the employee in the Redux store
        dispatch({
            type: ActionTypes.EDIT_EMPLOYEE,
            payload: updatedEmployee,  // The updated employee data
        });
 
        // Optionally, show success notification
        dispatch({
            type: ActionTypes.NOTIFY_SUCCESS,
            payload: { message: "Employee updated successfully" },
        });
 
    } catch (error) {
        console.error("Error updating employee:", error);
       
        // Optionally, dispatch an error action or show an error notification
        dispatch({
            type: ActionTypes.NOTIFY_ERROR,
            payload: { message: "Failed to update employee" },
        });
    }
};
 
 
// Action to fetch employee data
export const fetchEmployeeData = () => async (dispatch) => {
    try {
        // Fetch data from the service
        const employees = await getEmployees();
        // const locations = await getLocations();
        // const departments = await getDepartments();
        // const jobTitles = await getJobTitles();
        // const managingAuthorities = await getManagingAuthorities();
 
        // Dispatch actions to set the data in the Redux store
        dispatch({ type: ActionTypes.SET_EMPLOYEES, payload: employees });
        // dispatch({ type: ActionTypes.SET_LOCATIONS, payload: locations });
        // dispatch({ type: ActionTypes.SET_DEPARTMENTS, payload: departments });
        // dispatch({ type: ActionTypes.SET_JOB_TITLES, payload: jobTitles });
        // dispatch({ type: ActionTypes.SET_MANAGING_AUTHORITIES, payload: managingAuthorities });
    } catch (error) {
        console.error("Error fetching employee data:", error);
    }
};
 
// Action to create a new employee
export const createEmployee = (employeeData) => async (dispatch) => {
    try {
        // Add new employee using the service
        const newEmployee = await addEmployee(employeeData);
        // Dispatch action to add the new employee in the Redux store
        dispatch({ type: ActionTypes.ADD_EMPLOYEE, payload: newEmployee });
        // dispatch({ type: ActionTypes.SET_EMPLOYEES, payload: employees });
 
    } catch (error) {
        console.error("Error adding employee:", error);
    }
};



// export const fetchEmployeeData = () => async (dispatch) => {
//     try {
//         const employees = await getEmployees();
//         console.log('Fetched Employees:', employees); // Log the fetched employees

//         if (Array.isArray(employees)) {
//             dispatch({ type: ActionTypes.SET_EMPLOYEES, payload: employees });
//         } else {
//             console.error('Fetched employees is not an array:', employees);
//             dispatch({ type: ActionTypes.SET_EMPLOYEES, payload: [] }); // Reset to empty if not an array
//         }
//     } catch (error) {
//         console.error("Error fetching employee data:", error);
//     }
// };
