import { ActionTypes } from '../../../redux/contants/ActionTypes';
 
const loadTasks = () => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];  // Ensuring it returns an empty array if no tasks are found
  };
 
  const initialState = {
    tasks: loadTasks(),  // This will be an empty array or the parsed tasks
  };
 
 
export const ToDoListReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.ADD_TASK:
            const newTasksAfterAdd = [...state.tasks, action.payload];
            localStorage.setItem('tasks', JSON.stringify(newTasksAfterAdd)); // Save to localStorage
            return {
                ...state,
                tasks: newTasksAfterAdd,
            };
        case ActionTypes.DELETE_TASK:
            const newTasksAfterDelete = state.tasks.filter(task => task.id !== action.payload);
            localStorage.setItem('tasks', JSON.stringify(newTasksAfterDelete)); // Save to localStorage
            return {
                ...state,
                tasks: newTasksAfterDelete,
            };
        case ActionTypes.UPDATE_TASK_STATUS:
            const updatedTasks = state.tasks.map(task =>
                task.id === action.payload.id ? { ...task, status: action.payload.status } : task
            );
            localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Save to localStorage
            return {
                ...state,
                tasks: updatedTasks,
            };
        default:
            return state;
    }
};
 
export default ToDoListReducer;