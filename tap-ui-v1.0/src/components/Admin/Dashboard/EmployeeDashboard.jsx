import React, { useState, useRef, useEffect } from "react";
 
import {
  Users,
  Languages,
  SunMoon,
  Briefcase,
  Award,
  Menu,
  LayoutDashboard,
  BriefcaseBusiness,
  Handshake,
  CalendarCheck,
  UserCheck,
} from "lucide-react";
import Logo from "../../../assets/RelevantzBlue.PNG";
import { useNavigate } from "react-router-dom";
import User3D from "../../../assets/pngtre.png";
import ToDoList from "../TODO/ToDoList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox, faUser } from "@fortawesome/free-solid-svg-icons";
import { getAllMrfData } from "../../../services/Admin/Mrf/MrfService";
import { fetchMrfData } from "../../../services/ClientPartner/DatewiseService";
import { getEmployeeById } from "../../../services/Admin/Employee/EmployeeService";
import SimpleCalendar from "./SimpleCalendar";
 
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
 
const EmployeeDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(false);
 
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
 
  const [totalRequiredResourceCount, setTotalRequiredResourceCount] =
    useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [employeeData, setEmployeeData] = useState(null);
 
  const navigate = useNavigate();
 
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
 
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "viewjobs", label: "View Jobs", icon: BriefcaseBusiness, route: "/adminViewAvailableJobs" }, // Add route property here
    { id: "referfriends", label: "Refer Friends", icon: Handshake },
  ];
 
  const Sidebar = () => (
    <div
      className={`fixed left-0 top-0 h-full text-white transition-all duration-300 ease-in-out z-20
      ${isSidebarOpen ? "w-64" : "w-16"} ${isMobile ? "shadow-2xl" : ""}`}
      style={{ backgroundColor: "#27235C" }}
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-10 mr-10 mt-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Menu className="w-7 h-7" ml-1 />
          </button>
          {isSidebarOpen && (
            <img src={Logo} alt="Organization Logo" className="ml-3 mr-2 h-12 mt-3" />
          )}
        </div>
        <nav>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                // Navigate to the specific route if defined
                if (item.route) {
                  navigate(item.route); // Use navigate to go to the defined route
                }
                if (isMobile) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors
                ${activeTab === item.id ? "bg-blue-600" : "hover:bg-gray-700"}`}
            >
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
 
  useEffect(() => {
    const fetchMrfData = async () => {
      setLoading(true);
      try {
        // Fetch MRF data
        const mrfData = await getAllMrfData();
        const totalCount = mrfData.reduce(
          (acc, mrf) => acc + (mrf.requiredResourceCount || 0),
          0
        );
        setTotalRequiredResourceCount(totalCount);
 
        console.log("MRF Data:", mrfData);
        console.log("Total Required Resource Count:", totalCount);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchMrfData();
  }, []);
 
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
 
  const id = sessionStorage.getItem("employeeId");
  console.log(id);
 
  useEffect(() => {
    if (id === null) {
      navigate("/");
    }
    else {
      const fetchEmployeeData = async () => {
          setLoading(true);
          try {
              const data = await getEmployeeById(id);
              setEmployeeData(data);
          } catch (error) {
              console.error('Failed to fetch employee:', error);
          } finally {
              setLoading(false);
          }
      };
      fetchEmployeeData();
  }
}, [id, navigate]);
 
  const calculateExperience = (createdDate) => {
    if (!createdDate) return "N/A"; // Handle case if no date is available
    const startDate = new Date(createdDate);
    const today = new Date();
    const totalDays = Math.floor((today - startDate) / (1000 * 3600 * 24));
    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    return `${years} year${years !== 1 ? "s" : ""}, ${months} month${
      months !== 1 ? "s" : ""
    }`;
  };
 
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };
 
  const StatCard = ({ icon: Icon, title, value, color }) => {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300 flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <h3 className="text-2xl font-bold"> {value}</h3>
        </div>
      </div>
    );
  };
 
  return (
    <div className="min-h-screen bg-gray-200">
      <Sidebar />
 
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <div className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Employee Dashboard
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <SunMoon className="w-6 h-6" />
              </button>
 
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <Languages className="w-6 h-6" />
              </button>
 
              <div
                id="profile-dropdown"
                style={{ position: "relative", zIndex: 50 }}
              >
                <button
                  onClick={toggleProfileDropdown}
                  style={{ display: "flex", alignItems: "center" }}
                >
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
                        color: "#ccc",
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
                      <FontAwesomeIcon
                        icon={faUser}
                        style={{ marginRight: "8px" }}
                      />{" "}
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
                      <FontAwesomeIcon
                        icon={faInbox}
                        style={{ marginRight: "8px" }}
                      />{" "}
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
                      <FontAwesomeIcon
                        icon={faUser}
                        style={{ marginRight: "8px" }}
                      />{" "}
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
 
        <div className="flex justify-center items-center">
          <div className="bg-gradient-to-r from-[#97247E] to-[#E01950] text-white rounded-lg shadow-md m-6 flex items-center w-full lg:w-1/3 h-64">
            <div className="ml-6 w-30">
              <h2 className="text-xl font-semibold">Welcome Back!</h2>
              <p className="mt-1">Employee Number: 12222</p>
              <p className="mt-1">Department: Delivery</p>
              <p className="mt-1">Work Location: Virudhunagar</p>
              <button className="mt-2 bg-white text-[#E01950] rounded-lg px-4 py-1">
                View Profile
              </button>
            </div>
            <img
              src={User3D}
              alt="Profile"
              className="rounded-md ml-4 bounce"
              style={{
                width: "100%",
                maxWidth: "210px",
                marginLeft: "16px",
                height: "auto",
              }}
            />
          </div>
 
          <div className="p-6 grid grid-cols-2 lg:grid-cols-2 gap-4 w-full lg:w-2/3">
            <div className="col-span-2 lg:col-span-1">
              <StatCard
                icon={UserCheck}
                title="Current Openings"
                value={totalRequiredResourceCount} // Use state value here
                color="bg-blue-500"
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <StatCard
                icon={Briefcase}
                title="Experience"
                value={
                  employeeData
                    ? calculateExperience(employeeData.createdDate)
                    : "N/A"
                }
                color="bg-yellow-500"
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <StatCard
                icon={Users}
                title="Referrals"
                value={3}
                color="bg-green-500"
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <StatCard
                icon={CalendarCheck}
                title="Schedules"
                value={5}
                color="bg-red-500"
              />
            </div>
          </div>
        </div>
 
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4">Calendar</h2>
                <SimpleCalendar events={[]} />
              </div>
 
          {/* TODO */}
          <div className="bg-white rounded-lg shadow-md p-4 flex-grow flex flex-col">
            <h2 className="text-xl font-bold mb-4">To Do List</h2>
            <ToDoList />
          </div>
        </div>
      </div>
 
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
 
export default EmployeeDashboard;