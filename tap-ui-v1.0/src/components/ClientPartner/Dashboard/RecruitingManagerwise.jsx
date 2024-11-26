// import React, { useState, useEffect } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import { fetchMrfVendors, fetchAllRecruiters, fetchVendorDetails } from '../../../services/ClientPartner/RecruitingManagerwiseService';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// import VendorDetails from './VendorDetails';
// import RecruitingManagerDetails from './RecruitingManagerDetails';

// function RecruitingManagerwise({ sidebarOpen }) {
//     const [vendors, setVendors] = useState([]);
//     const [recruiters, setRecruiters] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [filter, setFilter] = useState('All');
//     const [selectedVendor, setSelectedVendor] = useState(null);
//     const [modalIsOpen, setModalIsOpen] = useState(false);
//     const [organizationMap, setOrganizationMap] = useState({});
//     const [managerMap, setManagerMap] = useState({});
//     const [selectedManager, setSelectedManager] = useState(null);
//     const [mrfData, setMrfData] = useState([])

//     useEffect(() => {
//         const loadVendorsAndManagers = async () => {
//             try {
//                 const vendorData = await fetchMrfVendors();
//                 setVendors(vendorData);

//                 const recruiterData = await fetchAllRecruiters();
//                 setRecruiters(recruiterData);

//                 const uniqueManagerIds = [...new Set(vendorData.map(vendor => vendor.recrutingManagerId))];
//                 const managerEmails = await Promise.all(
//                     uniqueManagerIds.map(id =>
//                         fetch(`http://localhost:8080/tap/getEmployeeById/${id}`)
//                             .then(response => response.json())
//                     )
//                 );

//                 const managerMap = managerEmails.reduce((acc, employeeData) => {
//                     acc[employeeData.employeeId] = employeeData;
//                     return acc;
//                 }, {});

//                 setManagerMap(managerMap);
//             } catch (error) {
//                 setError(error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         const loadOrganizations = async () => {
//             try {
//                 const vendorData = await fetchMrfVendors();
//                 const map = vendorData.reduce((acc, vendor) => {
//                     acc[vendor.vendorId] = vendor.organizationName;
//                     return acc;
//                 }, {});
//                 setOrganizationMap(map);
//             } catch (error) {
//                 console.error('Error fetching organization names:', error);
//             }
//         };

//         const loadMRFs = async () => { 
//             try {
//                 const response = await fetch('http://localhost:8080/tap/mrf/getAllMrf');
//                 const mrfData = await response.json();
//                 setMrfData(mrfData);
//             } catch (error) {
//                 console.error('Error fetching MRFs:', error);
//             }
//         };

//         loadVendorsAndManagers();
//         loadOrganizations();
//         loadMRFs();
//     }, []);

//     const getMrfStageById = (mrfId) => {
//         const mrfDetails = mrfData.find(mrf => mrf.mrfId === mrfId);
//         return mrfDetails ? mrfDetails.mrfStatus.mrfStage : 'N/A';
//     };

//     const colorStatusText = (status) => {
//         switch (status) {
//             case 'Assigned':
//                 return 'text-green-600';
//             case 'Not Assigned':
//                 return 'text-red-500';
//             case 'Not Started':
//                 return 'text-yellow-500';
//             case 'Pending':
//                 return 'text-gray-500';
//             default:
//                 return 'text-black';
//         }
//     };

//     const colorRecruiterStatusText = (status) => {
//         switch (status) {
//             case 'Assigned':
//                 return 'text-green-500'; 
//             case 'Not Assigned':
//                 return 'text-red-500'; 
//             case 'In Progress':
//                 return 'text-yellow-500';
//             case 'Pending':
//                 return 'text-gray-500';
//             default:
//                 return 'text-black';
//         }
//     };

//     const colorMrfStageText = (stage) => {
//         switch (stage) {
//             case 'Draft':
//                 return 'text-blue-500';
//             case 'In Progress':
//                 return 'text-yellow-500'; 
//             case 'Completed':
//                 return 'text-green-500';
//             case 'Not Started':
//                 return 'text-red-500'; 
//             default:
//                 return 'text-black';
//         }
//     };

//     const columnDefs = [
//         { headerName: 'MRF ID', field: 'mrfId', sortable: true, filter: true, width: 180 },
//         {
//             headerName: 'Recruiting Manager Email',
//             field: 'recrutingManagerId',
//             sortable: true,
//             filter: true,
//             width: 230,
//             cellRenderer: (params) => (
//                 <div className="flex items-center">
//                     <span className="mr-2">{managerMap[params.data.recrutingManagerId]?.employeeEmail || 'N/A'}</span>
//                     <FontAwesomeIcon
//                         icon={faInfoCircle}
//                         className="text-blue-500 cursor-pointer"
//                         onClick={(event) => {
//                             event.stopPropagation();
//                             handleManagerClick(params.data.recrutingManagerId);
//                         }}
//                     />
//                 </div>
//             ),
//         },
//         {
//             headerName: 'Vendor Name',
//             field: 'vendorId',
//             sortable: true,
//             filter: true,
//             width: 200,
//             cellRenderer: (params) => (
//                 <div className="flex items-center">
//                     <span className="mr-2">{organizationMap[params.data.vendorId] || 'N/A'}</span>
//                     <FontAwesomeIcon
//                         icon={faInfoCircle}
//                         className="text-blue-500 cursor-pointer"
//                         onClick={(event) => {
//                             event.stopPropagation();
//                             handleVendorClick(params.data.vendorId);
//                         }}
//                     />
//                 </div>
//             ),
//         },
//         {
//             headerName: 'Vendor Assigned Status',
//             field: 'vendorAssignedStatus',
//             sortable: true,
//             filter: true,
//             width: 200,
//             cellRenderer: (params) => (
//                 <span className={colorStatusText(params.data.vendorAssignedStatus)}>
//                     {params.data.vendorAssignedStatus}
//                 </span>
//             ),
//         },

//         {
//             headerName: 'Recruiter Email',
//             field: 'recruiterId',
//             sortable: true,
//             filter: true,
//             width: 200,
//             cellRenderer: (params) => {
                
//                 const recruiterData = recruiters.find(recruiter => recruiter.employeeId === params.data.recruiterId);
//                 return (
//                     <div>
//                         <span>{recruiterData?.recruiterId?.employeeEmail || 'N/A'}</span>
//                     </div>
//                 );
//             },
//         },

//         {
//             headerName: 'Recruiter Assigned Status', 
//             field: 'recruiterId',
//             sortable: true,
//             filter: true,
//             width: 200,
//             cellRenderer: (params) => {
//                 const recruiterData = recruiters.find(recruiter => recruiter.employeeId === params.data.recruiterId);
//                 const status = recruiterData?.recruiterAssignedStatus || 'N/A';
//                 return (
//                     <span className={colorRecruiterStatusText(status)}>
//                         {status}
//                     </span>
//                 );
//             },
//         },
//         {
//             headerName: 'MRF Stage',
//             field: 'mrfId',
//             sortable: true,
//             filter: true,
//             width: 200,
//             cellRenderer: (params) => {
//                 const mrfStage = getMrfStageById(params.data.mrfId);
//                 return (
//                     <span className={colorMrfStageText(mrfStage)}>
//                         {mrfStage}
//                     </span>
//                 );
//             },
//         },
//     ];

//     const filteredVendors = vendors.filter(vendor => {
//         if (filter === 'Assigned') {
//             return vendor.vendorAssignedStatus === 'Assigned';
//         } else if (filter === 'Completed') {
//             return vendor.vendorAssignedStatus === 'Completed';
//         }
//         return true;
//     });

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;

//     const handleVendorClick = async (id) => {
//         try {
//             const vendorDetails = await fetchVendorDetails(id);
//             setSelectedVendor(vendorDetails);
//             setModalIsOpen(true);
//         } catch (error) {
//             console.error('Error fetching vendor details:', error);
//         }
//     };

//     const handleManagerClick = (managerId) => {
//         const managerDetails = managerMap[managerId];
//         setSelectedManager(managerDetails);
//     };

//     const closeModal = () => {
//         setModalIsOpen(false);
//         setSelectedVendor(null);
//         setSelectedManager(null);
//     };

//     return (
//         <div className={`flex justify-center transition-all duration-300 mt-32 ${sidebarOpen ? '' : ''}`}>
//             <div className="p-4 bg-white rounded-lg shadow-md w-full max-w-8xl">
//                 <h2 className="text-lg font-semibold mb-4 text-center">Assigned Vendors / Recruiters</h2>

//                 <div className="flex items-center mb-4">
//                     <label htmlFor="vendorFilter" className="mr-2 font-bold">Filter by Status:</label>
//                     <select
//                         id="vendorFilter"
//                         value={filter}
//                         onChange={(e) => setFilter(e.target.value)}
//                         className="border p-2 rounded w-1/3"
//                     >
//                         <option value="All">All</option>
//                         <option value="Assigned">Assigned</option>
//                         <option value="Completed">Completed</option>
//                     </select>
//                 </div>

//                 <div className="ag-theme-alpine text-left mt-4" style={{ height: '400px', width: '100%' }}>
//                     {filteredVendors.length > 0 ? (
//                         <AgGridReact
//                             rowData={filteredVendors}
//                             columnDefs={columnDefs}
//                             pagination={true}
//                         />
//                     ) : (
//                         <p>No vendors found.</p>
//                     )}
//                 </div>


//                 {modalIsOpen && selectedVendor && (
//                     <VendorDetails vendor={selectedVendor} closeModal={closeModal} />
//                 )}


//                 {selectedManager && (
//                     <RecruitingManagerDetails employee={selectedManager} closeModal={closeModal} />
//                 )}
//             </div>
//         </div>
//     );
// }

// export default RecruitingManagerwise;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FaCheck } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
 
// API URLs
const EMPLOYEE_API_URL = 'http://localhost:8080/tap/getallemployee';
const RECRUITER_API_URL = 'http://localhost:8080/api/recruitingManager/fetch/allrecruiters';
const VENDOR_API_URL = 'http://localhost:8080/api/recruitingManager/fetch/allMrfVendors';
const GET_EMPLOYEE_BY_ID_URL = 'http://localhost:8080/tap/getEmployeeById/';
const GET_VENDOR_BY_ID_URL = 'http://localhost:8080/api/vendors/';
 
async function fetchAllEmployees() {
    try {
        const response = await axios.get(EMPLOYEE_API_URL);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching employee data: ${error.message}`);
    }
}
 
async function fetchAllRecruiters() {
    try {
        const response = await axios.get(RECRUITER_API_URL);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching recruiters: ${error.message}`);
    }
}
 
async function fetchAllVendors() {
    try {
        const response = await axios.get(VENDOR_API_URL);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching vendors: ${error.message}`);
    }
}
 
async function fetchEmployeeById(employeeId) {
    try {
        const response = await axios.get(`${GET_EMPLOYEE_BY_ID_URL}${employeeId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching employee by ID: ${error.message}`);
    }
}
 
async function fetchVendorById(vendorId) {
    try {
        const response = await axios.get(`${GET_VENDOR_BY_ID_URL}${vendorId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching vendor by ID: ${error.message}`);
    }
}
 
const getStatusColor = (status) => {
    switch (status) {
        case 'Assigned':
            return 'text-green-500';
        case 'In Progress':
            return 'text-yellow-500';
        case 'Completed':
            return 'text-green-500';
        default:
            return 'text-gray-700';
    }
};
 
function RecruitingManagerwise() {
    const [error, setError] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [vendorEmployeeNames, setVendorEmployeeNames] = useState({});
    const [vendorOrganizationNames, setVendorOrganizationNames] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('recruiters');
    const [selectedManager, setSelectedManager] = useState('');
    const [vendorSelectedManager, setVendorSelectedManager] = useState('');
    const [selectedMrfStage, setSelectedMrfStage] = useState('');
    const [managerNames, setManagerNames] = useState([]);
    const [mrfStages, setMrfStages] = useState([]);
    const [recruiterSearch, setRecruiterSearch] = useState('');
 
    const columnDefsRecruiters = [
        { headerName: "MRF Id", field: "mrfRecruitingManager.mrf.mrfId", sortable: true, filter: true },
        { headerName: "Assigned by (RM)", field: "mrfRecruitingManager.recruitingManager.employeeName", sortable: true, filter: true },
        { headerName: "Recruiter ID", field: "recruiterId.employeeId", sortable: true, filter: true },
        { headerName: "Recruiter Name", field: "recruiterId.employeeName", sortable: true, filter: true },
        { headerName: "Recruiter Email", field: "recruiterId.employeeEmail", sortable: true, filter: true },
        {
            headerName: "Assigned Status", field: "recruiterAssignedStatus", sortable: true, filter: true,
            cellRenderer: (params) => {
                const statusColor = getStatusColor(params.value);
                return (
                    <span className={statusColor}>{params.value === 'Completed' ? <><FaCheck className="inline" /> {params.value}</> : params.value}</span>
                );
            }
        },
        { headerName: "Assigned Count", field: "assignedCount", sortable: true, filter: true },
        { headerName: "Achieved Count", field: "achievedCount", sortable: true, filter: true },
    ];
 
    const columnDefsVendors = [
        {
            headerName: "MRF ID",
            field: "mrfId",
            sortable: true,
            filter: true
        },
        {
            headerName: "Assigned by (RM)",
            field: "recrutingManagerId",
            sortable: true,
            filter: true,
            cellRenderer: (params) => {
                const employeeId = params.value;
                const employeeName = vendorEmployeeNames[employeeId] || 'Loading...';
                return <span>{employeeName}</span>;
            }
        },
        {
            headerName: "Organization Name",
            field: "vendorId",
            sortable: true,
            filter: true,
            cellRenderer: (params) => {
                const vendorId = params.value;
                const organizationName = vendorOrganizationNames[vendorId] || 'Loading...';
                return (
                    <span style={{ cursor: 'default', color: 'black' }}>
                        {organizationName}
                    </span>
                );
            }
        },
        {
            headerName: "Vendor Assigned Status",
            field: "vendorAssignedStatus",
            sortable: true,
            filter: true,
            cellRenderer: (params) => {
                const statusColor = getStatusColor(params.value);
                return (
                    <span className={statusColor}>{params.value === 'Completed' ? <><FaCheck className="inline" /> {params.value}</> : params.value}</span>
                );
            }
        },
        {
            headerName: "Assigned Count",
            field: "assignedCount",
            sortable: true,
            filter: true
        },
        {
            headerName: "Achieved Count",
            field: "achievedCount",
            sortable: true,
            filter: true
        },
    ];
 
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const employeesData = await fetchAllEmployees();
                setEmployees(employeesData);
 
                const uniqueManagers = employeesData.filter(employee =>
                    employee.role && employee.role.roleName === 'Recruiting Manager'
                ).map(manager => manager.employeeName);
                setManagerNames([...new Set(uniqueManagers)]);
            } catch (err) {
                setError(`Error fetching data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
 
        fetchData();
    }, []);
 
    useEffect(() => {
        const fetchRecruiters = async () => {
            setLoading(true);
            try {
                const recruitersData = await fetchAllRecruiters();
                setRecruiters(recruitersData);
 
                const uniqueStages = [...new Set(recruitersData.map(r => r.mrfRecruitingManager.mrf.mrfStatus.mrfStage))];
                setMrfStages(uniqueStages);
            } catch (err) {
                setError(`Error fetching recruiters: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
 
        fetchRecruiters();
    }, []);
 
    useEffect(() => {
        const fetchVendors = async () => {
            setLoading(true);
            try {
                const vendorsData = await fetchAllVendors();
                setVendors(vendorsData);
 
 
                const employeeNamePromises = vendorsData.map(async (vendor) => {
                    if (vendor.recrutingManagerId) {
                        const employeeData = await fetchEmployeeById(vendor.recrutingManagerId);
                        return { id: vendor.recrutingManagerId, name: employeeData.employeeName };
                    }
                    return { id: vendor.recrutingManagerId, name: 'Unknown' };
                });
 
                const employeeNames = await Promise.all(employeeNamePromises);
                const namesMap = {};
                employeeNames.forEach(emp => {
                    if (emp && emp.id) {
                        namesMap[emp.id] = emp.name;
                    }
                });
                setVendorEmployeeNames(namesMap);
 
                const organizationNamePromises = vendorsData.map(async (vendor) => {
                    if (vendor.vendorId) {
                        const vendorData = await fetchVendorById(vendor.vendorId);
                        return { id: vendor.vendorId, name: vendorData.organizationName };
                    }
                    return { id: vendor.vendorId, name: 'Unknown' };
                });
 
                const organizationNames = await Promise.all(organizationNamePromises);
                const orgNamesMap = {};
                organizationNames.forEach(org => {
                    if (org && org.id) {
                        orgNamesMap[org.id] = org.name;
                    }
                });
                setVendorOrganizationNames(orgNamesMap);
            } catch (err) {
                setError(`Error fetching vendors: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
 
        fetchVendors();
    }, []);
 
 
    const filteredRecruiters = recruiters.filter(recruiter => {
        const matchesManager = selectedManager === '' || recruiter.mrfRecruitingManager.recruitingManager.employeeName === selectedManager;
        const matchesMrfStage = selectedMrfStage === '' || recruiter.mrfRecruitingManager.mrf.mrfStatus.mrfStage === selectedMrfStage;
        const matchesRecruiterName = recruiterSearch === '' || recruiter.recruiterId.employeeName.toLowerCase().includes(recruiterSearch.toLowerCase());
        return matchesManager && matchesMrfStage && matchesRecruiterName;
    });
 
    const filteredVendors = vendors.filter(vendor => {
        const managerName = vendorEmployeeNames[vendor.recrutingManagerId];
        const matchesVendorManager = vendorSelectedManager === '' ||
            managerName === vendorSelectedManager;
        return matchesVendorManager;
    });
 
    const getRecruiterPerformanceData = () => {
        return {
            labels: filteredRecruiters.map(recruiter => recruiter.recruiterId.employeeName),
            datasets: [
                {
                    label: 'Assigned Count',
                    data: filteredRecruiters.map(recruiter => recruiter.assignedCount),
                    backgroundColor: 'rgba(151, 36, 126, 1)', // Use your tab color
                },
                {
                    label: 'Achieved Count',
                    data: filteredRecruiters.map(recruiter => recruiter.achievedCount),
                    backgroundColor: 'rgba(151, 36, 126, 0.4)', // Use your tab color
                },
            ],
        };
    };
 
    const getVendorDependenceData = () => {
        const vendorCounts = {};
 
        for (const recruiter of filteredRecruiters) {
            const vendorId = recruiter.vendorId;
            const assignedCount = recruiter.assignedCount || 0;
            const achievedCount = recruiter.achievedCount || 0;
 
            if (!vendorCounts[vendorId]) {
                vendorCounts[vendorId] = { organizationName: vendorOrganizationNames[vendorId] || 'Unknown', assignedTotal: 0, achievedTotal: 0 };
            }
 
            vendorCounts[vendorId].assignedTotal += assignedCount;
            vendorCounts[vendorId].achievedTotal += achievedCount;
        }
 
        const labels = Object.values(vendorCounts).map(count => count.organizationName); // Use organization names
        const assignedData = Object.values(vendorCounts).map(count => count.assignedTotal);
        const achievedData = Object.values(vendorCounts).map(count => count.achievedTotal);
 
        return {
            labels,
            datasets: [
                {
                    label: 'Assigned Count',
                    data: assignedData,
                    backgroundColor: 'rgba(151, 36, 126, 1)', // Use your tab color
                },
                {
                    label: 'Achieved Count',
                    data: achievedData,
                    backgroundColor: 'rgba(151, 36, 126, 0.4)', // Use your tab color
                },
            ],
        };
    };
 
    return (
        <div className="p-5">
            <h2 className="text-lg font-semibold mb-4 mt-32 text-center">Assigned Recruiters & Vendors</h2>
            {error && <p className="text-red-500">{error}</p>}
            {loading && <p>Loading...</p>}
 
 
            <h3 className="text-lg font-semibold mt-0"></h3>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ marginTop: '10px', width: '100%', height: '250px' }}>
                    <Bar
                        data={getRecruiterPerformanceData()}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Assigned vs Achieved Count',
                                },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </div>
 
                <div style={{ marginTop: '10px', width: '50%', height: '250px' }}>
                    <Bar
                        data={getVendorDependenceData()}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Vendor Dependence for Counts',
                                },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </div>
            </div>
 
 
            <div className="flex space-x-4 mb-2 bg-white shadow-md rounded">
                <button
                    onClick={() => setActiveTab('recruiters')}
                    className={`px-4 py-2 rounded relative ${activeTab === 'recruiters' ? 'text-gray-700' : 'text-gray-500'}`}
                >
                    Recruiters
                    {activeTab === 'recruiters' && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[rgb(151,36,126)] to-[rgb(224,25,80)]"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('vendors')}
                    className={`px-4 py-2 rounded relative ${activeTab === 'vendors' ? 'text-gray-700' : 'text-gray-500'}`}
                >
                    Vendors
                    {activeTab === 'vendors' && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[rgb(151,36,126)] to-[rgb(224,25,80)]"></div>
                    )}
                </button>
            </div>
 
            {activeTab === 'recruiters' && (
                <div className="flex space-x-4 mb-4 mt-4">
                    <div className="flex-1">
                        <label htmlFor="managerFilter" className="block text-md font-medium text-gray-700">Filter by Recruiting Manager:</label>
                        <div className="relative">
                            <select
                                id="managerFilter"
                                value={selectedManager}
                                onChange={(e) => setSelectedManager(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm h-10"
                            >
                                <option value="">All</option>
                                {managerNames.map((name, index) => (
                                    <option key={index} value={name}>{name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex-1">
                        <label htmlFor="recruiterSearch" className="block text-md font-medium text-gray-700">Search by Recruiter Name:</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="recruiterSearch"
                                value={recruiterSearch}
                                onChange={(e) => setRecruiterSearch(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm h-10"
                                placeholder="  Enter Recruiter's name"
                            />
                        </div>
                    </div>
                </div>
            )}
 
            {activeTab === 'vendors' && (
                <div className="flex space-x-4 mb-4 mt-4">
                    <div className="flex-1">
                        <label htmlFor="vendorManagerFilter" className="block text-md font-medium text-gray-700">Filter by Recruiting Manager:</label>
                        <div className="relative">
                            <select
                                id="vendorManagerFilter"
                                value={vendorSelectedManager}
                                onChange={(e) => setVendorSelectedManager(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm h-10"
                            >
                                <option value="">All</option>
                                {managerNames.map((name, index) => (
                                    <option key={index} value={name}>{name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}
 
            <div className="relative max-h-[calc(100vh-25rem)]">
                {activeTab === 'recruiters' && filteredRecruiters.length > 0 && (
                    <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                        <AgGridReact
                            columnDefs={columnDefsRecruiters}
                            rowData={filteredRecruiters}
                            pagination={true}
                            paginationPageSize={10}
                            defaultColDef={{
                                flex: 1,
                                filter: true,
                                sortable: true,
                                cellStyle: { display: 'flex', alignItems: 'center' }
                            }}
                            headerHeight={50}
                        />
                    </div>
                )}
                {activeTab === 'recruiters' && filteredRecruiters.length === 0 && !loading && (
                    <p>No MRF's were Assigned.</p>
                )}
 
                {activeTab === 'vendors' && filteredVendors.length > 0 && (
                    <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
                        <AgGridReact
                            columnDefs={columnDefsVendors}
                            rowData={filteredVendors}
                            pagination={true}
                            paginationPageSize={10}
                            defaultColDef={{
                                flex: 1,
                                filter: true,
                                sortable: true,
                                cellStyle: { display: 'flex', alignItems: 'center' }
                            }}
                            headerHeight={50}
                        />
                    </div>
                )}
                {activeTab === 'vendors' && filteredVendors.length === 0 && !loading && (
                    <p>No vendors found.</p>
                )}
            </div>
        </div>
    );
}
 
export default RecruitingManagerwise;
