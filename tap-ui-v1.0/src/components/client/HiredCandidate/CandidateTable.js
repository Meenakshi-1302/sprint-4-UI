// import React, { useState, useEffect } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import axios from 'axios';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// import { FaSearch } from 'react-icons/fa';
// import { useParams } from 'react-router-dom';
// import ClientNavbar from '../Dashboard/ClientNavbar';

// const CandidateTable = () => {
//   const [candidatesData, setCandidatesData] = useState([]);
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { requirementId } = useParams();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/tap/api/hired-requirement/${requirementId}`);
//         setCandidatesData(response.data);
//         console.log(response.data);
//       } catch (error) {
//         console.error('Error fetching the candidates data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   // const filteredData = candidatesData.filter(candidate =>
//   //   candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //   candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //   candidate.skills.toLowerCase().includes(searchTerm.toLowerCase())
//   // );

//   const columns = [
//     { headerName: 'Name', field: 'firstName', filter: true, flex: 1, minWidth: 200 },
//     { headerName: 'Skills', field: 'skill', filter: true, flex: 1, minWidth: 200 },
//     { headerName: 'Location', field: 'location', filter: true, flex: 1, minWidth: 200 },

//     {
//       headerName: 'Actions',
//       field: 'actions',
//       cellRenderer: (params) => (
//         <button
//         className="bg-[#27235C] text-white py-1 px-3 text-xs rounded-lg  transition duration-200 hover:bg-[#524F7D]"
//         onClick={() => setSelectedCandidate(params.data)}
//         >
//           View More
//         </button>
//       ),
//       width: 120, // Set fixed width for the action column
//       maxWidth: 120, // Avoid expanding beyond this width
//       minWidth: 120 // Ensure it doesn't shrink too much
//     },
//   ];

//   const closeModal = () => {
//     setSelectedCandidate(null);
//   };

//   return (
//     <div className="flex flex-col items-center mx-auto p-4 mt-20">
//       <ClientNavbar />
//       {/* Search Bar */}
//       <b><h1>Hired candidates</h1></b>
//       <div className="flex items-center mb-6 w-full max-w-4xl">
//         <div className="relative w-full">
//           <FaSearch className="absolute left-3 top-2 text-gray-500" />
//           <input
//             type="text"
//             placeholder="Search candidates..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="border rounded-full pl-10 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       {/* Ag-Grid Table */}
//       <div className="ag-theme-alpine w-full max-w-4xl h-96">
//         <AgGridReact
//           rowData={candidatesData}
//           columnDefs={columns}
//           pagination={true}
//           paginationPageSize={5}
//           enableSorting={true}
//           domLayout='autoHeight'
//           suppressRowHoverHighlight={true}
//         />
//       </div>
//     </div>
//   );
// };

// export default CandidateTable;

import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FaSearch } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu, SunMoon, Languages, LayoutDashboard, FilePlus, List, Key } from "lucide-react";
import Logo from "../../../assets/RelevantzBlue.PNG"; // Adjust path as necessary

const CandidateTable = () => {
  const [candidatesData, setCandidatesData] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { requirementId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("view-requirements");
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/tap/api/hired-requirement/${requirementId}`);
        setCandidatesData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching the candidates data:', error);
      }
    };

    fetchData();
  }, [requirementId]);

  const columns = [
    { headerName: 'Name', field: 'firstName', filter: true, flex: 1, minWidth: 200 },
    { headerName: 'Skills', field: 'skill', filter: true, flex: 1, minWidth: 200 },
    { headerName: 'Location', field: 'location', filter: true, flex: 1, minWidth: 200 },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params) => (
        <button
          className="bg-[#27235C] text-white py-1 px-3 text-xs rounded-lg transition duration-200 hover:bg-[#524F7D]"
          onClick={() => setSelectedCandidate(params.data)}
        >
          View More
        </button>
      ),
      width: 120,
    },
  ];

  const closeModal = () => {
    setSelectedCandidate(null);
  };

  // Sidebar Component
  const Sidebar = () => (
    <div
      className={`fixed left-0 top-0 h-full text-white transition-all duration-300 ease-in-out z-20 ${isSidebarOpen ? "w-64" : "w-16"}`}
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
              alt="Company Logo" 
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
                navigate(item.path);
                setActiveTab(item.id);
              }}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${activeTab === item.id ? "bg-blue-600" : "hover:bg-gray-700"}`}
            >
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  // Navbar Component
  const Navbar = () => (
    <div className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold text-gray-800">Hired Candidates</h1>
        <div className="flex items-center space-x-2">
          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <SunMoon className="w-6 h-6" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <Languages className="w-6 h-6" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <img src="https://via.placeholder.com/40" alt="Profile" className="rounded-full" style={{ width: "32px", height: "32px" }} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="flex flex-col items-center mx-auto p-4 mt-20">
          {/* Search Bar */}
          <div className="flex items-center mb-6 w-full max-w-4xl">
            <FaSearch className="absolute left-3 top-2 text-gray-500" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-full pl-10 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Ag-Grid Table */}
          <div className="ag-theme-alpine w-full max-w-4xl h-96">
            <AgGridReact
              rowData={candidatesData}
              columnDefs={columns}
              pagination={true}
              paginationPageSize={5}
              enableSorting={true}
              domLayout='autoHeight'
              suppressRowHoverHighlight={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateTable;