import React, { useState, useEffect } from "react";
import {
  FaTrash,
  FaCheckCircle,
  FaExclamationCircle,
  FaTasks,
  FaClock,
  FaRegTrashAlt,
  FaUserSecret,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  addTaskAction,
  deleteTaskAction,
  updateTaskStatusAction,
} from "../../../redux/actions/TODO/ToDoAction";
import todologo from "../../../assets/todolist.gif"; // Change to todolist.gif
 
const ToDoList = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.toDoList.tasks);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("All Tasks");
  const [userName, setUserName] = useState('');
 
  const handleAddTask = () => {
    if (newTask) {
      const taskToAdd = {
        id: Date.now(),
        name: newTask,
        status: "Pending",
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };
      dispatch(addTaskAction(taskToAdd));
      setNewTask("");
    }
  };
 
  useEffect(() => {
    // Get user email from session storage or any global state you're using
    // const userEmail = sessionStorage.getItem('email'); // Assuming the email is saved in session storage
 
    // // Extract the name from email (before @)
    // if (userEmail) {
    //     setUserName(userEmail.split('@')[0]); // Get the part before '@'
    // }
    const clientPartnerName = sessionStorage.getItem('email');
    const usernameWithDigits = clientPartnerName.split('@')[0];

    // Remove all numbers from the username part
    const username = usernameWithDigits.replace(/\d+/g, '');

    // Optional: Trim to remove any extra spaces
    const trimmedUsername = username.trim();
 
        // Extract the name from email (before @)
        if (trimmedUsername) {
            setUserName(trimmedUsername.split('@')[0]); // Get the part before '@'
        }
 
}, []);
 
  const handleDelete = (id) => {
    dispatch(deleteTaskAction(id));
  };
 
  const handleStatusChange = (id, newStatus) => {
    dispatch(updateTaskStatusAction(id, newStatus));
  };
 
  const filteredTasks = (() => {
    if (filter === "All Tasks") return tasks;
    return tasks.filter((task) => task.status === filter);
  })();
 
  const countByStatus = (status) => tasks.filter((task) => task.status === status).length;
 
  return (
    // <div className="flex items-center justify-center min-h-screen bg-[#eeeeee] p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md w-full max-w-[900px]"> {/* Responsive width */}
        {/* User Info Section */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col w-full md:w-2/4 mr-4">
          <div className="flex items-center mb-4">
            <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center mr-2">
              <FaUserSecret className="text-lg" />
            </div>
            {/* <div> */}
              <h2 className="text-md font-semibold">{userName}</h2>
              {/* <p className="text-gray-600 text-sm">sam.peter@relevantz.com</p> */}
             
            {/* </div> */}
          </div>
          {/* Logo Section */}
          <div className="bg-[#7366FF] text-white flex items-center py-2 rounded-md mb-4">
            <img src={todologo} alt="To Do Logo" className="h-10 w-10 mx-2" />
            <h2 className="font-semibold text-md">To Do List</h2>
          </div>
          {/* Task Categories */}
          <div className="flex flex-col space-y-2 mb-4">
            {[
              {
                title: "All Tasks",
                icon: <FaTasks />,
                color: "bg-purple-200",
                iconColor: "text-purple-800",
              },
              {
                title: "Completed",
                icon: <FaCheckCircle />,
                color: "bg-green-200",
                iconColor: "text-green-800",
                countColor: "bg-green-300",
              },
              {
                title: "Pending",
                icon: <FaExclamationCircle />,
                color: "bg-yellow-200",
                iconColor: "text-yellow-800",
                countColor: "bg-yellow-300",
              },
              {
                title: "In Process",
                icon: <FaClock />,
                color: "bg-blue-200",
                iconColor: "text-blue-800",
                countColor: "bg-blue-300",
              },
              {
                title: "Trash",
                icon: <FaRegTrashAlt />,
                color: "bg-red-200",
                iconColor: "text-red-800",
                countColor: "bg-red-300",
              },
            ].map(({ title, icon, color, iconColor, countColor }, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`rounded-full h-8 w-8 ${color} flex items-center justify-center mr-2`}>
                      {React.cloneElement(icon, {
                        className: `${iconColor} text-md`,
                      })}
                    </div>
                    <button
                      className="flex-1 text-black text-sm text-left py-1 rounded-md hover:bg-transparent transition duration-200"
                      onClick={() => setFilter(title)} // Set filter on button click
                    >
                      {title}
                    </button>
                  </div>
                  {/* Only show the count if it's not "All Tasks" */}
                  {title !== "All Tasks" && (
                    <div className={`text-white h-6 w-6 flex items-center justify-center rounded-md ml-2 ${countColor}`}>
                      {countByStatus(title === "All Tasks" ? "" : title)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
 
        {/* Task List Section */}
        <div className="flex flex-col w-full md:w-4/4 rounded-lg shadow-md p-4 border border-gray-300 border-l-0 ">
          <div className="flex items-center justify-between p-2 border-b border-gray-300 mb-2 max-w-[3000px]">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              type="text"
              className="border border-gray-300 rounded-md p-2 flex-grow focus:border-[#7366FF] focus:border-2 focus:outline-none text-sm"
              placeholder="Enter task here"
            />
            <button
              onClick={handleAddTask}
              className="bg-[#7366FF] text-white px-4 py-2 rounded-md ml-2 text-md"
            >
              Add Task
            </button>
          </div>
          {/* Task Table */}
          <div className="overflow-x-auto p-2 flex-grow ">
            <table className="w-full border border-gray-300 text-sm">
              <thead>
                <tr className="text-left bg-[#7366FF] text-white rounded-t-lg">
                  <th className="py-2 text-center rounded-tl-lg">Task</th>
                  <th className="py-2 text-center">Status</th>
                  <th className="py-2 text-center">Date</th>
                  <th className="py-2 text-center rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => {
                  let rowColor = "";
                  let taskTextColor = "";
 
                  switch (task.status) {
                    case "Pending":
                      rowColor = "bg-yellow-100";
                      taskTextColor = "";
                      break;
                    case "Completed":
                      rowColor = "bg-green-100";
                      taskTextColor = "line-through";
                      break;
                    case "In Process":
                      rowColor = "bg-blue-100";
                      taskTextColor = "";
                      break;
                    case "Trash":
                      rowColor = "bg-red-100";
                      taskTextColor = "line-through";
                      break;
                    default:
                      break;
                  }
 
                  return (
                    <tr key={task.id} className={`border-b ${rowColor}`}>
                      <td
                        className={`py-2 text-md font-semibold text-center ${taskTextColor} ${
                          task.status === "Completed"
                            ? "text-green-800"
                            : "text-black"
                        }`}
                      >
                        {task.name}
                      </td>
                      <td className={`py-2 text-center ${rowColor}`}>
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task.id, e.target.value)
                          }
                          className={`border rounded-md p-1 text-sm ${rowColor} w-24`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="In Process">In Process</option>
                          <option value="Trash">Trash</option>
                        </select>
                      </td>
                      <td className="py-2 text-center">{task.date}</td>
                      <td className="py-2 text-center">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="flex items-center justify-center bg-red-200 text-red-500 rounded-full h-8 w-8 hover:bg-red-300 transition duration-200"
                          >
                            <FaRegTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    // </div>
  );
};
 
export default ToDoList;