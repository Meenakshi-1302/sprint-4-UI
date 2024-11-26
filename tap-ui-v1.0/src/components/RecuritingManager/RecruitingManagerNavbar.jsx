import React, { useEffect, useState } from "react";
import logo from "../../assets/RelevantzLogo 1.png"; // Ensure the logo is correctly imported
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser,
  faLanguage,
  faTachometerAlt,
  faCheckCircle,
  faTimes,
  faClipboardCheck,
  faPenToSquare,
  faPersonCircleCheck
  
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const RecruitingManagerNavbar = ({ sidebarOpen, toggleSidebar }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  // const userId = sessionStorage.getItem('UserId') || ""
  const role = sessionStorage.getItem('role') || "Recruiting Manager"
  const rmEmail = sessionStorage.getItem('email') || "Meenakshi"
  const [approvalDropdownOpen, setApprovalDropdownOpen] = useState(false);
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const toggleApprovalDropdown = () => {
    setApprovalDropdownOpen(!approvalDropdownOpen); // Toggle approval dropdown
  };

  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen(!languageDropdownOpen);
  };

  const splitName = (email) => {
    const dottedName = email.split("@");
    const fullname = dottedName[0].split(".");
    let firstLetter = fullname[0]
    // Access first letter using 0 index
    let name = firstLetter[0].toUpperCase() + firstLetter.slice(1);
    console.log(name);
    return name;
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-[#27235c] h-screen fixed top-0 left-0 transition-width duration-300 z-50 ${sidebarOpen ? "w-64" : "w-16"
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
          <Link to="/recruitingManagerDashboard" className="flex items-center">
            <li className="flex w-full items-center p-2 text-white hover:bg-[#3a386f] transition">
              <FontAwesomeIcon
                icon={faTachometerAlt}
                className="w-6 h-6 text-white"
              />
              {sidebarOpen && <span className="ml-4">Dashboard</span>}
            </li>
          </Link>

          <Link to="/listMrfsForRecruitingManager" className="flex items-center">
            <li className="flex w-full items-center p-2 text-white hover:bg-[#3a386f] transition">
              <FontAwesomeIcon
                icon={faClipboardCheck}
                className="w-6 h-6 text-white"
              />
              {sidebarOpen && <span className="ml-4">View MRF</span>}
            </li>
          </Link>
          <Link to="/listvendors" className="flex items-center">
            <li className="flex w-full items-center p-2 text-white hover:bg-[#3a386f] transition">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="w-6 h-6 text-white"
              />
              {sidebarOpen && <span className="ml-4">Manage Vendors</span>}
            </li>
          </Link>
          <Link to="/candidates" className="flex items-center">
            <li className="flex w-full items-center p-2 text-white hover:bg-[#3a386f] transition">
              <FontAwesomeIcon
                icon={faPersonCircleCheck}
                
                className="w-6 h-6 text-white"
              />
              {sidebarOpen && <span className="ml-4">Manage Candidates</span>}
            </li>
          </Link>
          {/* Add more items as needed */}
          <li className="flex flex-col p-2 text-white hover:bg-[#3a386f] transition relative">
            <button onClick={toggleApprovalDropdown} className="flex items-center">
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="w-6 h-6 text-white"
              />
              {sidebarOpen && <span className="ml-4">Approvals</span>}
            </button>
            {approvalDropdownOpen && ( // Render approval buttons conditionally
              <div className="absolute left-full top-0 mt-2 w-40 bg-[#3a386f] rounded-md shadow-lg py-2">
                <Link
                  to="/workFlowApproval" // Link to Workflow Approval page
                  className="block px-4 py-2 text-white hover:bg-[#3a386f]"
                >
                  Recruitment Process
                </Link>
                <div className="border-b border-white my-1"></div> {/* Added white line */}
                <a
                  href="/offerApproval" // Link to Offer Approval page
                  className="block px-4 py-2 text-white hover:bg-[#3a386f]"
                >
                  Offer
                </a>
              </div>
            )}
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
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-1"
              >
                <img
                  src="https://via.placeholder.com/40"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-left">
                  <span className="block text-sm">{splitName(rmEmail)}</span>
                  <span className="block text-xs text-gray-400">{role}</span>
                </div>
                <FontAwesomeIcon icon={faUser} className="w-3 h-3 ml-1" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
                  </a>
                  <a
                    href="/"
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={sessionStorage.clear()}
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

export default RecruitingManagerNavbar;