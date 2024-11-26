
// import React, { useEffect, useState } from "react";
// import logo from "../../assets/logo.png.png";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faBars,
//   faUser,
//   faInbox,
//   faLanguage,
//   faTachometerAlt,
//   faClipboard,
//   faKey,
//   faTable,
//   faCheckCircle,
//   faTimes,
// } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";
// import axios from 'axios';
 
// const VendorNavbar = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
//   const [clientName, setClientName] = useState(''); // State for client name
//   const [organizationLogo, setOrganizationLogo] = useState(''); // State for organization logo
 
//   const navigate = useNavigate(); // Initialize useNavigate
 
//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };
 
//   const toggleProfileDropdown = () => {
//     setProfileDropdownOpen(!profileDropdownOpen);
//   };
 
//   const toggleLanguageDropdown = () => {
//     setLanguageDropdownOpen(!languageDropdownOpen);
//   };
 
//   // Fetch client name and organization logo on component mount
//   useEffect(() => {
//     const fetchClientDetails = async () => {
//       try {
//         const response = await axios.get('http://localhost:3012/client'); // Replace with your API endpoint
//         setClientName(response.data[0]?.vendortName || ''); // Set client name from response
 
//         // Assuming the organization logo is part of the same response
//         setOrganizationLogo(response.data[0]?.organizationLogo || ''); // Set organization logo from response
//       } catch (error) {
//         console.error("Error fetching client details:", error);
//         setClientName(''); // Fallback to empty string on error
//         setOrganizationLogo(''); // Fallback to empty string on error
//       }
//     };
 
//     fetchClientDetails(); // Call the fetch function
//   }, []); // Empty dependency array to run only once on mount
 
//   // Handle profile redirect
//   const handleProfileClick = () => {
//     navigate("/vendorProfileView"); // Modify this path as needed
//     toggleProfileDropdown(); // Close the dropdown after clicking
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
//           <img
//             src={logo}
//             alt="Logo"
//             className={`h-12 ${sidebarOpen ? "block" : "hidden"}`}
//           />
//           <button onClick={toggleSidebar} className="text-white">
//             <FontAwesomeIcon
//               icon={sidebarOpen ? faTimes : faBars}
//               className="w-8 h-8"
//             />
//           </button>
//         </div>
//         <ul className="mt-8 ml-4">
//           <li className="flex items-center p-2 text-white hover:bg-[#3a386f] transition">
//             <a href="/vendordashboard" className="flex items-center">
//               <FontAwesomeIcon
//                 icon={faTachometerAlt}
//                 className="w-6 h-6 text-white"
//               />
//               {sidebarOpen && <span className="ml-4">Dashboard</span>}
//             </a>
//           </li>
//           <li className="flex items-center p-2 text-white hover:bg-[#3a386f] transition">
//             <a href="/viewmrfbyvendor" className="flex items-center">
//               <FontAwesomeIcon
//                 icon={faClipboard}
//                 className="w-6 h-6 text-white"
//               />
//               {sidebarOpen && <span className="ml-4">View All MRF's</span>}
//             </a>
//           </li>
//           <li className="flex items-center p-2 text-white hover:bg-[#3a386f] transition">
//             <a href="/JobRequirementsTable" className="flex items-center">
//               <FontAwesomeIcon
//                 icon={faTable}
//                 className="w-6 h-6 text-white"
//               />
//               {sidebarOpen && (
//                 <span className="ml-4">View All Requirements</span>
//               )}
//             </a>
//           </li>
//           <li className="flex items-center p-2 text-white hover:bg-[#3a386f] transition">
//             <a href="/resetpassword" className="flex items-center">
//               <FontAwesomeIcon
//                 icon={faKey}
//                 className="w-6 h-6 text-white"
//               />
//               {sidebarOpen && <span className="ml-4">Reset Password</span>}
//             </a>
//           </li>
//         </ul>
//       </div>
 
//       {/* Main Content */}
//       <div
//         className={`flex-1 ml-${sidebarOpen ? "64" : "16"} transition-all duration-300`}
//       >
//         {/* Top Navbar */}
//         <nav className="bg-[#27235c] text-white p-3 flex justify-between items-center w-full fixed top-0 left-0 z-40">
//           <div className="flex items-center">
//             <button onClick={toggleSidebar} className="mr-2">
//               <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
//             </button>
//             <img src={logo} alt="Logo" className="h-12 ml-6" />
//           </div>
//           {/* Profile and Language Dropdowns */}
//           <div className="flex items-center space-x-3">
//             {/* Language Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={toggleLanguageDropdown}
//                 className="flex items-center"
//               >
//                 <FontAwesomeIcon icon={faLanguage} className="w-5 h-5" />
//               </button>
//               {languageDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2">
//                   <a
//                     href="#"
//                     className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
//                   >
//                     English
//                   </a>
//                   <a
//                     href="#"
//                     className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
//                   >
//                     Español
//                   </a>
//                   <a
//                     href="#"
//                     className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
//                   >
//                     Français
//                   </a>
//                 </div>
//               )}
//             </div>
 
//             {/* Profile Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={toggleProfileDropdown}
//                 className="flex items-center space-x-1"
//               >
//                 {/* <img
//                   src="https://via.placeholder.com/40"
//                   alt="Profile"
//                   className="w-8 h-8 rounded-full"
//                 /> */}
//                 <div className="flex items-center">
//                   {organizationLogo && (
//                     <img
//                       src={organizationLogo}
//                       alt="Organization Logo"
//                       className="w-8 h-8 rounded-full mr-2" // Adjust the size as needed
//                     />
//                   )}
//                   <div className="text-left">
//                     <span className="block text-s">{clientName}</span>
//                     <span className="block text-xs text-gray-400">Client</span> {/* Added Client label */}
//                   </div>
//                 </div>
//               </button>
 
//               {profileDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
//                   <a
//                     onClick={handleProfileClick} // Change to handle click
//                     className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
//                   >
//                     <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
//                   </a>
//                   <a
//                     href="#"
//                     className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
//                   >
//                     <FontAwesomeIcon icon={faInbox} className="mr-2" /> Inbox
//                   </a>
//                   <a
//                     href="#"
//                     className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
//                   >
//                     <FontAwesomeIcon icon={faUser} className="mr-2" /> Logout
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
 
// export default VendorNavbar;
import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser,
  faInbox,
  faLanguage,
  faTachometerAlt,
  faClipboard,
  faKey,
  faTable,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
 
const VendorNavbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [vendorName, setVendorName] = useState(''); // State for vendor name
  const [organizationLogo, setOrganizationLogo] = useState(''); // State for organization logo
 
  const navigate = useNavigate(); // Initialize useNavigate
 
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
 
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };
 
  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen(!languageDropdownOpen);
  };
 
  // Fetch vendor name and organization logo on component mount
  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3012/vendor'); // Replace with your API endpoint
        setVendorName(response.data[0]?.username || ''); // Set vendor name from response
 
 
        setOrganizationLogo(response.data[0]?.logo || '');
      } catch (error) {
        console.error("Error fetching vendor details:", error);
        setVendorName('');
        setOrganizationLogo('');
      }
    };
 
    fetchVendorDetails();
  }, []);
 
 
  const handleProfileClick = () => {
    navigate("/vendorProfileView");
    toggleProfileDropdown(); // Close the dropdown after clicking
  };
 
  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-[#27235c] h-screen fixed top-0 left-0 transition-transform duration-300 z-50 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4">
          <img
            src={logo}
            alt="Logo"
            className={`h-12 ${sidebarOpen ? "block" : "hidden"}`}
          />
          <button onClick={toggleSidebar} className="text-white">
            <FontAwesomeIcon
              icon={sidebarOpen ? faTimes : faBars}
              className="w-8 h-8"
            />
          </button>
        </div>
        <ul className="mt-8 ml-4">
          <li className="flex items-center p-2 text-white hover:bg-[#3a386f] transition">
            <a href="/vendorDashboard" className="flex items-center">
              <FontAwesomeIcon
                icon={faTachometerAlt}
                className="w-6 h-6 text-white"
              />
              {sidebarOpen && <span className="ml-4">Dashboard</span>}
            </a>
          </li>
          <li className="flex items-center p-2 text-white hover:bg-[#3a386f] transition">
            <a href="/requirement" className="flex items-center">
              <FontAwesomeIcon
                icon={faClipboard}
                className="w-6 h-6 text-white"
              />
              {sidebarOpen && <span className="ml-4">Post Requirement</span>}
            </a>
          </li>
          <li className="flex items-center p-2 text-white hover:bg-[#3a386f] transition">
            <a href="/JobRequirementsTable" className="flex items-center">
              <FontAwesomeIcon
                icon={faTable}
                className="w-6 h-6 text-white"
              />
              {sidebarOpen && (
                <span className="ml-4">View All Requirements</span>
              )}
            </a>
          </li>
          <li className="flex items-center p-2 text-white hover:bg-[#3a386f] transition">
            <a href="/resetpassword" className="flex items-center">
              <FontAwesomeIcon
                icon={faKey}
                className="w-6 h-6 text-white"
              />
              {sidebarOpen && <span className="ml-4">Reset Password</span>}
            </a>
          </li>
        </ul>
      </div>
 
      {/* Main Content */}
      <div
        className={`flex-1 ml-${sidebarOpen ? "64" : "16"} transition-all duration-300`}
      >
        {/* Top Navbar */}
        <nav className="bg-[#27235c] text-white p-3 flex justify-between items-center w-full fixed top-0 left-0 z-40">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="mr-2">
              <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
            </button>
            <img src={logo} alt="Logo" className="h-12 ml-6" />
          </div>
          {/* Profile and Language Dropdowns */}
          <div className="flex items-center space-x-3">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={toggleLanguageDropdown}
                className="flex items-center"
              >
                <FontAwesomeIcon icon={faLanguage} className="w-5 h-5" />
              </button>
              {languageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2">
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    English
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Español
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Français
                  </a>
                </div>
              )}
            </div>
 
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-1"
              >
                <div className="flex items-center">
                  {organizationLogo && (
                    <img
                      src={organizationLogo}
                      alt="Organization Logo"
                      className="w-10 h-10 rounded-full mr-2" // Adjust the size as needed
                    />
                  )}
                  <div className="text-left">
                    <span className="block text-s">{vendorName}</span>
                    <span className="block text-xs text-gray-400">Vendor</span>
                  </div>
                </div>
              </button>
 
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                  <a
                    onClick={handleProfileClick} // Change to handle click
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faInbox} className="mr-2" /> Inbox
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" /> Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};
 
export default VendorNavbar;