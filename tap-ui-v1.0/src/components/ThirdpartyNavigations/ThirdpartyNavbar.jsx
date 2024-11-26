import React from "react";
import { SunMoon, Languages } from "lucide-react";

const ThirdpartyNavbar = ({ toggleProfileDropdown, profileDropdownOpen, handleLogout }) => (
  <div className="sticky top-0 z-10 bg-white shadow-sm">
    <div className="flex items-center justify-between p-6">
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Client Dashboard</h1>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <SunMoon className="w-6 h-6" />
        </button>
        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <Languages className="w-6 h-6" />
        </button>
        <div style={{ position: "relative", zIndex: 50 }}>
          <button onClick={toggleProfileDropdown} style={{ display: "flex", alignItems: "center" }}>
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              style={{
                width: "32px ",
                height: "32px",
                borderRadius: "50%",
              }}
            />
            <div style={{ textAlign: "left", marginLeft: "8px" }}>
              <span style={{ display: "block", fontSize: "14px" }}>
                {sessionStorage.getItem("email")}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "black",
                }}
              >
                {sessionStorage.getItem("role")}
              </span>
            </div>
          </button>
          {profileDropdownOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                marginTop: "8px",
                width: "192px",
                background: "white",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                padding: "8px",
              }}
            >
              <a
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px",
                  color: "#333",
                  textDecoration: "none",
                }}
              >
                Profile
              </a>
              <a
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px",
                  color: "#333",
                  textDecoration: "none",
                }}
              >
                Inbox
              </a>
              <a
                href="/"
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px",
                  color: "#333",
                  textDecoration: "none",
                }}
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ThirdpartyNavbar;