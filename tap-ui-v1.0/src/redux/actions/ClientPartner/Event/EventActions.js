import { ActionTypes } from "../../../contants/ActionTypes";
 
export const addEvent = (date, event) => {
  return {
    type: ActionTypes.ADD_EVENT,
    payload: { date, event },
  };
};
 
export const deleteEvent = (date, eventId) => {
  return {
    type: ActionTypes.DELETE_EVENT,
    payload: { date, eventId },
  };
};
 
export const setEvents = (events) => {
  return {
    type: ActionTypes.SET_EVENTS,
    payload: events,
  };
};