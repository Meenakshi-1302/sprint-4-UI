import React, { useState } from "react";
import logo from "../../../assets/logo.png.png"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 
import {
  faBars,
  faUser,
  faInbox,
  faLanguage,
  faTachometerAlt,
  faClipboard,
  faTimes,
  faUserCheck,
  faHammer,
  faBriefcase,
  faFileAlt
} from "@fortawesome/free-solid-svg-icons";
import { Link, Navigate, useNavigate } from "react-router-dom";
 
const MRFRecruiterNavbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const mrfid = sessionStorage.getItem("mrfid");

  const navigate = useNavigate();
 
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
 
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };
 
  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen(!languageDropdownOpen);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
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
     
<li className="flex items-center p-2  mt-10 text-white hover:bg-[#3a386f] transition">
  <Link to={`/mrfDashboard/${mrfid}`} className="flex items-center">
    <FontAwesomeIcon
      icon={faTachometerAlt} 
      className="w-6 h-6 text-white"
    />
    {sidebarOpen && <span className="ml-4">DASHBOARD</span>}
  </Link>
</li>
<li className="flex items-center p-2 mt-3 text-white hover:bg-[#3a386f] transition">
  <a href="/recruitementProcessLevel" className="flex items-center">
    <FontAwesomeIcon
      icon={faClipboard} 
      className="w-6 h-6 text-white"
    />
    {sidebarOpen && <span className="ml-4">RECRUITMENT PROCESS</span>}
  </a>
</li>
<li className="flex items-center p-2 mt-3 text-white hover:bg-[#3a386f] transition">
  <a href="/approver" className="flex items-center">
    <FontAwesomeIcon
      icon={faUserCheck} // Icon for Offer Approver
      className="w-6 h-6 text-white"
    />
    {sidebarOpen && (
      <span className="ml-4">OFFER APPROVERS</span>
    )}
  </a>
</li>
<li className="flex items-center p-2 mt-3 text-white hover:bg-[#3a386f] transition">
  <a href="/mrf/offerCreation" className="flex items-center">
    <FontAwesomeIcon
      icon={faHammer} // Icon for Manage Offer
      className="w-6 h-6 text-white"
    />
    {sidebarOpen && (
      <span className="ml-4">MANAGE OFFER</span>
    )}
  </a>
</li>
<li className="flex items-center p-2 mt-3 text-white hover:bg-[#3a386f] transition">
  <a href="" className="flex items-center">
    <FontAwesomeIcon
      icon={faBriefcase} // Icon for Job Post
      className="w-6 h-6 text-white"
    />
    {sidebarOpen && (
      <span className="ml-4">JOB POST</span>
    )}
  </a>
</li>
<li className="flex items-center p-2 mt-3 text-white hover:bg-[#3a386f] transition">
  <a href="" className="flex items-center">
    <FontAwesomeIcon
      icon={faFileAlt} // Icon for Screen Resumes
      className="w-6 h-6 text-white"
    />
    {sidebarOpen && (
      <span className="ml-4">SCREEN RESUMES</span>
    )}
  </a>
</li>
          {/* Add more items as needed */}
        </ul>
      </div>
 
      {/* Main Content */}
      <div
        className={`flex-1 ml-${
          sidebarOpen ? "64" : "16"
        } transition-all duration-300`}
      >
        {/* Top Navbar */}
        <nav className="bg-blue-950 text-white p-3 flex justify-between items-center w-full fixed top-0 left-0 z-40">
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
                <img
                  src="https://via.placeholder.com/40"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-left">
                  <span className="block text-sm">Nandha Kumaran</span>
                  <span className="block text-xs text-gray-400">Recruiter</span>
                </div>
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
                    href="#"
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faInbox} className="mr-2" /> Inbox
                  </a>
                  <a
                    href="/"
                    onClick={handleLogout}
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
 
export default MRFRecruiterNavbar;