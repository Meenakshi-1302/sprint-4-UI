import { ActionTypes } from '../../../redux/contants/ActionTypes';
 
// Action to add a task
export const addTaskAction = (task) => {
    return {
        type: ActionTypes.ADD_TASK,
        payload: task,
    };
};
 
// Action to delete a task
export const deleteTaskAction = (taskId) => {
    return {
        type: ActionTypes.DELETE_TASK,
        payload: taskId,
    };
};
 
// Action to update task status
export const updateTaskStatusAction = (taskId, newStatus) => {
    return {
        type: ActionTypes.UPDATE_TASK_STATUS,
        payload: { id: taskId, status: newStatus },  // new structure for payload
    };
};
 