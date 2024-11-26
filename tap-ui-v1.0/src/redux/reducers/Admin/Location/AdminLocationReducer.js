import { ActionTypes } from "../../../contants/ActionTypes";
 
const initialState = {
  loading: false,
  locations: [],
  error: null,
};
 
const adminLocationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_ADMIN_LOCATIONS:
      return {
        ...state,
        locations: action.payload,
        error: null,
      };
    case ActionTypes.ADD_ADMIN_LOCATION:
      return {
        ...state,
        locations: [...state.locations, action.payload],
        error: null,
      };
    case ActionTypes.UPDATE_ADMIN_LOCATION:
      return {
        ...state,
        locations: state.locations.map(location =>
          location.locationId === action.payload.locationId ? action.payload : location
        ),
        error: null,
      };
    case ActionTypes.ADD_LOCATION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.ADD_LOCATION_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case ActionTypes.ADD_LOCATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ActionTypes.UPDATE_LOCATION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.UPDATE_LOCATION_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case ActionTypes.UPDATE_LOCATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
 
export default adminLocationReducer;