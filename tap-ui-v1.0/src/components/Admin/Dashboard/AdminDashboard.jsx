import React, { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  SquarePlus,
  MapPin,
  Menu,
  LayoutDashboard,
  Building2,
  Landmark,
  House,
  Newspaper,
  MapPinCheckInside,
  UserRoundPlus,
  SunMoon,
  Languages,
} from "lucide-react";
import Logo from "../../../assets/RelevantzBlue.PNG";
import { useNavigate } from "react-router-dom";
import SimpleCalendar from "./SimpleCalendar";
import ToDoList from "../TODO/ToDoList";
import ViewDepartmentView from "../../../views/Admin/Department/ViewDepartmentView";
import AdminViewRole from "../Role/AdminViewRole";
import ViewEmployee from "../Employee/ViewEmployee";
import AdminViewLocation from "../Location/AdminViewLocation";
import AdminViewBussinessUnit from "../BussinessUnit/AdminViewBussinessUnit";
import CreateBulkEmployee from "../Employee/CreateBulkEmployee";
import User3D from "../../../assets/pngtre.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox, faUser } from "@fortawesome/free-solid-svg-icons";
import { getBussinessUnits } from "../../../services/Admin/BussinessUnit/AdminBusinessUnitService";
import { getAdminRoles } from "../../../services/Admin/Role/AdminRoleService";
import { getEmployees } from "../../../services/Admin/Employee/EmployeeService";
import { getLocations } from "../../../services/Admin/Location/LocationService";
import { getAdminDepartments } from "../../../services/Admin/Department/AdminDepartmentService";

const AdminDashboard = () => {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(false);
  const [businessUnitsCount, setBusinessUnitsCount] = useState(0);
  const [departmentsCount, setDepartmentsCount] = useState(0);
  const [rolesCount, setRolesCount] = useState(0);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [totalLocations, setTotalLocations] = useState(0);
  const [locationData, setLocationData] = useState([]);
  const [businessUnitData, setBusinessUnitData] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formattedDepartmentData, setFormattedDepartmentData] = useState([]);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // New language
  const navigate = useNavigate();

  // Fetch employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesData = await getEmployees();
        setEmployees(employeesData);
        setEmployeesCount(employeesData.length);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departments = await getAdminDepartments();
        setDepartmentsCount(departments.length);
        const roles = await getAdminRoles();
        const roleCountMap = {};
        roles.forEach((role) => {
          const departmentName = role.department?.departmentName || "Unknown";
          roleCountMap[departmentName] =
            (roleCountMap[departmentName] || 0) + 1;
        });
        const departmentDistribution = departments.map((dep) => ({
          department: dep.departmentName,
          RoleCount: roleCountMap[dep.departmentName] || 0,
        }));
        setFormattedDepartmentData(departmentDistribution);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };
    fetchDepartments();
  }, [employees]);

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
      } if (languageDropdown && !languageDropdown.contains(event.target)) {
        setLanguageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);


  const id = sessionStorage.getItem('UserId');
  console.log(id);
  useEffect(() => {
    if (id === null) {
      navigate('/');
    }
  }, []); 
  
  const handleLogout = () => {
     sessionStorage.clear();
     navigate('/'); 
  };


  // Fetch locations and business units
  useEffect(() => {
    const fetchData = async () => {
      try {
        const locations = await getLocations();
        setLocationData(locations);
        setTotalLocations(locations.length);
        const businessUnits = await getBussinessUnits();
        setBusinessUnitData(businessUnits);
        setBusinessUnitsCount(businessUnits.length);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roles = await getAdminRoles();
        setRolesCount(roles.length);
        const roleDistribution = {};
        employees.forEach((emp) => {
          const roleName = emp.role?.roleName || "Unknown";
          roleDistribution[roleName] = (roleDistribution[roleName] || 0) + 1;
        });
        setRolesData(
          Object.entries(roleDistribution).map(([name, employeecount]) => ({
            name,
            employeecount,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch roles or employees:", error);
      }
    };
    if (employees.length > 0) {
      fetchRoles();
    }
  }, [employees]);

  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Dropdown functionality for outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const StatCard = ({ icon: Icon, title, value, color, onClick }) => {
    return (
      <div
        className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300 flex items-center space-x-4 cursor-pointer"
        onClick={onClick}
      >
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    );
  };

  const MainContent = () => {
    const formattedData = locationData.map((location) => ({
      locationName: location.locationName,
      businessUnits: businessUnitData.filter(
        (businessUnit) =>
          businessUnit.businessUnitLocation === location.locationName
      ).length,
    }));

    const maxEmployeeCount = Math.max(...rolesData.map(role => role.employeecount));

    const formatTick = (value) => {
      // Check if the value is a whole number
      return Number.isInteger(value) ? value : ''; // Show value if it's an integer, otherwise show an empty string
    };

    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StatCard
                icon={Users}
                title="Total Employees"
                value={employeesCount}
                color="bg-blue-500"
                onClick={() => setActiveTab('employee')}
              />
              <StatCard
                icon={Landmark}
                title="Business Units"
                value={businessUnitsCount}
                color="bg-green-500"
                onClick={() => setActiveTab('business unit')}
              />
              <StatCard
                icon={House}
                title="Departments"
                value={departmentsCount}
                color="bg-purple-500"
                onClick={() => setActiveTab('department')}
              />
              <StatCard
                icon={Newspaper}
                title="Total Roles"
                value={rolesCount}
                color="bg-yellow-500"
                onClick={() => setActiveTab('role')}
              />
              <StatCard
                icon={MapPin}
                title="Locations"
                value={totalLocations}
                color="bg-red-500"
                onClick={() => setActiveTab('location')}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Profile Card */}
              <div className="bg-gradient-to-r from-[#97247E] to-[#E01950] text-white rounded-xl shadow-lg flex items-center p-6">
                <div>
                  <h2 className="text-xl font-semibold">Welcome Back!</h2>
                  <p className="mt-6">Remember! Every great system begins with a great admin like you</p>
                  {/* <p className="mt-3">Department: Delivery</p>
                  <p className="mt-3">Work Location: Virudhunagar</p> */}
                  <button className="mt-6 bg-white text-[#E01950] rounded-lg px-4 py-1">
                    View Profile
                  </button>
                </div>
                <img
                  src={User3D}
                  alt="Profile"
                  className="rounded-md ml-4"
                  style={{ width: "100%", maxWidth: "170px", height: "auto" }}
                />
              </div>

              {/* Calendar Component */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4">Calendar</h2>
                <SimpleCalendar events={[]} />
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-10">
                  Business Units by Location
                </h2>
                <div className="h-50">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={formattedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="locationName" />
                      <YAxis
                        domain={[0, "dataMax + 1"]}
                        ticks={Array.from(
                          {
                            length:
                              Math.max(
                                ...formattedData.map(
                                  (data) => data.businessUnits
                                )
                              ) + 2,
                          },
                          (_, i) => i
                        )} // Create an array of whole numbers based on max value
                      />
                      <Tooltip />
                      <Bar dataKey="businessUnits" fill="#E01950" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Third Section: Role and Department Distribution Charts */}
            {/* Role Distribution Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4">Role Distribution</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rolesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      {/* <YAxis /> */}
                      <YAxis domain={[0, maxEmployeeCount]} tickFormatter={formatTick} />
                      <Tooltip />
                      <Bar dataKey="employeecount" fill="#AC5098" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Department Distribution Chart */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4">
                  Department Distribution
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formattedDepartmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="RoleCount" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Fourth Section: To Do List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4">To Do List</h2>
                <ToDoList />
              </div>
            </div>
          </>
        );

      case "department":
        return <ViewDepartmentView />;
      case "location":
        return <AdminViewLocation />;
      case "business unit":
        return <AdminViewBussinessUnit />;
      case "role":
        return <AdminViewRole />;
      case "employee":
        return <ViewEmployee />;
      case "bulk employee":
        return <CreateBulkEmployee />;
      default:
        return null;
    }
  };

  const Sidebar = () => (
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

  return (
    <div className="bg-gray-200 h-screen flex">
    <Sidebar />
    <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
    <div className="sticky top-0 z-10 bg-white shadow-sm">
    <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Admin Dashboard
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

        <div className="p-6 overflow-y-auto flex-1">

          <MainContent />
        </div>
      </div>

      {isMobile && isSidebarOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={() => setIsSidebarOpen(false)} />
    )}

      {isProfileDropdownOpen && (
        <div
          ref={profileDropdownRef}
          className="fixed top-16 right-6 bg-white rounded-lg shadow-lg z-10 w-48"
        >
          <ul className="py-2">
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                Profile
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                Settings
              </a>
            </li>
            <li>
              <a
                href="/"
                onClick={handleLogout}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;