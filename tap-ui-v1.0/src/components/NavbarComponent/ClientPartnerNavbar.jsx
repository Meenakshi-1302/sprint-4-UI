

// import React, { useState } from "react";
// import logo from "../../assets/RelevantzLogo.png" // Ensure the logo is correctly imported
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faArrowRightFromBracket,
//   faUser,
//   faInbox,
//   faLanguage,
//   faChartSimple,
//   faUsers,
//   faTimes,
//   faIdCard,
//   faFileLines,
// } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";
 
// const ClientPartnerNavbar = () => {
//   const navigate = useNavigate(); // Initialize useNavigate
//   const [sidebarOpen, setSidebarOpen] = useState(true); // Initially expanded
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
 
//   const toggleProfileDropdown = () => {
//     setProfileDropdownOpen(!profileDropdownOpen);
//   };
 
//   const toggleLanguageDropdown = () => {
//     setLanguageDropdownOpen(!languageDropdownOpen);
//   };
 
//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <div
//         className={`bg-[#27235c] h-screen fixed top-0 left-0 transition-transform duration-300 z-50 ${
//           sidebarOpen ? "w-64" : "w-16"
//         }`}
//       >
//         <div className="flex items-center justify-between h-16 px-4">
//           <div
//             onClick={() => setSidebarOpen(!sidebarOpen)} // Toggle Sidebar on Click
//             className="cursor-pointer flex items-center"
//             aria-label="Toggle Sidebar"
//           >
//             <img
//               src={logo}
//               alt="Logo"
//               className={`h-12 transition duration-300 ${sidebarOpen ? "block" : "hidden"}`}
//             />
//           </div>
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)} // Toggle on button click
//             className="text-white"
//           >
//             <FontAwesomeIcon
//               icon={sidebarOpen ? faTimes : null} // Show the 'X' icon when expanded
//               className="w-8 h-8"
//             />
//           </button>
//         </div>
//         <ul className="mt-8 ml-4">
//           <li className="flex items-center p-2 text-white hover:bg-[#3a386f] transition">
//             <a href="#" className="flex items-center">
//               <FontAwesomeIcon icon={faChartSimple} className="w-6 h-6 text-white" />
//               {sidebarOpen && <span className="ml-4">Reports</span>}
//             </a>
//           </li>
//           <li
//             className="flex items-center p-2 text-white hover:bg-[#3a386f] transition"
//             onClick={() => navigate("/clientDash")} // Directly navigate on click
//           >
//             <a href="#" className="flex items-center">
//               <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-white" />
//               {sidebarOpen && <span className="ml-4">Clients</span>}
//             </a>
//           </li>
//           <li
//             className="flex items-center p-2 text-white hover:bg-[#3a386f] transition"
//             onClick={() => navigate("/clientRequirementView")} // Directly navigate on click
//           >
//             <a href="#" className="flex items-center">
//               <FontAwesomeIcon icon={faFileLines} className="w-6 h-6 text-white" />
//               {sidebarOpen && <span className="ml-4">Requirement Details</span>}
//             </a>
//           </li>
//           <li
//             className="flex items-center p-2 text-white hover:bg-[#3a386f] transition"
//             onClick={() => navigate("/viewMrf")} // Directly navigate on click
//           >
//             <a href="#" className="flex items-center">
//               <FontAwesomeIcon icon={faIdCard} className="w-6 h-6 text-white" />
//               {sidebarOpen && <span className="ml-4">MRF Summary</span>}
//             </a>
//           </li>
          
//           {/* Add more items as needed */}
//         </ul>
//       </div>
 
//       {/* Main Content */}
//       <div
//         className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}
//       >
//         {/* Top Navbar */}
//         <nav className="bg-[#27235c] text-white p-3 flex justify-between items-center w-full fixed top-0 left-0 z-40">
//           <div className="flex items-center">
//             <img
//               src={logo}
//               alt="Logo"
//               className="h-12 ml-10 cursor-pointer" // Make the top navbar logo clickable too
//               onClick={() => setSidebarOpen(!sidebarOpen)} // Toggle Sidebar on Click
//             />
//           </div>
//           {/* Profile and Language Dropdowns */}
//           <div className="flex items-center space-x-3">
//             {/* Language Dropdown */}
//             <div className="relative">
//               <button onClick={toggleLanguageDropdown} className="flex items-center">
//                 <FontAwesomeIcon icon={faLanguage} className="w-7 h-7" />
//               </button>
//               {languageDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2">
//                   <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
//                     English
//                   </a>
//                   <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
//                     Español
//                   </a>
//                   <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
//                     Français
//                   </a>
//                 </div>
//               )}
//             </div>
 
//             {/* Profile Dropdown */}
//             <div className="relative">
//               <button onClick={toggleProfileDropdown} className="flex items-center space-x-1">
//                 <img
//                   src="https://via.placeholder.com/40"
//                   alt="Profile"
//                   className="w-8 h-8 rounded-full"
//                 />
//                 <div className="text-left">
//                   <span className="block text-sm">Aneesh</span>
//                   <span className="block text-xs text-gray-400">Client Partner</span>
//                 </div>
//               </button>
 
//               {profileDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
//                   <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
//                     <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
//                   </a>
//                   <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
//                     <FontAwesomeIcon icon={faInbox} className="mr-2" /> Inbox
//                   </a>
//                   <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
//                     <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2" /> Logout
//                   </a>
//                 </div>
//               )}
//             </div>
//           </div>
//         </nav>
//       </div>
//     </div>
//   );
// };
 
// export default ClientPartnerNavbar;


// import React, { useState } from "react";
// import logo from "../../assets/RelevantzLogo.png"; 
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faArrowRightFromBracket,
//   faUser,
//   faInbox,
//   faLanguage,
//   faChartPie, 
//   faUsers,
//   faChevronLeft,
//   faChevronRight,
//   faIdCard,
//   faFileAlt
// } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";

// const ClientPartnerNavbar = ({ setSidebarOpen, sidebarOpen }) => {
//   const navigate = useNavigate();
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

//   const toggleProfileDropdown = () => {
//     setProfileDropdownOpen(prev => !prev);
//   };

//   const toggleLanguageDropdown = () => {
//     setLanguageDropdownOpen(prev => !prev);
//   };

//   const toggleSidebar = () => {
//     if (typeof setSidebarOpen === "function") {
//       setSidebarOpen(prevState => !prevState); // Use previous state to toggle
//     } else {
//       console.error("setSidebarOpen is not a function");
//     }
//   };

//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <div
//         className={`bg-[#27235c] h-screen fixed top-0 left-0 transition-all duration-300 ease-in-out z-50 ${sidebarOpen ? "w-64" : "w-16"}`}
//       >
//         <div className="flex items-center justify-between h-16 px-4">
//           <div className="cursor-pointer flex items-center" aria-label="Toggle Sidebar" onClick={toggleSidebar}>
//             <img
//               src={logo}
//               alt="Logo"
//               className={`h-12 transition duration-300 ${sidebarOpen ? "block" : "hidden"}`}
//             />
//           </div>
//           <button onClick={toggleSidebar} className="text-white">
//             <FontAwesomeIcon icon={sidebarOpen ? faChevronLeft : faChevronRight} className="w-6 h-6" />
//           </button>
//         </div>

//         <ul className="mt-8 ml-4">
//           <li 
//             className={`flex items-center p-2 text-white transition`} 
//             onClick={() => navigate("/clientPartnerDashboard")} // Change this based on your reports route
//           >
//             <FontAwesomeIcon icon={faChartPie} className="w-6 h-6 text-white" />
//             {sidebarOpen && <span className="ml-4">Reports</span>}
//           </li>
//           <li 
//             className={`flex items-center p-2 text-white transition`} 
//             onClick={() => { navigate("/clientDash"); }}
//           >
//             <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-white" />
//             {sidebarOpen && <span className="ml-4">Clients</span>}
//           </li>
//           <li 
//             className={`flex items-center p-2 text-white transition`} 
//             onClick={() => { navigate("/clientRequirementView"); }}
//           >
//             <FontAwesomeIcon icon={faFileAlt} className="w-6 h-6 text-white" />
//             {sidebarOpen && <span className="ml-4">Requirement Details</span>}
//           </li>
//           <li 
//             className={`flex items-center p-2 text-white transition`} 
//             onClick={() => { navigate("/viewMrf"); }}
//           >
//             <FontAwesomeIcon icon={faIdCard} className="w-6 h-6 text-white" />
//             {sidebarOpen && <span className="ml-4">MRF Summary</span>}
//           </li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className={`flex-1 transition-all duration-300`}>
//         {/* Top Navbar */}
//         <nav className="bg-[#27235c] text-white p-3 flex justify-between items-center w-full fixed top-0 left-0 z-40">
//           <div className="flex items-center">
//             <button className="mr-3" onClick={toggleSidebar} aria-label="Toggle Sidebar">
//               <FontAwesomeIcon icon={sidebarOpen ? faChevronLeft : faChevronRight} className="w-5 h-5" />
//             </button>
//             <img src={logo} alt="Logo" className="h-12 cursor-pointer ml-4" onClick={toggleSidebar} />
//           </div>

//           {/* Profile and Language Dropdowns */}
//           <div className="flex items-center space-x-3">
//             <div className="relative">
//               <button onClick={toggleLanguageDropdown} className="flex items-center">
//                 <FontAwesomeIcon icon={faLanguage} className="w-7 h-7" />
//               </button>
//               {languageDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2">
//                   <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">English</a>
//                   <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Español</a>
//                   <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Français</a>
//                 </div>
//               )}
//             </div>

//             <div className="relative">
//               <button onClick={toggleProfileDropdown} className="flex items-center space-x-1">
//                 <img src="https://via.placeholder.com/40" alt="Profile" className="w-8 h-8 rounded-full" />
//                 <div className="text-left">
//                   <span className="block text-sm">Aneesh</span>
//                   <span className="block text-xs text-gray-400">Client Partner</span>
//                 </div>
//               </button>

//               {profileDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
//                   <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
//                     <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
//                   </a>
//                   <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
//                     <FontAwesomeIcon icon={faInbox} className="mr-2" /> Inbox
//                   </a>
//                   <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
//                     <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2" /> Logout
//                   </a>
//                 </div>
//               )}
//             </div>
//           </div>
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default ClientPartnerNavbar;

// import React, { useState, useEffect } from "react";
// import logo from "../../assets/RelevantzLogo.png"; 
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faArrowRightFromBracket,
//   faUser,
//   faInbox,
//   faLanguage,
//   faChartPie, 
//   faUsers,
//   faChevronLeft,
//   faChevronRight,
//   faIdCard,
//   faFileAlt
// } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";
// import { getUserLoginCredentialsById, formatUserProfile } from '../../services/Profile/Profile'; // Import your user service functions

// const ClientPartnerNavbar = ({ setSidebarOpen, sidebarOpen, userId }) => {
//   const navigate = useNavigate();
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
//   const [userProfile, setUserProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const toggleProfileDropdown = () => setProfileDropdownOpen(prev => !prev);
//   const toggleLanguageDropdown = () => setLanguageDropdownOpen(prev => !prev);
//   const toggleSidebar = () => {
//     if (typeof setSidebarOpen === "function") {
//       setSidebarOpen(prevState => !prevState);
//     } else {
//       console.error("setSidebarOpen is not a function");
//     }
//   };

//   // Fetch user profile on component mount
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const userData = await getUserLoginCredentialsById(userId);
//         const formattedProfile = formatUserProfile(userData);
//         setUserProfile(formattedProfile);
//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         setError('Failed to fetch user profile');
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, [userId]);

//   if (loading) {
//     return <div>Loading...</div>; // Optional loading state
//   }

//   if (error) {
//     return <div>{error}</div>; // Optional error state
//   }

//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <div
//         className={`bg-[#27235c] h-screen fixed top-0 left-0 transition-all duration-300 ease-in-out z-50 ${sidebarOpen ? "w-64" : "w-16"}`}
//       >
//         <div className="flex items-center justify-between h-16 px-4">
//           <div 
//             className="cursor-pointer flex items-center" 
//             onClick={toggleSidebar} 
//             aria-label="Toggle Sidebar"
//           >
//             <img
//               src={logo}
//               alt="Logo"
//               className={`h-12 transition duration-300 ${sidebarOpen ? "block" : "hidden"}`}
//             />
//           </div>
//           <button onClick={toggleSidebar} className="text-white">
//             <FontAwesomeIcon icon={sidebarOpen ? faChevronLeft : faChevronRight} className="w-6 h-6" />
//           </button>
//         </div>

//         <ul className="mt-8 ml-4">
//           <li className={`flex items-center p-2 text-white transition`} onClick={() => navigate("/clientPartnerDashboard")}>
//             <FontAwesomeIcon icon={faChartPie} className="w-6 h-6 text-white" />
//             {sidebarOpen && <span className="ml-4">Reports</span>}
//           </li>
//           <li className={`flex items-center p-2 text-white transition`} onClick={() => { navigate("/clientDash"); }}>
//             <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-white" />
//             {sidebarOpen && <span className="ml-4">Clients</span>}
//           </li>
//           <li 
//             className={`flex items-center p-2 text-white transition`} 
//             onClick={() => { navigate("/clientRequirementView"); }}
//           >
//             <FontAwesomeIcon icon={faFileAlt} className="w-6 h-6 text-white" />
//             {sidebarOpen && <span className="ml-4">Requirement Details</span>}
//           </li>
//           <li 
//             className={`flex items-center p-2 text-white transition`} 
//             onClick={() => { navigate("/viewMrf"); }}
//           >
//             <FontAwesomeIcon icon={faIdCard} className="w-6 h-6 text-white" />
//             {sidebarOpen && <span className="ml-4">MRF Summary</span>}
//           </li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className={`flex-1 transition-all duration-300`}>
//         {/* Top Navbar */}
//         <nav className="bg-[#27235c] text-white p-3 flex justify-between items-center w-full fixed top-0 left-0 z-40">
//           <div className="flex items-center">
//             <button className="mr-3" onClick={toggleSidebar} aria-label="Toggle Sidebar">
//               <FontAwesomeIcon icon={sidebarOpen ? faChevronLeft : faChevronRight} className="w-5 h-5" />
//             </button>
//             <img src={logo} alt="Logo" className="h-12 cursor-pointer ml-4" onClick={toggleSidebar} />
//           </div>

//           {/* Profile and Language Dropdowns */}
//           <div className="flex items-center space-x-3">
//             <div className="relative">
//               <button onClick={toggleLanguageDropdown} className="flex items-center">
//                 <FontAwesomeIcon icon={faLanguage} className="w-7 h-7" />
//               </button>
//               {languageDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2">
//                   <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">English</a>
//                   <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Español</a>
//                   <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Français</a>
//                 </div>
//               )}
//             </div>

//             <div className="relative">
//               <button onClick={toggleProfileDropdown} className="flex items-center space-x-1">
//                 {userProfile ? (
//                   <>
//                     <img src={userProfile.profilePic} alt="Profile" className="w-8 h-8 rounded-full" />
//                     <div className="text-left">
//                       <span className="block text-sm">{userProfile.name}</span>
//                       <span className="block text-xs text-gray-400">{userProfile.roleName}</span>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="text-left">
//                     <span className="block text-sm">Anonymous</span>
//                     <span className="block text-xs text-gray-400">Unknown Role</span>
//                   </div>
//                 )}
//               </button>

//               {profileDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
//                   <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
//                     <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
//                   </a>
//                   <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
//                     <FontAwesomeIcon icon={faInbox} className="mr-2" /> Inbox
//                   </a>
//                   <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
//                     <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2" /> Logout
//                   </a>
//                 </div>
//               )}
//             </div>
//           </div>
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default ClientPartnerNavbar;

// import React, { useState, useEffect } from "react";
// import logo from "../../assets/RelevantzLogo.png";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faArrowRightFromBracket,
//   faUser,
//   faInbox,
//   faLanguage,
//   faChartPie,
//   faUsers,
//   faChevronLeft,
//   faChevronRight,
//   faIdCard,
//   faFileAlt,
//   faHome
// } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
// import { getUserLoginCredentialsById, formatUserProfile } from '../../services/Profile/Profile';
 
// const ClientPartnerNavbar = ({ setSidebarOpen, sidebarOpen, userId }) => {
//   const navigate = useNavigate();
//   const location = useLocation(); // useLocation to get the current path
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
//   const [userProfile, setUserProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
 
//   // Determine active item based on location
//   const determineActiveItem = (path) => {
//     switch (path) {
//       case "/clientPartnerDashboard":
//         return "home";
//       case "/reports":
//         return "reports";
//       case "/clientDash":
//         return "clients";
//       case "/clientRequirementView":
//         return "requirement";
//       case "/viewMrf":
//         return "mrf";
//       default:
//         return "home"; // Default to home if no match
//     }
//   };
 
//   const activeItem = determineActiveItem(location.pathname); // Set activeItem based on the current path
 
//   const toggleProfileDropdown = () => setProfileDropdownOpen((prev) => !prev);
//   const toggleLanguageDropdown = () => setLanguageDropdownOpen((prev) => !prev);
//   const toggleSidebar = () => {
//     if (typeof setSidebarOpen === "function") {
//       setSidebarOpen((prevState) => !prevState);
//     } else {
//       console.error("setSidebarOpen is not a function");
//     }
//   };
 
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const userData = await getUserLoginCredentialsById(userId);
//         const formattedProfile = formatUserProfile(userData);
//         setUserProfile(formattedProfile);
//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         setError('Failed to fetch user profile');
//         setLoading(false);
//       }
//     };
 
//     fetchUserProfile();
//   }, [userId]);
 
//   if (loading) {
//     return <div>Loading...</div>;
//   }
 
//   if (error) {
//     return <div>{error}</div>;
//   }
 
//   const handleItemClick = (path) => {
//     navigate(path); // Navigate to the desired path
//   };
 
//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <div
//         className={`bg-[#27235c] h-screen fixed top-0 left-0 transition-all duration-300 ease-in-out z-50 ${sidebarOpen ? "w-64" : "w-16"}`}
//       >
//         <div className="flex items-center justify-between h-16 px-4">
//           <div
//             className="cursor-pointer flex items-center"
//             onClick={toggleSidebar}
//             aria-label="Toggle Sidebar"
//           >
//             <img
//               src={logo}
//               alt="Logo"
//               className={`h-12 transition duration-300 ${sidebarOpen ? "block" : "hidden"}`}
//             />
//           </div>
//           <button onClick={toggleSidebar} className="text-white">
//             <FontAwesomeIcon icon={sidebarOpen ? faChevronLeft : faChevronRight} className="w-6 h-6" />
//           </button>
//         </div>
 
//         <ul className="mt-8 ml-4">
//           <li
//             className={`flex items-center p-2 text-white transition ${activeItem === "home" ? "bg-blue-500" : "hover:bg-blue-600"} cursor-pointer`}
//             onClick={() => handleItemClick("/clientPartnerDashboard")}
//           >
//             <FontAwesomeIcon icon={faHome} className="w-6 h-6 text-white" />
//             {sidebarOpen && <span className="ml-4">Home</span>}
//           </li>
//           <li
//             className={`flex items-center p-2 text-white transition ${activeItem === "reports" ? "bg-blue-500" : "hover:bg-blue-600"} cursor-pointer`}
//             onClick={() => handleItemClick("/reports")}
//           >
//             <FontAwesomeIcon icon={faChartPie} className="w-6 h-6 text-white" />
//             {sidebarOpen && <span className="ml-4">Reports</span>}
//           </li>
//           <li
//             className={`flex items-center p-2 text-white transition ${activeItem === "clients" ? "bg-blue-500" : "hover:bg-blue-600"} cursor-pointer`}
//             onClick={() => handleItemClick("/clientDash")}
//           >
//             <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-white" />
//             {sidebarOpen && <span className="ml-4">Clients</span>}
//           </li>
//           <li
//             className={`flex items-center p-2 text-white transition ${activeItem === "requirement" ? "bg-blue-500" : "hover:bg-blue-600"} cursor-pointer`}
//             onClick={() => handleItemClick("/clientRequirementView")}
//           >
//             <FontAwesomeIcon icon={faFileAlt} className="w-6 h-6 text-white" />
//             {sidebarOpen && <span className="ml-4">Requirement Details</span>}
//           </li>
//           <li
//             className={`flex items-center p-2 text-white transition ${activeItem === "mrf" ? "bg-blue-500" : "hover:bg-blue-600"} cursor-pointer`}
//             onClick={() => handleItemClick("/viewMrf")}
//           >
//             <FontAwesomeIcon icon={faIdCard} className="w-6 h-6 text-white" />
//             {sidebarOpen && <span className="ml-4">MRF Summary</span>}
//           </li>
//         </ul>
//       </div>
 
//       {/* Main Content */}
//       <div className={`flex-1 transition-all duration-300`}>
//         {/* Top Navbar */}
//         <nav className="bg-[#27235c] text-white p-3 flex justify-between items-center w-full fixed top-0 left-0 z-40">
//           <div className="flex items-center">
//             <button className="mr-3" onClick={toggleSidebar} aria-label="Toggle Sidebar">
//               <FontAwesomeIcon icon={sidebarOpen ? faChevronLeft : faChevronRight} className="w-5 h-5" />
//             </button>
//             <img src={logo} alt="Logo" className="h-12 cursor-pointer ml-4" onClick={toggleSidebar} />
//           </div>
 
//           {/* Profile and Language Dropdowns */}
//           <div className="flex items-center space-x-3">
//             <div className="relative">
//               <button onClick={toggleLanguageDropdown} className="flex items-center">
//                 <FontAwesomeIcon icon={faLanguage} className="w-7 h-7" />
//               </button>
//               {languageDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2">
//                   <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">English</a>
//                   <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Español</a>
//                   <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Français</a>
//                 </div>
//               )}
//             </div>
 
//             <div className="relative">
//               <button onClick={toggleProfileDropdown} className="flex items-center space-x-1">
//                 {userProfile ? (
//                   <>
//                     <img src={userProfile.profilePic} alt="Profile" className="w-8 h-8 rounded-full" />
//                     <div className="text-left">
//                       <span className="block text-sm">{userProfile.name}</span>
//                       <span className="block text-xs text-gray-400">{userProfile.roleName}</span>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="text-left">
//                     <span className="block text-sm">Anonymous</span>
//                     <span className="block text-xs text-gray-400">Unknown Role</span>
//                   </div>
//                 )}
//               </button>
 
//               {profileDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
//                   <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
//                     <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
//                   </a>
//                   <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
//                     <FontAwesomeIcon icon={faInbox} className="mr-2" /> Inbox
//                   </a>
//                   <a href="#" className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
//                     <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2" /> Logout
//                   </a>
//                 </div>
//               )}
//             </div>
//           </div>
//         </nav>
//       </div>
//     </div>
//   );
// };
 
// export default ClientPartnerNavbar;

 
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox, faUser, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Menu, SunMoon, Languages, LayoutDashboard, Users, MapPinCheckInside, Building2, HomeIcon } from "lucide-react";
import Logo from "../../assets/RelevantzLogo.png";
 
const ClientPartnerUpdatedNavbar = ({ setSidebarOpen, sidebarOpen }) => {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
 
    const navItems = [
        { id: "home", label: "Home", icon: HomeIcon, path: "/clientpartnerhome" },
        { id: "reports", label: "Reports", icon: LayoutDashboard, path: "/clientPartnerDashboard" },
        { id: "clients", label: "Clients", icon: Users, path: "/clientDash" },
        { id: "requirements", label: "Requirements", icon: MapPinCheckInside, path: "/clientRequirementView" },
        { id: "mrfs", label: "MRF Summary", icon: Building2, path: "/viewMrf" },
    ];
 
    // Function to handle logout
    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/");
    };

    const employeeEmail = sessionStorage.getItem('email');
    const firstLetterOfEmail = employeeEmail.charAt(0).toUpperCase();
    const name = employeeEmail.split('@')[0].replace(/\d+/g, ''); // Remove digits from name
    const roleName = sessionStorage.getItem('role');

    // Construct avatar URL
    const profilePic = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstLetterOfEmail)}&rounded=true&size=285`;

 
    // Sidebar Component
    const Sidebar = () => (
        <div className={`fixed left-0 top-0 h-full text-white transition-all duration-300 ease-in-out z-20 ${sidebarOpen ? "w-64" : "w-16"}`} style={{ backgroundColor: "#27235C" }}>
            <div className="p-3">
                <div className="flex items-center justify-between mb-10 mt-2">
                    <button onClick={() => setSidebarOpen((prev) => !prev)} className="p-1 hover:bg-gray-700 rounded-lg transition-colors" aria-label="Toggle Sidebar">
                        <Menu className="w-7 h-7" />
                    </button>
                    {sidebarOpen && <img src={Logo} alt="Organization Logo" className="h-12" />}
                </div>
                <nav>
                    {navItems.map((item) => (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${location.pathname === item.path || (item.id === 'home' && location.pathname === '/clientpartnerhome') ? "bg-blue-600" : "hover:bg-gray-700"}`}
                        >
                            <item.icon className="w-5 h-5" />
                            {sidebarOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
 
    return (
        <div className="">
            <Sidebar />
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
                <div className="bg-white shadow-sm fixed top-0 left-16 right-0 z-10">
                    <div className="flex items-center justify-between p-6">
                        <div className="text-2xl font-bold text-gray-800">Client Partner Dashboard</div>
                        <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Toggle Dark Mode">
                                <SunMoon className="w-6 h-6" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Toggle Language">
                                <Languages className="w-6 h-6" />
                            </button>
                            <div>
                                <button onClick={() => setProfileDropdownOpen((prev) => !prev)} className="flex items-center" aria-label="Profile Dropdown">
                                    <img src={profilePic} alt="Profile" className="rounded-full w-8 h-8" onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }} />
                                    <div className="ml-2">
                                        <span>{name}</span>
                                        <span> - </span>
                                        <span className="text-sm text-gray-500">{roleName}</span>
                                    </div>
                                </button>
                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 p-2 bg-white rounded-md shadow-lg z-50">
                                        <a href="#" className="flex items-center p-2 text-gray-800 hover:bg-gray-100">
                                            <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
                                        </a>
                                        <a href="#" className="flex items-center p-2 text-gray-800 hover:bg-gray-100">
                                            <FontAwesomeIcon icon={faInbox} className="mr-2" /> Inbox
                                        </a>
                                        <a href="#" onClick={handleLogout} className="flex items-center p-2 text-gray-800 hover:bg-gray-100">
                                            <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2" /> Logout
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
 
export default ClientPartnerUpdatedNavbar;
 