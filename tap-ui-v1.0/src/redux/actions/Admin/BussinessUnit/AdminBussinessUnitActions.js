import { ActionTypes } from "../../../contants/ActionTypes";
import { getBussinessUnits, addBussinessUnit, updateBussinessUnit } from '../../../../services/Admin/BussinessUnit/AdminBusinessUnitService'; // Import services
import { getLocations } from '../../../../services/Admin/Location/LocationService';
// Action to set business units
export const setBussinessUnitsAction = (bussinessUnits) => {
  return {
    type: ActionTypes.SET_BUSSINESS_UNITS,
    payload: bussinessUnits,
  };
};
 
// Action to update a business unit
export const updateBussinessUnitAction = (id, updatedData) => async (dispatch) => {
  try {
    // Call the API to update the business unit
    const response = await updateBussinessUnit(id, updatedData); // This should be the correct API service call
    dispatch({
      type: ActionTypes.UPDATE_BUSSINESS_UNIT,
      payload: response.data, // Adjust depending on API response structure
    });
 
    // Optionally refetch the business units after the update
    dispatch(fetchBussinessUnitsAndLocations());
 
  } catch (error) {
    console.error('Error updating business unit:', error);
  }
};
 
// Action to add a new business unit
export const addBussinessUnitAction = (bussinessUnit) => {
  console.log("BU Action", bussinessUnit);  // Debugging log
 
  return async (dispatch) => {
    try {
      const addBuResponse = await addBussinessUnit(bussinessUnit); // Pass the object directly
      dispatch({
        type: ActionTypes.ADD_BUSSINESS_UNIT,
        payload: addBuResponse, // Adjust as needed based on the API response
      });
 
      // Refetch business units and locations after adding a new business unit
      dispatch(fetchBussinessUnitsAndLocations());
 
    } catch (error) {
      console.error('Error adding Business Unit:', error);
    }
  };
};
 
// Action to set locations
export const setLocationsAction = (locations) => ({
  type: ActionTypes.SET_LOCATIONS,
  payload: locations,
});
 
// Fetch business units and locations
export const fetchBussinessUnitsAndLocations = () => {
  return async (dispatch) => {
    try {
      // Fetching business units
      const bussinessUnits = await getBussinessUnits();
      dispatch(setBussinessUnitsAction(bussinessUnits));
 
      // Fetching locations
      const locations = await getLocations();
      dispatch(setLocationsAction(locations));
 
    } catch (error) {
      console.error('Error fetching business units or locations:', error);
      // Optionally dispatch an error action here
    }
  };
};