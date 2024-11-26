// // import React, { useState } from 'react';
// // import ClientNavbar from '../../../components/NavbarComponent/ClientPartnerNavbar';
// // import ClientPartnerTabs from '../Dashboard/ClientPartnerTabs';

// // function ClientPartnerDashboard() {
// //   const [sidebarOpen, setSidebarOpen] = useState(false);

// //   return (
// //     <div>
// //       <ClientNavbar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
// //       <ClientPartnerTabs sidebarOpen={sidebarOpen} />
// //     </div>
// //   );
// // }

// // export default ClientPartnerDashboard;

// import React, { useState, useEffect } from 'react';
// import ClientNavbar from '../../../components/NavbarComponent/ClientPartnerNavbar';
// import User3D from '../../../assets/pngtre.png';
// import ToDoList from '../../Admin/TODO/ToDoList'; // Import ToDoList component
// import ClientPartnerCalendar from './ClientPartnerCalender'; // Updated import name
 
// const ClientPartnerDashboard = () => {
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [currentTime, setCurrentTime] = useState('');
//     const [userName, setUserName] = useState(''); // State to hold the user's name
 
//     // Function to update the current time every second
//     const updateTime = () => {
//         const now = new Date();
//         setCurrentTime(now.toLocaleTimeString()); // Update to include seconds
//     };
 
//     useEffect(() => {
//         // Get user email from session storage or any global state you're using
//         const clientPartnerName = sessionStorage.getItem('email');
//     const usernameWithDigits = clientPartnerName.split('@')[0];

//     // Remove all numbers from the username part
//     const username = usernameWithDigits.replace(/\d+/g, '');

//     // Optional: Trim to remove any extra spaces
//     const trimmedUsername = username.trim();
 
//         // Extract the name from email (before @)
//         if (trimmedUsername) {
//             setUserName(trimmedUsername.split('@')[0]); // Get the part before '@'
//         }
 
//         updateTime();
//         const intervalId = setInterval(updateTime, 1000); // Update every second
//         return () => clearInterval(intervalId); // Cleanup on unmount
//     }, []);
 
//     return (
//         <div className="min-h-screen bg-gray-50">
//             <ClientNavbar setSidebarOpen={setIsSidebarOpen} sidebarOpen={isSidebarOpen} />
//             <div className="p-6 flex flex-col">
//                 <div className="flex mt-20"> {/* Row for Profile Card and To-Do List */}
//                     {/* Profile Card */}
//                     <div className="bg-gradient-to-r from-[#97247E] to-[#E01950] text-white rounded-lg shadow-md p-4 flex items-center ml-20 w-100 h-56 mt-20"> {/* Reduced size */}
//                         <div className="ml-4 flex-grow">
//                             <h2 className="text-lg font-semibold">Welcome Back, {userName}!</h2>
//                             <div className="mt-1">
//                                 {/* <p>Employee Number: 12212</p> */}
//                                 <p>Department: Client Partner</p>
//                                 <p>Time: {currentTime}</p> {/* Current Time */}
//                             </div>
//                             <button className="mt-2 bg-white text-[#E01950] rounded-lg px-4 py-1">View Profile</button>
//                         </div>
//                         <img src={User3D} alt="Profile" className="rounded-md ml-4" style={{ maxHeight: '70%', maxWidth: '40%' }} /> {/* Adjusted image size */}
//                     </div>
 
//                     {/* To-Do List Container */}
//                     <div className="bg-white p-4 rounded shadow-md w-2/3 h-120 ml-4">
//                         <ToDoList /> {/* Rendering the To-Do List Component */}
//                     </div>
//                 </div>
 
//                 {/* Calendar Container at the bottom */}
//                 <div className="bg-white p-4 rounded shadow-md flex-1 mt-10"> {/* Calendar */}
//                     <ClientPartnerCalendar /> {/* Rendering the Calendar Component */}
//                 </div>
//             </div>
//         </div>
//     );
// };
 
// export default ClientPartnerDashboard;

import React, { useState } from 'react';
import ClientPartnerNavbar from '../../../components/NavbarComponent/ClientPartnerNavbar';
import ClientPartnerTabs from '../Dashboard/ClientPartnerTabs';
 
function ClientPartnerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
 
  return (
    <div>
      <ClientPartnerNavbar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
      <ClientPartnerTabs setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
    </div>
  );
}
 
export default ClientPartnerDashboard;