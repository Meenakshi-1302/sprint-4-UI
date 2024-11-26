import React, { useState, useEffect } from "react";
import logo from "../../assets/RelevantzLogo.png"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser ,
  faInbox,
  faLanguage,
  faTachometerAlt,
  faCheckCircle,
  faBuilding,
  faUserPlus,
  faLocationArrow,
  faBuildingUn,
} from "@fortawesome/free-solid-svg-icons";
 
const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); 
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English"); 
 
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };
 
  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen(!languageDropdownOpen);
  };
 
  const changeLanguage = (language) => {
    setSelectedLanguage(language);
    setLanguageDropdownOpen(false); 
  };
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileDropdown = document.getElementById("profile-dropdown");
      const languageDropdown = document.getElementById("language-dropdown");
 
      if (profileDropdown && !profileDropdown.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
 
      if (languageDropdown && !languageDropdown.contains(event.target)) {
        setLanguageDropdownOpen(false);
      }
    };
 
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
 
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div
        onMouseEnter={() => setSidebarOpen(true)} 
        onMouseLeave={() => setSidebarOpen(false)} 
        style={{
          backgroundColor: "#27235c",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          transition: "width 0.3s",
          zIndex: 50,
          width: sidebarOpen ? "256px" : "64px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
            padding: "0 16px",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              height: "48px",
              display: sidebarOpen ? "block" : "none",
            }}
          />
        </div>
        <ul style={{ marginTop: "32px", marginLeft: "16px", listStyle: "none" }}>
          {/* Menu Items */}
          <li>
            <a href="/AdminDashboard" style={{ display: "flex", alignItems: "center", padding: "8px", color: "white", textDecoration: "none" }}>
              <FontAwesomeIcon icon={faTachometerAlt} style={{ width: "24px", height: "24px", color: "white" }} />
              {sidebarOpen && <span style={{ marginLeft: "16px" }}>Dashboard</span>}
            </a>
          </li>
          <li>
            <a href="/AdminViewRole" style={{ display: "flex", alignItems: "center", padding: "8px", color: "white", textDecoration: "none" }}>
              <FontAwesomeIcon icon={faCheckCircle} style={{ width: "24px", height: "24px", color: "white" }} />
              {sidebarOpen && <span style={{ marginLeft: "16px" }}>Role</span>}
            </a>
          </li>
          <li>
            <a href="/adminViewDepartment" style={{ display: "flex", alignItems: "center", padding: "8px", color: "white", textDecoration: "none" }}>
              <FontAwesomeIcon icon={faBuilding} style={{ width: "24px", height: "24px", color: "white" }} />
              {sidebarOpen && <span style={{ marginLeft: "16px" }}>Manage Department</span>}
            </a>
          </li>
          <li>
            <a href="/adminViewBussinessUnit" style={{ display: "flex", alignItems: "center", padding: "8px", color: "white", textDecoration: "none" }}>
              <FontAwesomeIcon icon={faBuildingUn} style={{ width: "24px", height: "24px", color: "white" }} />
              {sidebarOpen && <span style={{ marginLeft: "16px" }}>Manage Business Unit</span>}
            </a>
          </li>
          <li>
            <a href="/ViewEmployee" style={{ display: "flex", alignItems: "center", padding: "8px", color: "white", textDecoration: "none" }}>
              <FontAwesomeIcon icon={faUserPlus} style={{ width: "24px", height: "24px", color: "white" }} />
              {sidebarOpen && <span style={{ marginLeft: "16px" }}>Manage Employee</span>}
            </a>
          </li>
          <li>
            <a href="/adminViewLocation" style={{ display: "flex", alignItems: "center", padding: "8px", color: "white", textDecoration: "none" }}>
              <FontAwesomeIcon icon={faLocationArrow} style={{ width: "24px", height: "24px", color: "white" }} />
              {sidebarOpen && <span style={{ marginLeft: "16px" }}>Manage Location</span>}
            </a>
          </li>
        </ul>
      </div>
 
      {/* Main Content */}
      <div
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? "256px" : "64px",
          transition: "margin-left 0.3s",
          padding: "24px",
        }}
      >
        {/* Top Navbar */}
        <nav style={{ backgroundColor: "#27235c", color: "white", padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button style={{ marginRight: "8px" }}>
              <FontAwesomeIcon icon={faBars} style={{ width: "20px", height: "20px" }} />
            </button>
            <img src={logo} alt="Logo" style={{ height: "48px", marginLeft: "24px" }} />
          </div>
 
          {/* Profile and Language Dropdowns */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            
            <div id="language-dropdown" style={{ position: "relative" }}>
              <button onClick={toggleLanguageDropdown} style={{ display: "flex", alignItems: "center", background: "none", border: "none", color: "white", cursor: "pointer" }}>
                <FontAwesomeIcon icon={faLanguage} style={{ width: "20px", height: "20px" }} />
                {sidebarOpen && <span style={{ marginLeft: "8px" }}>{selectedLanguage}</span>}
              </button>
              {languageDropdownOpen && (
                <div style={{ position: "absolute", right: 0, marginTop: "8px", width: "160px", background: "white", borderRadius: "4px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", padding: "8px" }}>
                  <a href="#" onClick={() => changeLanguage("English")} style={{ display: "block", padding: "8px", color: "#333", textDecoration: "none" }}>English</a>
                  <a href="#" onClick={() => changeLanguage("Español")} style={{ display: "block", padding: "8px", color: "#333", textDecoration: "none" }}>Español</a>
                  <a href="#" onClick={() => changeLanguage("Français")} style={{ display: "block", padding: "8px", color: "#333", textDecoration: "none" }}>Français</a>
                </div>
              )}
            </div>
 
            {/* Profile Dropdown */}
            <div id="profile-dropdown" style={{ position: "relative" }}>
              <button onClick={toggleProfileDropdown} style={{ display: "flex", alignItems: "center" }}>
                <img
                  src="https://via.placeholder.com/40"
                  alt="Profile"
                  style={{ width: "32px ", height: "32px", borderRadius: "50%" }}
                />
                <div style={{ textAlign: "left", marginLeft: "8px" }}>
                  <span style={{ display: "block", fontSize: "14px" }}>John Doe</span>
                  <span style={{ display: "block", fontSize: "12px", color: "#ccc" }}>{sessionStorage.getItem("role")}</span>
                </div>
              </button>
 
              {profileDropdownOpen && (
                <div style={{ position: "absolute", right: 0, marginTop: "8px", width: "192px", background: "white", borderRadius: "4px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", padding: "8px" }}>
                  <a href="#" style={{ display: "flex", alignItems: "center", padding: "8px", color: "#333", textDecoration: "none" }}>
                    <FontAwesomeIcon icon={faUser } style={{ marginRight: "8px" }} /> Profile
                  </a>
                  <a href="#" style={{ display: "flex", alignItems: "center", padding: "8px", color: "#333", textDecoration: "none" }}>
                    <FontAwesomeIcon icon={faInbox} style={{ marginRight: "8px" }} /> Inbox
                  </a>
                  <a href="/" style={{ display: "flex", alignItems: "center", padding: "8px", color: "#333", textDecoration: "none" }}>
                    <FontAwesomeIcon icon={faUser } style={{ marginRight: "8px" }} /> Logout
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
 
export default Navbar;