// src/redux/actions/UserAction.js
import { ActionTypes } from "../../../contants/ActionTypes"; // Ensure the path is correct
import axios from 'axios';

export const addUser = (user) => {
  return {
    type: ActionTypes.ADD_USER,
    payload: user,
  };
};

export const setUsers = (users) => {
  return {
    type: ActionTypes.SET_USERS,
    payload: users,
  };
};


