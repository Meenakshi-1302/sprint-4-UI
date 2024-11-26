import { combineReducers } from 'redux';
import overallReducer from './OverallReducer'; // Adjust the path as necessary

const rootReducer = combineReducers({
  overall: overallReducer,
  // Add other reducers here if needed
});

export default rootReducer;
