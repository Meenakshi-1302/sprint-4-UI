import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import { useNavigate } from "react-router-dom";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Chart from "react-apexcharts";
import moment from "moment";
import {
  getJobRequirements,
  getShortlistedCount,
  getCandidates,
} from "../../../services/Client/ClientDashboardService";
import axios from "axios";
import gif1 from "../../../assets/ClientDashboardgif/process.gif";
import gif2 from "../../../assets/ClientDashboardgif/human-resources.gif";
import gif3 from "../../../assets/ClientDashboardgif/curriculum-vitae.gif";
import { Menu, SunMoon, Languages, FilePlus, List, Key } from "lucide-react";
import Logo from "../../../assets/RelevantzBlue.PNG";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox, faUser } from "@fortawesome/free-solid-svg-icons";
import {
  LayoutDashboard,
  Landmark,
  MapPinCheckInside,
  Building2,
  SquarePlus,
  UserRoundPlus,
  Users,
} from "lucide-react";

const ClientDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userName] = useState("John Doe");
  const [currentTime] = useState(moment().format("LTS"));
  const [jobPosts, setJobPosts] = useState(0);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [hiringCount, setHiringCount] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [chartSeries, setChartSeries] = useState([0, 0, 0]);
  const [pageSize, setPageSize] = useState(5);
  const [activeTab, setActiveTab] = useState("dashboard"); // Default active tab
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Column definitions for the AgGrid
  const columnDefs = [
    {
      headerName: "Requirement",
      field: "requirement",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Resource required",
      field: "resourceNeeded",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Hired count",
      field: "resourceAssigned",
      sortable: true,
      filter: true,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientId = sessionStorage.getItem("vendorId");
        const jobPostCount = await getJobRequirements(clientId);
        setJobPosts(jobPostCount);

        const totalApplicantsCount = await getCandidates(clientId);
        setTotalApplicants(totalApplicantsCount.length);

        const hiringCountValue = await getShortlistedCount(clientId);
        setHiringCount(hiringCountValue);

        const requirementsResponse = await axios.get(
          `http://localhost:8080/tap/api/requirement-by-client/${clientId}`
        );
        const requirementsData = requirementsResponse.data;

        const transformedData = await Promise.all(
          requirementsData.map(async (requirement) => {
            const resourceNeeded = requirement.totalRequiredResourceCount;
            const assignedResponse = await axios.get(
              `http://localhost:8080/tap/api/hired/${requirement.requirementId}`
            );
            return {
              requirement: requirement.requirementId,
              resourceNeeded,
              resourceAssigned: assignedResponse.data,
            };
          })
        );

        setRowData(transformedData);
        setChartSeries([
          totalApplicantsCount.length,
          hiringCountValue,
          jobPostCount,
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    chart: {
      type: "pie",
      height: "350",
    },
    labels: ["Total Applicants", "Hiring Count", "Job Posts"],
    colors: ["#008FFB", "#00E396", "#FEB019"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  // New function to handle the "View More" button click
  const handleViewMore = () => {
    navigate("/JobRequirementsTable"); // Adjust the path as needed
  };

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
          {[
            {
              id: "dashboard",
              label: "Dashboard",
              icon: LayoutDashboard,
              path: "/clientdashboard",
            },
            {
              id: "post-requirements",
              label: "Post Requirements",
              icon: FilePlus,
              path: "/requirement",
            },
            {
              id: "view-requirements",
              label: "View All Requirements",
              icon: List,
              path: "/jobRequirementsTable",
            },
            {
              id: "reset-password",
              label: "Reset Password",
              icon: Key,
              path: "/resetpassword",
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                navigate(item.path);
              }}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
                activeTab === item.id ? "bg-blue-600" : "hover:bg-gray-700"
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
    <div
      className={`flex h-screen ${
        isSidebarOpen ? "ml-64" : "ml-16"
      }`}
    >
      <Sidebar />
      <div className="flex-1">
        {/* Navbar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between p-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Client Dashboard
            </h1>
            <div className="flex items-center space-x-2">
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <SunMoon className="w-6 h-6" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <Languages className="w-6 h-6" />
              </button>
              <div style={{ position: "relative", zIndex: 50 }}>
                <button
                  onClick={toggleProfileDropdown}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Profile"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                    }}
                  />
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

        <div className="flex flex-col flex-grow bg-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 p-6">
            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold text-center">
                Welcome, {userName}!
              </h2>
              <p className="text-gray-600 text-center">{currentTime}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center">
              <div className="flex items-center">
                <div className="w-12 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-4 overflow-hidden">
                  <img
                    src={gif1}
                    alt="Requirements Posted"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold">Requirements Posted</h3>
                  <p className="text-2xl">{jobPosts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center">
              <div className="flex items-center">
                <div className="w-12 h-10 rounded-full bg-green-500 flex items-center justify-center mr-4 overflow-hidden">
                  <img
                    src={gif2}
                    alt="Hiring Count"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold">Hiring Count</h3>
                  <p className="text-2xl">{totalApplicants}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center">
              <div className="flex items-center">
                <div className="w-12 h-10 rounded-full bg-yellow-500 flex items-center justify-center mr-4 overflow-hidden">
                  <img
                    src={gif3}
                    alt="Shortlisted Count"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold">Shortlisted Count</h3>
                  <p className="text-2xl">{hiringCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-6">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">
                Job Applications Overview
              </h3>
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="pie"
                height={350}
              />
            </div>
            <div
              className="ag-theme-alpine"
              style={{ height: "400px", width: "100%" }}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-semibold">Applicants List</p>
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded-md"
                  onClick={handleViewMore}
                >
                  View More
                </button>
              </div>
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={pageSize}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
