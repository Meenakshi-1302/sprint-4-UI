import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaTimes,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { getAllJobPostings } from "../../../services/Admin/Employee/JobPostingService";
import { getBussinessUnits } from "../../../services/Admin/BussinessUnit/AdminBusinessUnitService";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox, faUser } from "@fortawesome/free-solid-svg-icons";
import Logo from "../../../assets/RelevantzBlue.PNG";
import {
  Menu,
  LayoutDashboard,
  BriefcaseBusiness,
  Handshake,
  SunMoon,
  Languages,
} from "lucide-react";

const AdminViewAvailableJobs = () => {
  // State for jobs, filters, loading, pagination, sidebar toggle
  const [jobs, setJobs] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    jobTypes: [],
    locations: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesCount, setEntriesCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("viewjobs");
  const [isMobile, setIsMobile] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

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

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
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

  const jobTypes = ["Full-time", "Part-time", "Remote"];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getAllJobPostings();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const businessUnits = await getBussinessUnits();
      const uniqueLocations = new Set();
      businessUnits.forEach((businessUnit) => {
        if (businessUnit.businessUnitLocation) {
          uniqueLocations.add(businessUnit.businessUnitLocation);
        }
      });
      setLocations(Array.from(uniqueLocations));
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchLocations();
  }, []);

  const filterJobs = () => {
    return jobs
      .filter((job) => {
        const jobMatchesType =
          selectedFilters.jobTypes.length === 0 ||
          selectedFilters.jobTypes.includes(job.jobType);

        const jobLocation = job.mrf?.mrfCriteria?.jobLocation;
        const locationMatches =
          selectedFilters.locations.length === 0 ||
          (jobLocation && selectedFilters.locations.includes(jobLocation));

        const searchTermMatches =
          (job.jobTitle &&
            job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (jobLocation &&
            jobLocation.toLowerCase().includes(searchTerm.toLowerCase()));

        return jobMatchesType && locationMatches && searchTermMatches;
      })
      .slice((currentPage - 1) * entriesCount, currentPage * entriesCount);
  };

  const totalPages = Math.ceil(filterJobs().length / entriesCount);

  const handleFilterChange = (type, value) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      const currentFilters = newFilters[type];
      if (currentFilters.includes(value)) {
        newFilters[type] = currentFilters.filter((v) => v !== value);
      } else {
        newFilters[type] = [...currentFilters, value];
      }
      return newFilters;
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      route: "/employeeDashboard",
    },
    { id: "viewjobs", label: "View Jobs", icon: BriefcaseBusiness },
    { id: "referfriends", label: "Refer Friends", icon: Handshake },
  ];

  const Sidebar = () => (
    <div
      className={`fixed left-0 top-0 h-full text-white transition-all duration-300 ease-in-out z-20 ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}
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

  const filteredJobs = filterJobs();

  return (
    <div className="min-h-screen flex bg-gray-200">
      <Sidebar />
      <div
        className={`flex-grow transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <div className="bg-white shadow-sm p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Available Jobs</h1>
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

        <div className="min-h-screen flex flex-col items-center py-8 bg-[#eeeeee]">
          <div className="w-full max-w-7xl p-6 bg-white rounded-lg shadow-xl flex space-x-6">
            {/* Left Sidebar for Filters */}
            <div className="w-1/4 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-[#27235C] mb-4">Filters</h2>

              {/* Job Type Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#27235C]">Job Type</h3>
                {jobTypes.map((type) => (
                  <div key={type} className="flex items-center mb-2">
                    <div
                      className={`custom-checkbox ${
                        selectedFilters.jobTypes.includes(type) ? "checked" : ""
                      }`}
                      onClick={() => handleFilterChange("jobTypes", type)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        handleFilterChange("jobTypes", type)
                      }
                    >
                      {selectedFilters.jobTypes.includes(type) && (
                        <span className="tick-mark">✔</span>
                      )}
                    </div>
                    <label onClick={() => handleFilterChange("jobTypes", type)}>
                      {type}
                    </label>
                  </div>
                ))}
              </div>

              {/* Location Filter */}
              <div>
                <h3 className="text-lg font-semibold text-[#27235C]">Location</h3>
                {locations.map((location) => (
                  <div key={location} className="flex items-center mb-2">
                    <div
                      className={`custom-checkbox ${
                        selectedFilters.locations.includes(location)
                          ? "checked"
                          : ""
                      }`}
                      onClick={() => handleFilterChange("locations", location)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        handleFilterChange("locations", location)
                      }
                    >
                      {selectedFilters.locations.includes(location) && (
                        <span className="tick-mark">✔</span>
                      )}
                    </div>
                    <label
                      onClick={() => handleFilterChange("locations", location)}
                    >
                      {location}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Job Cards */}
            <div className="w-3/4">
              {/* Search Bar */}
              <div className="flex justify-between items-center mb-6">
                <div className="relative flex items-center w-full max-w-md">
                  <FaSearch className="absolute left-3 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search Jobs..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                  {searchTerm && (
                    <button
                      className="absolute right-3 text-gray-500 hover:text-gray-700"
                      onClick={() => setSearchTerm("")}
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>

              {/* Job Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredJobs.length === 0 ? (
                  <div className="col-span-3 text-center text-xl text-red-500 font-bold mb-6">
                    No Available Jobs
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <div
                      key={job.jobPostingId}
                      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
                    >
                      <h3 className="text-xl font-semibold text-[#27235C]">
                        {job.jobTitle}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Department:{" "}
                        {job.mrf
                          ? job.mrf.mrfDepartmentName
                          : "Department not provided"}
                      </p>
                      {/* Display Educational Qualification and Years of Experience */}
                      <p className="text-sm text-gray-500">
                        Educational Qualification:{" "}
                        {job.mrf?.mrfCriteria?.educationalQualification ||
                          "Not specified"}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        Years of Experience:{" "}
                        {job.mrf?.mrfCriteria?.yearsOfExperience || "Not specified"}
                      </p>
                      <p className="text-sm text-gray-700">
                        {job.jobDescription}
                      </p>
                      <p className="mt-2 text-sm text-gray-600">
                        Location:{" "}
                        {job.mrf?.mrfCriteria?.jobLocation || "Location not provided"}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination Controls - only show if there are available jobs */}
              {filteredJobs.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => handlePageChange("prev")}
                    disabled={currentPage === 1}
                    className="p-2 bg-gray-200 rounded-l disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft />
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange("next")}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-gray-200 rounded-r disabled:cursor-not-allowed"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Add custom styles */}
          <style>{`
        .custom-checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid #27235C; /* Border color */
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          cursor: pointer;
          position: relative;
          background-color: white; /* Default background color */
        }
        .custom-checkbox.checked {
          background-color: #27235C; /* Checkbox background color when checked */
        }
        .custom-checkbox.checked .tick-mark {
          color: white; /* Change tick mark color to white when checked */
          display: block; /* Show tick mark when checked */
        }
        .tick-mark {
          font-size: 16px;
          display: none; /* Initially hide the tick mark */
        }
      `}</style>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminViewAvailableJobs;
