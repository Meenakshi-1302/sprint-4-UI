import { ActionTypes } from "../../../contants/ActionTypes";
import { addLocation, getLocations, updateLocation } from '../../../../services/Admin/Location/LocationService';
 
// Action creator for setting locations in state
export const setAdminLocationsAction = (locations) => {
  return {
    type: ActionTypes.SET_ADMIN_LOCATIONS,
    payload: locations,
  };
};
 
// Action creator for adding a new location
export const addAdminLocationAction = (location) => {
  return {
    type: ActionTypes.ADD_ADMIN_LOCATION,
    payload: location,
  };
};
 
// Action creator for updating a location
export const updateAdminLocationAction = (updatedLocation) => {
  return {
    type: ActionTypes.UPDATE_ADMIN_LOCATION,
    payload: updatedLocation,
  };
};
 
// Action creator for fetching all locations
export const fetchAdminLocations = () => {
  return async (dispatch) => {
    try {
      const locations = await getLocations();
      dispatch(setAdminLocationsAction(locations));
    } catch (error) {
      console.error('Error fetching admin locations:', error);
    }
  };
};
 
// Action creator for adding a new location
export const createAdminLocation = (locationData) => {
  return async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.ADD_LOCATION_REQUEST });
      const newLocation = await addLocation(locationData);
      dispatch(addAdminLocationAction(newLocation));
      dispatch({ type: ActionTypes.ADD_LOCATION_SUCCESS });
    } catch (error) {
      dispatch({ type: ActionTypes.ADD_LOCATION_FAILURE, payload: error.message });
      console.error('Error adding location:', error);
    }
  };
};
 
// Action creator for updating an existing location
export const updateAdminLocation = (locationId, locationData) => {
  return async (dispatch) => {
    try {
      dispatch({ type: ActionTypes.UPDATE_LOCATION_REQUEST });
      const updatedLocation = await updateLocation(locationId, locationData); // Call the updateLocation service
      dispatch(updateAdminLocationAction(updatedLocation)); // Dispatch update action
      dispatch({ type: ActionTypes.UPDATE_LOCATION_SUCCESS });
    } catch (error) {
      dispatch({ type: ActionTypes.UPDATE_LOCATION_FAILURE, payload: error.message });
      console.error('Error updating location:', error);
    }
  };
};