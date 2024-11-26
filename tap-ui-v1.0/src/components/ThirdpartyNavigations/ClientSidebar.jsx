import React from "react";
import { Menu } from "lucide-react";
import { LayoutDashboard, Landmark, MapPinCheckInside, Building2, SquarePlus, UserRoundPlus, Users } from "lucide-react";
import Logo from "../../assets/RelevantzBlue.PNG";

const ClientSidebar = ({ isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab, isMobile }) => (
  <div
    className={`fixed left-0 top-0 h-full text-white transition-all duration-300 ease-in-out z-20 ${isSidebarOpen ? "w-64" : "w-16"
      } ${isMobile ? "shadow-2xl" : ""}`}
    style={{ backgroundColor: "#27235C" }}
  >
    <div className="p-3">
      <div className="flex items-center justify-between mb-10 mr-10 mt-2">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Menu className="w-7 h-7" />
        </button>
        {isSidebarOpen && (
          <img
            src={Logo}
            alt="Organization Logo"
            className="ml-3 mr-2 h-12 mt-3"
          />
        )}
      </div>
      <nav>
        {[
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { id: "department", label: "Department", icon: Landmark },
          { id: "location", label: "Location", icon: MapPinCheckInside },
          { id: "business unit", label: "Business Unit", icon: Building2 },
          { id: "role", label: "Role", icon: SquarePlus },
          { id: "employee", label: "Employee", icon: UserRoundPlus },
          { id: "bulk employee", label: "Bulk Employee", icon: Users },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              if (isMobile) setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${activeTab === item.id ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
          >
            <item.icon className="w-5 h-5" />
            {isSidebarOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  </div>
);

export default ClientSidebar;