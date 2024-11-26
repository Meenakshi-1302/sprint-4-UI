import { combineReducers } from "redux";
import { TitleReducer } from "./TitleReducer"; // Ensure this matches your file name
import { userReducer } from "../reducers/ClientPartner/Client/ClientReducer";  // Ensure this matches your file name
import { MRFReducer } from "../reducers/ClientPartner/mrf/mrfReducer";
import { AdminRoleReducer } from "../reducers/Admin/Role/AdminRoleReducer";
import LoginReducer from "../reducers/Login/LoginReducer";
import EmployeeReducer from '../reducers/Admin/Employee/EmployeeReducer';
import { EmailReducer } from "../reducers/Client/EmailReducer";
import { RequirementReducer } from "../reducers/Client/RequirementReducer";
import { AdminDepartmentReducer } from '../reducers/Admin/Department/AdminDepartmentReducer';
import EventReducer from "./ClientPartner/Event/EventReducer";


import { ToDoListReducer } from '../reducers/TODO/ToDoListReducer';

const OverallReducer = combineReducers({
  title: TitleReducer,
  users: userReducer,
  mrf: MRFReducer,
  adminRoles: AdminRoleReducer,
  login: LoginReducer,
  employee: EmployeeReducer,
  email: EmailReducer, 
  requirement: RequirementReducer,
  adminDepartments: AdminDepartmentReducer,

  toDoList: ToDoListReducer,
  events: EventReducer,
});

export default OverallReducer;