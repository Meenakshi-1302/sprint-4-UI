import { ActionTypes } from "../../../contants/ActionTypes";
 
const initialState = {};
 
const EventReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.ADD_EVENT: {
      const { date, event } = payload;
      return {
        ...state,
        [date]: [...(state[date] || []), event],
      };
    }
    case ActionTypes.DELETE_EVENT: {
      const { date, eventId } = payload;
      const updatedEvents = state[date].filter(event => event.id !== eventId);
      const newState = { ...state, [date]: updatedEvents };
 
      if (updatedEvents.length === 0) {
        delete newState[date];
      }
      return newState;
    }
    case ActionTypes.SET_EVENTS: {
      return payload;
    }
    default:
      return state;
  }
};
 
export default EventReducer;