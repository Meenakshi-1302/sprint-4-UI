

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getUserData, updatePassword } from '../../../services/Client/ResetPasswordService';
// import { useSelector } from 'react-redux';
// import toast from 'react-hot-toast';
// import ClientNavbar from '../Dashboard/ClientNavbar';
 
// const passwordStrength = (password) => {
//   let score = 0;
//   const passwordMinLength = 8;
 
//   if (password.length >= passwordMinLength) score++;
//   if (/[A-Z]/.test(password)) score++;
//   if (/[a-z]/.test(password)) score++;
//   if (/\d/.test(password)) score++;
//   if (/[!@#$%^&*]/.test(password)) score++;
//   return score;
// };
 
// const ResetPassword = () => {
//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [strength, setStrength] = useState(0);
//   const [showModal, setShowModal] = useState(false); // State for modal visibility
//   const navigate = useNavigate();
 
//   // Retrieve email from Redux (or localStorage if Redux state is empty)
//   // const clienEmail = useSelector((state) => state.email.email);
//   const clienEmail = localStorage.getItem('email')
 
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');
 
//     // Validate inputs
//     if (!oldPassword || !newPassword || !confirmPassword) {
//       setError('Please fill out all fields.');
//       return;
//     }
 
//     try {
//       // If you have a function that validates the old password against the backend
//       // const user = await getUserData();
//       // if (oldPassword !== user.password) {
//       //   setError('Old password is incorrect.');
//       //   return;
//       // }
 
//       if (newPassword === oldPassword) {
//         setError("You can't keep your old password as the new password.");
//         return;
//       }
 
//       if (newPassword !== confirmPassword) {
//         setError('New passwords do not match.');
//         return;
//       }
 
//       // Use the email from Redux or localStorage to update the password
//       await updatePassword(clienEmail, oldPassword, newPassword);
//       toast.success('Password reset successfully! You can log in with your new password.');
//       navigate('/dashboard'); // Redirect to a success page
//     } catch (err) {
//       setError('An error occurred. Please try again.');
//       console.error(err);
//     }
//   };
 
//   useEffect(() => {
//     setStrength(passwordStrength(newPassword));
//   }, [newPassword]);
 
//   const handleBackButtonClick = () => {
//     setShowModal(true); // Show the modal when back is clicked
//   };
 
//   const confirmNavigation = () => {
//     navigate('/');
//   };
 
//   const cancelNavigation = () => {
//     setShowModal(false); // Close the modal without navigating
//   };
 
//   return (
//     <div className="flex items-center justify-center min-h-screen mt-6 bg-[#EEEEEE]">

//       <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-11/12 max-w-xl relative"> {/* Increased card size */}
//         {/* Back Button */}
//         <ClientNavbar />
//         {/* <ClientSidebar /> */}
//         <button
//           onClick={handleBackButtonClick}
//           className="absolute top-8 left-8 text-[#27235C] hover:text-[#524F7D] transform hover:scale-110 transition duration-200 focus:outline-none"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             className="w-6 h-6 inline-block align-middle"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M19 12H5m7-7l-7 7 7 7"
//             />
//           </svg>
//         </button>
//         {/* Title */}
//         <h2 className="text-2xl font-semibold mb-6 text-center text-[#27235C] flex items-center justify-center gap-2">
//           <span>Reset Password</span>
//         </h2>
 
//         {/* Form */}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-[#27235C] text-sm font-bold mb-2" htmlFor="oldPassword">
//               Enter Your Old Password:
//             </label>
//             <input
//               type="password"
//               id="oldPassword"
//               value={oldPassword}
//               onChange={(e) => setOldPassword(e.target.value)}
//               placeholder="Old Password"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-[#27235C] hover:border-blue-700"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-[#27235C] text-sm font-bold mb-2" htmlFor="newPassword">
//               New Password:
//             </label>
//             <input
//               type="password"
//               id="newPassword"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               placeholder="New Password"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-[#27235C] hover:border-blue-700"
//             />
//             {newPassword && (
//               <div className="mt-2">
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className={`h-2 rounded-full ${strength === 0 ? 'bg-transparent' :
//                       strength === 1 ? 'bg-red-500' :
//                         strength === 2 ? 'bg-yellow-500' :
//                           strength >= 3 ? 'bg-green-500' : 'bg-green-500'
//                       }`}
//                     style={{ width: `${(strength / 5) * 100}%` }}
//                   />
//                 </div>
//                 <p className="text-xs text-[#27235C] mt-1">
//                   {strength === 0 ? 'Very Weak' :
//                     strength === 1 ? 'Weak' :
//                       strength === 2 ? 'Fair' :
//                         strength === 3 ? 'Good' :
//                           'Strong'}
//                 </p>
//               </div>
//             )}
//           </div>
//           <div className="mb-4">
//             <label className="block text-[#27235C] text-sm font-bold mb-2" htmlFor="confirmPassword">
//               Confirm New Password:
//             </label>
//             <input
//               type="password"
//               id="confirmPassword"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="Confirm New Password"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-[#27235C] hover:border-blue-700"
//             />
//           </div>
//           {error && <p className="text-red-500 text-xs italic mb-2">{error}</p>}
//           {message && <p className="text-green-500 text-xs italic mb-2">{message}</p>}
//           {/* <button
//             type="submit"
//             className="bg-[#27235C] hover:bg-[#524F7D] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out w-full"
//           >
//             Submit
//           </button> */}
 
//           <button
//             type="submit"
//             className="bg-[#27235C] hover:bg-[#524F7D] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out w-full"
//           >
//             Submit
//           </button>
 
//           {/* Password instructions */}
//           <div className="mt-4">
//             <h3 className="text-black-600 font-semibold mb-1">Password Requirements:</h3>
//             <ul className="list-disc list-inside text-black-400 text-xs italic">
//               <li>At least 8 characters long</li>
//               <li>At least one uppercase letter (A-Z)</li>
//               <li>At least one lowercase letter (a-z)</li>
//               <li>At least one number (0-9)</li>
//               <li>At least one special character (e.g., !@#$%^&*)</li>
//             </ul>
//           </div>
//         </form>
 
//         {/* Confirmation Modal */}
//         {showModal && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white rounded-lg p-6 w-80">
//               <h3 className="text-lg font-semibold mb-4">Confirm Navigation</h3>
//               <p className="mb-4">Are you sure you want to leave this page?</p>
//               <div className="flex gap-x-4 justify-center">
//                 <button
//                   onClick={confirmNavigation}
//                   className="bg-[#27235C] text-white py-2 px-4 rounded hover:bg-[#524F7D] transition duration-200"
//                 >
//                   Yes
//                 </button>
//                 <button
//                   onClick={cancelNavigation}
//                   className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition duration-200"
//                 >
//                   No
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
 
// export default ResetPassword;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { updatePassword } from '../../../services/Client/ResetPasswordService';
// import toast from 'react-hot-toast';
// import Logo from '../../../assets/RelevantzBlue.PNG';
// import { Menu, SunMoon, Languages, Key, LayoutDashboard, FilePlus, List } from "lucide-react"; // Import icons for the navbar

// const passwordStrength = (password) => {
//   let score = 0;
//   const passwordMinLength = 8;

//   if (password.length >= passwordMinLength) score++;
//   if (/[A-Z]/.test(password)) score++;
//   if (/[a-z]/.test(password)) score++;
//   if (/\d/.test(password)) score++;
//   if (/[!@#$%^&*]/.test(password)) score++;
//   return score;
// };

// const ResetPassword = () => {
//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [strength, setStrength] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [activeTab, setActiveTab] = useState('reset-password');
//   const navigate = useNavigate();

//   const clientEmail = localStorage.getItem('email');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');

//     if (!oldPassword || !newPassword || !confirmPassword) {
//       setError('Please fill out all fields.');
//       return;
//     }

//     if (newPassword === oldPassword) {
//       setError("You can't keep your old password as the new password.");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError('New passwords do not match.');
//       return;
//     }

//     try {
//       await updatePassword(clientEmail, oldPassword, newPassword);
//       toast.success('Password reset successfully! You can log in with your new password.');
//       navigate('/dashboard');
//     } catch (err) {
//       setError('An error occurred. Please try again.');
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     setStrength(passwordStrength(newPassword));
//   }, [newPassword]);

//   const handleBackButtonClick = () => {
//     setShowModal(true);
//   };

//   const confirmNavigation = () => {
//     navigate('/');
//   };

//   const cancelNavigation = () => {
//     setShowModal(false);
//   };

//   // Sidebar Component
//   const Sidebar = () => (
//     <div className={`fixed left-0 top-0 h-full text-white transition-all duration-300 ease-in-out z-20 ${isSidebarOpen ? "w-64" : "w-16"}`} style={{ backgroundColor: "#27235C" }}>
//       <div className="p-3">
//         <div className="flex items-center justify-between mb-10 mt-2">
//           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-700 rounded-lg transition-colors">
//             <Menu className="w-7 h-7" />
//           </button>
//           {isSidebarOpen && <img src={Logo} alt="Company Logo" className="ml-3 mr-2 h-12 mt-3" />}
//         </div>
//         <nav>
//           {[
//             { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/clientdashboard" },
//             { id: "post-requirements", label: "Post Requirements", icon: FilePlus, path: "/requirement" },
//             { id: "view-requirements", label: "View All Requirements", icon: List, path: "/jobRequirementsTable" },
//             { id: "reset-password", label: "Reset Password", icon: Key, path: "/resetpassword" },
//           ].map((item) => (
//             <button
//               key={item.id}
//               onClick={() => {
//                 navigate(item.path);
//                 setActiveTab(item.id);
//               }}
//               className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${activeTab === item.id ? "bg-blue-600" : "hover:bg-gray-700"}`}
//             >
//               <item.icon className="w-5 h-5" />
//               {isSidebarOpen && <span>{item.label}</span>}
//             </button>
//           ))}
//         </nav>
//       </div>
//     </div>
//   );

//   // Navbar Component
//   const Navbar = () => (
//     <div className="sticky top-0 z-10 bg-white shadow-sm">
//       <div className="flex items-center justify-between p-6">
//         <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
//         <div className="flex items-center space-x-2">
//           <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
//             <SunMoon className="w-6 h-6" />
//           </button>
//           <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
//             <Languages className="w-6 h-6" />
//           </button>
//           <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
//             <img src="https://via.placeholder.com/40" alt="Profile" className="rounded-full" style={{ width: "32px", height: "32px" }} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className={`flex h-screen ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
//       <Sidebar />
//       <div className="flex-1">
//         <Navbar />
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//           <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-11/12 max-w-xl relative">
//             <button
//               onClick={handleBackButtonClick}
//               className="absolute top-8 left-8 text-[#27235C] hover:text-[#524F7D] transform hover:scale-110 transition duration-200 focus:outline-none"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 className="w-6 h-6 inline-block align-middle"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M19 12H5m7-7l-7 7 7 7"
//                 />
//               </svg>
//             </button>
//             <h2 className="text-2xl font-semibold mb-6 text-center text-[#27235C] flex items-center justify-center gap-2">
//               <span>Reset Password</span>
//             </h2>

//             {/* Form */}
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-[#27235C] text-sm font-bold mb-2" htmlFor="oldPassword">
//                   Enter Your Old Password:
//                 </label>
//                 <input
//                   type="password"
//                   id="oldPassword"
//                   value={oldPassword}
//                   onChange={(e) => setOldPassword(e.target.value)}
//                   placeholder="Old Password"
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-[#27235C] hover:border-blue-700"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-[#27235C] text-sm font-bold mb-2" htmlFor="newPassword">
//                   New Password:
//                 </label>
//                 <input
//                   type="password"
//                   id="newPassword"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   placeholder="New Password"
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-[#27235C] hover:border-blue-700"
//                 />
//                 {newPassword && (
//                   <div className="mt-2">
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className={`h-2 rounded-full ${strength === 0 ? 'bg-transparent' :
//                           strength === 1 ? 'bg-red-500' :
//                           strength === 2 ? 'bg-yellow-500' :
//                           strength === 3 ? 'bg-green-500' : 'bg-green-500'
//                         }`}
//                         style={{ width: `${(strength / 5) * 100}%` }}
//                       />
//                     </div>
//                     <p className="text-xs text-[#27235C] mt-1">
//                       {strength === 0 ? 'Very Weak' :
//                         strength === 1 ? 'Weak' :
//                         strength === 2 ? 'Fair' :
//                         strength === 3 ? 'Good' :
//                         'Strong'}
//                     </p>
//                   </div>
//                 )}
//               </div>
//               <div className="mb-4">
//                 <label className="block text-[#27235C] text-sm font-bold mb-2" htmlFor="confirmPassword">
//                   Confirm New Password:
//                 </label>
//                 <input
//                   type="password"
//                   id="confirmPassword"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   placeholder="Confirm New Password"
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-[#27235C] hover:border-blue-700"
//                 />
//               </div>
//               {error && <p className="text-red-500 text-xs italic mb-2">{error}</p>}
//               {message && <p className="text-green-500 text-xs italic mb-2">{message}</p>}
              
//               <button
//                 type="submit"
//                 className="bg-[#27235C] hover:bg-[#524F7D] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out w-full"
//               >
//                 Submit
//               </button>

//               {/* Password instructions */}
//               <div className="mt-4">
//                 <h3 className="text-black-600 font-semibold mb-1">Password Requirements:</h3>
//                 <ul className="list-disc list-inside text-black-400 text-xs italic">
//                   <li>At least 8 characters long</li>
//                   <li>At least one uppercase letter (A-Z)</li>
//                   <li>At least one lowercase letter (a-z)</li>
//                   <li>At least one number (0-9)</li>
//                   <li>At least one special character (e.g., !@#$%^&*)</li>
//                 </ul>
//               </div>
//             </form>

//             {/* Confirmation Modal */}
//             {showModal && (
//               <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                 <div className="bg-white rounded-lg p-6 w-80">
//                   <h3 className="text-lg font-semibold mb-4">Confirm Navigation</h3>
//                   <p className="mb-4">Are you sure you want to leave this page?</p>
//                   <div className="flex gap-x-4 justify-center">
//                     <button
//                       onClick={confirmNavigation}
//                       className="bg-[#27235C] text-white py-2 px-4 rounded hover:bg-[#524F7D] transition duration-200"
//                     >
//                       Yes
//                     </button>
//                     <button
//                       onClick={cancelNavigation}
//                       className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition duration-200"
//                     >
//                       No
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;